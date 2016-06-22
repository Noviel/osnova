var path = require('path');
var webpack = require('webpack');

console.log('using webpack.config.server.js');

const pj = path.join, pr = path.resolve;

module.exports = {
  entry: {
    main: './src/server/index.js'
  },

  output: {
    path: pj(__dirname, 'build/'),
    filename: '[name].server.js'
  },

  debug: true,
  devtool: 'source-map',

  resolveLoader: {
    root: pj(__dirname, 'node_modules')
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: [ pr(__dirname, 'src') ],
        query: {
          presets:['stage-0', 'es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },

  plugins: [
    new webpack.OldWatchingPlugin()
  ]

  /* resolve: {
   extensions: ['', '.js', '.jsx'],
   root: pj(__dirname, 'node_modules'),

   alias: {
   //'react$': path.resolve(__dirname, './node_modules/react/dist/react.js'),
   //'react-dom$': path.resolve(__dirname, './node_modules/react-dom/dist/react-dom.js'),
   //'babel-polyfill$': path.resolve(__dirname, './node_modules/babel-polyfill/dist/polyfill.min.js'),
   //'pixi.js$': pr(__dirname, './node_modules/pixi.js/bin/pixi.min.js')
   }
   },*/
};