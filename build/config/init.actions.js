'use strict';

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

var _userman = require('../modules/userman');

var _userman2 = _interopRequireDefault(_userman);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Created by snov on 25.08.2016.

var communicator = require('../modules/communicator');

module.exports = exports = function addCoreModules(osnova, opts) {
  opts = opts || osnova.opts || {};

  opts.userMan = opts.userMan || {};

  osnova.on('init', _routes2.default);
  osnova.on('init', _userman2.default, opts.userMan);

  if (opts.socketio) {
    osnova.on('init', require('../modules/socket'));
  }

  // start communicator both on master and workers
  osnova.on('init', communicator);
  osnova.on('master', communicator);
};