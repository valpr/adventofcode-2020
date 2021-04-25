import { readFileSync } from 'fs';
let data = readFileSync('./input.txt', 'utf-8').split('\r\n');

let firstPlayer = [];
let secondPlayer = [];
let mid = false;
for (let line of data) {
    if (line === 'Player 2:') {
        mid = true;
    } else if (line ==='Player 1:' || line === '') {
        continue;
    } else {
        let number = parseInt(line, 10);
        if (mid) {
            secondPlayer.push(number);
        } else {
            firstPlayer.push(number);
        }
    }
}


const playOneRound = (deck1: number[], deck2: number[]) => {
    if (deck1.length > 0 && deck2.length > 0){
        let elem1;
        let elem2;
        if (deck1[0] > deck2[0]) {
            elem1 = deck1.shift();
            elem2 = deck2.shift();
            if (elem1 && elem2){
                deck1.push(elem1);
                deck1.push(elem2);
            }    
        } else {
            elem1 = deck1.shift();
            elem2 = deck2.shift();
            if (elem2 && elem1){
                deck2.push(elem2);
                deck2.push(elem1);
            }  
        }
    }
}

while (firstPlayer.length !== 0 && secondPlayer.length!== 0) {
    playOneRound(firstPlayer, secondPlayer);
}

let deckToUse = firstPlayer.length === 0 ? secondPlayer : firstPlayer;
let multiplier = 1;
let score = 0;
while (deckToUse.length > 0) {
    let current = deckToUse.pop();
    if (current)
        score += current * multiplier;
    multiplier++;
}
console.log(score);