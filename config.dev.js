// Created by snov on 28.06.2016.

const path    = require('path');
const appRoot = path.resolve(__dirname);
const env     = process.env;

const paths = {
  root: appRoot,
  public: {
    web: path.resolve(appRoot, './public'),
    mobile: path.resolve(appRoot, './mobile/www')
  },
  views: path.resolve(appRoot, './private/views'),
  server:  path.resolve(appRoot, './server')
};

const config = {
  path: paths,

  webpack: {
    web: {
      public: paths.public.web,
      entry: {
        'js/index': path.join(appRoot, './src/client/index.js'),
        //'js/index.unauth': path.join(appRoot, './src/client/index.unauthorized.js'),
        //'css/index': path.join(appRoot, './src/styles/index.css'),
      },
      production: false
    },

    mobile: {
      public: paths.public.mobile,
      entry: {
        'js/index': path.join(appRoot, './src/client/index.android.js'),
        //'css/index': path.join(appRoot, './src/styles/index.css')
      },
      production: false
    }
  }
};

module.exports = config;