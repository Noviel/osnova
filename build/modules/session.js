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
    resave: true,
    saveUninitialized: true,
    secret: secret,
    key: key
  };
};

var entry = function entry() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (osnova) {

    var app = opts.express || osnova.express;
    var connection = opts.connection || osnova.mongo ? osnova.mongo.connection : null;

    if (!app) {
      throw new Error('Express is not defined. Turn on express module in osnova or specify express in options.');
    }
    if (!connection) {
      throw new Error('Connection is required. Turn on mongo module is osnova or specify connection in options.');
    }

    var config = defaults(opts, defConfig(osnova));
    config.store = config.store || new MongoStore({ mongooseConnection: connection });

    app.use(session(config));

    osnova.next({
      session: {
        store: config.store,
        key: config.key,
        secret: config.secret
      }
    });
  };
};

module.exports = entry;
exports.default = entry;