// Created by snov on 11.10.2016.

const Module = require('../build/module');

class MyModule extends Module {
  constructor(name, fn) {
    super(name, fn);
  }
}

module.exports = function(name) {
  return new Module(name, (osnova) => {
    console.log(`I AM AN EXTERN MODULE ${name}... LOADING)))`);

    setTimeout(() => {
      osnova.moduleReady();
    }, 100);

  });
};