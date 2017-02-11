'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Created by snov on 12.07.2016.

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var _require = require('osnova-lib'),
    defaults = _require.defaults;

var defConfig = function defConfig(osnova) {
  var _osnova$opts$core$ses = osnova.opts.core.session,
      secret = _osnova$opts$core$ses.secret,
      key = _osnova$opts$core$ses.key;

  return {
    resave: false,
    saveUninitialized: false,
    secret: secret,
    key: key
  };
};

// opts.express [?] - external express app apply session to.
// opts.store [?]
// opts.connection [?]
var entry = function entry(opts) {
  return function (osnova) {
    opts = opts || {};
    var app = osnova.express || opts.express;

    if (!app) {
      throw new Error('Express is not defined. Turn on express module in osnova or specify it in options.');
    }

    var config = defaults(opts, defConfig(osnova));
    config.store = config.store || new MongoStore({ mongooseConnection: config.connection || osnova.connection });

    app.use(session(config));

    osnova.next({ sessionStore: config.store });
  };
};

module.exports = entry;
exports.default = entry;