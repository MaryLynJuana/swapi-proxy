'use strict';

const vowels = 'aeiouy';
const vowelReg = new RegExp(`[${vowels}]`,'gi');
const consonantReg = new RegExp(`(?![${vowels}])[a-z]`, 'gi');

const ewokEncode = str => str.replace(vowelReg, 'i').replace(consonantReg, 'b');

const ewok = jsonStr => {
  const data = JSON.parse(jsonStr);
  for (const key of Object.keys(data)) {
    const value = data[key];
    data[key] = (Array.isArray(value)) ? 
      value.map(ewokEncode) : ewokEncode(value);
  }
  return JSON.stringify(data);
};

module.exports = { ewok };