// Created by snov on 11.10.2016.

const Http = require('http'),
      path = require('path');

const Express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

const out = opts => osnova => {
  const express  = Express();
  const http = Http.Server(express);
  const { assets: assetsPath } = osnova.opts.core.paths.absolute;

  express.use(compression());
  express.use(Express.static(assetsPath));
  express.use(bodyParser.json());
  express.use(bodyParser.urlencoded({ extended: false }));
  express.use(cookieParser());

  osnova.next({ cookieParser, express, http });
};

module.exports = out;
export default out;