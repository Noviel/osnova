// Created by snov on 25.08.2016.

import routes from '../routes';
import userMan from '../modules/userman';

const communicator = require('../modules/communicator');

module.exports = exports = function addCoreModules (osnova, opts) {
  opts = opts || osnova.opts || {};

  opts.userMan = opts.userMan || {};

  osnova.on('init', routes);
  osnova.on('init', userMan, opts.userMan);

  if (opts.socketio) {
    osnova.on('init', require('../modules/socket'));
  }

  // start communicator both on master and workers
  osnova.on('init', communicator);
  osnova.on('master', communicator);
};