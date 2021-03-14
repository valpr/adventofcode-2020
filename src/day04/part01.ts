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
            switch (info.split(":")[0]){
                case "byr":
                    passportDetails[0] = true;
                    break;
                case "iyr":
                    passportDetails[1] = true;
                    break;
                case "eyr":
                    passportDetails[2] = true;
                    break;
                case "hgt":
                    passportDetails[3] = true;
                    break;
                case "hcl":
                    passportDetails[4] = true;
                    break;
                case "ecl":
                    passportDetails[5] = true;
                    break;
                case "pid":
                    passportDetails[6] = true;
                    break;
                case "cid":
                    break;
            }
        })
    }
}
console.log(valid);