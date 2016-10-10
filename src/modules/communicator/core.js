// Created by snov on 07.10.2016.

const ClientServerMessenger = require('./client-server.messenger');
const IPCMessenger = require('./ipc.messenger');

class Communicator{
  constructor(opts) {
    this.ipc = new IPCMessenger(opts.port, opts.ip, opts.master);
    console.log(`Created ${opts.master ? 'master' : 'worker'} IPC on ${opts.ip}:${opts.port}`);
    if (!opts.master && opts.io) {
      this.cs = new ClientServerMessenger(opts.io);
    } else {
      this.cs = null;
    }
  }

  use(fn) {
    fn(this.ipc, this.cs);
  }

  start() {

  }

  stop() {

  }
}

module.exports = Communicator;