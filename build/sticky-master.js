'use strict';

// Created by snov on 09.02.2017.
//
// Sticky master routine
//
/////////////////////////////////////////////////////////////////
var net = require('net');

var getWorkerIndex = function getWorkerIndex(ip, len) {
  var s = '';
  for (var i = 0, _len = ip.length; i < _len; i++) {
    if (!isNaN(ip[i])) {
      s += ip[i];
    }
  }

  return Number(s) % len;
};

function stickyListen(opts) {
  var ip = opts.ip,
      port = opts.port,
      workerCount = opts.workerCount,
      workers = opts.workers;


  var server = net.createServer({ pauseOnConnect: true }, function (connection) {
    var worker = workers[getWorkerIndex(connection.remoteAddress || '', workerCount)];
    worker.send('sticky-session:connection', connection);
  }).listen(port);

  console.log('Web server started on ' + ip + ':' + port);
}

module.exports = stickyListen;