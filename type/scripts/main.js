var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "./wordDef", "./loadFile"], function (require, exports, wordDef, loadFile) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    wordDef = __importStar(wordDef);
    loadFile = __importStar(loadFile);
    window.addEventListener('load', init);
    //Globals
    var score = 0;
    var time, isPlaying;
    var gameOverStatus = false;
    //DOM Elements
    var levelSelection = document.querySelector('#level-selection');
    var timeSelection = document.querySelector('#time-selection');
    var wordInput = document.querySelector('#word-input');
    var currentWord = document.querySelector('#current-word');
    var scoreDisplay = document.querySelector('#score');
    var timeDisplay = document.querySelector('#time');
    var message = document.querySelector('#message');
    var resultSection = document.querySelector('#results-section');
    //const words = loadFileTXT('./scripts/file.txt').split('\n');
    var words, hiragana;
    var levelSelected = false, timeSelected = false;
    var gameStarted = false, timerStarted = false;
    var currentWordIndex;
    //Initialize Game
    function init() {
        //Start matching on word input
        wordInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter')
                startMatch();
        });
        //Add event listener to level select dropdown box and load correct JSON
        levelSelection.addEventListener('change', function (e) {
            var selection = e.target.value;
            console.log("User selected JLPT Level " + selection);
            //Set JSONs in this file
            words = loadFile.loadFileJSON("./lists/" + selection + "-vocab-kanji-eng.json");
            hiragana = loadFile.loadFileJSON("./lists/" + selection + "-vocab-kanji-hiragana.json");
            levelSelected = true;
        });
        //Add event listener to time select dropdown box
        timeSelection.addEventListener('change', function (e) {
            var selection = parseInt(e.target.value);
            console.log("User selected time limit of " + selection / 60000 + " seconds");
            time = selection;
            timeSelected = true;
        });
        setInterval(checkStartReq, 100); //Check requirements for game start
        setInterval(checkStatus, 50); //Check game status
    }
    function checkStartReq() {
        if (!gameStarted && levelSelected && timeSelected) {
            startGame();
            gameStarted = true;
            //Disable further changes to selection
            levelSelection.disabled = timeSelection.disabled = true;
        }
    }
    //Start game
    function startGame() {
        updateTimeRemaining();
        //Start timer when user clicks into input box
        wordInput.addEventListener('click', function () {
            if (!timerStarted)
                setInterval(countdown, 100); //Start timer - run every 100ms
            timerStarted = true;
        });
        //Get word - will keep running showWord() until showWord() returns a true
        var f = true;
        do {
            setTimeout(function () {
                f = showWord(words);
            }, 100);
        } while (!f);
    }
    //Start match
    function startMatch() {
        var match = matchWords();
        isPlaying = true;
        wordInput.value = '';
        //Check match and update array in wordDef
        if (match) {
            score++;
            wordDef.addWord(true, currentWordIndex);
        }
        else if (!match)
            wordDef.addWord(false, currentWordIndex);
        //Generate and display new word
        showWord(words);
        //Test
        console.log('Current correct words: ' + wordDef.getArray(true));
        console.log('Current incorrect words: ' + wordDef.getArray(false));
        scoreDisplay.innerHTML = String(score); //Update score element
    }
    //Match currentWord to wordInput
    function matchWords() {
        if (wordInput.value === currentWord.innerHTML)
            return true;
        else
            return false;
    }
    //Pick and display random word
    function showWord(wordArray) {
        var randomIndex = Math.floor(Math.random() * wordArray.length);
        //Try accessing the wordArray JSON
        var word;
        try {
            do {
                word = wordArray[randomIndex].Front;
            } while (word.includes('/[/・]/'));
        }
        catch (error) {
            console.log('Failed accessing wordArray\n' + error);
            return false;
        }
        console.log("New word sent: " + word);
        currentWord.innerHTML = word;
        currentWordIndex = randomIndex;
        return true;
    }
    //Timer
    function countdown() {
        //Check time valid
        if (time > 0) {
            time -= 100; //Decrement time by 100ms
        }
        else if (time === 0) {
            isPlaying = false; //Game Over
        }
        updateTimeRemaining(); //Show time and formatting
    }
    //Update timer clock in format xx:xx
    function updateTimeRemaining() {
        timeDisplay.innerHTML = Math.floor(time / 60000).toString().padStart(2, '0') + ":" + (Math.floor((time % 60000) / 1000).toFixed(0)).padStart(2, '0');
    }
    //Check game status
    function checkStatus() {
        //Game over
        if (!gameOverStatus && !isPlaying && time === 0) {
            message.innerHTML = 'Finished';
            gameOverStatus = true;
            document.querySelectorAll('.remove-when-finished').forEach(function (e) {
                e.innerHTML = '';
            });
            //Test
            wordDef.getArray(true).forEach(function (e) { return console.log(e); });
            wordDef.getArray(false).forEach(function (f) { return console.log(f); });
            //Show results
            showResults(words, hiragana);
        }
    }
    function showResults(kanjiList, hiraganaList) {
        //Test
        console.log(kanjiList);
        console.log(hiraganaList);
        var resultSectionHTML = '';
        resultSectionHTML += "<h5>Correct Words<h5>";
        wordDef.getArray(true).forEach(function (e) {
            console.log("Generating card for index " + e);
            //resultSectionHTML += `<div class="card card-body bg-secondary text-white"><p>${kanjiList[e].Front}</p><br><p>${hiraganaList[e].Back}</p></div>`;
            resultSectionHTML += "<div class=\"card card-body bg-secondary text-white my-2\"><p>" + kanjiList[e].Front + "</p></div>";
        });
        resultSectionHTML += '<hr class="my-4" style="border-top: 1px solid white" />';
        resultSectionHTML += '<h5>Incorrect Words<h5>';
        wordDef.getArray(false).forEach(function (f) {
            console.log("Generating card for index " + f);
            //resultSectionHTML += `<div class="card card-body bg-secondary text-white"><p>${kanjiList[f].Front}</p><br><p>${hiraganaList[f].Back}</p></div>`;
            resultSectionHTML += "<div class=\"card card-body bg-secondary text-white my-2\"><p>" + kanjiList[f].Front + "</p></div>";
        });
        resultSection.innerHTML = resultSectionHTML;
    }
});
