import {readFileSync} from 'fs';
let tiles: string[] = readFileSync('./input.txt', 'utf-8').split('\r\n\r\n').map(tile => tile.split(':\r\n')[1]);
//basically need to match tiles to other tiles based on #'s on the borders
console.log(tiles);
console.log(tiles[0]);