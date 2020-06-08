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
    (document.querySelector('#results-button-div') as HTMLElement)!.hidden = true;

    showResults2();
}

function showResults2() {
    const JSONString: string = sessionStorage.getItem('jsonString')!;
    let urlJSON: any;

    try {
        urlJSON = JSON.parse(JSONString);
    } catch (e) {
        console.log('JSON unparsable\n' + e);
    }

    console.log(urlJSON);

    //Load stats into the words typed and time limit
    const timeDisplay: HTMLElement = document.querySelector('#time') as HTMLElement;
    const wordsTypedDisplay: HTMLElement = document.querySelector('#words-typed-display') as HTMLElement;
    timeDisplay.innerHTML = `${Math.floor(urlJSON.TimeSelected / 60000).toString().padStart(2, '0')}:${(Math.floor((urlJSON.TimeSelected % 60000) / 1000).toFixed(0)).padStart(2, '0')}`;
    timeDisplay.hidden = false;

    wordsTypedDisplay.innerHTML = `
    <h3>Words Typed</h3>
    <br>
    <h4><span id="score" data-trigger="hover" data-toggle="popover" data-placement="right" data-html="true" data-content="Incorrect: ${urlJSON.Incorrect.length}</br>Correct: ${urlJSON.Correct.length}">${urlJSON.WordsTyped}</span></h4>
    `;

    const generatedCards: string[] = generateCards2(urlJSON);
    (resultSectionCorrect as HTMLElement).innerHTML = generatedCards[0];
    (resultSectionIncorrect as HTMLElement).innerHTML = generatedCards[1];
}

function generateCards2(urlJSON: any): string[] {
    let resultsSectionCorrectHTML: string = '', resultsSectionIncorrectHTML: string = '';
    let correctIndicatorsHTML: string = '', incorrectIndicatorsHTML: string = '';

    //Activate divider
    (document.querySelector('#result-section-divider') as HTMLElement).hidden = false;

    //Correct Section
    const correct: any[] = urlJSON.Correct;

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
            console.log("Current iteration: " + i + ", generating card for " + JSON.stringify(correct[i]));

            //First item of carousel must be marked active
            if (i == 0) {
                resultsSectionCorrectHTML += `
                <div class="carousel-item active">
                    <div class="card text-center mx-auto bg-secondary text-white my-5" style = "width: 32rem;">
                        <div class="card-body">
                            <p>${correct[i].kanji.Front}</p>
                        </div>
                    </div>
                </div>`;

                correctIndicatorsHTML += `<li data-target="#resultsCarousel2" data-slide-to="0" class="active"></li>`;
                continue;   //Skip rest of loop
            }

            resultsSectionCorrectHTML += `
            <div class="carousel-item">
                <div class="card text-center mx-auto bg-secondary text-white my-5" style = "width: 32rem;">
                    <div class="card-body">
                        <p>${correct[i].kanji.Front}</p>
                    </div>
                </div>
            </div>`;

            //Add indicators
            correctIndicatorsHTML += `
            <li data-target="#resultsCarousel2" data-slide-to="${i}"></li>
            `;
        }
    }

    //Incorrect section
    const incorrect: any[] = urlJSON.Incorrect;

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
            console.log("Current iteration: " + i + ", generating card for " + JSON.stringify(incorrect[i]));

            //First item of carousel must be marked active
            if (i == 0) {
                resultsSectionIncorrectHTML += `
                <div class="carousel-item active">
                    <div class="card text-center mx-auto bg-secondary text-white my-5" style = "width: 32rem;">
                        <div class="card-body">
                            <p>${incorrect[i].kanji.Front}</p>
                        </div>
                    </div>
                </div>`;

                incorrectIndicatorsHTML += `<li data-target="#resultsCarousel1" data-slide-to="0" class="active"></li>`;
                continue;
            }

            resultsSectionIncorrectHTML += `
            <div class="carousel-item">
                <div class="card text-center mx-auto bg-secondary text-white my-5" style = "width: 32rem;">
                    <div class="card-body">
                        <p>${incorrect[i].kanji.Front}</p>
                    </div>
                </div>
            </div>`;

            //Add indicators
            incorrectIndicatorsHTML += `
            <li data-target="#resultsCarousel1" data-slide-to="${i}"></li>
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