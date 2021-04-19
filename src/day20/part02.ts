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

//TODO: assemble picture here
//need methods to flip array on x and flip array on y
//also need methods to rotate array
//[ 1049, 2081, 2129, 3229 ] is corner edge array

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

/*TODO: logic for assembling square
start with corner X using square dict
find the 2 squares that connect with it in EdgeCollection (using edges)
find which edges are connected on square X
*/
let picture : string[][] = [];
let pictureTiles :number[][] = [];

//Logic for attaching a tile to a tile on the left
//if the left edge connects nothing, if the left edge reverse connects, flip Y
//if the right edge connects flip tile by Y, if the right edge reverse connects, rotate 180
//if the top edge connects, rotate 90 counter clock, if reverse connects, rotate90 counter and flip y
//if the bottom edge connects rotate 90 clockwise, if referse connects, rotate 90 clock and flip y

//FIRST STEP: find out which edges on firstCorner are matching
//connected if edge length is 2
// console.log(allEdges[left.representation], allEdges[left.reverseRepresentation]);
// console.log(allEdges[right.representation], allEdges[right.reverseRepresentation]);
// console.log(allEdges[top.representation], allEdges[top.reverseRepresentation]);
// console.log(allEdges[bottom.representation], allEdges[bottom.reverseRepresentation]);
//2081 has right connection and bottom connection without rotating so start here
//IDEA: do left edge first, then expand right

/*
End result of this function is to insert into picture the right tile string representation
    //Logic for attaching a tile to a tile above it
    //if top edge connects, nothing, if top edge reverse connects, flip y
    //if left edge connects, rotate 90 clock, if left edge R connects, rotate 90 clock and flip on y
    //if right edge connects, rotate 90 counterclock, if right edge R connects, rotate 90 counterclock and flip on y
    //if bottom edge connects, flip on x, if bottom edge R connects, rotate 180
    //when flipping or rotating, should re-arrange square edges?
*/
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
    console.log('Action:', actionTaken);
    let bottomEdge = newTransform[newTransform.length-1];
    let connectingEdge = (allEdges[bottomEdge] || allEdges[bottomEdge.split('').reverse().join('')])?.filter(x => x!==currentSquare.ID);
    if (connectingEdge?.length !== 0)
        connectBottom(sqDict[connectingEdge[0]], bottomEdge);
    else {
        // console.log(bottomEdge, allEdges[bottomEdge])
        // console.log(allEdges[bottomEdge.split('').reverse().join('')])
    }
}

//TODO: on testing, there appears to be orientation issues
//basically--some are upside down in relation to others
//should also devise a way to join horizontally for sanity's sake
//key is how i read left vs right side, facing from left POV is left to right whereas it's reverse in right pov
//so switch outcome in reverse representation
const connectRight = (currentSquare: Square, edgeLeft: string) => {
    // console.log(currentSquare);
    let [left, top, right, bottom] = currentSquare.edges;
    let newTransform = currentSquare.tile;
    let currentTile = currentSquare.tile;
    pictureTiles.push([currentSquare.ID]);
    // console.log('before', newTransform.join('\r\n'));
    let actionTaken = '';
    if (left.representation === edgeLeft){
        //just add into picture
        actionTaken = `${currentSquare.ID} left`
        picture.push(newTransform);
    }
    else if (left.reverseRepresentation === edgeLeft) {
        actionTaken = `${currentSquare.ID} leftr`
        newTransform = flipOnX(currentTile)
        picture.push(newTransform);
    }
    else if (right.representation === edgeLeft){
        //just add into picture
        actionTaken = `${currentSquare.ID} bottom`

        newTransform = flipOnY(currentTile);
        picture.push(newTransform);
    }
    else if (right.reverseRepresentation === edgeLeft) {
        actionTaken = `${currentSquare.ID} bottomR`

        newTransform = rotate180(currentTile)
        picture.push(newTransform);
    }
    else if (bottom.representation === edgeLeft){
        actionTaken = `${currentSquare.ID} bottom`

        newTransform = rotate90(currentTile, false)
        picture.push(newTransform);
    }
    else if (bottom.reverseRepresentation === edgeLeft){
        actionTaken = `${currentSquare.ID} bottomr`

        newTransform = flipOnY(rotate90(currentTile, false));
        picture.push(newTransform);
    }
    else if (top.representation === edgeLeft){
        actionTaken = `${currentSquare.ID} top`

        newTransform = rotate90(currentTile, true)
        picture.push(newTransform);
    }
    else if (top.reverseRepresentation === edgeLeft){
        actionTaken = `${currentSquare.ID} topr`
        //this trans is screwed RN, counter clockwise doesn't work
        newTransform = flipOnX(rotate90(currentTile, true));
        picture.push(newTransform);
    }
    else {
        actionTaken = `edge`;
        picture.push(newTransform);
    }
    //take the bottom of newTransform and look in edge dictionary
    console.log('Action:', actionTaken);
    let rightEdge = getSide(newTransform, newTransform.length-1);
    //let bottomEdge = newTransform[newTransform.length-1]; //change to right edge logic
    let connectingEdge = (allEdges[rightEdge] || allEdges[rightEdge.split('').reverse().join('')])?.filter(x => x!==currentSquare.ID);
    if (connectingEdge?.length !== 0 && currentSquare.ID !== 3769)
        connectRight(sqDict[connectingEdge[0]], rightEdge);
    else {
        // console.log(bottomEdge, allEdges[bottomEdge])
        // console.log(allEdges[bottomEdge.split('').reverse().join('')])
    }
}

connectRight(sqDict[2081], '');


let counter = 0;
console.log('top','----')
for (let tile of picture){
    console.log(tile.join('\r\n'));
    console.log(pictureTiles[counter],'---');
    counter++;
}
console.log(pictureTiles);


//TODO: search for sea monster here:
//should only be found in one orientation, so may need to rotate/ flip picture to find it