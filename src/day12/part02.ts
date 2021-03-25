import {readFileSync} from 'fs';

let input: string[] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim());
let N = 1;
let E = 10;
let shipN = 0;
let shipE = 0;

//rotate right is switch N/E, and multiply N by -1
//rotate left is switch N/E, and multiply E by -1
const rotate = (direction: string, degrees:number) => {
    for (let i =0; i < degrees/90; i++) {
        let temp = N;
        N = E;
        E = temp;
        switch(direction) {
            case 'L':
                E *= -1;
                break;
            case 'R':
                N *= -1;
                break;
        }
    }
}

const parseMovement = (magnitude: number) => {
    shipN += N*magnitude;
    shipE += E*magnitude;
}

const moveWayPoint = (direction: string, magnitude: number) => {
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
            parseMovement(m);
            break;
        case 'R':
        case 'L':
            rotate(value[0],m);
            break;
        default:
            moveWayPoint(value[0], m);
            break;
    }
    console.log(value);
    console.log(`WP North: ${N}`, `East: ${E}`);
    console.log(`Ship North: ${shipN}`, `East: ${shipE}`);
}

console.log(Math.abs(shipN) + Math.abs(shipE));
