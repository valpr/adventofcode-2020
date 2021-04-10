import {readFileSync} from 'fs';
let input: string[] = readFileSync('./input.txt', 'utf-8').split('\r\n').map(line => line.trim());

//take in input, then iterate over each active node. then each active node's neighbours?

//dictionary system, where key is #, #, #
//each cycle we can iterate through all active keys, put their updated state in a new dictionary, and also evaluate neighbours of those active keys
//best way to evaluate neighbours:
/*
things we want to avoid:
re-evaluating a neighbour more than once

keep states between cycles separate--state1, state2

each new cycle, evaluate each active node
add current node to intermediateDictionary if not already in there, set to 1
if in there, increment
----
once all active nodes in state1 are evaluated, iterate through all nodes in intermediateDictionary
filter nodes that have value 3, or 2 and were active, and add those to active dictionary
---
new cycle, so update state1 with state2
intermediateDictionary becomes empty again

intermediateDictionary: {
    "x, y, z": touch: number;
}

StateDictionary: {
    "x, y, z": active: boolean
}

*/
let intermediateDictionary : {[coordinates: string]: number} = {}; //tracks how many times a node has been touched
let stateDictionary: {[coordinates: string]: boolean} = {}; //tracks what nodes are active
/*
Parse initial puzzle input, and put into dictionaries
*/
const parseInput = (initialInput: string[]) => {
    const z = 0;
    for (let x = 0; x < initialInput.length; x++){
        for (let y = 0; y < initialInput[0].length; y++){
            if (initialInput[x][y] === '#')
                stateDictionary[`${x},${y},${z}`] = true;
        }
    }
}

const touchAdjacentNodes = (x: number, y: number, z: number) => {
    //just 3 for loops, loop through all possible numbers?
    for (let a = x-1; a <= x+1; a++) {
        for (let b = y -1; b <= y+1; b++){
            for (let c = z-1; c<= z+1; c++){
                if (a !== x || b !== y || c !== z){ //exclude self
                    // if (c === 2) {
                    //     console.log(`${a},${b},${c}`);
                    //     console.log(`${x},${y},${z}`)
                    // }
                    intermediateDictionary[`${a},${b},${c}`] = 
                        intermediateDictionary[`${a},${b},${c}`] ? 
                        intermediateDictionary[`${a},${b},${c}`] + 1 :
                        1;
                    
                }
            }
        }
    }
}

//loop setup
parseInput(input);
let currentCycle = 0;
const targetCycle = 6;

while (currentCycle !== targetCycle) {
    let previousActiveNodes = Object.keys(stateDictionary);
    for (const node of previousActiveNodes) {
        let [x, y, z] = node.split(',').map(coord => parseInt(coord));
        //evaluate each node
        touchAdjacentNodes(x,y,z);
    }
    let newActiveNodes = Object.keys(intermediateDictionary).filter(node => stateDictionary[node] && intermediateDictionary[node] === 2 || intermediateDictionary[node] === 3);
    //clear out current dictionaries
    stateDictionary = {};
    intermediateDictionary = {};
    //add new active nodes
    for (const newActiveNode of newActiveNodes){
        stateDictionary[newActiveNode] = true;
    }
    currentCycle++;
}
console.log(stateDictionary);
console.log(Object.keys(stateDictionary).length);
