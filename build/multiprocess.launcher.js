'use strict';

var util = require('util');
var cluster = require('cluster'),
    net = require('net'),
    stopSignals = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'],
    production = process.env.NODE_ENV == 'production';

function launch(opts) {
  var stopping = false;

  cluster.on('disconnect', function (worker) {
    if (production) {
      if (!stopping) {
        cluster.fork();
      }
    } else {
      process.exit(1);
    }
  });

  var target = opts.config;
  target.host = target.host || { port: 8080, ip: 'localhost' };

  var port = target.host.port || 8080;
  var ip = target.host.ip || 'localhost';
  var threads = target.threads || 1;

  var workers = [];

  if (cluster.isMaster) {
    var _spawn;

    var workerIndex;

    (function () {
      var workerCount = threads;

      console.log('Starting ' + workerCount + ' workers...');

      _spawn = function spawn(i) {
        workers[i] = cluster.fork();
        workers[i].on('exit', function (code, signal) {
          console.log('respawning worker', i);
          _spawn(i);
        });
      };

      for (var i = 0; i < workerCount; i++) {
        _spawn(i);
      }

      workerIndex = function workerIndex(ip, len) {
        var s = '';
        for (var i = 0, _len = ip.length; i < _len; i++) {
          if (!isNaN(ip[i])) {
            s += ip[i];
          }
        }

        return Number(s) % len;
      };

      cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
      });

      var server = net.createServer({ pauseOnConnect: true }, function (connection) {
        var worker = workers[workerIndex(connection.remoteAddress, workerCount)];
        worker.send('sticky-session:connection', connection);
      }).listen(port);

      if (production) {
        stopSignals.forEach(function (signal) {
          process.on(signal, function () {
            console.log('Got ' + signal + ', stopping workers...');
            stopping = true;
            cluster.disconnect(function () {
              console.log('All workers stopped, exiting.');
              process.exit(0);
            });
          });
        });
      }

      opts.master();
    })();
  } else {
    opts.worker();
  }
}

module.exports = launch;