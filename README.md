**OSNOVA**

Multithreaded node.js server based on master/workers conception.
Include:
- Mongoose as a database.
- Express as web server.
- Passport as authorization system.
- Axon for IPC communication.
- Socket.IO for client-server communication.

Wow such ready-to-go much time to watch anime!

Install

npm i osnova [--save] [--production]

--production - use in most cases. It will not install any Babel stuff. Use this flag if you want to use prebuilt version of OSNOVA.

Usage

const OSNOVA = require('osnova');
const osnova = OSNOVA(opts);


