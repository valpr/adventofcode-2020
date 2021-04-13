import {readFileSync} from 'fs';
let [ruleList, messageInput]: string[][] = readFileSync('./input.txt', 'utf-8').split('\r\n\r\n').map(chunk => chunk.split('\r\n').map(line => line.trim()));


//initial thoughts:
//could do all possible values of rule 0, but might be too much memory
//want to evaluate rules as they come
//should cache the values of rules to avoid recalc
//recursive function to expand rule 0
/*
rule structure:
rule : {
    validRuleSets : number[];
    valid: {
        [key: string]: boolean;
    }
}

new thoughts
you can translate rules into arrays of 'base' rules
type: base rule means have a value
all other rules only have validRuleSets
Key is to translate all validRuleSets into value

the problem is each rule in the array could have an array of multiple values
so, must be able to expand ruleset by n each time depending on how many values there could be




*/
interface intermediateRuleType {
    validRuleSets: number[][];
    values: string[];
    type: 'intermediate';
}

interface baseRuleType {
    value: string;
    type: 'base';
}

type ruleSet = {
    [key: number]: intermediateRuleType | baseRuleType;
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
        currentRule.values = currentRule.values.concat(ruleValues);
    }
    return currentRule.values;
}

let ruleSet = parseRules(ruleList);
//console.log(ruleSet);
// console.log(expand(3));
// console.log(expand(2));
// console.log(ruleSet);
let finalSet = expand(0);
//console.log(ruleSet);

let completeMatches = 0;
for (let message of messageInput) {
    if (~finalSet.indexOf(message)){
        completeMatches++;
    }
}
console.log(completeMatches);