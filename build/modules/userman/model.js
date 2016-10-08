'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Created by snov on 14.07.2016.

var bcrypt = require('bcryptjs');

var Schema = _mongoose2.default.Schema;

var userSchema = new Schema({
  name: String,

  local: {
    email: String,
    password: String
  },

  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },

  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },

  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },

  admin: Boolean,
  location: String,
  meta: {
    age: Number
  },
  created_at: Date,
  updated_at: Date
});

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = exports = _mongoose2.default.model('User', userSchema);