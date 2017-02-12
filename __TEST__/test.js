// Created by snov on 10.02.2017.
//
// Some quick tests.
// TODO: write NORMAL tests!
//
/////////////////////////////////////////////////////////////////

const osnova = require('../build/index.js');
const { defaults }  = require('osnova-lib');

/*
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

const configExpressModule = opts => osnova => {
  const express = osnova.express;

  express.use(compression());
  express.use(bodyParser.json());
  express.use(bodyParser.urlencoded({ extended: false }));
  express.use(cookieParser());

  osnova.next();
};*/

const server = osnova.Server({
  core: {
    modules: {
      session: {
        use: true,
        opts: { key: 'sid.osnovatest' }
      }
    },
    database: { uri: 'mongodb://localhost/osnovatest'},
    host: { ip: 'localhost', port: 4444 },
  },
  modules: [],
  listen: 'default'
});

server.start((osnova) => {
  const app = osnova.express;
  app.get('*', (req, res) => {
    const obj = { a: 1, b: 2, c: { cc: 10} };
    const def = { x: {}, a: { aa: 10}, b: 10, c: { cc: 20, cd: 50} };
    res.send(defaults(obj, def));
  })
});