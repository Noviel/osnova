// Created by snov on 29.06.2016.

const path = require('path');
const EventEmitter = require('events').EventEmitter;

import lib from 'osnova-lib';

const {
  isArray,
  isFunction,
  isObject,
  defaults
} = lib.core;

// private data
const data = {
  actions: {
    preinit: [],
    init: [],
    starting: [],
    master: []
  }
};

const OSNOVA = function(opts) {
  opts = opts || {};
  opts.master = opts.master || false;

  opts.core = defaults(opts.core, require('./config/core'));

  this.__version  = require('../package.json').version;
  this.opts       = opts;

  // module loading stuff
  this.moduleQueue = [];

  // used to generate names of unnamed modules
  this.moduleLastIndex = 0;
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

  if (this.opts.core.mongo) {
    this.add(require('./modules/mongo'), 'mongo');
  }

  if (this.opts.master) {

  } else {

    if (this.opts.core.express) {
      this.add(require('./modules/express'), 'express');
    }

    if (this.opts.core.session) {
      this.add(require('./modules/session'), 'session');
    }

    if (this.opts.core.socketio) {
      this.add(require('./modules/socket')({ auth: this.opts.core.auth }), 'socket');
    }
  }

  this.add(require('./modules/communicator'));

  const modules = opts.modules;

  if (isArray(modules)) {
    for (let i = 0; i < modules.length; i++) {
      this.add(modules[i]);
    }
  }
};

OSNOVA.prototype = Object.create(null);
OSNOVA.prototype.constructor = OSNOVA;



// add module to the queue
// if the queue is empty - this is first module and the current
// if current module is exist - add new module as next to current
// and set new module is current
// so we have single linked list of modules in order of they were added
OSNOVA.prototype.add = function(module, name) {
  if (isFunction(module)) {
    module = {
      fn: module,
      name: name || 'm'+this.moduleLastIndex++
    }
  } else if (isObject(module) && isFunction(module.fn)) {
    if (!module.name) {
      module.name = name || 'm' + this.moduleLastIndex;
    }
  } else {
    console.log(`Error: wrong module format ${module}`);
    return;
  }

  if (this.moduleQueue[module.name]) {
    console.log(`Warning: module with name [${module.name}] already present in modules' queue. Overriding.`);
  }

  this.moduleQueue[module.name] = module;

  if (this.currentModule) {
    this.currentModule.nextModule = module;
  } else {
    this.firstModule = module;
  }
  this.currentModule = module;
};

OSNOVA.prototype.onAllModulesReady = function() {
  console.log(`All modules are ready. Booting...`);
  this.launch();
};

function executeModule(osnova, module) {
  if (module) {
    console.log(`Executing module ${module.name}`);
    module.fn(osnova);
  } else {
    osnova.ee.emit('ALL_MODULES_READY');
  }
}

// Triggered by moduleReady()
OSNOVA.prototype.onModuleReady = function (module) {
  if (!module) return;

  console.log(`Module ${module.name} is ready`);

  // since current module is ready - move to the next one
  this.currentModule = module.nextModule;
  delete this.moduleQueue[module.name];

  // if there is no current module - it means we are in the end of the queue
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
  const modules = this.moduleQueue;
  if (!this.syncModuleLoading) {
    for (let i in modules) {
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
  if (this.opts.master) {
    console.log('OSNOVA::master started.');
  } else {
    this.listen();
  }
};

OSNOVA.prototype.listen = function () {
  const http = this.http;

  const server = http.listen(0/*config.target.host.port*/, 'localhost'/*config.target.host.ip*/, () => {
    console.log(`OSNOVA::worker pid:${process.pid} started...`);
  });

  // Listen to messages sent from the master. Ignore everything else.
  process.on('message', function(message, connection) {
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
  console.log('-----------------------------------------------------------');
  console.log('OSNOVA v' + this.__version);

  if (isFunction(this.opts.start)) {
    this.add((osnova) => {
      this.opts.start(osnova);
      this.moduleReady();
    });
  }

  this.loadModules();
};

OSNOVA.prototype.on = function(state, action, args) { fn.addAction(this, state, action, args); };

export default function OSNOVA_DEFAULT(opts) {
  return new OSNOVA(opts);
}

export const Server = OSNOVA_DEFAULT;
export const launch = require('./multiprocess.launcher');
export const Module = require('./module');