var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "./wordDef", "./loadFile", "./generateResults"], function (require, exports, wordDef, loadFile, results) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    wordDef = __importStar(wordDef);
    loadFile = __importStar(loadFile);
    results = __importStar(results);
    window.addEventListener('load', init); //Run init() on page load
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
            //Don't do anything if the selected value is any invalid value
            if (!['n1', 'n2', 'n3', 'n4', 'n5'].includes(selection))
                return;
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
            //Activate input box
            wordInput.disabled = false;
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
        score++; //Add one to "Words Typed"
        //Check match and update array in wordDef
        if (match)
            wordDef.addWord(true, currentWordIndex);
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
            /** Test
            wordDef.getArray(true).forEach(e => console.log(e));
            wordDef.getArray(false).forEach(f => console.log(f));
            **/
            //Show results
            results.init(words, hiragana);
            results.generateResults();
        }
    }
});
