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
    
    
####Accessing the components

Any component of OSNOVA can be accessed from `osnova` object, which is returned by `OSNOVA.Server(opts)`.

- Functions `init` and `start` from `opts` of `OSNOVA.Server(opts)` 
will be called with `osnova` object as a parameter when their time comes.
    
        const workerOpts = {
            init: (osnova) => {
                const app = osnova.express;
                app.get('/myroute', (req, res) => { res.send('hello') });
            },
            start: (osnova) => {
                allComponentsAreInitializedLetsRock(osnova);
            }
        }
        const osnovaWorker = OSNOVA.Server(workerOpts);

Options (including `start` and `init` functions) are passed to configurator, when `OSNOVA.Server()` is called. 
But core modules will be created later, after `osnova.start()` called. Because of it you **can't** write something like this:

    const osnova = OSNOVA.Server(opts);
    const app = osnova.express;
    app.get('/myroute', (req, res) => { res.send('hello') });

`app` will be undefined. All logic based on `osnova` components should be called from inside `start`/`init` functions. 

 - The other way access to `osnova` components is [OsnovaModule](#osnovamodule).
    
There is no other way to get any `osnova` component safely.

##API 
###OSNOVA
`OSNOVA = require('osnova');`
####.Server(opts)
**@in** `opts` - options object  
**@return** `OsnovaServer` - public OSNOVA server interface  
Starts OSNOVA server on the master or on a worker.
This is a default import and available via:

    import OSNOVA from 'osnova'
    const osnovaServer = OSNOVA({/* opts */});
    
**!** - option required to be explicitly defined on both.  
**W!** - required for worker.  
**M!** - required for master.

- **opts.master** [true/false]: 
Default: false. Flag. Is current instance of osnova will be launched in master thread.
- **opts.init** [function(osnova object)]: 
Function-initializer. Will be called after all components are ready and have full access to them.
- **opts.start** [function(osnova object)]:
Function-starter. Will be called after initialize state.
- **opts.core** [object]:
- **opts.core.paths** [object]:
- `!`**opts.core.paths.root** [string]: Absolute project root path. MUST be defined! Used in Express and in low-level configurator.
- **opts.core.paths.public** [string]: Relative path from project root to public web-server folder. `Default: './public'`
- **opts.core.paths.views** [string]: Relative path from project root to template-views folder. `Default './private/views'`
- **opts.core.template** [string]: Template engine. Default: 'pug'.
- **opts.core.target** [object]: Target configuration.
- **opts.core.target.database** [object]:
- `!`**opts.core.target.database.uri** [string]: MongoDB connection URI. 
- `!`**opts.core.target.database.path** [string]: MongoDB connection URL. Will be used if no `uri` specified.
- `!`**opts.core.target.database.name** [string]: MongoDB database name. Will be used if no `uri` specified.

####.launch(opts)
**@in** `opts` - options object  
**@return** -  

Entry point of multithreaded application. It takes config, master and worker functions and launch its in master and workers threads respectively.

- `!`**opts.worker** [function]: Worker function.
- `!`**opts.master** [function]: Master function.
- **opts.config** [object]:
- **opts.config.threads** [integer]: Number of worker-threads to be spawned. Default: 1.
- **opts.config.host** [object]:
- **opts.config.host.ip** [string]: Server IP of the application. Default: 'localhost'.
- **opts.config.host.port** [integer]: Web-server port of the application. Default: '8080'.

####.Module(name, fn)

 - `!`**@in** `name` [string]: Unique module name. 
 - `!`**@in** `fn` [function(osnova object)]: Module entry point.
 - **@return** `OsnovaModule`.  
 
###OsnovaServer

Returned by `OSNOVA.Server()` and provides main interface to OSNOVA.

####.add(module)
**@in** `module` [OsnovaModule object]  
**@return** -  
Adds custom module to OSNOVA. Should be called after `osnova = OSNOVA.Server()` and before `osnova.start()`.

    
See [OsnovaModule](#osnovamoduledesc) for details.

####.start()
**@in** -  
**@return** -  
Starts the server. Any code in flow after this function will never be executed.

###OsnovaModule

Returned by [OSNOVA.Module(name, fn)](#moduledesc)
 
Module can be created by `new OSNOVA.Module()` or simply by object literal with the required fields.
 
    
    const myModule = {
        name: 'myCustomModule',
        fn: (osnova) => {
            setTimeout(() => {
                osnova.moduleReady();
            }, 1000);
        }
    }
    osnovaMaster.add(myModule);
        
OSNOVA module system is based on the execution queue. Modules are guaranteed to be invoked 
in the sequence in which were added. Even if they are doing async job inside themselves. 
This is achieved by function `osnova.moduleReady()` that **MUST** be called, when module is ready.
It tells to module system that the module (where it is called from) finished the job 
and the next module can be called. 
If this function is not called - the system will never 
know that the module has done his job, and never will start operating next module in the queue.



###Samples

[Very basic sample application](https://github.com/Noviel/osnova-basic-application)

