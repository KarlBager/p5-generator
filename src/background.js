import names from './names.json';
import { getRandomInt } from './text.js';

export function startBackground(){
let allNames = "";
const arrayLength = names.length;

const bgContainerEl = document.querySelector('#background-container');

    function printName(){
        const nameIndex = getRandomInt(arrayLength);
        let newName = names[nameIndex];

        // Split the name by spaces and join with non-breaking space
        const nameParts = newName.split(" ");
        const formattedName = nameParts.join("\u00A0"); // "\u00A0" is the Unicode for non-breaking space
 
        allNames += "  " + formattedName; // Concatenate the new formatted name
        bgContainerEl.innerHTML = allNames;
    }

setInterval(printName, 1000);
}