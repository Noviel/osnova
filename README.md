**OSNOVA**

The way to use the all power of multicore processors on the server made on node.js.

Include:
- Express as web server.
- Passport as authorization system.
- Mongoose for work with MongoDB.
- Axon for IPC communication.
- Socket.IO for client-server communication.

Every worker and maser are isolated processes. Web-server starts on the every worker. So any client requests must be processed in worker code.
Master is used to distribute client connections between workers and provides communication of workers with master and between each other. 

Wow such ready-to-go much time to watch anime!

##Install

    npm i osnova [--save] [--production]

  **--production** - use in most cases. It will not install any Babel stuff. Use this flag if you want to use prebuilt version of OSNOVA.

###Usage

    const OSNOVA = require('osnova');
    const opts = {/* options object */};
    const osnova = OSNOVA(opts);
    osnova.start();

Any component of OSNOVA can be accessed from `init` or `start` functions in options of OSNOVA.
    
    const opts = {
        init: (osnova) => {
            /* init code goes here */
        },
        start: (osnova) => {
            /* starting code goes here*/
        }
    }


####Express
        const app = osnova.express;
        app.get('/myroute', (req, res) => { res.send('hello') });


##API 

####function OSNOVA(opts)

Starts OSNOVA server on the master or on a worker.
    
**!** - option required to be explicitly defined on both.  **W!** - required for worker.  **M!** - required for master.  

- **opts.master** [true/false]: 
Flag. Is current instance of osnova will be launched in master thread.
- **opts.init** [function(osnova)]: 
Function-initializer. Will be executed in the end of init stage and will have access to all init-stage systems.
- **opts.start** [function(osnova)]:
Function-starter. Will be executed in the end of starting-stage.
- **opts.core** [object]:
- **opts.core.paths** [object]:
- **opts.core.paths.root** (W!) [string]: Absolute project root path. Used in Express, because of it is required only on worker.
- **opts.core.template** [string]: Template engine.
- **opts.core.target** [object]: Target configuration.
- **opts.core.target.database** [object]:
- **opts.core.target.database.uri** [string]: MongoDB connection URI. 
- **opts.core.target.database.path** [string]: MongoDB connection URL. Will be used if no `uri` specified.
- **opts.core.target.database.name** [string]: MongoDB database name. Will be used if no `uri` specified.

####function launch(opts)

Entry point of multithreaded application.

- !**opts.worker** [function]: Worker function.
- !**opts.master** [function]: Master function.
- **opts.config** [object]:
- **opts.config.threads** [integer]: Number of worker-threads to be spawned.
- **opts.config.host** [object]:
- **opts.config.host.ip** [string]: Server IP of the application.
- **opts.config.host.port** [integer]: Web-server port of the application.

###Basic Application Code

worker.js

    module.exports = {
        const opts = {
            init: (osnova) => { console.log('Hello. I am worker init func.'); }
            start: (osnova) => { console.log('And I am worker start func!'); }
            core: {
                paths: {
                    root: require('path).resolve(__dirname)
                }
                target: {
                    database: { uri: 'my_mongodb_uri' }
                }
            }
        };
        
        const OSNOVA = require('osnova');
        const osnova = OSNOVA(opts);
        osnova.start();
    }

master.js

    module.exports = {
        const opts = {
            init: (osnova) => { console.log('Hello. I am init master func.'); }
            start: (osnova) => { console.log('And I am master start func!'); }
            core: {
                target: {
                    database: { uri: 'my_mongodb_uri' }
                }
            }
        };
        
        const OSNOVA = require('osnova');
        const osnova = OSNOVA(opts);
        osnova.start();
    }

index.js

    const launch = require('osnova').launch;
    
    launch({
      worker: require('./worker.js'),
      master: require('./master.js'),
      config: {
        threads: 3,
        host: { ip: 'localhost', port: 3337 }
      }
    });
