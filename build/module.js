'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Created by snov on 11.10.2016.

var Promise = require('bluebird');

var Module = function Module(name, fn) {
  _classCallCheck(this, Module);

  this.name = name;
  this.fn = fn;
};

module.exports = function load(fn) {
  return new Promise(function (res, rej) {});
};