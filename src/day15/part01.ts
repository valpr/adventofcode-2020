import {readFileSync} from 'fs';
let input: number[] = readFileSync('./input.txt', 'utf-8').split(',').map(line => Number(line.trim()));
let turnLimit = 2020;

interface gameState { //represents game state 
    memory: {[key: number]: number}, //memory of on what turn a number was previously said
    lastNum: number, //represents number from the previous turn
    turn: number, //represents current turn to iterate on
    lastSpoken: number //what turn was the number last spoken?
}

const createGameState = ():gameState => {
    let memory: {[key: number]: number} ={};
    let turn = 0;
    for (let i =0; i < input.length; i++) {
        turn++;
        memory[input[i]] = turn;
    }
    return {
        memory: memory,
        lastNum: input[input.length-1],
        turn: turn,
        lastSpoken: -1
    }
}

const oneRound = ({memory, turn, lastNum, lastSpoken}:gameState):gameState => {
    turn++;
    if (lastSpoken === -1){
        lastNum = 0
        lastSpoken = memory[lastNum] ? memory[lastNum] : -1;
        memory[lastNum] = turn;
    }
    else {
        lastNum = (turn-1)-lastSpoken;
        lastSpoken = memory[lastNum] ? memory[lastNum] : -1;
        memory[lastNum] = turn;
    }
    return {
        turn, lastNum, lastSpoken, memory
    }
}
let x = createGameState();
while(x.turn !== turnLimit) {
    x = oneRound(x);
}


console.log(x.lastNum);