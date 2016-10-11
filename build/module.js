'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Created by snov on 11.10.2016.

var Promise = require('bluebird');

var Module = function () {
  function Module(name, fn) {
    _classCallCheck(this, Module);

    this.name = name;
    this.fn = fn.bind(this);
    this.ready = false;
  }

  _createClass(Module, [{
    key: 'ready',
    value: function ready() {
      osnova.moduleReady(this.name);
    }
  }]);

  return Module;
}();

module.exports = Module;
module.exports.default = Module;