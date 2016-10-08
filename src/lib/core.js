// Created by snov on 27.08.2016.

export function isArray (obj) {
  return (Object.prototype.toString.call(obj) === '[object Array]');
}

export function isObject (obj) {
  return (typeof obj === 'object');
}

export function isFunction (obj) {
  return (typeof obj === 'function');
}

export function defaults(dst, src) {
  if (!src) return dst;
  if (!dst) dst = {};

  for (let j in src) {
    if (src.hasOwnProperty(j)) {
      if (isObject(src[j])) {
        dst[j] = defaults(dst[j], src[j]);
      }

      if (dst[j] === undefined) { dst[j] = src[j]; }
    }
  }

  return dst;
}

export function defaultsMergeArrays(dst, src) {
  if (!src) return dst;
  if (!dst) dst = {};

  for (let j in src) {
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

      if (dst[j] === undefined) { dst[j] = src[j]; }
    }
  }

  return dst;
}

export function defaultsMultiple(dst, ...src) {
  for (let i = 0, len = src.length; i < len; i++) {
    dst = defaults(dst, src[i]);
  }
  return dst;
}

export function sleep(time, callback) {
  const stop = new Date().getTime();
  while(new Date().getTime() < stop + time) {
      ;
  }
  if (typeof callback === 'function') {
    callback();
  }
}