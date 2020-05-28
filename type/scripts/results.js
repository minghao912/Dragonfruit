define(["require", "exports", "./generateResults"], function (require, exports, generateResults_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.addEventListener('load', showResults);
    function showResults() {
        var hex = window.location.hash.substr(1);
        var JSONString = generateResults_1.hexDecode(hex);
        console.log(JSONString);
    }
});
