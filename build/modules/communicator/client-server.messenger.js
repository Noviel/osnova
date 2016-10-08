"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Created by snov on 07.10.2016.

var ClientServerMessenger = function ClientServerMessenger(io) {
  _classCallCheck(this, ClientServerMessenger);

  this.io = io;
};

module.exports = ClientServerMessenger;