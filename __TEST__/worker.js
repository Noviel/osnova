const myModule = require('./mymodule');
const opts = { core: require('./config').core };
const OSNOVA = require('../build');
const osnova = OSNOVA.Server(opts);

module.exports = () => {
  osnova.add(myModule('1'));
  osnova.add(myModule('7'), 'YA SEDMOI');

  osnova.start((osnova) => {
    const app = osnova.express;

    app.get('/', (req, res) => {
      res.sendFile('index.html', { root: osnova.opts.core.paths.absolute.static });
    });
  });

};