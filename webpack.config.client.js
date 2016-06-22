var path = require('path');
var webpack = require('webpack');

console.log('using webpack.config.js');

const pj = path.join, pr = path.resolve;

module.exports = {
  entry: {
    main: './src/code/client/app'
  },

  output: {
    path: pj(__dirname, 'public/js/'),
    filename: '[name].compiled.js'
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
        //query: {
        //  presets:['stage-0', 'react', 'es2015']
        //}
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ],
    postLoaders: [
      {
        test: /\.js$/,
        include: pr(__dirname, './node_modules/pixi.js'),
        loader: 'transform/cacheable?brfs'
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