import { readFileSync } from 'fs';

const input: number[] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim()).map(line => {
    return Number(line);
}).sort((a,b) => a-b);

let joltage = 0;
let oneJoltage = 0;
let threeJoltage = 1; //due to adapter at end
for (let i = 0; i < input.length; i++) {
    switch(input[i]-joltage){
        case 1:
            oneJoltage++;
            break;
        case 3:
            threeJoltage++;
            break;
    }
    joltage = input[i];

}
console.log(oneJoltage*threeJoltage)
