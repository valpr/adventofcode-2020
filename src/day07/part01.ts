import { readFileSync } from 'fs';
let bagContains: {[bag: string]: {[color: string]: boolean}} = {};
let key = 'shiny gold';
let counter = 0;
readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim()).map(line => {
    //parsing each rule plan
    //each type is identified by [adjective] [color]
    //split string by "bags contain"
    //split second part of string by "," then " "
    let [currBag, containsBag] = line.split("bags contain").map(elem => elem.trim());
    //numbers aren't important right now
    if (containsBag !== 'no other bags.'){
        let indivBags = containsBag.split(',');
        bagContains[currBag] = {};
        for (let i =0; i < indivBags.length; i ++) {
            let currColor = indivBags[i].trimStart().split(" ").slice(1,3).join(" ").replace(".","");
            bagContains[currBag][currColor] = true; 
        }
    }
});
//now we have the dictionary
//look for the key: 'shiny gold'
//should use recursion with caching to find if it works
let bagDirectory: {[color: string]: boolean} = {};
const checkBag = (bag: string): boolean => {
    if (bagDirectory[bag] === true || bag === key) {
        return true;
    }
    if (!bagContains[bag]){
        return false;
    } else {
        Object.keys(bagContains[bag]).forEach(bagInside => {
            bagDirectory[bag] = bagDirectory[bag] || checkBag(bagInside);
        })
        return bagDirectory[bag];
    }
}
Object.keys(bagContains).forEach(bag => {
    checkBag(bag);
    if (bagDirectory[bag]){
        counter++;
    }
});
console.log(bagDirectory);
console.log(counter);