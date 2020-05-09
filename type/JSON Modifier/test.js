const fs = require('fs');

let eng = JSON.parse(fs.readFileSync('new.json'));
let hir = JSON.parse(fs.readFileSync('n4-vocab-kanji-hiragana.json'));

eng.forEach(e => {
    if (e.HiraganaIndex == null)
        console.log(`${e.Front}, ${e.Front}, ${e.Back}`);
    else console.log(`${e.Front}, ${hir[e.HiraganaIndex].Back}, ${e.Back}`);
})