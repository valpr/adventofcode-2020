import { readFileSync } from 'fs';

//Count if the number in each word
//O(m) where m is num of letters in the passwords
var valid =0;
const input = readFileSync('./input.txt', 'utf-8').split('\n').map(line => {
    var [a, b, password] = line.split(" ");
    var key = b[0];
    var [min, max] = a.split("-").map(num => parseInt(num));
    var num = password.split("").filter(letter => letter === key).length;
    if (num >= min && num <= max)
        valid++;
});
console.log(valid);
