import { readFileSync } from 'fs';

//Count if the number in each word
//O(m) where m is num of letters in the passwords
var valid =0;
const input = readFileSync('./input.txt', 'utf-8').split('\n').map(line => {
    var [a, b, password] = line.split(" ");
    var key = b[0];
    var [min, max] = a.split("-").map(num => parseInt(num));
    //1 based indexes, so min-1
    var first = password[min-1] === key;
    var second = password[max-1] === key;
    //budget XOR
    if (first !== second)
        valid++;

});
console.log(valid);
