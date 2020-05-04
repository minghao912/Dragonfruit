"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Load file (txt)
export function loadFileTXT(filepath) {
    var req = new XMLHttpRequest();
    req.open("GET", filepath, false);
    req.send();
    if (req.status == 200)
        return req.responseText;
}
exports.loadFileTXT = loadFileTXT;
//Load file (json)
export function loadFileJSON(filepath) {
    var result = [];
    fetch(filepath).then(function (response) { return response.json(); }).then(function (json) {
        for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
            var e = json_1[_i];
            result.push(e);
        }
    });
    console.log("Loaded file " + filepath);
    return result;
}
exports.loadFileJSON = loadFileJSON;
