import {readFileSync} from 'fs';
let input: string[] = readFileSync('./input.txt', 'utf-8').split('\r\n').map(line => line.trim());
//initial thoughts:
//use a stack system
// read 1 character at a time and keep state
// when parentheses ( appears, put current value on stack and evaluate inside
// calc state would be current number, and operation
interface calcState {
    currentValue: number;
    operation: Operation;
}
enum Operation {
    Addition = "+",
    Multiplication = "*",
    OpenParen = "(",
    ClosingParen = ")",
    None = ""
}
const genEmptyCalcState = ():calcState => ({currentValue: 0, operation: Operation.None});
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
            case Operation.Addition:
            case Operation.Multiplication:
                currentState.operation = letter;
                break;
            case Operation.OpenParen:
                stackState.push(currentState);
                currentState = genEmptyCalcState();
                break;
            case Operation.ClosingParen:
                let oldState = stackState.pop();
                if (oldState) currentState = evalNums(oldState, currentState.currentValue);
            case " ":
                break;
            default:
                console.log(letter);
                currentState = evalNums(currentState, parseInt(letter));
        }
    }
    totalSum += currentState.currentValue;
    currentState = genEmptyCalcState();
}
console.log(totalSum);
