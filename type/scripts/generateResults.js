var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "./wordDef"], function (require, exports, wordDef) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    wordDef = __importStar(wordDef);
    function generateResults() {
        //Generate JSON to pass to results page
        var JSONString = JSON.stringify({
            "Correct": wordDef.getArray(true),
            "Incorrect": wordDef.getArray(false)
        });
        var hexJSON = hexEncode(JSONString);
        console.log(JSONString);
        console.log(hexJSON);
        window.location.replace("results.html#" + hexJSON);
    }
    exports.generateResults = generateResults;
    //Convert JSON to hex string
    function hexEncode(input) {
        var i;
        var result = "";
        for (i = 0; i < input.length; i++) {
            result += input.charCodeAt(i).toString(16);
        }
        return result;
    }
    function hexDecode(input) {
        var j;
        var hexes = input.match(/.{1,2}/g) || [];
        var back = "";
        for (j = 0; j < hexes.length; j++)
            back += String.fromCharCode(parseInt(hexes[j], 16));
        return back;
    }
    exports.hexDecode = hexDecode;
});
