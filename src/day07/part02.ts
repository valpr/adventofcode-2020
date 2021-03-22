import { readFileSync } from 'fs';
let bagContains: {[bag: string]: {[color: string]: number}} = {};
let key = 'shiny gold';
readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim()).map(line => {
    //parsing each rule plan
    //each type is identified by [adjective] [color]
    //split string by "bags contain"
    //split second part of string by "," then " "
    let [currBag, containsBag] = line.split("bags contain").map(elem => elem.trim());
    if (containsBag !== 'no other bags.'){
        let indivBags = containsBag.split(',');
        bagContains[currBag] = {};
        for (let i =0; i < indivBags.length; i ++) {
            //yucky input cleaning
            let currBagNum :number = parseInt(indivBags[i].trimStart().split(" ")[0]);
            let currColor = indivBags[i].trimStart().split(" ").slice(1,3).join(" ").replace(".","");
            //get num
            bagContains[currBag][currColor] = currBagNum; 
        }
    }
});
//now we have the dictionary
//look for the key: 'shiny gold'
//should use recursion with caching to find if it works
let bagDirectory: {[color: string]: number} = {}; 
//bagDirectory should be how many bags the current bag contains
const expandBag = (bag: string): number => {
    if (!bagContains[bag]) {
        return 0;
    } else if (bagDirectory[bag]){
        return bagDirectory[bag]
    } else {
        if (!bagDirectory[bag])
            bagDirectory[bag] = 0;
        Object.keys(bagContains[bag]).forEach(innerBag => {
            bagDirectory[innerBag] = expandBag(innerBag);
            bagDirectory[bag] += bagContains[bag][innerBag] * bagDirectory[innerBag] +  bagContains[bag][innerBag] ; //multiply bags inside
        })
        return bagDirectory[bag];
    }
}
console.log(expandBag(key));
console.log(bagDirectory);
