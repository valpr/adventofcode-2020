import {readFileSync} from 'fs';

type List = { 
    fromID: number;
    representation: string;
    reverseRepresentation: string;
    count: number;
}

console.time();
let allIngredients: string[] = [];
let allAllergens: {[allergen: string]: {[ingredient: string]: boolean}} = {};
//should I do string array or a new object
let data = readFileSync('./input.txt', 'utf-8').split('\r\n');
for (let line of data) {
    let [ilist, alist] = line.slice(0,-1).split(' (contains ');
    let currentIngredients = ilist.split(' ');
    let currentAllergens = alist.split(', ');
    allIngredients = allIngredients.concat(currentIngredients);
    for (let allergen of currentAllergens) {
        if (allAllergens[allergen]) {
            //find intersection
            allAllergens[allergen] = currentIngredients.filter(ingredient => allAllergens[allergen][ingredient] === true)
            .reduce((accumulator, currentIngredient) => {
                return {...accumulator, [currentIngredient]: true}}, {});
        } else {
            allAllergens[allergen] = currentIngredients
            .reduce((accumulator, currentIngredient) => {
            return {...accumulator, [currentIngredient]: true}}, {});
        }
    }
}
    let allergenList = Object.keys(allAllergens);
    const clear:{[ingredient: string]: boolean} = {};
    let nonAllergenCounter= 0;
    for (const ingredient of allIngredients) {
        let found = false;
        if (clear[ingredient]){
            nonAllergenCounter++;
            continue;
        }
        for (const allergen of allergenList) {
            if (allAllergens[allergen][ingredient]) {
                found = true;
                break;
            }
        }
        if (found === false) {
            clear[ingredient] = true;
            nonAllergenCounter++;
        }
    }
    //find non-allergens, so these should not be in any list
    //if they are in the list, remove them
console.log(nonAllergenCounter);

console.timeEnd();