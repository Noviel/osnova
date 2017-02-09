const launch = require('../build').launch;

launch({
  worker: {
    main: require('./worker.js'),
    listen: require('../build/sticky-listen')
  },
  master: {
    main: require('./master.js'),
    listen: require('../build/sticky-master')
  },
  config: require('./config.js').launcher
});