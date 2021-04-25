import { readFileSync } from 'fs';

let [cardPublicKey, doorPublicKey] = readFileSync('./input.txt', 'utf-8').split('\r\n').map(x => parseInt(x));
/*
Loop Size is unknown
Assuming subjectNumber for each key is always 7?...
*/

const searchingTransform = (subjectNumber: number, publicKey: number) => {
    let value =1;
    let loopSize = 0;
    while (value !== publicKey) {
        value *= subjectNumber;
        value = value % 20201227
        loopSize++;
    }
    return loopSize;
}

const transform = (subjectNumber: number, testLoopSize: number) => {
    let value = 1;
    for (let i = 0; i <testLoopSize; i++) {
        value *= subjectNumber;
        value = value % 20201227
    }
    return value;
}

let subjectNumber = 7;
let cardLoopSize = searchingTransform(subjectNumber, cardPublicKey);
let doorLoopSize = searchingTransform(subjectNumber, doorPublicKey);

console.log(cardLoopSize, doorLoopSize);

let encryptionKey = transform(doorPublicKey, cardLoopSize);
let shouldBeSameKey = transform(cardPublicKey, doorLoopSize);
console.log(encryptionKey, shouldBeSameKey);