import {readFileSync} from 'fs';
let tiles: string[] = readFileSync('./input.txt', 'utf-8').split('\r\n\r\n');

type Edge = { //Add # Number?
    fromID: number;
    representation: string;
    reverseRepresentation: string;
    count: number;
}

type Square = {
    ID: number;
    connectedTo: number[];
    edges: Edge[];
    tile: string[];
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
        ID: parseInt(ID.split(' ')[1]), connectedTo: [], edges, tile: lines
    }
}

const parseEdges = (tileArray: string[], ID: number): Edge[] => {
    let sides = [getSide(tileArray, 0).split('').reverse().join(''),
     tileArray[0], //top
     getSide(tileArray, tileArray[0].length-1), 
     tileArray[tileArray.length-1]];
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
let sqDict: {[id: number]: Square} = {};
for (let rep of tiles) {
    let newSq = parseSquare(rep);
    sqArray.push(newSq);
    sqDict[newSq.ID] = newSq;
}

const flipOnY = (square: string[]) => { //
    let newSquare = [];

    for (let line of square) {
        newSquare.push(line.split('').reverse().join(''));
    }
    return newSquare;
}

const flipOnX = (square: string[]) => {
    for (let i =0; i < square.length/2; i++ ) {
        const temp = square[i];
        square[i] = square[square.length-1-i];
        square[square.length-1-i] = temp;
    }
    return square;
}

const rotate90 = (square: string[], counter: boolean): string[] => {
    let newSquare: string[] = Array(square.length).fill([]);
    for (let line of square) {
        for (let [idx, char] of line.split('').entries()) {
            if (counter){
                newSquare[newSquare.length-1-idx]=`${newSquare[newSquare.length-1-idx]}${char}`
            } else {
                newSquare[idx]=`${char}${newSquare[idx]}`
            }
        }
    }
    return newSquare;
}

const rotate180 = (square: string[]) => {
    square = flipOnX(square);
    square = flipOnY(square);
    return square;
}

let picture : string[][] = [];
let pictureTiles :number[][] = [];


const connectBottom = (currentSquare: Square, edgeAbove: string) => {
    // console.log(currentSquare);
    let [left, top, right, bottom] = currentSquare.edges;
    let newTransform = currentSquare.tile;
    let currentTile = currentSquare.tile;
    pictureTiles.push([currentSquare.ID]);
    // console.log('before', newTransform.join('\r\n'));
    let actionTaken = '';
    if (top.representation === edgeAbove){
        //just add into picture
        actionTaken = `${currentSquare.ID} top`
        picture.push(newTransform);
    }
    else if (top.reverseRepresentation === edgeAbove) {
        actionTaken = `${currentSquare.ID} topr`
        newTransform = flipOnY(currentTile)
        picture.push(newTransform);
    }
    else if (bottom.representation === edgeAbove){
        //just add into picture
        actionTaken = `${currentSquare.ID} bottom`

        newTransform = flipOnX(currentTile);
        picture.push(newTransform);
    }
    else if (bottom.reverseRepresentation === edgeAbove) {
        actionTaken = `${currentSquare.ID} bottomR`

        newTransform = rotate180(currentTile)
        picture.push(newTransform);
    }
    else if (left.representation === edgeAbove){
        actionTaken = `${currentSquare.ID} left`

        newTransform = rotate90(currentTile, false)
        picture.push(newTransform);
    }
    else if (left.reverseRepresentation === edgeAbove){
        actionTaken = `${currentSquare.ID} leftr`

        newTransform = flipOnY(rotate90(currentTile, false));
        picture.push(newTransform);
    }
    else if (right.representation === edgeAbove){
        actionTaken = `${currentSquare.ID} right`

        newTransform = rotate90(currentTile, true)
        picture.push(newTransform);
    }
    else if (right.reverseRepresentation === edgeAbove){
        actionTaken = `${currentSquare.ID} rightr`
        //this trans is screwed RN, counter clockwise doesn't work
        newTransform = flipOnY(rotate90(currentTile, true));
        picture.push(newTransform);
    }
    else {
        actionTaken = `corner`;
        picture.push(newTransform);
    }
    //take the bottom of newTransform and look in edge dictionary
    //console.log('Action:', actionTaken);
    let bottomEdge = newTransform[newTransform.length-1];
    let connectingEdge = (allEdges[bottomEdge] || allEdges[bottomEdge.split('').reverse().join('')])?.filter(x => x!==currentSquare.ID);
    if (connectingEdge?.length !== 0)
        connectBottom(sqDict[connectingEdge[0]], bottomEdge);
    else {
        // console.log(bottomEdge, allEdges[bottomEdge])
        // console.log(allEdges[bottomEdge.split('').reverse().join('')])
    }
}


const connectRight = (transformedSquare: string[], ID: number, edgeLeft: string) => {
    // console.log(currentSquare);
    let [left, top, right, bottom] = sqDict[ID].edges;
    let newTransform = transformedSquare;
    let currentTile = transformedSquare;
    pictureTiles.push([ID]);
    // console.log('before', newTransform.join('\r\n'));
    let actionTaken = '';
    if (edgeLeft === ''){
        picture.push(newTransform);
    }
    else if (left.representation === edgeLeft){
        actionTaken = `${ID} left`
        newTransform = flipOnX(currentTile)
        picture.push(newTransform);

    }
    else if (left.reverseRepresentation === edgeLeft) {
        //add into picture
        actionTaken = `${ID} leftr`
        picture.push(newTransform);
    }
    else if (right.representation === edgeLeft){
        //just add into picture
        actionTaken = `${ID} right`
        newTransform = flipOnY(currentTile)

        picture.push(newTransform);
    }
    else if (right.reverseRepresentation === edgeLeft) {
        actionTaken = `${ID} rightR`
        newTransform = rotate180(currentTile);

        picture.push(newTransform);
    }
    else if (bottom.representation === edgeLeft){
        actionTaken = `${ID} bottom`
        newTransform = (rotate90(currentTile, false));

        picture.push(newTransform);
    }
    else if (bottom.reverseRepresentation === edgeLeft){
        actionTaken = `${ID} bottomR`
        newTransform = flipOnX(rotate90(currentTile, false));

        picture.push(newTransform);
    }
    else if (top.representation === edgeLeft){
        actionTaken = `${ID} top`

        newTransform = flipOnX(rotate90(currentTile, true)); //check
        picture.push(newTransform);
    }
    else if (top.reverseRepresentation === edgeLeft){
        actionTaken = `${ID} topr`
        newTransform = rotate90(currentTile, true)

        picture.push(newTransform);
    }
    else {
        actionTaken = `edge`;
        picture.push(newTransform);
    }
    //take the bottom of newTransform and look in edge dictionary
    // console.log('Action:', actionTaken);
    let rightEdge = getSide(newTransform, newTransform.length-1);
    //let bottomEdge = newTransform[newTransform.length-1]; //change to right edge logic
    let connectingEdge = (allEdges[rightEdge] || allEdges[rightEdge.split('').reverse().join('')])?.filter(x => x!==ID);
    if (connectingEdge?.length !== 0)
    //if (connectingEdge?.length !== 0)
        connectRight(sqDict[connectingEdge[0]].tile, sqDict[connectingEdge[0]].ID, rightEdge);
    else {
        // console.log(rightEdge, allEdges[rightEdge])
        // console.log(allEdges[rightEdge.split('').reverse().join('')])
    }
}
//initial testing code
//connectBottom(sqDict[2081], '');

// connectBottom testing code
// let counter = 0;
// console.log('top','----')
// for (let tile of picture){
//     console.log(tile.join('\r\n'));
//     console.log(pictureTiles[counter],'---');
//     counter++;
// }
// console.log(pictureTiles);

//connectRight testing code
// let accumulator = picture[0];
// for (let tile of picture.slice(1)){
//     for (let [idx, line] of tile.entries()){
//         accumulator[idx] = accumulator[idx].concat(`|${line}`);
//     }
// }
// console.log(accumulator.join('\r\n'));

//now assemble whole picture into one array
//left EDGE IDS got from connectBottom(2081);
connectBottom(sqDict[2081], '');
//connectBottom(sqDict[2081], '');

//const fullPicture = picture.slice(-2);
const fullPicture = picture;
// fullPicture.forEach(a => {
//     console.log(a.slice(1, -1).join('\r\n'));
//     console.log('--')
//     strippedPicture.push(Array.from(a.slice(1, -1))); //strip first and last line of each
// })

//instead of passing in square, pass transformed stringArray, and currentSquare ID


const leftEdgeIDs = [2081, 3697, 1399, 2221, 3889, 2347, 1873, 1523, 1583, 2659, 2441, 2129];
//const leftEdgeIDs = [ 2441, 2129];

const assemble = (leftEdgeIDs: number[]) => {
    let lastLine = '';
    for (let [idx, ID] of leftEdgeIDs.entries()){
        picture = [];
        connectRight(fullPicture[idx], ID, ''); //doesn't work rn because they are not oriented correctly
        //will need to pipe in connectBottom results instead of attempting to cheat
        let errorCount = 0;
        let accumulator = picture[0];
        for (let tile of picture.slice(1)){
            for (let [idx, line] of tile.entries()){
                if (accumulator[idx].charAt(accumulator[idx].length-1) !== line[0]){
                    errorCount++;
                }
                accumulator[idx] = accumulator[idx].concat(`|${line}`);
            }
        }
        fullPicture[idx] = accumulator;
        if (lastLine !== '' && accumulator[0] !== lastLine){
            errorCount++;
        }
        lastLine = accumulator[accumulator.length-1];
        // console.log(accumulator.join('\r\n'));
        // console.log(`line of ${ID}-error: ${errorCount}--------------------`)
    }
}

assemble(leftEdgeIDs);
console.log(fullPicture);
const stripTileBorders = (fullPicture: string[][]): string[][] => {
    const strippedPicture: string[][] = [];
    fullPicture.forEach(a => {
        strippedPicture.push(Array.from(a.slice(1, -1)
            .map(line => line.split('|')
            .map(tileLine => tileLine.slice(1,-1))
            .join('')))); //strip first and last line of each tile
    })
    return strippedPicture;
}


const findingSeaMonsters: string[][] =  stripTileBorders(fullPicture);
//can test on testInput 2
console.log(findingSeaMonsters);
//TODO: search for sea monster here:
//should only be found in one orientation, so may need to rotate/ flip picture to find it
//how many orientations are there?
//console.log(fullPicture);