import { readFileSync } from 'fs';

const input = readFileSync('./input.txt', 'utf-8').split('\n').map(num => parseInt(num));

const dict: { [neededNum: number]: number} = {};
const target = 2020;
const answer = input.find(num => {
    if (dict[num]){
        return true;
    }
    else{
        dict[target-num] = num;
    }
})

if (answer)
    console.log(answer * (2020 - answer));