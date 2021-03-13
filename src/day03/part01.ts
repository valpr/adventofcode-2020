import { readFileSync } from 'fs';

const input = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim());
const width = input[0].length;
var y = 0;
var x = 0;
var trees = 0;
while (y < input.length-1){
    x+=3;
    y++;
    console.log(x,y);
    console.log(input[y]);
    // console.log(input[y][x]);
    if (input[y][x % width] === '#'){
        trees++;
    }
}

console.log(trees);
