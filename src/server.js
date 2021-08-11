'use strict';

const http = require('http');
const https = require('https');
const { URL } = require('url');
const encodings = require('./encodings.js');

const swapiUrl = 'https://swapi.dev/api';

const routing = {
  'GET': {
    '/people': (id, searchPars, callback) => {
      console.log(`Sending request to swapi for route /people/${id}`);
      https.get(`${swapiUrl}/people/${id}${searchPars}`, callback);
    },
    '/planets': (id, searchPars, callback) => {
      console.log(`Sending request to swapi for route /planets/${id}`);
      https.get(`${swapiUrl}/planets/${id}${searchPars}`, callback);
    },
  },
};

module.exports = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://' + req.headers.host);
  const urlParts = url.pathname.split('/');
  const id = parseInt(urlParts[urlParts.length - 1]);
  if (!isNaN(id)) urlParts.pop();
  const handler = routing[req.method][urlParts.join('/')];
  if (!handler) {
    res.writeHead(404);
    return res.end('Page not found :(');
  }
  const callback = response => {
    const { statusCode } = response;
    res.writeHead(statusCode);
    if (statusCode !== 200) {
      return res.end(`Request failed. Got status code: ${statusCode}`);
    }
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      const encodeFun = encodings[url.searchParams.get('encoding')];
      if (encodeFun) data = encodeFun(data);
      res.end(data);
    });
  };
  handler((isNaN(id) ? '' : id), url.search, callback);
});
