const rotate90 = (square: string[], counter: boolean): string[] => {
    let newSquare: string[] = Array(square.length).fill([]);
    for (let line of square) {
        for (let [idx, char] of line.split('').entries()) {


            if (counter){
                newSquare[newSquare.length-1-idx]=`${newSquare[newSquare.length-1-idx]}${char}`
            } else {
                newSquare[idx]=`${char}${newSquare[idx]}`
            }
            console.log(newSquare);
            console.log(idx, char);
        }
    }
    return newSquare;
}

const test = 
`..#..####.
#.....#..#
...##....#
......##.#
#...#.##..
#.....###.
#.#...#...
....#.....
##.#.#...#
##.#.####.`.split('\n');

//console.log(rotate90(test, false));//clockwise
console.log(rotate90(test, true));//counter-clockwise