// Created by snov on 12.07.2016.

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const { defaults }  = require('osnova-lib');

const defConfig = (osnova) => {
  const { secret, key } = osnova.opts.core.session;
  return {
    resave: false,
    saveUninitialized: false,
    secret,
    key
  };
};

// opts.express [?] - external express app apply session to.
// opts.store [?]
// opts.connection [?]
const entry = opts => osnova => {
  opts = opts || {};
  const app = osnova.express || opts.express;

  if (!app) {
    throw new Error('Express is not defined. Turn on express module in osnova or specify it in options.');
  }

  const config = defaults(opts, defConfig(osnova));
  config.store = config.store || new MongoStore({ mongooseConnection: config.connection || osnova.connection });

  app.use(session(config));

  osnova.next({ sessionStore: config.store });
};

module.exports = entry;
export default entry;