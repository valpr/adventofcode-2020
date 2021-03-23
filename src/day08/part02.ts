import { readFileSync } from 'fs';
const input: string[] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim()).map(line => {
    return line;
})
let change = 0;
let start = 0;
let acc = 0;
//2 cases: change one nop to jmp or one jmp to nop
//is it possible to test without running the whole instruction set?
//no, but you could evaluate recursively?
//for each nop/jump function, switch and evaluate
while (change < input.length){
    //reinitialize variables
    acc = 0;
    start = 0;
    const tracker = new Array(input.length).fill(false);
    let changeSet = input[change].split(" ");
    changeSet[0] = changeSet[0] === 'jmp' ? 'nop' 
        : changeSet[0] === 'nop' ? 'jmp' 
        : changeSet[0]; 


    while (start < input.length && !tracker[start]) {
        tracker[start] = true;
        let instructionSet = change===start ? changeSet : input[start].split(" ");
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
    if (start === input.length){
        console.log(acc);
        break;
    }
    change++;
}