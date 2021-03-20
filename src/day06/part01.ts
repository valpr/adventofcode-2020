import { readFileSync } from 'fs';
let yesTracker: {[k: string]: number} = {};
let num = 0;
let totalnum = 0;

const input = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim()).map(line => {
    if (line.length !==0){
        //process answers and add to yesTracker
        for (let i =0; i < line.length; i++){
            if (!yesTracker[line[i]]){
                yesTracker[line[i]] = 1;
                num++;
            }
        }
    } else {
        //take down number of properties
        totalnum += num;
        num = 0;
        yesTracker = {};
    }
});
console.log(totalnum);