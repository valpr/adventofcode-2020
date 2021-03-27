import {readFileSync} from 'fs';
let z = 0;
let input: string[] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim());
let busIDs = input[1].split(",").map(id => [Number(id), z++]).filter(entry => !Number.isNaN(entry[0]));

const part2 = (input: number[][]):number => {
    let t =0;
    let step = 1;
    if (input.length ===1){
        return input[0][0];
    }
    for (const x of input) {
        //first loop: 0 mod anything is 0, so step is initially set to the first busID, t to 0
        //second loop: check multiples of first busID (step) and see when time+n % secondBusID === 0
        //Then multiply the step by the BusID.  The new step size is a multiple that satisfies both conditions: divisible by 13, and divisible by 41
        //nth loop: check multiples of n-1*n-2..*1 busIDs and see when (time+n-1) % n === 0
        //step becomes n(n-1)(n-2)..1
        //edge case--if input is length 1, then should just return busID[0], not time 0
        let id = x[0];
        let n = x[1];
        while((t+n) % id !== 0){
            t+= step;
        }
        step *= id;
        console.log(t, step);
    }
    return t;
}
console.log(part2(busIDs));