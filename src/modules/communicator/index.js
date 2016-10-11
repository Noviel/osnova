// Created by snov on 07.10.2016.

import Communicator from './core';

const MODULE_NAME = 'communicator';

function communicator(osnova) {
  osnova.communicator = new Communicator({
    master: osnova.opts.master,
    port: 4778,
    ip: 'localhost',
    io: osnova.io || null
  });
  osnova.moduleReady(MODULE_NAME);
}

module.exports = {
  name: MODULE_NAME,
  fn: communicator
};