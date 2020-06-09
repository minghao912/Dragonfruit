"use strict";
if (document.querySelector('#results-button') != null)
    document.querySelector('#results-button').addEventListener('click', init);
var resultSectionCorrect = document.querySelector('#correct-carousel-inner');
var resultSectionIncorrect = document.querySelector('#incorrect-carousel-inner');
var correctCarouselIndicators = document.querySelector('#correct-carousel-indicators');
var incorrectCarouselIndicators = document.querySelector('#incorrect-carousel-indicators');
var kanjiList, hiraganaList;
var correctIncorrect;
function init() {
    console.log('Showing results');
    //Show carousels and hide button
    document.querySelector('#results-carousels').hidden = false;
    document.querySelector('#results-button-div').hidden = true;
    showResults2();
}
function showResults2() {
    var JSONString = sessionStorage.getItem('jsonString');
    var urlJSON;
    try {
        urlJSON = JSON.parse(JSONString);
    }
    catch (e) {
        console.log('JSON unparsable\n' + e);
    }
    console.log(urlJSON);
    //Load stats into the words typed and time limit
    var timeDisplay = document.querySelector('#time');
    var scoreDisplay = document.querySelector('#score');
    timeDisplay.innerHTML = Math.floor(urlJSON.TimeSelected / 60000).toString().padStart(2, '0') + ":" + (Math.floor((urlJSON.TimeSelected % 60000) / 1000).toFixed(0)).padStart(2, '0');
    scoreDisplay.innerHTML = urlJSON.WordsTyped;
    document.querySelector('#time-score').hidden = false;
    var generatedCards = generateCards2(urlJSON);
    resultSectionCorrect.innerHTML = generatedCards[0];
    resultSectionIncorrect.innerHTML = generatedCards[1];
}
function generateCards2(urlJSON) {
    var resultsSectionCorrectHTML = '', resultsSectionIncorrectHTML = '';
    var correctIndicatorsHTML = '', incorrectIndicatorsHTML = '';
    //Activate divider
    document.querySelector('#result-section-divider').hidden = false;
    //Correct Section
    var correct = urlJSON.Correct;
    //If none correct, put a none card
    if (correct.length == 0) {
        resultsSectionCorrectHTML += "\n        <div class=\"carousel-item active\">\n            <div class=\"card text-center mx-auto bg-secondary text-white my-5\" style = \"width: 32rem;\">\n                <div class=\"card-body\">\n                    <h5 class=\"card-title\">None Correct</h5>\n                </div>\n            </div>\n        </div>";
    }
    else {
        for (var i = 0; i < correct.length; i++) {
            console.log("Current iteration: " + i + ", generating card for " + JSON.stringify(correct[i]));
            //First item of carousel must be marked active
            if (i == 0) {
                resultsSectionCorrectHTML += "\n                <div class=\"carousel-item active\">\n                    <div class=\"card text-center mx-auto bg-secondary text-white my-5\" style = \"width: 32rem;\">\n                        <div class=\"card-body\">\n                            <p>" + correct[i].kanji.Front + "</p>\n                        </div>\n                    </div>\n                </div>";
                correctIndicatorsHTML += "<li data-target=\"#resultsCarousel2\" data-slide-to=\"0\" class=\"active\"></li>";
                continue; //Skip rest of loop
            }
            resultsSectionCorrectHTML += "\n            <div class=\"carousel-item\">\n                <div class=\"card text-center mx-auto bg-secondary text-white my-5\" style = \"width: 32rem;\">\n                    <div class=\"card-body\">\n                        <p>" + correct[i].kanji.Front + "</p>\n                    </div>\n                </div>\n            </div>";
            //Add indicators
            correctIndicatorsHTML += "\n            <li data-target=\"#resultsCarousel2\" data-slide-to=\"" + i + "\"></li>\n            ";
        }
    }
    //Incorrect section
    var incorrect = urlJSON.Incorrect;
    if (incorrect.length == 0) {
        resultsSectionIncorrectHTML += "\n        <div class=\"carousel-item active\">\n            <div class=\"card text-center mx-auto bg-secondary text-white my-5\" style = \"width: 32rem;\">\n                <div class=\"card-body\">\n                    <h5 class=\"card-title\">None Correct</h5>\n                </div>\n            </div>\n        </div>";
    }
    else {
        for (var i = 0; i < incorrect.length; i++) {
            console.log("Current iteration: " + i + ", generating card for " + JSON.stringify(incorrect[i]));
            //First item of carousel must be marked active
            if (i == 0) {
                resultsSectionIncorrectHTML += "\n                <div class=\"carousel-item active\">\n                    <div class=\"card text-center mx-auto bg-secondary text-white my-5\" style = \"width: 32rem;\">\n                        <div class=\"card-body\">\n                            <p>" + incorrect[i].kanji.Front + "</p>\n                        </div>\n                    </div>\n                </div>";
                incorrectIndicatorsHTML += "<li data-target=\"#resultsCarousel1\" data-slide-to=\"0\" class=\"active\"></li>";
                continue;
            }
            resultsSectionIncorrectHTML += "\n            <div class=\"carousel-item\">\n                <div class=\"card text-center mx-auto bg-secondary text-white my-5\" style = \"width: 32rem;\">\n                    <div class=\"card-body\">\n                        <p>" + incorrect[i].kanji.Front + "</p>\n                    </div>\n                </div>\n            </div>";
            //Add indicators
            incorrectIndicatorsHTML += "\n            <li data-target=\"#resultsCarousel1\" data-slide-to=\"" + i + "\"></li>\n            ";
        }
    }
    //Set indicators
    correctCarouselIndicators.innerHTML = correctIndicatorsHTML;
    incorrectCarouselIndicators.innerHTML = incorrectIndicatorsHTML;
    //Final return
    return [resultsSectionCorrectHTML, resultsSectionIncorrectHTML];
}
function generateHiragana(index) {
    var hiraganaIndex = kanjiList[index].HiraganaIndex;
    if (hiraganaIndex == null)
        return "";
    else
        try {
            return hiraganaList[hiraganaIndex].Back;
        }
        catch (e) {
            throw Error(e + ("\nKanji List for index " + index + " has an invalid hiragana index"));
        }
}
