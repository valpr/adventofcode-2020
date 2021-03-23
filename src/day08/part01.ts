import { readFileSync } from 'fs';
const input: string[] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim()).map(line => {
    return line;
})
let acc = 0;
let start = 0;
const tracker = new Array(input.length).fill(false);
while (!tracker[start]) {
    tracker[start] = true;
    let instructionSet = input[start].split(" ");
    switch(instructionSet[0]){
        case 'jmp':
            start += Number(instructionSet[1]);
            break;
        case 'acc':
            acc += Number(instructionSet[1]);
        case 'nop':
            start++;
            break;
    }
}
console.log(acc);