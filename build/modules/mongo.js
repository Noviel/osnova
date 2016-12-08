'use strict';

// Created by snov on 11.10.2016.

var mongoose = require('mongoose');
var Bluebird = require('bluebird');

mongoose.Promise = Bluebird;
Bluebird.promisifyAll(require('mongoose'));

function connect(osnova) {
  var config = osnova.opts.core;
  var connectString = void 0;
  if (config.target.database.uri) {
    connectString = config.target.database.uri;
  } else {
    connectString = config.target.database.path + config.target.database.name;
  }
  return osnova.connection = mongoose.connect(connectString).connection;
}

function mongo(osnova) {
  connect(osnova).on('error', console.error.bind(console, 'connection error:')).on('disconnected', function () {
    connect(osnova);
  }).once('open', function () {
    console.log('Connected to MongoDB.');
    osnova.moduleReady();
  });
}

module.exports = mongo;