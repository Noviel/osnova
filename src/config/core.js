// Created by snov on 30.08.2016.

const path    = require('path');
const appRoot = global.appRoot;

module.exports = exports = function (root) {
  root = root || appRoot;
  return {
    paths: {
      public: path.resolve(root, './public'),
      views:  path.resolve(root, './private/views'),
    },

    session: {
      key: 'dqnt.sid',
      secret: 'W09lWi11$HiN4'
    },

    template: 'pug'
  };
};