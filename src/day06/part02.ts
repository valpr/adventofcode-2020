import { readFileSync } from 'fs';
let yesTracker: {[k: string]: number} = {};
let num = 0;
let totalnum = 0;
let currentGroupSize = 0;

const input = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim()).map(line => {
    if (line.length !==0){
        currentGroupSize++;
        //process answers and add to yesTracker
        for (let i =0; i < line.length; i++){
            if (!yesTracker[line[i]] && currentGroupSize === 1){
                yesTracker[line[i]] = 1;
            }
            else if (yesTracker[line[i]]){
                yesTracker[line[i]]++;
                if (yesTracker[line[i]] !== currentGroupSize) {
                    delete yesTracker[line[i]];
                }
            }
        }
    } else {
        //take down number of properties
        totalnum += Object.keys(yesTracker).filter(prop => yesTracker[prop] === currentGroupSize).length;
        yesTracker = {};
        currentGroupSize = 0;
    }
});
console.log(totalnum);