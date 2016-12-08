'use strict';

// Created by snov on 12.07.2016.

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

function fn(osnova) {
  var app = osnova.express;

  var config = {
    mongooseConnection: osnova.connection,
    secret: osnova.opts.core.session.secret,
    key: osnova.opts.core.session.key,
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

module.exports = fn;