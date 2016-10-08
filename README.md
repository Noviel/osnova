**OSNOVA**

Multithreaded node.js server based on master/workers conception.
Include:
- Mongoose as a database.
- Express as web server.
- Passport as authorization system.
- Axon for IPC communication.
- Socket.IO for client-server communication.

Wow such ready-to-go much time to watch anime!

##Install

    npm i osnova [--save] [--production]

  **--production** - use in most cases. It will not install any Babel stuff. Use this flag if you want to use prebuilt version of OSNOVA.

##Usage

    const OSNOVA = require('osnova');
    const osnova = OSNOVA(opts);
    osnova.start();

##API 

###OSNOVA(opts)

- **opts.master** [true/false]: 
Flag. Is current instance of osnova will be launched in master thread.
- **opts.init** [function]: 
Function-initializer. Will be executed in the end of init stage and will have access to all init-stage systems.
- **opts.start** [function]:
Function-starter. Will be executed in the end of starting-stage.