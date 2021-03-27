import {readFileSync} from 'fs';

let input: string[] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim());
let memory: {[key: number]: number} = {};
let currentMask: string[] = [];
const start = "000000000000000000000000000000000000";
for (const line of input) {
    let components = line.split(" = ");
    switch(components[0]){
        case "mask":
            currentMask= components[1].split("");
            break;
        default:
            //apply bitmask to number if bitmask is 1 or 0, change that digit to 1 or 0, otherwise leave unchanged
            let key = Number(components[0].slice(components[0].indexOf('[')+1,components[0].length-1));
            let num = `${start}${Number(components[1]).toString(2)}`
            num = num.slice(num.length-36,num.length);
            memory[key] = parseInt(num.split("").map((digit, index) => {
                if (currentMask[index] !== 'X'){
                    return currentMask[index];
                }
                return digit;
            }).join(""), 2);
            break;
    }
}
let total = 0;
for (let number in memory) {
    total+= memory[number];
}
console.log(memory);
console.log(total);

