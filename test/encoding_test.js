'use strict';

const assert = require('assert').strict;
const encodings = require('../src/encodings.js');

const testedData = '{"name":"You Can Do It!1!"}';

const tests = {
  'ewok': '{"name":"iii bib bi ib!1!"}',
};

const testEncoding = encodingName => {
  const encodeFun = encodings[encodingName];
  const expected = tests[encodingName];
  const result = encodeFun(testedData);
  assert.strictEqual(result, expected, `Wrong encoding result,
    expected: ${expected},
    got : ${result}`);
};

try {
  for (const encodingName of Object.keys(encodings)) {
    testEncoding(encodingName);
  }
  console.log('Encoding tests successfull!');
} catch (err) {
  console.error(err);
}