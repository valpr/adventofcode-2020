import { readFileSync } from 'fs';

const input = readFileSync('./input.txt', 'utf-8').split('\n').map(line => line.trim());

var passportDetails:boolean[] = new Array(7).fill(false);
// byr (Birth Year)
// iyr (Issue Year)
// eyr (Expiration Year)
// hgt (Height)
// hcl (Hair Color)
// ecl (Eye Color)
// pid (Passport ID)
// cid (Country ID)
var valid = 0;
const eyecolors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
const validHairChars = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
for (var i =0; i < input.length; i++){
    if (input[i] === ""){
        //check passport
        if (passportDetails.indexOf(false) === -1){
            valid++;
        }
        //reset passport
        passportDetails = new Array(7).fill(false);
    }
    else {
        var details = input[i].split(" ");
        details.map(info => {
            var kvp = info.split(":");
            switch (kvp[0]){
                case "byr":
                    var num = parseInt(kvp[1])
                    if (num > 1919 && num < 2003)
                        passportDetails[0] = true;
                    break;
                case "iyr":
                    var num = parseInt(kvp[1])
                    if (num > 2009 && num < 2021)
                        passportDetails[1] = true;
                    break;
                case "eyr":
                    var num = parseInt(kvp[1])
                    if (num > 2019 && num < 2031)
                        passportDetails[2] = true;
                    break;
                case "hgt":
                    if (kvp[1].search("cm") !== -1)
                        passportDetails[3] = parseInt(kvp[1].slice(0, -2)) >= 150 && parseInt(kvp[1].slice(0, -2)) <= 193;
                    if (kvp[1].search("in") !== -1)
                        passportDetails[3] = parseInt(kvp[1].slice(0, -2)) >= 59 && parseInt(kvp[1].slice(0, -2)) <= 76;
                    break;
                case "hcl":
                    passportDetails[4] = kvp[1].length === 7;
                    for (let i =0; i < kvp[1].length; i++){
                        if (i ===0){
                            if (kvp[1][0] !== '#'){
                                passportDetails[4] = false;
                                break;
                            }
                        } else {
                            if (!validHairChars.includes(kvp[1][i]))
                                passportDetails[4] = false;
                        }
                    }
                    break;
                case "ecl":
                    if (eyecolors.includes(kvp[1]))
                        passportDetails[5] = true;
                    break;
                case "pid":
                    passportDetails[6] = kvp[1].length === 9 && !isNaN(Number(kvp[1]));
                    break;
                case "cid":
                    break;
            }
        })
    }
}
console.log(valid);