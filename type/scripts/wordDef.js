let correctWords = [];
let incorrectWords = [];

export function addWord(correct, index) {
    if(correct) correctWords.push(index);
    else if(!correct) incorrectWords.push(index);
    else throw Error;
}

export function getWord(correct, index) {
    return correct ? correctWords[index] : incorrectWords[index];
}