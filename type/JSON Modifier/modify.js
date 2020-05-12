const fs = require('fs');
const levelToRequire = "1";

let eng = JSON.parse(fs.readFileSync(`./N${levelToRequire}/n${levelToRequire}-vocab-kanji-eng.json`));
let hiragana = JSON.parse(fs.readFileSync(`./N${levelToRequire}/n${levelToRequire}-vocab-kanji-hiragana.json`));

var pHiragana = "[\\u3041-\\u3096\\u309D-\\u309F]|\\uD82C\\uDC01|\\uD83C\\uDE00";
var pKatakana = "[\\u30A1-\\u30FA\\u30FD-\\u30FF\\u31F0-\\u31FF\\u32D0-\\u32FE\\u3300-\\u3357\\uFF66-\\uFF6F\\uFF71-\\uFF9D]|\\uD82C\\uDC00";
var pHan = "[\\u2E80-\\u2E99\\u2E9B-\\u2EF3\\u2F00-\\u2FD5\\u3005\\u3007\\u3021-\\u3029\\u3038-\\u303B\\u3400-\\u4DB5\\u4E00-\\u9FD5\\uF900-\\uFA6D\\uFA70-\\uFAD9]|[\\uD840-\\uD868\\uD86A-\\uD86C\\uD86F-\\uD872][\\uDC00-\\uDFFF]|\\uD869[\\uDC00-\\uDED6\\uDF00-\\uDFFF]|\\uD86D[\\uDC00-\\uDF34\\uDF40-\\uDFFF]|\\uD86E[\\uDC00-\\uDC1D\\uDC20-\\uDFFF]|\\uD873[\\uDC00-\\uDEA1]|\\uD87E[\\uDC00-\\uDE1D]";

let rx = new RegExp(`${pHiragana}|${pKatakana}`);
let rx2 = new RegExp(pHan);

let arrayOfIndexesToModify = [], arrayOfHiraganaIndexes = [];

for (let i = 0; i < eng.length; i++) {
    let word = eng[i].Front;
    let hiraganaString, hiraganaIndex;

    if(!rx2.test(word)) {   //If only hiragana/katakana
        console.log(`> Skip: ${i}, ${word}`);
        continue;
    }

    //Search hiragana JSON for word starting at current i and working backwards
    let startIndex;
    if (i < hiragana.length) 
        startIndex = i;
    else startIndex = hiragana.length - 1;

    for (let j = startIndex; j >= 0; j--) {
        if (hiragana[j].Front == word) {
            hiraganaIndex = j;
            hiraganaString = hiragana[j].Back;
            break;
        }
    }

    arrayOfIndexesToModify.push(i);
    arrayOfHiraganaIndexes.push(hiraganaIndex);
    console.log(`> Found: ${i}, ${word} and ${hiraganaIndex}, ${hiraganaString}`);
}

let newJSON = [];

for (let i = 0; i < eng.length; i++) {
    console.log(`> Now updating ${i}, ${eng[i].Front}`);

    let hiraganaIndexToBeAppended = (function () {
        if (!arrayOfIndexesToModify.includes(i))
            return null;
        else return arrayOfHiraganaIndexes[arrayOfIndexesToModify.indexOf(i)];
    })();

    const newElement = {
        "Front": eng[i].Front,
        "Back": eng[i].Back,
        "Tags": eng[i].Tags,
        "Deck": eng[i].Deck,
        "HiraganaIndex": hiraganaIndexToBeAppended
    }

    newJSON.push(newElement)

    console.log(newElement);

    console.log(`> Done updating ${i}, ${eng[i].Front}}`);
}

fs.writeFileSync(`./N${levelToRequire}/n${levelToRequire}-vocab-kanji-eng-new.json`, JSON.stringify(newJSON));