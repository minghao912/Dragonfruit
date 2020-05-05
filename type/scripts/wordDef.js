define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var correctWords = [], incorrectWords = [];
    function addWord(correct, index) {
        if (correct)
            correctWords.push(index);
        else if (!correct)
            incorrectWords.push(index);
        else
            throw new Error("This is not supposed to happen.");
    }
    exports.addWord = addWord;
    function getWord(correct, index) {
        return correct ? correctWords[index] : incorrectWords[index];
    }
    exports.getWord = getWord;
    function getArray(correct) {
        return correct ? correctWords : incorrectWords;
    }
    exports.getArray = getArray;
});
