module.exports = () => {

  const config = require('./config');

  const opts = {
      core: config.core,
      master: true
  };

  const OSNOVA = require('../build');
  const osnova = OSNOVA.Server(opts);
  osnova.start((osnova) => {
    console.log(`Open ${config.launcher.host.ip}:${config.launcher.host.port} in your browser!`);
  });
};