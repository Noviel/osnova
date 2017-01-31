// Created by snov on 12.07.2016.

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const { defaults }  =require('osnova-lib').core;

const defConfig = (osnova) => ({
  resave: false,
  saveUninitialized: false,
  secret: osnova.opts.core.session.secret,
  key: osnova.opts.core.session.key,
});

const entry = (config) => osnova => {
  const app = osnova.express;

  const finConfig = defaults(config, defConfig(osnova));
  finConfig.store = new MongoStore({ mongooseConnection: osnova.connection });

  app.use(session(finConfig));

  osnova.next({ sessionStore: finConfig.store});
};

module.exports = entry;