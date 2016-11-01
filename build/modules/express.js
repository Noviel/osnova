'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Created by snov on 11.10.2016.

var Http = require('http'),
    path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var MODULE_NAME = 'express';

function fn(osnova) {
  var app = (0, _express2.default)();
  var http = Http.Server(app);
  var config = osnova.config;

  var root = config.paths.root;

  app.use(compression());
  app.set('view engine', config.template);
  app.set('views', path.resolve(root, config.paths.views));
  app.use(_express2.default.static(path.resolve(root, config.paths.public)));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  osnova.cookieParser = cookieParser;

  osnova.express = app;
  osnova.http = http;

  osnova.moduleReady();
}

module.exports = {
  name: MODULE_NAME,
  fn: fn
};