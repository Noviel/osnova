// Created by snov on 12.07.2016.

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const { defaults }  = require('osnova-lib');

const defConfig = (osnova) => {
  const { secret, key } = osnova.opts.core.session;
  return {
    resave: true,
    saveUninitialized: true,
    secret,
    key
  };
};

const entry = (opts = {}) => osnova => {
  console.log(opts);
  const app = opts.express || osnova.express;
  const connection = opts.connection || osnova.mongo ? osnova.mongo.connection : null;

  if (!app) {
    throw new Error('Express is not defined. Turn on express module in osnova or specify express in options.');
  }
  if (!connection) {
    throw new Error('Connection is required. Turn on mongo module is osnova or specify connection in options.');
  }

  const config = defaults(opts, defConfig(osnova));
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

module.exports = entry;
export default entry;