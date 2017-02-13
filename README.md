# OSNOVA

## bI?

Modular Node.js server based on express and mongoose.

## Install

npm: 
```sh
npm i osnova [--save] 
```
or yarn:
```sh
yarn add osnova
```   
    
## Usage
```javascript
const OSNOVA = require('osnova');
const osnova = OSNOVA();

osnova.start((osnova) => {
  console.log(`Hello from OSNOVA v${osnova.getVersion()}`);
});
```
    
### Modules

OSNOVA is modular by its nature. Modules are just functions, that will be called on start. 
Every module added to OSNOVA will be called with `osnova` as an argument.

The very basic module:
 ```javascript
 const myUsefullCounterModule = ({ initialCount } = { initialCount: 0 }) => osnova => {
   let count = initialCount;
 
   osnova.next({ 
     counter: {
       value() { return count; },
       increment() { count++; },
       decrement() { count--; }
     }
   })    
 }
 ```
`osnova.next({ export })` assigns `export` object to `osnova`. So `myUsefullCounter` will be available 
as `osnova.counter` for other modules.
Important moment here - `next()` is not just making available some functionality from outside. 
It is also an indicator that module has done his business and OSNOVA should execute next one in the queue.
Every module **MUST CALL** `osnova.next()` even if it is not exporting anything. 
By this mechanism modules will guaranteed to be executed in an 
order they were added and any next module 
gain access to exports of all previous modules:

```javascript
const osnova = OSNOVA({
  modules: [ 
    myUsefullCounterModule({ initialCount: 100 }), 
    moduleWithoutOptions, 
    iCanCallPreviousModulesSafely
  ]
});
```
`osnova.start` takes the module as an argument. It will be added in queue as the last one.
And then module queue will be executed. So module added by `start` can safely use any other module.

```javascript
osnova.start((osnova) => {
  const counter = osnova.myUsefullCounter;
  counter.increment();
  console.log(`Hello from OSNOVA v${osnova.getVersion()}. Count = ${counter.value()}`);
});
```

### Core modules
Without any extern modules OSNOVA provides only `express`, `http` and `mongo` components.
    
#### Express

Exports `express`, `http`.

#### Mongo

Exports `mongo` with properties:
- **connection**: current connection to MongoDB.

### Options
- **listen** { function } will be called with `osnova.http` as an argument 
when all modules are ready. if `undefined` of `'default'` 
will be used built-in standard listen.

### Samples
 
#### Add routes
You **can't** do this: 

```javascript
const osnova = OSNOVA(opts);

const express = osnova.express; // app - undefined
express.get('/myroute', (req, res) => { res.send('hello') });

osnova.start();
```

The right way is to call routing from `start` callback or create a module:

```javascript

const myRouting = osnova => {
  const express = osnova.express;
  express.get('/route1', (req, res) => { res.send('hello from route1') });
  express.get('/route2', (req, res) => { res.send('hello from route2') });
  osnova.next();
}

const osnova = OSNOVA({
  modules: [ myRouting ],
  listen: 'default'
});

osnova.start();

```