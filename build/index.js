'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.launch = undefined;
exports.default = OSNOVA;

var _session = require('./session');

var _session2 = _interopRequireDefault(_session);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _core = require('./lib/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Created by snov on 29.06.2016.

var Http = require('http'),
    path = require('path');

var mongoose = require('mongoose');
var Bluebird = require('bluebird');

mongoose.Promise = Bluebird;
Bluebird.promisifyAll(require('mongoose'));

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

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
  defActions: function defActions(osnova) {
    return [{
      action: _session2.default,
      args: [osnova.express, {
        mongooseConnection: osnova.connection,
        secret: osnova.config.session.secret,
        key: osnova.config.session.key,
        resave: false,
        saveUninitialized: false
      }]
    }];
  },


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

    var argsF = this.prepareActionArgs(osnova, args);

    data.actions[state].push({ action: action, args: argsF });
  },
  addDefaultPreInitActions: function addDefaultPreInitActions(osnova) {
    var acts = this.defActions(osnova);
    for (var i = 0; i < acts.length; i++) {
      this.addAction(osnova, 'preinit', acts[i].action, acts[i].args);
    }
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
    opts.socketio = opts.socketio !== undefined ? opts.socketio : true;
  } else {
    opts.socketio = false;
  }

  this.__version = '0.5.2';
  this.opts = opts;

  var root = null;
  if (opts.core && opts.core.paths && opts.core.paths.root) {
    root = opts.core.paths.root;
  }
  var Config = require('./config/core')(root);
  this.config = (0, _core.defaults)(opts.core, Config);
};

OSNOVA.prototype = Object.create(null);
OSNOVA.prototype.constructor = OSNOVA;

OSNOVA.prototype.prepare = function () {
  var app = (0, _express2.default)();
  var http = Http.Server(app);

  app.set('view engine', this.config.template);
  app.set('views', this.config.paths.views);

  app.use(_express2.default.static(this.config.paths.public));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  this.cookieParser = cookieParser;

  this.express = app;
  this.http = http;
};

OSNOVA.prototype.execute = function (action, args) {
  args = fn.prepareActionArgs(this, args);
  action.apply(this, args);
};

OSNOVA.prototype.connect = function () {
  var connectString = void 0;
  if (this.config.target.database.uri) {
    connectString = this.config.target.database.uri;
  } else {
    connectString = this.config.target.database.path + this.config.target.database.name;
  }
  return this.connection = mongoose.connect(connectString).connection;
};

OSNOVA.prototype.launch = function () {
  fn.addDefaultPreInitActions(this);
  require('./config/init.actions.js')(this);

  if ((0, _core.isFunction)(this.opts.start)) {
    fn.addAction(this, 'starting', this.opts.start);
  }

  // we need to launch init function both to master and workers
  if ((0, _core.isFunction)(this.opts.init)) {
    fn.addAction(this, 'init', this.opts.init);
    fn.addAction(this, 'master', this.opts.init);
  }

  if (this.opts.master) {
    fn.executeActions(this, data.actions.master);
    fn.executeActions(this, data.actions.starting);

    console.log('OSNOVA::master started.');
  } else {
    this.prepare();

    fn.executeActions(this, data.actions.preinit);
    fn.executeActions(this, data.actions.init);
    fn.executeActions(this, data.actions.starting);

    this.listen();
  }
};

OSNOVA.prototype.listen = function () {
  var http = this.http,
      config = this.config;

  var server = http.listen(0 /*config.target.host.port*/, 'localhost' /*config.target.host.ip*/, function () {
    console.log('OSNOVA::worker pid:' + process.pid + ' started... [' + config.target.host.ip + ':' + config.target.host.port + ']');
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

OSNOVA.prototype.start = function () {
  var me = this;
  console.log('-----------------------------------------------------------');
  console.log('OSNOVA v' + this.__version);

  this.connect().on('error', console.error.bind(console, 'connection error:')).on('disconnected', this.connect.bind(this)).once('open', function () {
    console.log('Connected to MongoDB.');
    me.launch();
  });
};

OSNOVA.prototype.on = function (state, action, args) {
  fn.addAction(this, state, action, args);
};

function OSNOVA(opts) {
  var osnova = new OSNOVA(opts);

  return {
    start: osnova.start.bind(osnova),
    on: osnova.on.bind(osnova)
  };
}

var launch = exports.launch = require('./multiprocess.launcher');