// Created by snov on 11.10.2016.

const Promise = require('bluebird');

class Module {
  constructor(name, fn) {
    this.name = name;
    this.fn = fn.bind(this);
  }

  ready() {
    osnova.moduleReady(this.name);
  }
}

module.exports = Module;
module.exports.default = Module;