import { readFileSync } from 'fs';
console.time();
let cups = readFileSync('./input.txt', 'utf-8').split('').map(x => parseInt(x));
type Node = {
    value: number;
    next: Node | null;
}
const HIGHESTVALUE = 1000000;
const NUMLOOPS = 10000000;
//instead of looking through the list each time, better to create an array
//allows you to lookup the node that you want to find
//maintain linked list structure, but avoid n-length search every loop
let lookupArray:Node[] = (Array(HIGHESTVALUE)).map(x => ({value: -1, next: null}));


const parseCups = (cups: number[]):Node => {
    let startingNode: Node = {
        value: cups[0],
        next: null
    }
    lookupArray[startingNode.value-1] = startingNode;
    let currentNode = startingNode;
    for (let cup of cups.slice(1)) {
        let newNode: Node = {
            value: cup,
            next: null
        };
        currentNode.next = newNode;
        //move current to next
        lookupArray[newNode.value -1] = newNode;
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
        lookupArray[newNode.value -1] = newNode;
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
    return lookupArray[searchValue-1];
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
    let removedCups = removeThree(currentCup);
    let destinationCup: Node = searchDestination(currentCup, removedCups); 
    replaceThree(destinationCup, removedCups);
    return currentCup.next || {value: 0, next: null};
}

let newCups = parseCups(cups);

for (let i = 0; i < NUMLOOPS; i++){
    newCups = playRound(newCups);
}

let oneCup:Node = lookupArray[0];
let displayArray = [oneCup.next?.value, oneCup.next?.next?.value];

console.log(displayArray.join(','));
console.log(displayArray[0] && displayArray[1] ? displayArray[0] * displayArray[1] : 'error');
console.timeEnd();