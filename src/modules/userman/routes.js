// Created by snov on 27.08.2016.

var userData = require('./model');
var User = userData.model;

const expUtils = require('../../lib/express.util');

export default function routes(
  osnova,
  opts = {},
  app = osnova.express,
  passport = osnova.userman.passport) {

  app.get('/', function(req, res) {
    if (!req.session.views) req.session.views = 1;
    else req.session.views++;

    res.render('index');
  });

  app.get('/signup', function (req, res) {
    res.render('login', { title: 'Hey', message: `views count: ${req.session.views}`});
  });

  app.get('/register', (req, res) => {
    res.render('unauth', { action: 'register' });
  });

  // app.get('/auth', expUtils.isNotAuth, (req, res) => {
  //   res.render('unauth', { action: 'login' });
  // });

  app.get('/isloggedin', function (req, res) {
    if (req.user) {
      res.send(req.user);
    } else {
      res.send({status: false});
    }
  });

  app.post('/user/checklogged', (req, res) => {
    if (req.user) {
      res.send({authenticated: true});
    } else {
      res.send({authenticated: false});
    }
  });

  app.get('/status/logout', (req, res) => {
    res.send({message: 'you are logged out.'});
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/status/logout');
  });

  app.get('/error/user/loggedinfailed', (req, res) => {
    res.send({ status: 'failed', code: 0, message: 'login error' });
  });

  app.get('/error/user/registerfailed', (req, res) => {
    res.send({ status: 'failed', code: 1, message: 'register error' });
  });

  app.post('/register',
    passport.authenticate('local-signup', {
      failureRedirect: '/error/user/registerfailed'
    }),
    expUtils.safeMiddlewares(opts.events.newUserRegistered),
    function (req, res, next) {
      console.log('user registered');
      res.send({ status: 'success', data: req.user });
    });

  app.post('/login',
    passport.authenticate('local-login', {
      failureRedirect: '/error/user/loggedinfailed'
    }),
    expUtils.safeMiddlewares(opts.events.userLoggedIn),
    function (req, res, next) {
      res.send({ status: 'success', data: req.user });
    });

}