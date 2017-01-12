'use strict';

// Created by snov on 30.08.2016.

var path = require('path');

module.exports = exports = {
  paths: {
    public: './public',
    views: './private/views'
  },

  session: {
    key: 'dqnt.sid',
    secret: 'W09lWi11$HiN4'
  },

  use: {
    express: true,
    socketio: true,
    session: true,
    mongo: true
  },

  template: 'pug',

  socketio: true,
  express: true,
  mongo: true
};