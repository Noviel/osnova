// Created by snov on 30.08.2016.

const path    = require('path');

module.exports = exports = {
  paths: {
    absolute: {
      root: process.cwd()
    },
    assets: './public'
  },

  target: {
    host: {
      port: process.env.PORT || process.env.NODE_PORT || 5000,
      ip: process.env.NODE_IP || 'localhost'
    }
  },

  session: {
    key: 'osnova.sid',
    secret: 'W09lWi11$HiN4'
  },

  use: {
    express: true,
    socketio: true,
    session: true,
    mongo: true,
    auth: true
  }
};