'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = socket;

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function socket(opts) {
  var authOpts = opts.auth ? {
    cookieParser: osnova.cookieParser,
    key: osnova.opts.core.session.key,
    secret: osnova.opts.core.session.secret,
    sessionStore: osnova.sessionStore
  } : null;

  return function socketio(osnova) {
    var http = osnova.http;

    var io = new _core2.default(http, authOpts);

    io.on = io.socketEvent;

    io.socketEvent('disconnect', function () {
      console.log('socket disconnected');
    }, false);

    osnova.next({ io: io });
  };
} // Created by snov on 18.09.2016.

module.exports = socket;