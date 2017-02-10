// Created by snov on 10.02.2017.
//
// ABOUT THIS FILE
//
/////////////////////////////////////////////////////////////////

const osnova = require('../build/index.js');

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
    res.send('hello');
  })
});