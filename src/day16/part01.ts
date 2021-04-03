import {readFileSync} from 'fs';
let [rules,yourTicket, nearbyTickets]: string[] = readFileSync('./input.txt', 'utf-8').split('\r\n\r\n').map(line => line.trim());
console.log(rules);
console.log(yourTicket);
console.log(nearbyTickets);

const parseRule = (rule: string): number[][][] => {
    return rule.split('\r\n').map(line => line.split(':')[1].split(' or ').map(line => {
        return line.split('-').map(range => Number(range));
    }));
}

console.log(parseRule(rules));