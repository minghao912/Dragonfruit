let correctWords: any[] = [], incorrectWords: any[] = [];

export function addWord(correct: boolean, index: number) {
    if (correct) correctWords.push(index);
    else if (!correct) incorrectWords.push(index);
    else throw new Error("This is not supposed to happen.");
}

export function getWord(correct: boolean, index: number) {
    return correct ? correctWords[index] : incorrectWords[index];
}

export function getArray(correct: boolean) {
    return correct ? correctWords : incorrectWords;
}