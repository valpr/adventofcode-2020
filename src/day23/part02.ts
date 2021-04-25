import { readFileSync } from 'fs';
console.time();
let cups = readFileSync('./input.txt', 'utf-8').split('').map(x => parseInt(x));
type Node = {
    value: number;
    next: Node | null;
}
const HIGHESTVALUE = 1000000;


const parseCups = (cups: number[]):Node => {
    let startingNode: Node = {
        value: cups[0],
        next: null
    }
    let currentNode = startingNode;
    for (let cup of cups.slice(1)) {
        let newNode: Node = {
            value: cup,
            next: null
        };
        currentNode.next = newNode;
        //move current to next
        currentNode = newNode;
    }
    let currentValue = 10;
    while (currentValue <= HIGHESTVALUE) {
        let newNode: Node = {
            value: currentValue,
            next: null
        };
        
        currentNode.next = newNode;
        //move current to next
        currentNode = newNode;
        currentValue++;
    }
    currentNode.next = startingNode //complete circle
    return startingNode;
}

const removeThree = (currentCup: Node): Node => {
    let removedCups = currentCup.next;
    let lastCup = currentCup.next?.next?.next;
    if (lastCup){
        currentCup.next = lastCup?.next;
        lastCup.next = null;
    }
    return removedCups ? removedCups : {value: 0, next: null}; //error status
}

const searchDestination = (currentCup: Node, removedCups: Node): Node => {
    let searchValue = currentCup.value-1;
    let removedValues = [];
    let cur: Node | null = removedCups;
    while (cur) {
        removedValues.push(cur.value);
        cur = cur.next;
    }
    if (searchValue <= 0) {
        searchValue = HIGHESTVALUE;
    }
    while (removedValues.indexOf(searchValue) !== -1){
        searchValue -=1;
        if (searchValue <= 0){
            searchValue = HIGHESTVALUE;
        }
    }
    let destinationCup = currentCup;
    while (destinationCup && destinationCup.next && destinationCup.value !== searchValue) {
        destinationCup = destinationCup.next;
    }
    return destinationCup;
}

const replaceThree = (destinationCup: Node, removedCups: Node) => {
    let endNode = destinationCup.next;
    destinationCup.next = removedCups;
    let curCup = removedCups;
    while (curCup.next) {
        curCup = curCup.next;
    }
    curCup.next = endNode;
}

const playRound = (currentCup: Node):Node => {
    //console.log('start')
    let removedCups = removeThree(currentCup);
    //console.log('removed')
    let destinationCup: Node = searchDestination(currentCup, removedCups); 
    //console.log('destination found', destinationCup)
    replaceThree(destinationCup, removedCups);
    //console.log('replaced three');
    return currentCup.next || {value: 0, next: null};
}

const findOne = (currentCup:Node):Node => {
    while(currentCup && currentCup.next && currentCup.value !== 1) {
        currentCup = currentCup.next;
    }
    return currentCup;
}



let newCups = parseCups(cups);

for (let i = 0; i < 10000000; i++){
    newCups = playRound(newCups);
    if (i % 100000 === 0){
        console.log(i);
        console.timeLog();
    }
}



let oneCup:Node | null = findOne(newCups);
let displayArray = [oneCup.next?.value, oneCup.next?.next?.value];
// oneCup = oneCup.next;
// while (oneCup && oneCup.next && oneCup.value !== 1) {
//     displayArray.push(oneCup.value);
//     oneCup = oneCup.next;
// }
console.log(displayArray.join(','));
console.log(displayArray[0] && displayArray[1] ? displayArray[0] * displayArray[1] : 'error');
console.timeEnd();