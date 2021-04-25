import { readFileSync } from 'fs';
console.time();
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
type Game = {
    history: {
        [hash: string]: boolean
    };
    deck1: number[];
    deck2: number[];
}

type Result = {
    deck: number[];
    player1Wins: boolean;
}

const getHashString = (game: Game) => {
    return `${game.deck1.join(',')}|${game.deck2.join(',')}`;
}

const playGame = ({deck1, deck2, history}: Game): Result => {
    while (deck1.length > 0 && deck2.length > 0){
        let hash = getHashString({deck1, deck2, history});
        if (history[hash]) {
            return {
                deck: deck1,
                player1Wins: true
            }; //player 1 wins
        } else {
            history[hash] = true;
        }
        let elem1 = deck1.shift();
        let elem2 = deck2.shift();
        let winnerPlayerOne: boolean | null = null;
        if (elem1 && elem2){
            if (elem1 <= deck1.length && elem2 <= deck2.length) {
                winnerPlayerOne = playGame({deck1: deck1.slice(0,elem1), deck2: deck2.slice(0, elem2), history: {}}).player1Wins;
            }
            if (winnerPlayerOne === true || (winnerPlayerOne === null && elem1 > elem2)) {
                deck1.push(elem1);
                deck1.push(elem2);
            } else {
                deck2.push(elem2);
                deck2.push(elem1);
            }
        }
    }
    return {deck: (deck1.length === 0 ? deck2 : deck1), player1Wins: deck1.length !== 0};

}

let winner = playGame({deck1: firstPlayer, deck2: secondPlayer, history: {}})

//calculate score
let deckToUse = winner.deck;
let multiplier = 1;
let score = 0;
while (deckToUse.length > 0) {
    let current = deckToUse.pop();
    if (current)
        score += current * multiplier;
    multiplier++;
}
console.log(score);
console.timeEnd();