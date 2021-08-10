'use strict';

const server = require('./server.js');

const host = 'localhost';
const port = 3033;

server.listen(port, host, () => console.log(`Server running at ${host}:${port}, tutturu`));
