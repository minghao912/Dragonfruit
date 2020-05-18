var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "./wordDef"], function (require, exports, wordDef) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    wordDef = __importStar(wordDef);
    var resultSectionCorrect = document.querySelector('#results-section-correct');
    var resultSectionIncorrect = document.querySelector('#results-section-incorrect');
    var kanjiList, hiraganaList;
    function init(kanji, hiragana) {
        kanjiList = kanji;
        hiraganaList = hiragana;
    }
    exports.init = init;
    function showResults() {
        if (kanjiList == null || hiraganaList == null)
            throw Error("Results module has undefined kanji or hiragana list");
        var resultSectionCorrectHTML = '', resultSectionIncorrectHTML = '';
        //Activate divider
        document.querySelector('#result-section-divider').hidden = false;
        //Correct
        resultSectionCorrectHTML += "<h5 class=\"mb-3\">Correct Words (" + wordDef.getArray(true).length + ")<h5>";
        wordDef.getArray(true).forEach(function (e) {
            console.log("Generating card for index " + e);
            resultSectionCorrectHTML += "<div class=\"card card-body bg-secondary text-white my-2\">\n                                        <p class=\"display-6\">" + kanjiList[e].Front + "</p>\n                                        <p class=\"display-10\">" + generateHiragana(e) + "</p>\n                                    </div>";
        });
        //Incorrect
        resultSectionIncorrectHTML += "<h5 class=\"mb-3\">Incorrect Words (" + wordDef.getArray(false).length + ")<h5>";
        wordDef.getArray(false).forEach(function (f) {
            console.log("Generating card for index " + f);
            resultSectionIncorrectHTML += "<div class=\"card card-body bg-secondary text-white my-2\">\n                                            <p class=\"display-6\">" + kanjiList[f].Front + "</p>\n                                            <p class=\"display-10\">" + generateHiragana(f) + "</p>\n                                        </div>";
        });
        resultSectionCorrect.innerHTML = resultSectionCorrectHTML;
        resultSectionIncorrect.innerHTML = resultSectionIncorrectHTML;
    }
    exports.showResults = showResults;
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
