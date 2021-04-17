import {readFileSync} from 'fs';
let tiles: string[] = readFileSync('./input.txt', 'utf-8').split('\r\n\r\n');
//problem is now need to assemble picture
//then search the image for sea monsters
//start from corner, find 2 adjacent squares
//problem is I don't know what needs to be flipped/rotated
//for first corner only:
//--based on edges that match, if top edge matches then flip first tile on y axis
//--if left edge matches flip first tile on x axis
//all other edges should be correctly oriented to match after, may need to flip tiles that are adding
//since edge collection exists, should be easy to find which tile to get next.
//after that need to take out border of each tile

type Edge = { //Add # Number?
    fromID: number;
    representation: string;
    reverseRepresentation: string;
    count: number;
}

type Square = {
    ID: number;
    connectedTo: number[];
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
        ID: parseInt(ID.split(' ')[1]), connectedTo: [], unmatchedEdges: edges
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

//TODO: assemble picture here
//need methods to flip array on x and flip array on y
//also need methods to rotate array
//[ 1049, 2081, 2129, 3229 ] is corner edge array

const flipOnX = (square: string[]) => {
    for (let line of square) {
        line = line.split('').reverse().join('');
    }
    return square;
}

const flipOnY = (square: string[]) => {
    for (let i =0; i < square.length/2; i++ ) {
        const temp = square[i];
        square[i] = square[square.length-1-i];
        square[square.length-1-i] = temp;
    }
    return square;
}

const rotate90 = (square: string[], counter: boolean) => {
    let newSquare = Array(square.length).fill([]);
    for (let line of square) {
        for (let [idx, char] of line.split('').entries()) {
            counter ? newSquare[idx].push(char) : newSquare[idx].unshift(char);       
        }
    }
}

const rotate180 = (square: string[]) => {
    square = flipOnX(square);
    square = flipOnY(square);
    return square;
}


//TODO: search for sea monster here:
//should only be found in one orientation, so may need to rotate/ flip picture to find it