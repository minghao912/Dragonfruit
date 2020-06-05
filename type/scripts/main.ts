import * as wordDef from './wordDef';
import * as loadFile from './loadFile';
import * as genResults from './generateResults';
import * as results from './results';

window.addEventListener('load', init);  //Run init() on page load

//Globals
let score: number = 0;
let time: number, isPlaying: boolean;
let gameOverStatus: boolean = false;

//DOM Elements
const levelSelection = document.querySelector('#level-selection');
const timeSelection = document.querySelector('#time-selection');
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');

//const words = loadFileTXT('./scripts/file.txt').split('\n');
let words: any[], hiragana: any[];
let levelSelected = false, timeSelected = false;
let gameStarted = false, timerStarted = false;
let currentWordIndex: number;

//Initialize Game
function init() {
    //Start matching on word input
    wordInput!.addEventListener('keypress', function (e) {
        if ((e as KeyboardEvent).key === 'Enter') startMatch();
    });

    //Add event listener to level select dropdown box and load correct JSON
    levelSelection!.addEventListener('change', e => {
        const selection: string = (e.target as HTMLInputElement).value;

        //Don't do anything if the selected value is any invalid value
        if (!['n1', 'n2', 'n3', 'n4', 'n5'].includes(selection)) return;

        console.log(`User selected JLPT Level ${selection}`);

        //Set JSONs
        const kanjiFilename = `./lists/${selection}-vocab-kanji-eng.json`;
        const hiraganaFilename = `./lists/${selection}-vocab-kanji-hiragana.json`;

        words = loadFile.loadFileJSON(kanjiFilename);
        hiragana = loadFile.loadFileJSON(hiraganaFilename);
        //generateResults.setFilenames(kanjiFilename, hiraganaFilename);

        //Fulfill start game requirement
        levelSelected = true;
    });

    //Add event listener to time select dropdown box
    timeSelection!.addEventListener('change', e => {
        const selection: number = parseInt((e.target as HTMLInputElement).value);

        console.log(`User selected time limit of ${selection / 60000} seconds`);
        time = selection;
        timeSelected = true;
    })

    setInterval(checkStartReq, 100) //Check requirements for game start

    setInterval(checkStatus, 50);   //Check game status
}

function checkStartReq() {
    if (!gameStarted && levelSelected && timeSelected) {
        startGame();
        gameStarted = true;

        //Activate input box
        (wordInput! as HTMLInputElement).disabled = false;
        //Disable further changes to selection
        (levelSelection as HTMLInputElement).disabled = (timeSelection as HTMLInputElement).disabled = true;
    }
}

//Start game
function startGame() {
    updateTimeRemaining();

    //Start timer when user clicks into input box
    wordInput!.addEventListener('click', function () {
        if (!timerStarted)
            setInterval(countdown, 100);    //Start timer - run every 100ms
        timerStarted = true;
    });

    //Get word - will keep running showWord() until showWord() returns a true
    let f = true;
    do {
        setTimeout(function () {
            f = showWord(words);
        }, 100);
    } while (!f)
}

//Start match
function startMatch() {
    const match = matchWords();

    isPlaying = true;
    (wordInput as HTMLInputElement).value = '';
    score++;    //Add one to "Words Typed"

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

    scoreDisplay!.innerHTML = String(score); //Update score element
}

//Match currentWord to wordInput
function matchWords(): boolean {
    if ((wordInput as HTMLInputElement).value === currentWord!.innerHTML)
        return true;
    else
        return false;
}

//Pick and display random word
function showWord(wordArray: any[]): boolean {
    const randomIndex = Math.floor(Math.random() * wordArray.length);

    //Try accessing the wordArray JSON
    let word: string;
    try {
        do {
            word = wordArray[randomIndex].Front;
        } while (word.includes('/[/・]/'));
    } catch (error) {
        console.log('Failed accessing wordArray\n' + error);
        return false;
    }

    console.log(`New word sent: ${word}`);
    currentWord!.innerHTML = word;
    currentWordIndex = randomIndex;
    return true;
}

//Timer
function countdown() {
    //Check time valid
    if (time > 0) {
        time -= 100;    //Decrement time by 100ms
    } else if (time === 0) {
        isPlaying = false;  //Game Over
    }

    updateTimeRemaining(); //Show time and formatting
}

//Update timer clock in format xx:xx
function updateTimeRemaining() {
    timeDisplay!.innerHTML = `${Math.floor(time / 60000).toString().padStart(2, '0')}:${(Math.floor((time % 60000) / 1000).toFixed(0)).padStart(2, '0')}`;
}

//Check game status
function checkStatus() {
    //Game over
    if (!gameOverStatus && !isPlaying && time === 0) {
        message!.innerHTML = 'Finished';
        gameOverStatus = true;
        document.querySelectorAll('.remove-when-finished').forEach(e => {
            e.innerHTML = '';
        });

        generateResults();
    }
}

function generateResults() {
    //Generate JSON to pass to results page
    let urlJSON: any = {
        //"Filenames": [kFilename, hFilename],
        "Correct": null,
        "Incorrect": null
    };

    let correctArray: any[] = [], incorrectArray: any[] = [];

    //Add correct words to JSON
    wordDef.getArray(true).forEach(e => {
        const wordObj: any = words[e];

        if (wordObj.HiraganaIndex == null)
            correctArray.push({ "kanji": wordObj, "hiragana": null })
        else if (wordObj.HiraganaIndex != null)
            correctArray.push({ "kanji": wordObj, "hiragana": hiragana[wordObj.HiraganaIndex] });
    });
    urlJSON.Correct = correctArray;

    //Incorrect
    wordDef.getArray(false).forEach(e => {
        const wordObj: any = words[e];

        if (wordObj.HiraganaIndex == null)
            incorrectArray.push({ "kanji": wordObj, "hiragana": null })
        else if (wordObj.HiraganaIndex != null)
            incorrectArray.push({ "kanji": wordObj, "hiragana": hiragana[wordObj.HiraganaIndex] });
    });
    urlJSON.Incorrect = incorrectArray;

    const JSONString = JSON.stringify(urlJSON);
    console.log(JSONString);

    sessionStorage.setItem('jsonString', JSONString);

    window.location.replace(`results.html`);
}