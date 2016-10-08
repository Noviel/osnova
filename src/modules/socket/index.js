// Created by snov on 18.09.2016.

import Socket from './core';

module.exports = exports = function socketio(osnova, http) {
  http = http || osnova.http;

  const io = new Socket(http, {
    cookieParser: osnova.cookieParser,
    key:          osnova.config.session.key,
    secret:       osnova.config.session.secret,
    sessionStore: osnova.sessionStore
  });

  io.on = io.socketEvent;

  io.socketEvent('disconnect', function () {
    console.log('socket disconnected');
  }, false);

  osnova.io = io;
};