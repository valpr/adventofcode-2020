import {readFileSync} from 'fs';
let tiles: string[] = readFileSync('./input.txt', 'utf-8').split('\r\n\r\n');
//basically need to match tiles to other tiles based on #'s on the borders
//in order for 2 edges to possibly match
//same number of #'s, in the same coordinates
//however, tiles were flipped or rotated, so it could be anything
//key advice: Tiles at the edge of the image also have this border, but the outermost edges won't line up with any other tiles.
//theoretically: if you find 4 tiles that have 2 edges that do not line up with any other tile
//you have found the corner tile
//part 2 probably wants a full image though? 
//10 by 10 squares

//compareEdge: compare array to another array, then flip one array and compare again\
//compareSquare: compare all 4 arrays against 4 other arrays, only compare if #'s are equal
//probably want to represent squares
type Edge = { //Add # Number?
    fromID: number;
    representation: string;
    reverseRepresentation: string;
    count: number;
}

type Square = {
    ID: number;
    connectedTo: number[];
    matchedEdges: Edge[];
    unmatchedEdges: Edge[];
}

type EdgeCollection = {
    [key: string]: number[]; //leads to squareID
}

const allEdges: EdgeCollection = {};

const parseSquare = (tile: string):Square => {
    //need to return a square object with 4 edges
    //add edges to edge collection
    const [ID, square] = tile.split(':\r\n');
    const lines = square.split('\r\n');
    const edges = parseEdges(lines, parseInt(ID.split(' ')[1]));
    return {
        ID: parseInt(ID.split(' ')[1]), connectedTo: [], matchedEdges: [], unmatchedEdges: edges
    }
}

const parseEdges = (tileArray: string[], ID: number): Edge[] => {
    let sides = [getSide(tileArray, 0), getSide(tileArray, tileArray[0].length-1), tileArray[0], tileArray[tileArray.length-1]];
    let edges :Edge[] = sides.map((side) =>  {
        let reverseSide = side.split('').reverse().join('');
        let count = side.split('').filter(x => x === '#').length
        if (allEdges[side]){
            allEdges[side] = allEdges[side].concat([ID])
        } else if (allEdges[reverseSide]) {
            allEdges[reverseSide] = allEdges[reverseSide].concat([ID]);
        } else {
            allEdges[side] = [ID];
        }
        
        return { representation: side, reverseRepresentation: reverseSide, fromID: ID, count }
    })
    return edges
}

const getSide = (tileArray: string[], index: number): string => {
    if (tileArray.length === 0)
        return ''
    return tileArray[0][index] + getSide(tileArray.slice(1), index);
}


let sqArray: Square[] = [];
for (let rep of tiles) {
    sqArray.push(parseSquare(rep));
}

let nums = [];
let finalNum = 1;
let numTimesReferenced : {[key: number]: number}= {}
for (let key of Object.keys(allEdges)) {
    if (allEdges[key].length === 1){
        let ID = allEdges[key][0];
        numTimesReferenced[ID] = numTimesReferenced[ID] ? numTimesReferenced[ID]+1 : 1;
        if (numTimesReferenced[ID] === 2) {
            nums.push(ID);
            finalNum *= ID;
        }
    }
}

console.log(nums);
console.log(finalNum);
//TODO: loop through dictionary values
//if length is 1, add to dictionary
//if upon adding to dictionary, value is 2, add to final array