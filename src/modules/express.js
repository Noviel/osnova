// Created by snov on 11.10.2016.

const Http = require('http');
const Express = require('express');
const compression = require('compression');

const out = opts => osnova => {
  opts = opts || {};

  const express = Express();
  const http = Http.Server(express);
  const { assets: assetsPath } = osnova.opts.core.paths.absolute;

  if (opts.compression != false) {
    express.use(compression());
  }

  express.use(Express.static(assetsPath));

  if (!opts.middlewares) opts.middlewares = {};

  Object.keys(opts.middlewares).forEach((m) => {
    const middleware = opts.middlewares[m];
    express.use(middleware(express));
  });

  osnova.next({ express, http });
};

module.exports = out;
export default out;