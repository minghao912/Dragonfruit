import {hexDecode} from './generateResults';
import * as loadFile from './loadFile';

if (document.querySelector('#results-button') != null) 
    document.querySelector('#results-button')!.addEventListener('click', init);

const resultSectionCorrect = document.querySelector('#correct-carousel-inner');
const resultSectionIncorrect = document.querySelector('#incorrect-carousel-inner');
const correctCarouselIndicators = document.querySelector('#correct-carousel-indicators');
const incorrectCarouselIndicators = document.querySelector('#incorrect-carousel-indicators');
let kanjiList: any[], hiraganaList: any[];
let correctIncorrect: any;

function init() {
    console.log('Showing results');

    //Show carousels and hide button
    (document.querySelector('#results-carousels') as HTMLElement)!.hidden = false;
    (document.querySelector('#results-button') as HTMLElement)!.hidden = true;

    showResults();
}

function loadLists(url: any) {
    kanjiList = loadFile.loadFileJSON(url.Filenames[0]);
    hiraganaList = loadFile.loadFileJSON(url.Filenames[1]);
    console.log("Lists loaded for " + url.Filenames[0] + " and " + url.Filenames[1]);
}

function showResults() {
    const hex: string = window.location.hash.substr(1);
    const JSONString: string = hexDecode(hex);
    console.log(JSONString);

    try {
        correctIncorrect = JSON.parse(JSONString);
    } catch (e) {
        console.log('JSON unparsable\n' + e);
    }
    console.log(correctIncorrect);

    loadLists(correctIncorrect);

    const generatedCards: string[] = generateCards();
    (resultSectionCorrect as HTMLElement).innerHTML = generatedCards[0];
    (resultSectionIncorrect as HTMLElement).innerHTML = generatedCards[1];
}

function generateCards(): string[] {
    console.log(kanjiList, hiraganaList);
    if (kanjiList == null) throw Error("Results module has undefined kanji list");
    if (hiraganaList == null) throw Error("Results module has undefined hiragana list");

    let resultsSectionCorrectHTML: string = '', resultsSectionIncorrectHTML: string = '';
    let correctIndicatorsHTML: string = '', incorrectIndicatorsHTML: string = '';

    //Activate divider
    (document.querySelector('#result-section-divider') as HTMLElement).hidden = false;

    //Correct Section
    const correct: number[] = correctIncorrect['Correct'];
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
            const index: number = correct[i];

            console.log("Generating card for " + correct[i]);

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
                </div>`;
                continue;   //Skip rest of loop
            }

            resultsSectionCorrectHTML += `
            <div class="carousel-item">
                <div class="card text-center mx-auto bg-secondary text-white my-5" style = "width: 32rem;">
                    <div class="card-body">
                        <h5 class="card-title">${kanjiList[correct[i]].Front}</h5>
                        <p class="card-text">${generateHiragana(correct[i])}</p>
                    </div>
                </div>
            </div>`;

            //Add indicators
            correctIndicatorsHTML += `
            <li data-target="#resultsCarousel1" data-slide-to="${i}"></li>
            `;
        }
    }

    //Incorrect section
    const incorrect: number[] = correctIncorrect['Incorrect'];
    if (incorrect.length == 0) {
        resultsSectionIncorrectHTML += `
        <div class="carousel-item active">
            <div class="card text-center mx-auto bg-secondary text-white my-5" style = "width: 32rem;">
                <div class="card-body">
                    <h5 class="card-title">None Correct</h5>
                </div>
            </div>
        </div>`;
    } else {
        for (let i = 0; i < incorrect.length; i++) {
            console.log("Generating card for " + kanjiList[incorrect[i]]);

            //First item of carousel must be marked active
            if (i == 0) {
                resultsSectionIncorrectHTML += `
                <div class="carousel-item active">
                    <div class="card text-center mx-auto bg-secondary text-white my-5" style = "width: 32rem;">
                        <div class="card-body">
                            <h5 class="card-title">${kanjiList[incorrect[i]].Front}</h5>
                            <p class="card-text">${generateHiragana(incorrect[i])}</p>
                        </div>
                    </div>
                </div>`;
                continue;
            }

            resultsSectionCorrectHTML += `
            <div class="carousel-item">
                <div class="card text-center mx-auto bg-secondary text-white my-5" style = "width: 32rem;">
                    <div class="card-body">
                        <h5 class="card-title">${kanjiList[incorrect[i]].Front}</h5>
                        <p class="card-text">${generateHiragana(incorrect[i])}</p>
                    </div>
                </div>
            </div>`;

            //Add indicators
            incorrectIndicatorsHTML += `
            <li data-target="#resultsCarousel2" data-slide-to="${i}"></li>
            `;
        }
    }

    //Set indicators
    (correctCarouselIndicators as HTMLElement).innerHTML = correctIndicatorsHTML;
    (incorrectCarouselIndicators as HTMLElement).innerHTML = incorrectIndicatorsHTML;

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