// Created by snov on 07.10.2016.

const axon = require('axon');

class IPCMessenger {
  constructor(startPort, ip, master) {
    this.publisher  = axon.socket('pub-emitter');
    this.subscriber = axon.socket('sub-emitter');

    if (master) {
      this.responser = axon.socket('rep');

      this.publisher.bind (startPort + 0, ip);
      this.subscriber.bind(startPort + 1, ip);
      this.responser.bind (startPort + 2, ip);
    } else {
      this.requester = axon.socket('req');

      this.publisher.connect (startPort + 1, ip);
      this.subscriber.connect(startPort + 0, ip);
      this.requester.connect (startPort + 2, ip);
    }

  }

  start() {

  }

  stop() {

  }
}

module.exports = IPCMessenger;