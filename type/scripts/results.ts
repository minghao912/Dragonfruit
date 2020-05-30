import {hexDecode} from './generateResults';

window.onload = () => {
    showResults();
}

const resultSectionCorrect = document.querySelector('#correct-carousel-inner');
const resultSectionIncorrect = document.querySelector('#incorrect-carousel-inner');
let kanjiList: any[], hiraganaList: any[];
let correctIncorrect: any;

export function set(kanji: any[], hiragana: any[]) {
    kanjiList = kanji;
    hiraganaList = hiragana;
}

export function showResults() {
    const hex: string = window.location.hash.substr(1);
    const JSONString: string = hexDecode(hex);
    console.log(JSONString);

    correctIncorrect = JSON.parse(JSONString);

    const generatedCards: string[] = generateCards();
    (resultSectionCorrect as HTMLElement).innerHTML = generatedCards[0];
    (resultSectionIncorrect as HTMLElement).innerHTML = generatedCards[1];
}

function generateCards(): string[] {
    if (kanjiList == null) throw Error("Results module has undefined kanji list");
    if (hiraganaList == null) throw Error("Results module has undefined hiragana list");

    let resultsSectionCorrectHTML: string = '', resultsSectionIncorrectHTML: string = '';

    //Activate divider
    (document.querySelector('#result-section-divider') as HTMLElement).hidden = false;

    //Correct Section
    const correct = correctIncorrect.Correct;
    //If none correct, put a none card
    if (correct.length == 0) {
        resultsSectionCorrectHTML += `
        <div class="carousel-item active">
            <div class="card text-center mx-auto bg-secondary text-white my-5" style = "width: 32rem;">
                <div class="card-body">
                    <h5 class="card-title">None Correct</h5>
                </div>
            </div>
        </div>`;
    } else {
        for (let i = 0; i < correct.length; i++) {
            //First item of carousel must be marked active
            if (i == 0) {
                resultsSectionCorrectHTML += `
                <div class="carousel-item active">
                    <div class="card text-center mx-auto bg-secondary text-white my-5" style = "width: 32rem;">
                        <div class="card-body">
                            <h5 class="card-title">${kanjiList[correct[i]].Front}</h5>
                            <p class="card-text">${generateHiragana(correct[i])}</p>
                        </div>
                    </div>
                </div>`
            }

            resultsSectionCorrectHTML += `
            <div class="carousel-item">
                <div class="card text-center mx-auto bg-secondary text-white my-5" style = "width: 32rem;">
                    <div class="card-body">
                        <h5 class="card-title">${kanjiList[correct[i]].Front}</h5>
                        <p class="card-text">${generateHiragana(correct[i])}</p>
                    </div>
                </div>
            </div>`
        }
    }

    //Final return
    return [resultsSectionCorrectHTML, resultsSectionIncorrectHTML];
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