define(["require", "exports", "./generateResults"], function (require, exports, generateResults_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.onload = function () {
        showResults();
    };
    var resultSectionCorrect = document.querySelector('#correct-carousel-inner');
    var resultSectionIncorrect = document.querySelector('#incorrect-carousel-inner');
    var kanjiList, hiraganaList;
    var correctIncorrect;
    function set(kanji, hiragana) {
        kanjiList = kanji;
        hiraganaList = hiragana;
    }
    exports.set = set;
    function showResults() {
        var hex = window.location.hash.substr(1);
        var JSONString = generateResults_1.hexDecode(hex);
        console.log(JSONString);
        correctIncorrect = JSON.parse(JSONString);
        var generatedCards = generateCards();
        resultSectionCorrect.innerHTML = generatedCards[0];
        resultSectionIncorrect.innerHTML = generatedCards[1];
    }
    exports.showResults = showResults;
    function generateCards() {
        if (kanjiList == null)
            throw Error("Results module has undefined kanji list");
        if (hiraganaList == null)
            throw Error("Results module has undefined hiragana list");
        var resultsSectionCorrectHTML = '', resultsSectionIncorrectHTML = '';
        //Activate divider
        document.querySelector('#result-section-divider').hidden = false;
        //Correct Section
        var correct = correctIncorrect.Correct;
        //If none correct, put a none card
        if (correct.length == 0) {
            resultsSectionCorrectHTML += "\n        <div class=\"carousel-item active\">\n            <div class=\"card text-center mx-auto bg-secondary text-white my-5\" style = \"width: 32rem;\">\n                <div class=\"card-body\">\n                    <h5 class=\"card-title\">None Correct</h5>\n                </div>\n            </div>\n        </div>";
        }
        else {
            for (var i = 0; i < correct.length; i++) {
                //First item of carousel must be marked active
                if (i == 0) {
                    resultsSectionCorrectHTML += "\n                <div class=\"carousel-item active\">\n                    <div class=\"card text-center mx-auto bg-secondary text-white my-5\" style = \"width: 32rem;\">\n                        <div class=\"card-body\">\n                            <h5 class=\"card-title\">" + kanjiList[correct[i]].Front + "</h5>\n                            <p class=\"card-text\">" + generateHiragana(correct[i]) + "</p>\n                        </div>\n                    </div>\n                </div>";
                }
                resultsSectionCorrectHTML += "\n            <div class=\"carousel-item\">\n                <div class=\"card text-center mx-auto bg-secondary text-white my-5\" style = \"width: 32rem;\">\n                    <div class=\"card-body\">\n                        <h5 class=\"card-title\">" + kanjiList[correct[i]].Front + "</h5>\n                        <p class=\"card-text\">" + generateHiragana(correct[i]) + "</p>\n                    </div>\n                </div>\n            </div>";
            }
        }
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
});
