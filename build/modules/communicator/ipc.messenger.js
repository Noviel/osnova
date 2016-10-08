'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Created by snov on 07.10.2016.

var axon = require('axon');

var IPCMessenger = function () {
  function IPCMessenger(startPort, ip, master) {
    _classCallCheck(this, IPCMessenger);

    this.publisher = axon.socket('pub-emitter');
    this.subscriber = axon.socket('sub-emitter');

    if (master) {
      this.responser = axon.socket('rep');

      this.publisher.bind(startPort + 0, ip);
      this.subscriber.bind(startPort + 1, ip);
      this.responser.bind(startPort + 2, ip);
    } else {
      this.requester = axon.socket('req');

      this.publisher.connect(startPort + 1, ip);
      this.subscriber.connect(startPort + 0, ip);
      this.requester.connect(startPort + 2, ip);
    }
  }

  _createClass(IPCMessenger, [{
    key: 'start',
    value: function start() {}
  }, {
    key: 'stop',
    value: function stop() {}
  }]);

  return IPCMessenger;
}();

module.exports = IPCMessenger;