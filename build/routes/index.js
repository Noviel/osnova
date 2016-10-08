'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = routes;
// Created by snov on 28.08.2016.

function routes(osnova, app) {
  app = app || osnova.express;

  app.get('/health', function (req, res) {
    res.header(200).send('I am ok!');
  });
}