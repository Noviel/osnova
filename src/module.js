// Created by snov on 11.10.2016.

const Promise = require('bluebird');

class Module {
  constructor(name, fn) {
    this.name = name;
    this.fn = fn;
  }
}

module.exports = function load(fn) {
  return new Promise((res, rej) => {

  });
};