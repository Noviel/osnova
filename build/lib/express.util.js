"use strict";

// Created by snov on 18.09.2016.

module.exports = exports = {
  emptyMiddleware: function emptyMiddleware(req, res, next) {
    next();
  },
  safeMiddlewares: function safeMiddlewares(list) {
    if (list && list.length >= 1) {
      return list;
    }
    return this.emptyMiddleware;
  },
  isAuth: function isAuth(req, res, next) {
    if (req.user) {
      next();
      return;
    }
    //res.redirect('/');
  },
  isNotAuth: function isNotAuth(req, res, next) {
    if (!req.user) {
      next();
      return;
    }
    //res.redirect('/');
  },
  checkAuth: function checkAuth(req, res, next) {}
};