const util = require('util');
const cluster = require('cluster'),
      net = require('net'),

      stopSignals = [
        'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
      ],

      production = process.env.NODE_ENV == 'production';

import { core } from 'osnova-lib';
const defaults = core.defaults;

const defaultTarget = {
  threads: 1,

  host: {
    port: 8080,
    ip: 'localhost'
  }
};

function launch(opts) {
  let stopping = false;

  cluster.on('disconnect', function (worker) {
    if (production) {
      if (!stopping) {
        cluster.fork();
      }
    } else {
      process.exit(1);
    }
  });

  const target = defaults(opts.config, defaultTarget);
  const port = target.host.port;
  const ip = target.host.ip;
  const threads = target.threads;

  let workers = [];

  if (cluster.isMaster) {
    const workerCount = threads;

    console.log(`Starting ${workerCount} workers...`);

    var spawn = function (i) {
      workers[i] = cluster.fork();
      workers[i].on('exit', function (code, signal) {
        console.log('respawning worker', i);
        spawn(i);
      });
    };

    for (let i = 0; i < workerCount; i++) {
      spawn(i);
    }

    var workerIndex = function (ip, len) {
      var s = '';
      for (var i = 0, _len = ip.length; i < _len; i++) {
        if (!isNaN(ip[i])) {
          s += ip[i];
        }
      }

      return Number(s) % len;
    };

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });

    const server = net.createServer({pauseOnConnect: true}, connection => {
      const worker = workers[workerIndex(connection.remoteAddress, workerCount)];
      worker.send('sticky-session:connection', connection);
    }).listen(port);

    console.log(`Web server started on ${ip}:${port}`);

    if (production) {
      stopSignals.forEach(function (signal) {
        process.on(signal, function () {
          console.log(`Got ${signal}, stopping workers...`);
          stopping = true;
          cluster.disconnect(function () {
            console.log('All workers stopped, exiting.');
            process.exit(0);
          });
        });
      });
    }

    opts.master();
  } else {
    opts.worker();
  }
}

module.exports = launch;