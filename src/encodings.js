'use strict';

const vowels = 'aeiouy';
const vowelReg = new RegExp(`[${vowels}]`,'gi');
const consonantReg = new RegExp(`(?![${vowels}])[a-z]`, 'gi');

const ewok = str => str.replace(vowelReg, 'i').replace(consonantReg, 'b');

module.exports = { ewok };