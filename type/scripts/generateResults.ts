import * as wordDef from './wordDef';

let kFilename: string, hFilename: string;

export function setFilenames(k: string, h: string) {
    kFilename = k;
    hFilename = h;
}

export function generateResults() {
    //Generate JSON to pass to results page
    const JSONString: string = JSON.stringify({
        "Filenames": [kFilename, hFilename],
        "Correct": wordDef.getArray(true),
        "Incorrect": wordDef.getArray(false)
    });

    let hexJSON = hexEncode(JSONString);

    console.log(JSONString);
    console.log(hexJSON);
    
    window.location.replace(`results.html#${hexJSON}`);
}

//Convert JSON to hex string
function hexEncode(input: string) {
    var i;

    var result = "";
    for (i = 0; i < input.length; i++) {
        result += input.charCodeAt(i).toString(16);
    }

    return result;
}

export function hexDecode(input: string) {
    var j: number;
    var hexes = input.match(/.{1,2}/g) || [];
    var back = "";
    for (j = 0; j < hexes.length; j++)
        back += String.fromCharCode(parseInt(hexes[j], 16));

    return back;
}