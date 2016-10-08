// Created by snov on 18.09.2016.

module.exports = exports = {
  emptyMiddleware (req, res, next) {
    next();
  },

  safeMiddlewares (list) {
    if (list && list.length >= 1) {
      return list;
    }
    return this.emptyMiddleware;
  },

  isAuth (req, res, next) {
    if (req.user) {
      next();
      return;
    }
    //res.redirect('/');
  },

  isNotAuth (req, res, next) {
    if (!req.user) {
      next();
      return;
    }
    //res.redirect('/');
  },

  checkAuth(req, res, next) {

  }

};