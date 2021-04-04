import {readFileSync} from 'fs';
let [rules,yourTicket, nearbyTickets]: string[] = readFileSync('./input.txt', 'utf-8').split('\r\n\r\n').map(line => line.trim());

const parseRule = (rule: string): number[][][] => {
    return rule.split('\r\n').map(line => line.split(':')[1].split(' or ').map(line => {
        return line.split('-').map(range => Number(range));
    }));
}

const checkRange = (rule: number[], ticketNumber: number):boolean => {
    return rule[0] <= ticketNumber && rule[1] >= ticketNumber;
} 

const checkRules = (ruleList: number[][][], ticketValue: number):boolean => {
    let foundValidRange = false;
    for (let rules of ruleList) {
        for (let range of rules) {
            if (checkRange(range,ticketValue)){
                foundValidRange = true;
                break;
            }
        }
        if (foundValidRange)
            break;
    }
    return foundValidRange;
}


//nearby tickets are separated by newlines
//each value is separated by commas
//if a ticket has invalid values
let ruleList = parseRule(rules);
let validTickets:number[][] = [];

validTickets = nearbyTickets.split('\r\n').slice(1).filter(ticket => {
    let onlyValidValues = true;
    ticket.split(',').forEach(value => {
        onlyValidValues = onlyValidValues && checkRules(ruleList, parseInt(value.trim())) ? true : false;
    })
    return onlyValidValues;
}).map(x => x.split(',').map(y => parseInt(y)));
//logically, all valid tickets have at least one field that lines up with one order numerically
//Therefore, should be able to discern which field belongs to which position by checking if one field is valid
//for the position
let ticketPositions = [...Array(validTickets[0].length).keys()]; //will contain the right field for each position
//so, iterate through every ticket then see what which field each first value fits
//Then, the second value... nth value
let validPositions = [...Array(ruleList.length).keys()];

let possibilities:number[][] = [];
for (let position of ticketPositions){
    let validRules = Array.from(validPositions);
    for (let ticket of validTickets){
        let value = ticket[position];
        let updatedRules = Array.from(validRules);
        //check ticket value against rules
        //if value is not valid for a field, remove that field
        for (let rule of validRules){
            //each rule has 2 ranges
            if (!(checkRange(ruleList[rule][0], value) || checkRange(ruleList[rule][1], value))){
                updatedRules = updatedRules.filter(num => num !== rule)
            }
        }
        validRules = updatedRules;
    }
    possibilities.push(Array.from(validRules));
}

//at least one field will only have 1 possibility, one will have two and so on
let finalAns = new Array(possibilities.length);
for (let i = 0; i < possibilities.length; i++) {
    let currentIndex = -1;
    //in each loop, we look for array with length 1
    let value = possibilities.filter((array, index) => {
        currentIndex = array.length === 1 ? index : currentIndex;
        return array.length === 1
    })[0][0];
    //remove the found value from all arrays
    possibilities = possibilities.map(array => array.filter(val => val !== value))
    finalAns[currentIndex] = value;
    //store position
}
let yourNumbers = yourTicket.split('\r\n').slice(1)[0].split(',').map(x => parseInt(x));
let multiplied =1;
for (let i = 0; i < 6; i++){
    let rightField = finalAns.indexOf(i);
    multiplied *= yourNumbers[rightField];
}

console.log(multiplied);