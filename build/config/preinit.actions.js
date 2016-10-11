'use strict';

var _session = require('../modules/session');

var _session2 = _interopRequireDefault(_session);

var _express = require('../modules/express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Created by snov on 11.10.2016.

module.exports = exports = function addCoreModules(osnova, opts) {
  opts = opts || osnova.opts || {};

  osnova.on('preinit', _express2.default);

  osnova.on('preinit', _session2.default, [osnova.express, {
    mongooseConnection: osnova.connection,
    secret: osnova.config.session.secret,
    key: osnova.config.session.key,
    resave: false,
    saveUninitialized: false
  }]);
};