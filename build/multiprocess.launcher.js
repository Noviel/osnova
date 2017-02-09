'use strict';

var _osnovaLib = require('osnova-lib');

var util = require('util');
var cluster = require('cluster');

var stopSignals = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'],
    production = process.env.NODE_ENV === 'production';

var defaults = _osnovaLib.core.defaults;

var spawn = function spawn(workers, i) {
  workers[i] = cluster.fork();
  workers[i].on('exit', function (code, signal) {
    console.log('respawning worker', i);
    spawn(workers, i);
  });
};

var defaultTarget = {
  threads: 1,

  host: {
    port: 8080,
    ip: 'localhost'
  }
};

function launch(opts) {

  var stopping = false;
  console.log(opts);
  var target = defaults(opts.config, defaultTarget);
  var port = target.host.port;
  var ip = target.host.ip;
  var threads = target.threads;

  cluster.on('disconnect', function (worker) {
    if (production) {
      if (!stopping) {
        cluster.fork();
      }
    } else {
      process.exit(1);
    }
  });

  var workers = [];

  if (cluster.isMaster) {
    var workerCount = threads;

    console.log('Starting ' + workerCount + ' workers...');

    for (var i = 0; i < workerCount; i++) {
      spawn(workers, i);
    }

    cluster.on('exit', function (worker, code, signal) {
      console.log('worker ' + worker.process.pid + ' died');
    });

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

    if (_osnovaLib.core.isFunction(opts.master.listen)) {
      opts.master.listen({ ip: ip, port: port, workers: workers, workerCount: workerCount });
    }

    opts.master.main(opts.master.listen);
  } else {
    opts.worker.main(opts.worker.listen);
  }
}

module.exports = launch;