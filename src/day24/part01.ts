import { readFileSync } from 'fs';

/*
Tiling system
judging from reference tile, we can keep track of X and Y
E and W will change X by -1 and 1
SE, SW will change Y by -1 and NE NW will change Y by 1
SE, NE will change X by -0.5, and SW NW will change X by 0.5

Can we just count the number of times a step is taken in different directions and sum it up? I think so
I guess the difficulty of part 1 is parsing instructions?
*/
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
let flipCount = Object.keys(flippedTiles).filter(x => flippedTiles[x]).length;
console.log(flippedTiles);
console.log('flip count: ',flipCount);