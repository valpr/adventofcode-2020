import {readFileSync} from 'fs';
let [ruleList, messageInput]: string[][] = readFileSync('./input2.txt', 'utf-8').split('\r\n\r\n').map(chunk => chunk.split('\r\n').map(line => line.trim()));


//initial thoughts:
/*
    now that there are loops in rules,
    may need new rule type(s) to account for it

    pattern for rule 8 is just repeating rule 42
    42 42 42 42 would be valid (1 or more)

    pattern for rule 11 is having a bunch of matches to 42 followed by the same number of matches to 31

    rule 0 is 8 and 11
    basically any input should be any number of rule 42 followed by a n-1 or lower rule 31
    All solutions of 42 (j) and 31 (i) are assumed to be 8 letters
    j and i are not equal

    Counting from the end-> how many 31's are there? (i)
    Counting from the start-> how many 42's are there? (j)
    Also, how many 8 letter sequences are there? (k)
    
    For valid input values of m and n must exist where,
    m represents a number of matches to 42 less than or equal to j
    n represents a number of matches to 31 less than or equal to i
    k = m + n where m <= j, n <= i, m > n, i > 0

    how to code this:
    (i + j) < k fail
    (i + j) === k && j > i success
    (i + j) > k && j >= Math.floor(k/2)+1 success
*/
interface intermediateRuleType {
    validRuleSets: number[][];
    values: string[];
    type: 'intermediate';
}

interface loopingRuleType {
    validRuleSets: number[][];
    values: string[];
    type: 'looping'
}

interface baseRuleType {
    value: string;
    type: 'base';
}

type ruleSet = {
    [key: number]: intermediateRuleType | baseRuleType | loopingRuleType;
}
const parseRules = (ruleList: string[]):ruleSet => {
    let baseRuleSet: ruleSet = {};
    for (let line of ruleList){
        let baseValue = "";
        let possibilities: number[][] = [];
        let [key, lineRules] = line.split(": ");
        let numKey = parseInt(key);
        if (lineRules[0] === "\""){
            baseValue = lineRules[1];
            baseRuleSet[numKey] = {value: baseValue, type: 'base' };
        }
        else if (numKey === 8 || numKey === 11){
            possibilities = lineRules.split("|").map(individual => individual.trim().split(" ").map(num => parseInt(num)));
            baseRuleSet[numKey] = {type: 'looping', values:[], validRuleSets: possibilities};
        }
        else {
            possibilities = lineRules.split("|").map(individual => individual.trim().split(" ").map(num => parseInt(num)));
            baseRuleSet[numKey] = {type: 'intermediate', values:[], validRuleSets: possibilities};
        }
    }
    return baseRuleSet
}

const expand = (currentRuleNum: number) : string[] | string => {
    //might just try to get all possible values here
    let currentRule = ruleSet[currentRuleNum];
    if (currentRule && currentRule.type === 'base') { //already computed
        return currentRule.value;
    }
    else if (currentRule && currentRule.type === 'intermediate' && currentRule.values.length > 0) { //pre-computed
        return currentRule.values;
    }
    //otherwise compute rule
    for (let pipedRuleSet of currentRule.validRuleSets ) {
        let ruleValues: string[] = [];
        for (let ruleNum of pipedRuleSet) {
            if (ruleNum === currentRuleNum){
                if (ruleValues.length === 0){
                    ruleValues.push('*');
                }
                else {
                    ruleValues = ruleValues.map(currentValues => `${currentValues}*`);
                }
            }else {
                let value = expand(ruleNum);
                if (typeof value === 'string'){
                    if (ruleValues.length === 0){
                        ruleValues.push(value);
                    }
                    else {
                        ruleValues = ruleValues.map(currentValues => `${currentValues}${value}`);
                    }
                }
                else {
                    //console.log('current', value);
                    if (ruleValues.length === 0){
                        ruleValues = ruleValues.concat(value);
                    }
                    else { //each current value must have every different i in value added to it and made to be new string
                        let newRuleValues = [];
                        for (let j of ruleValues) {
                            for (let i of value) {
                                newRuleValues.push(`${j}${i}`)
                            }
                        }
                        ruleValues = newRuleValues;
                    }
                }
                //console.log('end of loop',ruleValues);
            }
        }
        currentRule.values = currentRule.values.concat(ruleValues);
    }
    return currentRule.values;
}

let ruleSet = parseRules(ruleList);

let Set42 = expand(42);
let Set31 = expand(31);

const matchFirstEight =(set: string[], message: string, k: number): number => {
    //need to loop over message until end
    let n = 0;
    while (n < k){
        if (~set.indexOf(message.slice(0+n*8,8+n*8))){
            n++;
        }
        else {
            break;
        }
    }
    return n;
}
const matchLastEight = (set: string[], message: string, k: number): number => {
    //need to loop over message until start  0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
    /* first loop is 16 and 8, second should be 8 and 0
    */ 
    let n = 0;
    while (n < k){
        if (~set.indexOf(message.slice(message.length-8+n*-8,message.length+n*-8))){
            n++;
        }
        else {
            break;
        }
    }
    return n;}

const validate = (message: string) : boolean => {
    if (message.length % 8 !== 0 || typeof Set42 === 'string' || typeof Set31 === 'string') { //hack
        return false;
    } else {
        let k = message.length / 8;
        let j = matchFirstEight(Set42, message, k);
        let i = matchLastEight(Set31, message, k);
        if (i+j < k) {
            return false;
        } else if (i + j === k && j > i && i > 0) {
            return true;
        } else if ((i + j) > k && j >= Math.floor(k/2)+1 && i > 0) {
            return true;
        }
    }
    return false;
}

let completeMatches = 0;
for (let message of messageInput) {
    if (validate(message)){
        completeMatches++;
        console.log(message);
    }
}
console.log(completeMatches);