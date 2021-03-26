import {readFileSync} from 'fs';

let input: string[] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim());
let departureTime = Number(input[0]);
let busIDs = input[1].split(",").map(id => Number(id));

const testRule = (baseNumber: BigInt, testNumber: BigInt):boolean => {
    //baseNumber is the multiple of 7+i
    //testNumber is the busId
    return baseNumber % testNumber === 0;
}


let counter = 0;
let found = false;

//Chinese Remainder theorem needed


console.log(counter*busIDs[0]);