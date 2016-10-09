**OSNOVA**

The way to use the all power of multicore processors on the server made on node.js.

Include:
- Express as a web server.
- Passport as an authorization system.
- Mongoose for work with MongoDB.
- Axon for IPC.
- Socket.IO for the client-server communication.

Every worker and the master are isolated processes. A web-server starts on the every worker. So any client requests must be processed in a worker code.
Master is used to distribute client connections between workers and provides communication of workers with master and between each other. 

Wow such ready-to-go much time to watch anime!

##Install

    npm i osnova [--save] [--production]

 Use **--production** in the most cases. It will not install any build-related stuff. (Honestly, there is no reason to build it by yourself.)

###Usage
    
    const OSNOVA = require('osnova');
    const osnovaMaster = OSNOVA.Server(/* masterOpts */);
    const osnovaWorker = OSNOVA.Server(/* workerOpts */);
    
    OSNOVA.launch({
      worker: () => { osnovaWorker.start(); },
      master: () => { osnovaMaster.start(); },
      config: {
        threads: 3,
        host: { ip: 'localhost', port: 3337 }
      }
    });

Any component of OSNOVA can be accessed from `init` or `start` functions in `opts` of `OSNOVA(opts)`.
    
    const workerOpts = {
        init: (osnova) => {
            /* init code goes here */
            myExpressRoute(osnova.express);
        },
        start: (osnova) => {
            /* starting code goes here*/
        }
    }
    const osnovaWorker = OSNOVA.Server(workerOpts);


####Express
    function myExpressRoute(osnova) {    
        const app = osnova.express;
        app.get('/myroute', (req, res) => { res.send('hello') });
    }

##API 

####function OSNOVA.Server(opts)

Starts OSNOVA server on the master or on a worker.
    
**!** - option required to be explicitly defined on both.  **W!** - required for worker.  **M!** - required for master.  

- **opts.master** [true/false]: 
Default: false. Flag. Is current instance of osnova will be launched in master thread.
- **opts.init** [function(osnova)]: 
Function-initializer. Will be executed in the end of init stage and will have access to all init-stage systems.
- **opts.start** [function(osnova)]:
Function-starter. Will be executed in the end of starting-stage.
- **opts.core** [object]:
- **opts.core.paths** [object]:
- `!`**opts.core.paths.root** [string]: Absolute project root path. MUST be defined! Used in Express and in low-level configurator.
- **opts.core.template** [string]: Template engine. Default: 'pug'.
- **opts.core.target** [object]: Target configuration.
- **opts.core.target.database** [object]:
- `!`**opts.core.target.database.uri** [string]: MongoDB connection URI. 
- `!`**opts.core.target.database.path** [string]: MongoDB connection URL. Will be used if no `uri` specified.
- `!`**opts.core.target.database.name** [string]: MongoDB database name. Will be used if no `uri` specified.

####function OSNOVA.launch(opts)

Entry point of multithreaded application.

- `!`**opts.worker** [function]: Worker function.
- `!`**opts.master** [function]: Master function.
- **opts.config** [object]:
- **opts.config.threads** [integer]: Number of worker-threads to be spawned. Default: 1.
- **opts.config.host** [object]:
- **opts.config.host.ip** [string]: Server IP of the application. Default: 'localhost'.
- **opts.config.host.port** [integer]: Web-server port of the application. Default: '8080'.

###Samples

[Very basic sample application](https://github.com/Noviel/osnova-basic-application)

