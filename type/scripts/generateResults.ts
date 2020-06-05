//Convert JSON to hex string
export function hexEncode(input: string) {
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