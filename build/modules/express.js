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
    var assetsPath = osnova.opts.core.paths.absolute.assets;


    express.use(compression());
    express.use(Express.static(assetsPath));
    express.use(bodyParser.json());
    express.use(bodyParser.urlencoded({ extended: false }));
    express.use(cookieParser());

    osnova.next({ cookieParser: cookieParser, express: express, http: http });
  };
};

module.exports = out;
exports.default = out;