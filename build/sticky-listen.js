'use strict';

// Created by snov on 09.02.2017.
//
// Sticky listen server
//
/////////////////////////////////////////////////////////////////

function stickyListen(http) {
  var server = http.listen(0, 'localhost', function () {
    console.log('Sticky Listener Server pid:' + process.pid + ' started...');
  });

  process.on('message', function (message, connection) {
    if (message === 'sticky-session:connection') {
      // Emulate a connection event on the server by emitting the
      // event with the connection the master sent us.
      server.emit('connection', connection);
      connection.resume();
    }
  });
}

module.exports = stickyListen;