'use strict';

// Created by snov on 12.07.2016.

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var MODULE_NAME = 'session';

function core(osnova) {
  var app = osnova.express;

  var config = {
    mongooseConnection: osnova.connection,
    secret: osnova.config.session.secret,
    key: osnova.config.session.key,
    resave: false,
    saveUninitialized: false
  };

  if (!config.store) {
    config.store = new MongoStore({ mongooseConnection: config.mongooseConnection });
  }

  app.use(session(config));

  osnova.sessionStore = config.store;

  osnova.moduleReady();
}

module.exports = {
  name: MODULE_NAME,
  fn: core
};