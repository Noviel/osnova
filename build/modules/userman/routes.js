'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = routes;

var _osnovaLib = require('osnova-lib');

// Created by snov on 27.08.2016.

var userData = require('./model');
var User = userData.model;

function routes(osnova) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var app = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : osnova.express;
  var passport = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : osnova.userman.passport;


  var routes = [];
  for (var i = 0; i < routes.length; i++) {
    if (!routes[i] || !routes[i].actions) continue;

    var method = routes[i].method;
    app[method](routes[i].path, routes[i].actions);
  }

  app.get('/', function (req, res) {
    if (!req.session.views) req.session.views = 1;else req.session.views++;

    res.render('index');
  });

  app.get('/signup', function (req, res) {
    res.render('login', { title: 'Hey', message: 'views count: ' + req.session.views });
  });

  app.get('/register', function (req, res) {
    res.render('unauth', { action: 'register' });
  });

  app.get('/isloggedin', function (req, res) {
    if (req.user) {
      res.send(req.user);
    } else {
      res.send({ status: false });
    }
  });

  app.post('/user/checklogged', function (req, res) {
    if (req.user) {
      res.send({ authenticated: true });
    } else {
      res.send({ authenticated: false });
    }
  });

  app.get('/status/logout', function (req, res) {
    res.send({ message: 'you are logged out.' });
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/status/logout');
  });

  app.get('/error/user/loggedinfailed', function (req, res) {
    res.send({ status: 'failed', code: 0, message: 'login error' });
  });

  app.get('/error/user/registerfailed', function (req, res) {
    res.send({ status: 'failed', code: 1, message: 'register error' });
  });

  app.post('/register', passport.authenticate('local-signup', {
    failureRedirect: '/error/user/registerfailed'
  }), _osnovaLib.express.safeMiddlewares(opts.events.newUserRegistered), function (req, res, next) {
    console.log('user registered');
    res.send({ status: 'success', data: req.user });
  });

  app.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/error/user/loggedinfailed'
  }), _osnovaLib.express.safeMiddlewares(opts.events.userLoggedIn), function (req, res, next) {
    res.send({ status: 'success', data: req.user });
  });
}