'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (osnova, app, config) {
  app = app || osnova.express;

  if (!config.store) {
    config.store = new MongoStore({ mongooseConnection: config.mongooseConnection });
  }

  app.use(session(config));

  osnova.sessionStore = config.store;
};

// Created by snov on 12.07.2016.

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);