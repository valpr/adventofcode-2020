import { readFileSync } from 'fs';
const input: number[] = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim()).map(line => {
    return Number(line);
})
//find the first number in input that is not the sum of two of the 25 numbers before it.
//things to address:
//basically a sliding window for moving selection
//'target'/number changes for each number, so have to evaluate whole array again each time? Time O((n-p)n), space is O(p)- p = preamble size, n = number size
//q says must use unique number--even if there are two of the same number
const preamble = 25;
//initialize window
let start = 0;
let end = preamble-1;
//invalid num if found
let found = -1;
//key represents the number, value represents number of times it appears in last 25 numbers
let numberLookup: {[key: number]: number} = {};
//build numberLookup
for (let i =0; i < preamble; i++) {
    numberLookup[input[i]] = numberLookup[input[i]] ? numberLookup[input[i]] +1 : 1;
}
while (end+1 < input.length && found < 0) {
    //evaluate if target is valid
    let valid = false;
    for (let j = start; j < end+1; j++) {
        //look in numberLookup with the current input[j] --we are looking for input[end+1]
        if (numberLookup[input[j]] > 0) {
            let search = input[end+1] - input[j];
            if (numberLookup[search] > 0 && search !== input[j]){ //dupe number check
                valid = true;
                break;
            }
        }
    }
    if (!valid){
        found = end+1;
        break;
    }

    //slide the window
    numberLookup[input[start]] -=1;
    //increment 
    start++;
    end++;
    if (end < input.length)
        numberLookup[input[end]] = numberLookup[input[end]] ? numberLookup[input[end]] +1 : 1;
}
console.log(input[found]);