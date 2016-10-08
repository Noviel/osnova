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
  path: paths
};

module.exports = config;