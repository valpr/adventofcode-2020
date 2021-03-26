import {readFileSync} from 'fs';

let input: string[] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim());
let departureTime = Number(input[0]);
let busIDs = input[1].split(",").filter(id => id !== 'x').map(id => Number(id));

let closestTime = 999;
let closestBusID = -1;
for (let i =0; i < busIDs.length; i++) {
    let leftoverTime = busIDs[i]*Math.ceil(departureTime/busIDs[i])-departureTime;
    if (leftoverTime < closestTime) {
        closestTime = leftoverTime;
        closestBusID = busIDs[i];
    }
}

console.log(closestBusID);
console.log(closestTime);
console.log(closestBusID*closestTime);