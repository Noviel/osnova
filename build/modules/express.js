'use strict';

// Created by snov on 11.10.2016.

var Http = require('http'),
    path = require('path');

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

module.exports = function (osnova) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : osnova.opts.core;

  var app = express();
  var http = Http.Server(app);
  var root = config.paths.root;

  app.use(compression());
  app.set('view engine', config.template);
  app.set('views', path.resolve(root, config.paths.views));
  app.use(express.static(path.resolve(root, config.paths.public)));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  osnova.cookieParser = cookieParser;

  osnova.express = app;
  osnova.http = http;

  osnova.moduleReady();
};