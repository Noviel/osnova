'use strict';

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function communicator(osnova) {
  osnova.communicator = new _core2.default({
    master: osnova.opts.master,
    port: 4778,
    ip: osnova.config.target.host.ip,
    io: osnova.io || null
  });
} // Created by snov on 07.10.2016.

module.exports = communicator;