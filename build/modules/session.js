'use strict';

// Created by snov on 12.07.2016.

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var defaults = require('osnova-lib').core.defaults;

var defConfig = function defConfig(osnova) {
  return {
    resave: false,
    saveUninitialized: false,
    secret: osnova.opts.core.session.secret,
    key: osnova.opts.core.session.key
  };
};

var entry = function entry(config) {
  return function (osnova) {
    var app = osnova.express;

    var finConfig = defaults(config, defConfig(osnova));
    finConfig.store = new MongoStore({ mongooseConnection: osnova.connection });

    app.use(session(finConfig));

    osnova.next({ sessionStore: finConfig.store });
  };
};

module.exports = entry;