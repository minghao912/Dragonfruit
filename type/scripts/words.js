let wordsTyped = [];

export function addWord(index, correct) {
    wordsTyped.push({
        "index": index,
        "correct": correct
    });
}

export function getWord(index) {
    return wordsTyped[index];
}