// Created by snov on 12.07.2016.

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

export default function (osnova, app, config) {
  app = app || osnova.express;

  if (!config.store) {
    config.store = new MongoStore({ mongooseConnection: config.mongooseConnection });
  }

  app.use(session(config));

  osnova.sessionStore = config.store;
}