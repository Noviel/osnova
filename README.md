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
    const opts = {
        init: (osnova) => { console.log('Hello. I am init func.'); }
        start: (osnova) => { console.log('And I am start func!'); }
        core: {
            paths: {
                root: myAppRoot
            }
        }
    };
    
    const OSNOVA = require('osnova');
    const osnova = OSNOVA(opts);
    osnova.start();

##API 

####function OSNOVA(opts)

! - option required to be explicitly defined on both.
W! - required for worker.
M! - required for master.

- **opts.master** [true/false]: 
Flag. Is current instance of osnova will be launched in master thread.
- **opts.init** [function(osnova)]: 
Function-initializer. Will be executed in the end of init stage and will have access to all init-stage systems.
- **opts.start** [function(osnova)]:
Function-starter. Will be executed in the end of starting-stage.
- **opts.core** [object]:
- **opts.core.paths** [object]:
- **opts.core.paths.root** (W!) [string]: Absolute project root path.
- **core.template** [string]: Template engine.
- **opts.core.target** [object]: Target configuration.
- **opts.core.target.database** [object]:
- **opts.core.target.database.uri** [string]: MongoDB connection URI. 
- **opts.core.target.database.path** [string]: MongoDB connection URL. Will be used if no `uri` specified.
- **opts.core.target.database.name** [string]: MongoDB database name. Will be used if no `uri` specified.

####function launch(opts)

- !**opts.worker** [function]: Worker function.
- !**opts.master** [function]: Master function.
- **opts.config** [object]:
- **opts.config.threads** [integer]: Number of worker-threads to be spawned.
- **opts.config.host** [object]:
- **opts.config.host.ip** [string]: Server IP of the application.
- **opts.config.host.port** [integer]: Web-server port of the application.