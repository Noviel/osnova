// Created by snov on 11.10.2016.

const Http = require('http'),
      path = require('path');

import express from 'express';

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

function fn(osnova) {
  const app   = express();
  const http  = Http.Server(app);
  const config = osnova.opts.core;

  const root = config.paths.root;

  app.use(compression());
  app.set('view engine', config.template);
  app.set('views', path.resolve(root, config.paths.views));
  app.use(express.static(path.resolve(root, config.paths.public)));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  osnova.cookieParser = cookieParser;

  osnova.express = app;
  osnova.http = http;

  osnova.moduleReady();
}

module.exports = fn;

