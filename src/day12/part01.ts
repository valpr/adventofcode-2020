import {readFileSync} from 'fs';

let input: string[] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim());
let currDirection = 0;
let compass = ['E', 'S', 'W', 'N'];
let N = 0;
let E = 0;

const rotate = (direction: number, rotation:number):number => {
    let index = (direction+(rotation/90))%4;
    return index < 0 ? compass.length+index : index; //negative number handling
}

const parseMovement = (direction: string, magnitude: number) => {
    switch(direction) {
        case 'E':
            E += magnitude;
            break;
        case 'N':
            N += magnitude;
            break;
        case 'S':
            N -= magnitude;
            break;
        case 'W':
            E -= magnitude;
            break;
    }
}

for (let value of input) {
    let m = Number(value.slice(1));
    switch(value[0]) {
        case 'F':
            parseMovement(compass[currDirection], m);
            break;
        case 'R':
            currDirection = rotate(currDirection,m)
            break;
        case 'L':
            currDirection = rotate(currDirection,-m);
            break;
        default:
            parseMovement(value[0], m);
            break;
    }
    console.log(compass[currDirection])
    console.log(N, E);

}

console.log(Math.abs(N) + Math.abs(E));
