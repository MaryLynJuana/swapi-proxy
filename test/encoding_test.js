'use strict';

const assert = require('assert').strict;
const encodings = require('../src/encodings.js');

const testPhrase = 'You Can Do It!1!';

const tests = {
  'ewok': 'iii bib bi ib!1!',
};

const testEncoding = encodingName => {
  const encodeFun = encodings[encodingName];
  const expected = tests[encodingName];
  const result = encodeFun(testPhrase);
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