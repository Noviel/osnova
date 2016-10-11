// Created by snov on 11.10.2016.

import session from '../modules/session';
import express from '../modules/express';

module.exports = exports = function addCoreModules (osnova, opts) {
  opts = opts || osnova.opts || {};

  osnova.on('preinit', express);

  osnova.on('preinit', session, [ osnova.express, {
    mongooseConnection: osnova.connection,
    secret: osnova.config.session.secret,
    key: osnova.config.session.key,
    resave: false,
    saveUninitialized: false
  }]);

};