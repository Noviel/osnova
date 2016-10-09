'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Created by snov on 07.10.2016.

var ClientServerMessenger = require('./client-server.messenger');
var IPCMessenger = require('./ipc.messenger');

var Communicator = function () {
  function Communicator(opts) {
    _classCallCheck(this, Communicator);

    this.ipc = new IPCMessenger(opts.port, opts.ip, opts.master);
    console.log('Created ' + (opts.master ? 'master' : 'worker') + ' IPC on ' + opts.ip + ':' + opts.port);
    if (!opts.master && opts.io) {
      this.cs = new ClientServerMessenger(opts.io);
    }
  }

  _createClass(Communicator, [{
    key: 'use',
    value: function use(fn) {
      fn(this.ipc, this.cs);
    }
  }, {
    key: 'start',
    value: function start() {}
  }, {
    key: 'stop',
    value: function stop() {}
  }]);

  return Communicator;
}();

module.exports = Communicator;