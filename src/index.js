// Created by snov on 29.06.2016.

const path = require('path');
const EventEmitter = require('events').EventEmitter;

import {
  isArray,
  isFunction,
  isObject,
  defaults
} from 'osnova-lib';

const consoleLinesBigSeparator = `----------------------------------------`;

const getHelloLines = (name, version) => {
  return [
    consoleLinesBigSeparator,
    `Welcome to ${name} v${version}`,
    consoleLinesBigSeparator
  ];
};

const printHello = (name, version) => {
  const helloLines = getHelloLines(name, version);
  for (let i = 0; i < helloLines.length; i++) {
    console.log(helloLines[i]);
  }
};

const defaultListen = (opts) => (http) => {

  const { port, ip } = opts;

  http.listen(port, ip, () => {
    console.log(`Default http server started on ${ip}:${port}`);
  });
};

const addCoreModule = (osnova, moduleName) => {
  const usageOpts = osnova.opts.core.modules[moduleName];
  const isUsageObject = isObject(usageOpts);

  if ((isUsageObject && usageOpts.use == true) || usageOpts == true) {
    const modulePath = './modules/' + moduleName;
    const opts = isUsageObject ? usageOpts.opts : undefined;

    osnova.add(require(modulePath)(opts), moduleName);
  }
};

const OSNOVA = function(opts = {}) {
  this.__version  = require('../package.json').version;

  opts.core = defaults(opts.core, require('./config/core'));
  opts.core.paths.absolute.assets = path.resolve(opts.core.paths.absolute.root, opts.core.paths.assets);

  if (opts.listen == 'default' || typeof opts.listen == 'undefined') {
    opts.listen = defaultListen(opts.core.host);
  }

  if (typeof opts.DEBUG == 'undefined') {
    opts.DEBUG = {};
  }

  this.opts = opts;

  this.listen = opts.listen;

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
  addCoreModule(this, 'mongo');
  addCoreModule(this, 'express');
  addCoreModule(this, 'session');
  addCoreModule(this, 'communicator');

  // process modules from options
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
    console.log(`Warning: Wrong module format ${module}. Skipping.`);
    return;
  }

  if (this.moduleQueue[module.name]) {
    console.log(`Warning: module with name [${module.name}] already exists in modules' queue. Overriding.`);
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
  console.log(`All modules are executed. Ready to listen.`);

  if (isFunction(this.listen)) {
    this.listen(this.http);
  } else {
    console.log('No listen function was specified. Are you sure that\'s everything all right?');
  }
};

function executeModule(osnova, module) {
  if (osnova.opts.DEBUG.modules) {
    console.log(`Executing module ${module.name}`);
  }
  module.fn(osnova);
}

// Triggered by moduleReady()
OSNOVA.prototype.onModuleReady = function (result) {
  const module = this.currentModule;

  if (!module) return;

  if (this.opts.DEBUG.modules) {
    console.log(`Module ${module.name} is ready`);
  }

  // copy result of module work to OSNOVA
  if (result !== undefined && result !== null) {
    Object.assign(this, result);
  }

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
// @result - object with data that will be attached to OSNOVA.
OSNOVA.prototype.moduleReady = function (result) {
  this.ee.emit('MODULE_READY', result);
};

OSNOVA.prototype.next = OSNOVA.prototype.moduleReady;

OSNOVA.prototype.loadModules = function () {
  const modules = this.moduleQueue;
  if (!this.syncModuleLoading) {
    for (let i in modules) {
      modules[i].osnova = this;
      modules[i].fn(this);
    }
  } else {
    this.currentModule = this.firstModule;
    executeModule(this, this.currentModule);
  }
};

// Entry point of the server.
OSNOVA.prototype.start = function (callback) {
  printHello('OSNOVA', this.__version);

  if (isFunction(callback)) {
    this.add((osnova) => {
      callback(osnova);
      this.next();
    });
  }

  this.loadModules();
};

OSNOVA.prototype.getVersion = function () {
  return this.__version;
};

export default function OSNOVA_EXPORT(opts) {
  return new OSNOVA(opts);
}

module.exports = OSNOVA_EXPORT;