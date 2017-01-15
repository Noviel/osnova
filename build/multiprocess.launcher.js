'use strict';

var _osnovaLib = require('osnova-lib');

var util = require('util');
var cluster = require('cluster'),
    net = require('net'),
    stopSignals = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'],
    production = process.env.NODE_ENV == 'production';

var defaults = _osnovaLib.core.defaults;

var defaultTarget = {
  threads: 1,

  host: {
    port: 8080,
    ip: 'localhost'
  }
};

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

  var target = defaults(opts.config, defaultTarget);
  var port = target.host.port;
  var ip = target.host.ip;
  var threads = target.threads;

  var workers = [];

  if (cluster.isMaster) {
    (function () {
      var workerCount = threads;

      console.log('Starting ' + workerCount + ' workers...');

      var spawn = function spawn(i) {
        workers[i] = cluster.fork();
        workers[i].on('exit', function (code, signal) {
          console.log('respawning worker', i);
          spawn(i);
        });
      };

      for (var i = 0; i < workerCount; i++) {
        spawn(i);
      }

      var workerIndex = function workerIndex(ip, len) {
        var s = '';
        for (var _i = 0, _len = ip.length; _i < _len; _i++) {
          if (!isNaN(ip[_i])) {
            s += ip[_i];
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

      console.log('Web server started on ' + ip + ':' + port);

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