import { readFileSync } from 'fs';

const input: number[] = [0].concat(readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim()).map(line => {
    return Number(line);
}).sort((a,b) => a-b));
//thoughts: you can use memoization in order to reduce the amount of calls you make
//a route only counts when it is from 0 to highest index
//add 0 element to find routes from 0 to 1, 2, 3
let solutionLookup : {[index: number]: number} = {};


const findRoutes = (index:number): number => {
    let currNumber = input[index];
    if (index === input.length-1) {
        return 1;
    }
    else if (solutionLookup[index]) {
        return solutionLookup[index]; //use pre-calculated
    }
    else {
        //here you can include up to the next 3 indexes if their joltages are in range as they represent three branching paths
        solutionLookup[index] = 1;
        if (index < input.length-3 && input[index+3] - currNumber <= 3) // index check and joltage difference check
            solutionLookup[index] = findRoutes(index+3) +findRoutes(index+2)+ findRoutes(index+1) ;
        else if (index < input.length-2 && input[index+2] -currNumber <= 3)
            solutionLookup[index] = findRoutes(index+2)+ findRoutes(index+1);
        else
            solutionLookup[index] = findRoutes(index+1);
        return solutionLookup[index];
    }
}

findRoutes(0);
console.log(solutionLookup);
console.log(solutionLookup[0]);