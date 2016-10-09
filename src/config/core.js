// Created by snov on 30.08.2016.

const path    = require('path');

module.exports = exports = function (root) {
  if (!root)
    throw new Error('No absolute root path was provided to core configurator!');

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