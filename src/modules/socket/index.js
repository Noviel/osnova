// Created by snov on 18.09.2016.

import Socket from './core';

export default function socket (opts) {
  const authOpts = opts.auth ?
    {
      cookieParser: osnova.cookieParser,
      key: osnova.opts.core.session.key,
      secret: osnova.opts.core.session.secret,
      sessionStore: osnova.sessionStore
    } : null;

  return function socketio(osnova) {
    const http = osnova.http;

    const io = new Socket(http, authOpts);

    io.on = io.socketEvent;

    io.socketEvent('disconnect', function () {
      console.log('socket disconnected');
    }, false);

    osnova.io = io;

    osnova.moduleReady();
  };
}

module.exports = socket;