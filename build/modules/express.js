'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Created by snov on 11.10.2016.

var Http = require('http');
var Express = require('express');

var out = function out(opts) {
  return function (osnova) {
    opts = opts || {};

    var express = Express();
    var http = Http.Server(express);
    var assetsPath = osnova.opts.core.paths.absolute.assets;


    express.use(Express.static(assetsPath));

    if (!opts.middlewares) opts.middlewares = {};

    Object.keys(opts.middlewares).forEach(function (m) {
      var middleware = opts.middlewares[m];
      express.use(middleware(express));
    });

    osnova.next({ express: express, http: http });
  };
};

module.exports = out;
exports.default = out;