import { readFileSync } from 'fs';

const input = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim());

const slopes = [[1, 1], [1, 3], [1, 5], [1, 7], [2, 1]];//index 0 is y, index 1 is x
var treesMultiplied =1;

for (var i = 0; i < slopes.length; i++){
    var y = 0;
    var x = 0;
    var trees = 0;
    while (y < input.length-1){
        x+=slopes[i][1];
        y+=slopes[i][0];
        if (input[y][x % input[0].length] && input[y][x % input[0].length] === '#'){
            trees++;
        }
    }
    treesMultiplied *= trees;
}

console.log(treesMultiplied);
