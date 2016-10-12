'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Module = exports.launch = exports.Server = undefined;
exports.default = OSNOVA_DEFAULT;

var _core = require('./lib/core');

// Created by snov on 29.06.2016.

var path = require('path');
var EventEmitter = require('events').EventEmitter;

// private data
var data = {
  actions: {
    preinit: [],
    init: [],
    starting: [],
    master: []
  }
};

// private functions
var fn = {

  // osnova must be the first argument in the final list ALWAYS!!!
  prepareActionArgs: function prepareActionArgs(osnova, args) {
    if (args === undefined) {
      return [osnova];
    } else if (!(0, _core.isArray)(args)) {
      return [osnova, args];
    } else {
      var arr = args.slice(0);
      arr.splice(0, 0, osnova);
      return arr;
    }
  },


  // args - array of arguments or a single argument or nothing
  // if args is a single argument and it is array - it must be inside []
  addAction: function addAction(osnova, state, action, args) {
    if (!(0, _core.isFunction)(action)) return;

    var dst = data.actions[state];
    if (!dst) {
      data.actions[state] = [];
    }

    data.actions[state].push({
      action: action,
      args: this.prepareActionArgs(osnova, args)
    });
  },
  executeActions: function executeActions(osnova, list) {
    var count = list.length;
    var curr = void 0;
    for (var i = 0; i < count; i++) {
      curr = list[i];
      curr.action.apply(osnova, curr.args);
    }
  }
};

var OSNOVA = function OSNOVA(opts) {
  opts = opts || {};
  opts.master = opts.master || false;

  // no socket server on master
  if (!opts.master) {
    opts.socketio = opts.socketio !== false;
  } else {
    opts.socketio = false;
  }

  this.__version = require('../package.json').version;
  this.opts = opts;

  this.config = (0, _core.defaults)(opts.core, require('./config/core'));

  // module loading stuff
  this.moduleQueue = [];
  // if true modules will be loaded one by one.
  // next module will be activated when MODULE_READY event is fired.
  this.syncModuleLoading = true;
  this.currentModule = null;
  this.firstModule = null;

  this.ee = new EventEmitter();
  this.ee.on('MODULE_READY', this.onModuleReady.bind(this));
  this.ee.on('ALL_MODULES_READY', this.onAllModulesReady.bind(this));

  // process built-in core modules
  //
  this.add(require('./modules/mongo'));

  if (this.opts.master) {} else {
    this.add(require('./modules/express'));
    this.add(require('./modules/session'));
    this.add(require('./modules/userman'));
    this.add(require('./modules/socket'));
  }

  this.add(require('./modules/communicator'));
};

OSNOVA.prototype = Object.create(null);
OSNOVA.prototype.constructor = OSNOVA;

OSNOVA.prototype.execute = function (action, args) {
  args = fn.prepareActionArgs(this, args);
  action.apply(this, args);
};

// add module to the queue
// if the queue is empty - this is first module and the current
// if current module is exist - add new module as next to current
// and set new module is current
// so we have single linked list of modules in order of they were added
OSNOVA.prototype.add = function (module) {
  if (this.moduleQueue[module.name]) {
    console.log('Warning: module with name [' + module.name + '] already present in modules\' queue. Overriding.');
  }

  this.moduleQueue[module.name] = module;

  if (this.currentModule) {
    this.currentModule.nextModule = module;
  } else {
    this.firstModule = module;
  }
  this.currentModule = module;
};

OSNOVA.prototype.onAllModulesReady = function () {
  console.log('All modules are ready. Booting...');
  this.launch();
};

function executeModule(osnova, module) {
  if (module) {
    console.log('Executing module ' + module.name);
    module.fn(osnova);
  } else {
    osnova.ee.emit('ALL_MODULES_READY');
  }
}

// Triggered by moduleReady()
OSNOVA.prototype.onModuleReady = function (module) {
  console.log('Module ' + module.name + ' is ready');

  // since current module is ready - move to the next one
  this.currentModule = module.nextModule;
  delete this.moduleQueue[module.name];

  // if there is no current module - it means we in the end of the queue
  // and all modules are ready, otherwise - execute next.
  if (!this.currentModule) {
    this.ee.emit('ALL_MODULES_READY');
  } else {
    executeModule(this, this.currentModule);
  }
};

// Must be called when OSNOVA Module has done all his thing and ready to go.
// If some module won't call this function - module loading process will stuck on this module forever.
// Since modules are executed in a sequence - if this function is called inside the module code - this module
// is currentModule and we don't need to know it's name to say to system what module is ready.
OSNOVA.prototype.moduleReady = function () {
  this.ee.emit('MODULE_READY', this.currentModule);
};

OSNOVA.prototype.loadModules = function () {
  var modules = this.moduleQueue;
  if (!this.syncModuleLoading) {
    for (var i in modules) {
      modules[i].osnova = this;
      modules[i].fn(this);
    }
  } else {
    // We must always execute currentModule in order to moduleReady points on the correct one.
    this.currentModule = this.firstModule;
    executeModule(this, this.currentModule);
  }
};

OSNOVA.prototype.launch = function () {
  if ((0, _core.isFunction)(this.opts.start)) {
    fn.addAction(this, 'starting', this.opts.start);
  }
  if ((0, _core.isFunction)(this.opts.init)) {
    fn.addAction(this, 'init', this.opts.init);
  }

  fn.executeActions(this, data.actions.init);
  fn.executeActions(this, data.actions.starting);

  if (this.opts.master) {
    console.log('OSNOVA::master started.');
  } else {
    this.listen();
  }
};

OSNOVA.prototype.listen = function () {
  var http = this.http;

  var server = http.listen(0 /*config.target.host.port*/, 'localhost' /*config.target.host.ip*/, function () {
    console.log('OSNOVA::worker pid:' + process.pid + ' started...');
  });

  // Listen to messages sent from the master. Ignore everything else.
  process.on('message', function (message, connection) {
    if (message !== 'sticky-session:connection') {
      return;
    }

    // Emulate a connection event on the server by emitting the
    // event with the connection the master sent us.
    server.emit('connection', connection);
    connection.resume();
  });
};

// Entry point of the server.
//
OSNOVA.prototype.start = function () {
  var me = this;
  console.log('-----------------------------------------------------------');
  console.log('OSNOVA v' + this.__version);

  this.loadModules();
};

OSNOVA.prototype.on = function (state, action, args) {
  fn.addAction(this, state, action, args);
};

function OSNOVA_DEFAULT(opts) {
  return new OSNOVA(opts);
}

var Server = exports.Server = OSNOVA_DEFAULT;
var launch = exports.launch = require('./multiprocess.launcher');
var Module = exports.Module = require('./module');