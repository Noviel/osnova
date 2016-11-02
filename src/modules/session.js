// Created by snov on 12.07.2016.

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const MODULE_NAME = 'session';

function core(osnova) {
  const app = osnova.express;

  const config = {
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

module.exports = {
  name: MODULE_NAME,
  fn: core
};