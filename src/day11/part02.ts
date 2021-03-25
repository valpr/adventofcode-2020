import {readFileSync} from 'fs';
let input: string[][] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim().split(''));
let occupied: number = 0;

const checkSeat = (r :number, c: number): number => {
    return input[r][c] === '#' ? 1 : 0;
}

const checkDirection = (r: number, c:number, y: number, x: number):number => {
    //check if in range
    if ((r >= 0 && r < input.length) && (c >= 0 && c < input[0].length)){
        if (input[r][c] ==='#'){
            return 1;
        }
        else if(input[r][c] === 'L') {
            return 0;
        }
        else {
            return checkDirection(r+y, c+x, y, x);
        }
    }
    //if not in range, then there is nothing in this direction
    return 0;
}

const checkOccupiedSeats = (r: number, c: number): number => {
    let occupied = 0;
    if (r === 0 && c === 0) {
        occupied = checkDirection(r+1, c, 1, 0) + checkDirection(r+1, c+1, 1, 1) + checkDirection(r, c+1, 0, 1);
    } else if (r === 0 && c === input[0].length-1){
        occupied = checkDirection(r+1, c, 1, 0) + checkDirection(r+1, c-1, 1, -1) + checkDirection(r, c-1, 0, -1);
    } else if (r === input.length-1 && c === 0){
        occupied = checkDirection(r-1, c, -1, 0) + checkDirection(r-1, c+1, -1, +1) + checkDirection(r, c+1, 0, 1);
    } else if (r === input.length-1 && c === input[0].length-1){
        occupied = checkDirection(r-1, c, -1, 0) + checkDirection(r-1, c-1, -1, -1) + checkDirection(r, c-1, 0, -1);
    } else if (r === 0) {
        occupied = checkDirection(r+1, c, 1, 0) + checkDirection(r+1, c+1, 1, 1) + 
        checkDirection(r, c+1, 0, 1) + checkDirection(r, c-1, 0, -1) + checkDirection(r +1, c-1, 1, -1);
    } else if (c === 0) {
        occupied = checkDirection(r+1, c, 1, 0) + checkDirection(r+1, c+1, 1, 1) + 
        checkDirection(r, c+1, 0, 1) + checkDirection(r -1, c, -1, 0) + checkDirection(r -1, c+1, -1, +1);
    } else if (r === input.length-1) {
        occupied = checkDirection(r-1, c, -1, 0) + checkDirection(r-1, c+1, -1, +1) + 
        checkDirection(r-1, c-1, -1, -1) + checkDirection(r, c-1, 0, -1) + checkDirection(r, c+1, 0, 1);
    } else if (c === input[0].length-1) {
        occupied = checkDirection(r, c-1, 0, -1) + checkDirection(r+1, c-1, 1, -1) + 
        checkDirection(r-1, c-1, -1, -1) + checkDirection(r+1, c, 1, 0) + checkDirection(r-1, c, -1, 0);        
    } else {
        occupied = checkDirection(r+1, c,1,0) + checkDirection(r+1, c-1, 1, -1) + 
        checkDirection(r+1, c+1, 1,1) + checkDirection(r, c+1, 0, 1) + checkDirection(r, c-1, 0, -1) +
        checkDirection(r-1, c-1, -1, -1) + checkDirection(r-1, c, -1, 0) + checkDirection(r-1, c+1, -1, 1);
    }
    return occupied;
}

const changeState = (newArray: string[][]):boolean => {
    let changed = false;
    for (let k =0; k < input.length; k++) {
        for (let l =0; l < input[k].length; l++){
            if (input[k][l] === 'L'){
                newArray[k][l] = checkOccupiedSeats(k,l) === 0 ? '#': 'L';
                changed = checkOccupiedSeats(k,l) === 0 || changed;
            } else if (input[k][l] === '#'){
                newArray[k][l] = checkOccupiedSeats(k,l) >= 5 ? 'L' : '#'
                changed = checkOccupiedSeats(k,l) >= 5 || changed;
            }
            else { //state doesn't change
                newArray[k][l] = input[k][l];
            }
        }
    }
    return changed;
}

let changing = true;
while (changing) {
    let newInput: string[][] = Array(input.length).fill(null).map(() => Array(input[0].length));
    changing = changeState(newInput);
    input = newInput;
}

for (let i =0; i < input.length; i++) {
    for (let j =0; j < input[i].length; j++){
        occupied += input[i][j] === '#' ? 1 : 0;
    }
}
console.log(input);
console.log(occupied);
//pretty messy, would clean up the checkOccupiedSeats logic if I knew part 2 ahead of time