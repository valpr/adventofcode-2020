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
    //this time, need to find allergens with only 1 potential ingredient in the list
    //Remove the potential ingredient from all other lists
    //do this n-1 times, all should have 1 ingredient (1 starts at 1 ingredient)
for (let i =0; i < allergenList.length+5; i++){
    let currentAllergen = allergenList.find(allergen => Object.keys(allAllergens[allergen]).length === 1);
    //remove from allergenList
    if (currentAllergen){
        allergenList = allergenList.filter(allergen => allergen !== currentAllergen);
        //remove currentAllergen from allAllergens dictionary
        let ingredientToRemove = Object.keys(allAllergens[currentAllergen])[0];
        allergenList.forEach(allergen => {
            if (allAllergens[allergen][ingredientToRemove]){
                delete allAllergens[allergen][ingredientToRemove];
            }
        })
    
    }
}
let finalList = Object.keys(allAllergens).sort().map(allergen => Object.keys(allAllergens[allergen])[0]).join(',');
console.log(finalList);
console.timeEnd();