'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Created by snov on 17.08.2016.
var IO = require('socket.io');
var ioRedis = require('socket.io-redis');
var passportSocketIo = require("passport.socketio");

var Socket = function () {
  function Socket(server, authOpts) {
    _classCallCheck(this, Socket);

    this.events = {
      connection: {},
      pure: {}
    };

    var io = IO(server);

    if (authOpts) {
      var onAuthorizeSuccess = function onAuthorizeSuccess(data, accept) {
        console.log('socket autorized.');
        accept();
      };

      var onAuthorizeFail = function onAuthorizeFail(data, message, error, accept) {
        if (error) throw new Error(message);
        console.log('failed connection to socket.io:', message);

        if (error) accept(new Error(message));
      };

      io.use(passportSocketIo.authorize({
        cookieParser: authOpts.cookieParser,
        key: authOpts.key,
        secret: authOpts.secret,
        store: authOpts.sessionStore,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
      }));
    }

    // io.adapter(ioRedis({ host: 'localhost', port: 6379 }));

    this.io = io;

    var self = this;

    io.on('connection', function (socket) {
      console.log('socket connected.');

      for (var i in self.events.pure) {
        socket.on(i, self.events.pure[i].event);
      }

      var _loop = function _loop(_i) {
        socket.on(_i, function (payload) {
          self.events.connection[_i].event(socket, payload);
        });
      };

      for (var _i in self.events.connection) {
        _loop(_i);
      }
    });
  }

  _createClass(Socket, [{
    key: 'socketEvent',
    value: function socketEvent(name, event) {
      var socket = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (socket) {
        this.events.connection[name] = { event: event, socket: socket };
      } else {
        this.events.pure[name] = { event: event };
      }
    }
  }]);

  return Socket;
}();

exports.default = Socket;