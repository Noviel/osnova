// Created by snov on 10.02.2017.
//
// Some quick tests.
// TODO: write NORMAL tests!
//
/////////////////////////////////////////////////////////////////

const osnova = require('../build/index.js');
const { defaults }  = require('osnova-lib');

const server = osnova.Server({
  core: {
    modules: {
      mongo: false,
      session: false
    },
    target: {
      database: { uri: 'fake'}
    }
  },
  listen: 'default'
});

server.start((osnova) => {
  const app = osnova.express;
  app.get('*', (req, res) => {
    const obj = { a: 1, b: 2, c: { cc: 10} };
    const def = { a: { aa: 10}, b: 10, c: { cc: 20, cd: 50} };
    res.send(defaults(obj,def));
  })
});