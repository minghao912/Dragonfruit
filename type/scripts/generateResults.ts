import * as wordDef from './wordDef';

const resultSectionCorrect = document.querySelector('#results-section-correct');
const resultSectionIncorrect = document.querySelector('#results-section-incorrect');

let kanjiList: any[], hiraganaList: any[];

export function init(kanji: any[], hiragana: any[]) {
    kanjiList = kanji;
    hiraganaList = hiragana;
}

export function generateResults() {
/*     if (kanjiList == null || hiraganaList == null) throw Error("Results module has undefined kanji or hiragana list");

    let resultSectionCorrectHTML: string = '', resultSectionIncorrectHTML: string = '';

    //Activate divider
    (document.querySelector('#result-section-divider') as HTMLElement).hidden = false;

    //Correct
    resultSectionCorrectHTML += `<h5 class="mb-3">Correct Words (${wordDef.getArray(true).length})<h5>`;
    wordDef.getArray(true).forEach(e => {
        console.log(`Generating card for index ${e}`);
        
        resultSectionCorrectHTML += `<div class="card card-body bg-secondary text-white my-2">
                                        <p class="display-6">${kanjiList[e].Front}</p>
                                        <p class="display-10">${generateHiragana(e)}</p>
                                    </div>`;
    });

    //Incorrect
    resultSectionIncorrectHTML += `<h5 class="mb-3">Incorrect Words (${wordDef.getArray(false).length})<h5>`;
    wordDef.getArray(false).forEach(f => {
        console.log(`Generating card for index ${f}`);
        
        resultSectionIncorrectHTML +=   `<div class="card card-body bg-secondary text-white my-2">
                                            <p class="display-6">${kanjiList[f].Front}</p>
                                            <p class="display-10">${generateHiragana(f)}</p>
                                        </div>`;
    });

    resultSectionCorrect!.innerHTML = resultSectionCorrectHTML;
    resultSectionIncorrect!.innerHTML = resultSectionIncorrectHTML; */

    //Generate JSON to pass to results page
    const JSONString: string = JSON.stringify({
        "Correct": wordDef.getArray(true),
        "Incorrect": wordDef.getArray(false)
    });

    let hexJSON = hexEncode(JSONString);

    console.log(JSONString);
    console.log(hexJSON);
    
    window.location.replace(`results.html#${hexJSON}`);
}

function generateHiragana(index: number): string {
    const hiraganaIndex: number = kanjiList[index].HiraganaIndex;

    if (hiraganaIndex == null)
        return "";
    else try {
        return hiraganaList[hiraganaIndex].Back;
    } catch (e) {
        throw Error(e + `\nKanji List for index ${index} has an invalid hiragana index`);
    }
}

//Convert JSON to hex string
function hexEncode(input: string) {
    var hex, i;

    var result = "";
    for (i = 0; i < input.length; i++) {
        result += input.charCodeAt(i).toString(16);
    }

    return result;
}

export function hexDecode(input: string) {
    var j: number;
    var hexes = input.match(/.{1,2}/g) || [];
    var back = "";
    for (j = 0; j < hexes.length; j++)
        back += String.fromCharCode(parseInt(hexes[j], 16));

    return back;
}