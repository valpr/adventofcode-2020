import {readFileSync} from 'fs';
let tiles: string[] = readFileSync('./input.txt', 'utf-8').split('\r\n\r\n').map(tile => tile.split(':\r\n')[1]);
//basically need to match tiles to other tiles based on #'s on the borders
console.log(tiles);
console.log(tiles[0]);
//in order for 2 edges to possibly match
//same number of #'s, in the same coordinates
//however, tiles were flipped or rotated, so it could be anything
//key advice: Tiles at the edge of the image also have this border, but the outermost edges won't line up with any other tiles.
//theoretically: if you find 4 tiles that have 2 edges that do not line up with any other tile
//you have found the corner tile
//part 2 probably wants a full image though? 
//10 by 10 squares

//compareEdge: compare array to another array, then flip one array and compare again\
//compareSquare: compare all 4 arrays against 4 other arrays, only compare if #'s are equal
//probably want to represent squares