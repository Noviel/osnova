// Created by snov on 30.08.2016.

const path    = require('path');

module.exports = exports = {
  paths: {
    static: './public'
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
  }
};