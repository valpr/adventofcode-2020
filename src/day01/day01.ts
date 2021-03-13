import { readFileSync } from 'fs';

const input = readFileSync('./input.txt', 'utf-8').split('\n').map(num => parseInt(num));

var dict = {};
const target = 2020;


console.log(input);