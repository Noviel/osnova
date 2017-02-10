// Created by snov on 17.08.2016.
const IO = require('socket.io');

export default class Socket {
  constructor(server, authOpts) {

    this.events = {
      connection: {},
      pure: {}
    };

    const io = IO(server);

    if (authOpts) {
      const passportSocketIo = require('passport.socketio');

      io.use(passportSocketIo.authorize({
        cookieParser: authOpts.cookieParser,
        key: authOpts.key,
        secret: authOpts.secret,
        store: authOpts.sessionStore,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail,
      }));

      function onAuthorizeSuccess(data, accept) {
        console.log('socket autorized.');
        accept();
      }

      function onAuthorizeFail(data, message, error, accept) {
        if (error)
          throw new Error(message);
        console.log('failed connection to socket.io:', message);

        if (error)
          accept(new Error(message));
      }
    }

    this.io = io;

    const self = this;

    io.on('connection', socket => {
      console.log('socket connected.');

      for (let i in self.events.pure) {
        socket.on(i, self.events.pure[i].event);
      }

      for (let i in self.events.connection) {
        socket.on(i, payload => {
          self.events.connection[i].event(socket, payload);
        });
      }
    });
  }

  socketEvent(name, event, socket = true) {
    if (socket) {
      this.events.connection[name] = {event: event, socket: socket};
    } else {
       this.events.pure[name] = { event: event };
    }
  }
}

Socket.prototype.on = Socket.prototype.socketEvent;