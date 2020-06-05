define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //Convert JSON to hex string
    function hexEncode(input) {
        var i;
        var result = "";
        for (i = 0; i < input.length; i++) {
            result += input.charCodeAt(i).toString(16);
        }
        return result;
    }
    exports.hexEncode = hexEncode;
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
