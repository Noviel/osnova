// Created by snov on 07.10.2016.

import Communicator from './core';

function communicator(osnova) {
  const communicator = new Communicator({
    master: osnova.opts.master,
    port: 4778,
    ip: 'localhost',
    io: osnova.io || null
  });
  osnova.next({ communicator });
}

module.exports = communicator;