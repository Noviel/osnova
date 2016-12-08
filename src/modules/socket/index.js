// Created by snov on 18.09.2016.

import Socket from './core';

function socketio(osnova) {
  const http = osnova.http;

  const io = new Socket(http, {
    cookieParser: osnova.cookieParser,
    key:          osnova.opts.core.session.key,
    secret:       osnova.opts.core.session.secret,
    sessionStore: osnova.sessionStore
  });

  io.on = io.socketEvent;

  io.socketEvent('disconnect', function () {
    console.log('socket disconnected');
  }, false);

  osnova.io = io;

  osnova.moduleReady();
}

module.exports = socketio;