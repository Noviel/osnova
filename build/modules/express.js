'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Created by snov on 11.10.2016.

var Http = require('http'),
    path = require('path');

var Express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var out = function out(opts) {
  return function (osnova) {
    var express = Express();
    var http = Http.Server(express);

    express.use(compression());
    //app.set('view engine', config.template);
    //app.set('views', path.resolve(root, config.paths.views));
    express.use(Express.static(path.resolve(opts.paths.root, opts.paths.static)));
    express.use(bodyParser.json());
    express.use(bodyParser.urlencoded({ extended: false }));
    express.use(cookieParser());

    osnova.next({ cookieParser: cookieParser, express: express, http: http });
  };
};

module.exports = out;
exports.default = out;