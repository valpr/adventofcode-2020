import { readFileSync } from 'fs';

const input = readFileSync('./input.txt', 'utf-8').split('\n').map(num => parseInt(num));

const target = 2020;
for (var i =0; i < input.length; i ++){
    const dict: { [neededNum: number]: number} = {};
    var currNum = input[i];
    var newTarget = target-currNum;
    var newInput = input.slice(i); //you only need to evaluate the latter half of the array because previous loops checked all for other elems
    const answer = newInput.find(num => {
        if (dict[num]){
            return true;
        }
        else{
            dict[newTarget-num] = num;
        }
    })
    if (answer){
        console.log(answer, currNum, 2020-answer-currNum);
        console.log(answer * (2020 - answer - currNum) * currNum);
        break;
    }
}