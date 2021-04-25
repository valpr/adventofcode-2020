import { readFileSync } from 'fs';

/*
Part 2: turns into Conway's game of life hexagon version?..
Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
*/
console.time();
let data = readFileSync('./input.txt', 'utf-8').split('\r\n');
enum Direction {
    sw = 'sw',
    se = 'se',
    w = 'w',
    e = 'e',
    nw = 'nw',
    ne = 'ne'
}
let flippedTiles: {[coordinates: string]: boolean} = {}
for (let line of data) {
    let reader = '';
    let x = 0, y = 0;
    for (let char of line) {
        reader = reader+char;
        if (reader in Direction){
            switch(reader){
                case Direction.e:
                    x-=1;
                    break;
                case Direction.w:
                    x+=1;
                    break;
                case Direction.ne:
                    y+=1;
                    x-=0.5;
                    break;
                case Direction.nw:
                    y+=1;
                    x+=0.5;
                    break;
                case Direction.se:
                    y-=1;
                    x-=0.5;
                    break;
                case Direction.sw:
                    y-=1;
                    x+=0.5;
                    break;
            }
            reader = '';
        }
    }
    //if already flipped, set it back to false value
    //if not flipped or doesn't exist, flip
    flippedTiles[`${x}|${y}`] = flippedTiles[`${x}|${y}`] ? false : true;
}


/*
Can do a similar algorithm to the previous AOC problem:
Create a separate touch dictionary
Each iteration, loop through all black tiles and 'touch' all adjacent tiles
if tile is black and touch value is !== 1, flip
if tile is white and touch value is === 2, flip
*/
const oneIteration = () => {
    let blackTiles = Object.keys(flippedTiles).filter(x => flippedTiles[x]);
    let touchedTiles: {[coordinates: string]: number} = {}; 
    for (let coordinates of blackTiles) {
        let [x, y] = coordinates.split('|').map(coord => Number(coord));
        //east, west
        touchedTiles[`${x-1}|${y}`] = touchedTiles[`${x-1}|${y}`] ? touchedTiles[`${x-1}|${y}`]+1 : 1;
        touchedTiles[`${x+1}|${y}`] = touchedTiles[`${x+1}|${y}`] ? touchedTiles[`${x+1}|${y}`]+1 : 1;
        //NE, NW
        touchedTiles[`${x-0.5}|${y+1}`] = touchedTiles[`${x-0.5}|${y+1}`] ? touchedTiles[`${x-0.5}|${y+1}`]+1 : 1;
        touchedTiles[`${x+0.5}|${y+1}`] = touchedTiles[`${x+0.5}|${y+1}`] ? touchedTiles[`${x+0.5}|${y+1}`]+1 : 1;
        //SE, SW
        touchedTiles[`${x-0.5}|${y-1}`] = touchedTiles[`${x-0.5}|${y-1}`] ? touchedTiles[`${x-0.5}|${y-1}`]+1 : 1;
        touchedTiles[`${x+0.5}|${y-1}`] = touchedTiles[`${x+0.5}|${y-1}`] ? touchedTiles[`${x+0.5}|${y-1}`]+1 : 1;
    }
    let newBlackTiles = Object.keys(touchedTiles).filter(coord => {
        return (flippedTiles[coord] && (touchedTiles[coord] === 2 || touchedTiles[coord] === 1)) || (flippedTiles[coord] !== true && touchedTiles[coord] === 2)
    });
    flippedTiles = {};
    for (const newTile of newBlackTiles) {
        flippedTiles[newTile] = true;
    }
}
let count = Object.keys(flippedTiles).filter(x => flippedTiles[x]).length;
console.log('day 0', count);
//loop this 100 times later
for (let i =1; i <= 100; i++ ){
    oneIteration();
    count = Object.keys(flippedTiles).filter(x => flippedTiles[x]).length;
    console.log(`Day ${i}`,count);
}
console.timeEnd();