let correctWords = [], incorrectWords = [];

export function addWord(correct, index) {
    if(correct) correctWords.push(index);
    else if(!correct) incorrectWords.push(index);
    else throw new Error("This is not supposed to happen.");
}

export function getWord(correct, index) {
    return correct ? correctWords[index] : incorrectWords[index];
}

export function getArray(correct) {
    return correct ? correctWords : incorrectWords;
}