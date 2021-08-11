'use strict';

const assert = require('assert').strict;
const http = require('http');
const server = require('../src/server.js');
server.listen(3033, 'localhost');

const baseUrl = 'http://localhost:3033/';

const tests = {
  'people/1': '{\
"name":"Luke Skywalker",\
"height":"172",\
"mass":"77",\
"hair_color":"blond",\
"skin_color":"fair",\
"eye_color":"blue",\
"birth_year":"19BBY",\
"gender":"male",\
"homeworld":"https://swapi.dev/api/planets/1/",\
"films":[\
"https://swapi.dev/api/films/1/",\
"https://swapi.dev/api/films/2/",\
"https://swapi.dev/api/films/3/",\
"https://swapi.dev/api/films/6/"\
],\
"species":[],\
"vehicles":[\
"https://swapi.dev/api/vehicles/14/",\
"https://swapi.dev/api/vehicles/30/"\
],\
"starships":[\
"https://swapi.dev/api/starships/12/",\
"https://swapi.dev/api/starships/22/"\
],\
"created":"2014-12-09T13:50:51.644000Z",\
"edited":"2014-12-20T21:17:56.891000Z",\
"url":"https://swapi.dev/api/people/1/"\
}',
  'people/1?encoding=ewok': '{\
"name":"bibi bbibibbib",\
"height":"172",\
"mass":"77",\
"hair_color":"bbibb",\
"skin_color":"biib",\
"eye_color":"bbii",\
"birth_year":"19bbi",\
"gender":"bibi",\
"homeworld":"bbbbb://bbibi.bib/ibi/bbibibb/1/",\
"films":[\
"bbbbb://bbibi.bib/ibi/bibbb/1/",\
"bbbbb://bbibi.bib/ibi/bibbb/2/",\
"bbbbb://bbibi.bib/ibi/bibbb/3/",\
"bbbbb://bbibi.bib/ibi/bibbb/6/"\
],\
"species":[],\
"vehicles":[\
"bbbbb://bbibi.bib/ibi/bibibbib/14/",\
"bbbbb://bbibi.bib/ibi/bibibbib/30/"\
],\
"starships":[\
"bbbbb://bbibi.bib/ibi/bbibbbibb/12/",\
"bbbbb://bbibi.bib/ibi/bbibbbibb/22/"\
],\
"created":"2014-12-09b13:50:51.644000b",\
"edited":"2014-12-20b21:17:56.891000b",\
"url":"bbbbb://bbibi.bib/ibi/biibbi/1/"\
}',
  'planets/4': '{\
"name":"Hoth",\
"rotation_period":"23",\
"orbital_period":"549",\
"diameter":"7200",\
"climate":"frozen",\
"gravity":"1.1 standard",\
"terrain":"tundra, ice caves, mountain ranges",\
"surface_water":"100",\
"population":"unknown",\
"residents":[],\
"films":[\
"https://swapi.dev/api/films/2/"\
],\
"created":"2014-12-10T11:39:13.934000Z",\
"edited":"2014-12-20T20:58:18.423000Z",\
"url":"https://swapi.dev/api/planets/4/"\
}',
  'planets/4?encoding=ewok': '{\
"name":"bibb",\
"rotation_period":"23",\
"orbital_period":"549",\
"diameter":"7200",\
"climate":"bbibib",\
"gravity":"1.1 bbibbibb",\
"terrain":"bibbbi, ibi bibib, biibbiib bibbib",\
"surface_water":"100",\
"population":"ibbbibb",\
"residents":[],\
"films":[\
"bbbbb://bbibi.bib/ibi/bibbb/2/"\
],\
"created":"2014-12-10b11:39:13.934000b",\
"edited":"2014-12-20b20:58:18.423000b",\
"url":"bbbbb://bbibi.bib/ibi/bbibibb/4/"\
}',
};

let counter = 0;

const testRequest = async path => {
  counter++;
  const expected = tests[path];
  const req = http.get(baseUrl + path, async res => {
    counter--;
    const { statusCode } = res;
    if (statusCode !== 200) assert.fail(`Wrong status code,
      expected 200,
      got ${statusCode}`);
    const buffers = [];
    for await (const chunk of res) buffers.push(chunk);
    const data = Buffer.concat(buffers).toString();
    assert.strictEqual(data, expected, `Wrong response data,
        expected: ${expected},
        got: ${data}`);
    if (counter <= 0) server.close(() => console.log('Server tests finished!'));
  });
  req.setTimeout(3000, () => assert.fail('Request timed out'));
};

(async () => {
  try {
    const paths = Object.keys(tests);
    await paths.forEach(testRequest);
  } catch (err) {
    console.error(err);
  }
})();
