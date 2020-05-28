import {hexDecode} from './generateResults';

window.addEventListener('load', showResults);

function showResults() {
    const hex: string = window.location.hash.substr(1);
    const JSONString: string = hexDecode(hex);
    console.log(JSONString);
}