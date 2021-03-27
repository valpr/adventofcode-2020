import {readFileSync} from 'fs';

let input: string[] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim());
let memory: {[key: number]: number} = {};
let currentMask: string[] = [];
const start = "000000000000000000000000000000000000";
const originalLength = 35;
let addresses: number[] = [];
const base = 2;
const expand = (keyString: string, number: number) => {
    //this is a memory address decoder--populates addresses array with values
    if (!keyString){ //when string is empty, stop and add to addresses
        addresses.push(number)
    }
    else {
        let power = Math.pow(base, originalLength-(keyString.length-1));
        switch(currentMask[keyString.length-1]){
            //evaluate last char of string
            case '1':
                expand(keyString.slice(0,keyString.length-1), number+power);
                break;
            case '0':
                power = keyString[keyString.length-1] === '1' ? power : 0;
                expand(keyString.slice(0,keyString.length-1), number+power);
                break;
            case 'X':
                expand(keyString.slice(0,keyString.length-1), number+power);
                expand(keyString.slice(0,keyString.length-1), number);
                
        }
    }
}

for (const line of input) {
    let components = line.split(" = ");
    switch(components[0]){
        case "mask":
            currentMask= components[1].split("");
            break;
        default:
            //apply bitmask to number if bitmask is 1 or 0, change that digit to 1 or 0, otherwise leave unchanged
            let key = Number(components[0].slice(components[0].indexOf('[')+1,components[0].length-1)).toString(2);
            let keyString = `${start}${key}`
            keyString = keyString.slice(keyString.length-36,keyString.length);
            addresses = [];
            expand(keyString, 0);
            let numberEntry = Number(components[1]);
            for (const address of addresses) {
                memory[address] = numberEntry;
            }
            break;
    }
}
let total = 0;
for (let number in memory) {
    total+= memory[number];
}
console.log(memory);
console.log(total);

