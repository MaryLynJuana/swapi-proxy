'use strict';

const http = require('http');
const https = require('https');
const { parse } = require('url');
const encodings = require('./encodings.js');

const host = 'localhost';
const port = 3033;

const swapiUrl = 'https://swapi.dev/api';

const routing = {
  'GET': {
    '/people': (id, encoding, res) => (
      https.get(`${swapiUrl}/people/${id}`, response => {
        const { statusCode } = response;
        res.writeHead(statusCode);
        if (statusCode !== 200) {
          return res.end(`Request failed. Got status code: ${statusCode}`);
        };
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
          const encodeFun = encodings[encoding];
          if (encodeFun) data = encodeFun(data);
          res.end(data);
        });
      })
    ),
    '/planets': (id, encoding, res) => (
      https.get(`${swapiUrl}/planets/${id}`, response => {
        const { statusCode } = response;
        res.writeHead(statusCode);
        if (statusCode !== 200) {
          return res.end(`Request failed. Got status code: ${statusCode}`);
        };
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
          const encodeFun = encodings[encoding];
          if (encodeFun) data = encodeFun(data);
          res.end(data);
        });
      })
    ),
  },
};

const server = http.createServer((req, res) => {
  const { url } = req;
  const urlParts = url.split('/');
  const id = parseInt(urlParts[urlParts.length - 1]);
  if (!isNaN(id)) urlParts.pop();
  const { encoding } = parse(req.url,true).query;
  const handler = routing[req.method][urlParts.join('/')];
  if (!handler) {
    res.writeHead(404);
    return res.end('Page not found :(');
  };
  handler((isNaN(id) ? '' : id), encoding, res);
});

server.listen(port, host, () => console.log(`Server running at ${host}:${port}, tutturu`));
