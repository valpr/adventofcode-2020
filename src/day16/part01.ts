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

const checkRules = (ruleList: number[][][], ticketValue: number):number => {
    let foundValidRange = false;
    for (let rules of ruleList) {
        for (let range of rules) {
            if (checkRange(range,ticketValue)){
                foundValidRange = true;
                break;
            } //return ticketValue if doesn't fit
        }
        if (foundValidRange)
            break;
    }
    return foundValidRange ? 0 : ticketValue;
}


//nearby tickets are separated by newlines
//each value is separated by commas
//need to get the ticket scanning error rate: sum of invalid values
let ticketScanningErrorRate = 0;
let ruleList = parseRule(rules);
nearbyTickets.split('\r\n').forEach(ticket => {
    ticket.split(',').forEach(value => {
        if (!Number.isNaN(parseInt(value)))
            ticketScanningErrorRate += checkRules(ruleList, parseInt(value.trim()));
    })
})

console.log(ticketScanningErrorRate);