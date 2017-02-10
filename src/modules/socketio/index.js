// Created by snov on 18.09.2016.

import Socket from './core';

const socket = opts => osnova => {
  const authOpts = opts.auth ?
    {
      cookieParser: osnova.cookieParser,
      key: osnova.opts.core.session.key,
      secret: osnova.opts.core.session.secret,
      sessionStore: osnova.sessionStore
    } : null;

  const http = osnova.http;

  const io = new Socket(http, authOpts);

  io.socketEvent('disconnect', function () {
    console.log('socket disconnected');
  }, false);

  osnova.next({ io });
};

module.exports = socket;
export default socket;