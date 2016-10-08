'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isArray = isArray;
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.defaults = defaults;
exports.defaultsMergeArrays = defaultsMergeArrays;
exports.defaultsMultiple = defaultsMultiple;
exports.sleep = sleep;
// Created by snov on 27.08.2016.

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function isObject(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

function isFunction(obj) {
  return typeof obj === 'function';
}

function defaults(dst, src) {
  if (!src) return dst;
  if (!dst) dst = {};

  for (var j in src) {
    if (src.hasOwnProperty(j)) {
      if (isObject(src[j])) {
        dst[j] = defaults(dst[j], src[j]);
      }

      if (dst[j] === undefined) {
        dst[j] = src[j];
      }
    }
  }

  return dst;
}

function defaultsMergeArrays(dst, src) {
  if (!src) return dst;
  if (!dst) dst = {};

  for (var j in src) {
    if (src.hasOwnProperty(j)) {
      if (isArray(src[j])) {
        if (isArray(dst[j])) {
          dst[j] = dst[j].concat(src[j]);
        } else if (!dst[j]) {
          dst[j] = [].concat(src[j]);
        }
      } else if (isObject(src[j])) {
        dst[j] = defaultsMergeArrays(dst[j], src[j]);
      }

      if (dst[j] === undefined) {
        dst[j] = src[j];
      }
    }
  }

  return dst;
}

function defaultsMultiple(dst) {
  for (var _len = arguments.length, src = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    src[_key - 1] = arguments[_key];
  }

  for (var i = 0, len = src.length; i < len; i++) {
    dst = defaults(dst, src[i]);
  }
  return dst;
}

function sleep(time, callback) {
  var stop = new Date().getTime();
  while (new Date().getTime() < stop + time) {
    ;
  }
  if (typeof callback === 'function') {
    callback();
  }
}