import {readFileSync} from 'fs';
let input: string[] = readFileSync('./input.txt', 'utf-8').split('\r\n').map(line => line.trim());
//initial thoughts:
//if I push calcState to stack when I see multiplication
//when I pop off I should check if multiplication is true and pop off until it isn't true

interface calcState {
    currentValue: number;
    operation: Operation;
    multiply: boolean;
}
enum Operation {
    Addition = "+",
    Multiplication = "*",
    OpenParen = "(",
    ClosingParen = ")",
    None = ""
}
const genEmptyCalcState = ():calcState => ({currentValue: 0, operation: Operation.None, multiply: false});
let currentState = genEmptyCalcState();
let stackState = [];
let totalSum = 0;

const evalNums = (numState: calcState,num: number): calcState => {
    switch(numState.operation){
        case Operation.Addition:
            numState.currentValue += num;
            break;
        case Operation.Multiplication:
            numState.currentValue *= num;
            break; 
        case Operation.None:
            numState.currentValue = num;
            break;
    }
    numState.operation = Operation.None;
    return numState;
}

for (const line of input){
    for (const letter of line){
        switch (letter){
            case Operation.Multiplication:
                currentState.operation = letter;
                currentState.multiply = true;
                stackState.push(currentState);
                currentState = genEmptyCalcState();
                break;
            case Operation.Addition:
                currentState.operation = letter;
                break;
            case Operation.OpenParen:
                stackState.push(currentState);
                currentState = genEmptyCalcState();
                break;
            case Operation.ClosingParen:
                let oldState;
                do {
                    oldState = stackState.pop();
                    if (oldState) currentState = evalNums(oldState, currentState.currentValue);
                } while (oldState && oldState.multiply && stackState.length !== 0)
                currentState.multiply = false;
            case " ":
                break;
            default:
                currentState = evalNums(currentState, parseInt(letter));
        }
    }
    let oldState;
    do {
        oldState = stackState.pop();
        if (oldState) currentState = evalNums(oldState, currentState.currentValue);
    } while (oldState && oldState.multiply && stackState.length !== 0)
    totalSum += currentState.currentValue;
    currentState = genEmptyCalcState();
}
console.log(totalSum);
