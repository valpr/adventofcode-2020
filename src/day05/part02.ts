import { readFileSync } from 'fs';
let maxID = 0;
let minID = 1000;
let row:number, column:number;
let sum = 0;
const input = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim()).map(line => {
    row = 0;
    column = 0;
    //128 rows
    //each letter narrows it down
    //so how can I represent what half i'm in?
    //low and high?
    let low = 0;
    let high = 127;
    for (let i =0; i <7; i++){
        if (line[i] === 'F'){
            high = Math.floor((low+high)/2)
        }
        else if (line[i] === 'B'){
            low = Math.floor((low+high)/2)+1
        }
    }
    row = low;
    low = 0;
    high = 7;
    for (let i =7; i <10; i++){
        if (line[i] === 'R'){
            low = Math.floor((low+high)/2)+1
        }
        else if (line[i] === 'L'){
            high = Math.floor((low+high)/2)
        }
    }
    column = low;
    let seatID = column+row*8;
    minID = Math.min(minID, seatID)
    maxID = Math.max(maxID, seatID)
    sum += seatID;
});
//take the average of min and max ID, then multiply by the number of numbers (difference+1)
console.log((minID+maxID)/2*(maxID-minID+1));
console.log(sum);
console.log((minID+maxID)/2*(maxID-minID+1)-sum)