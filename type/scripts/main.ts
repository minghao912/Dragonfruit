import * as wordDef from './wordDef';

window.addEventListener('load', init);

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
const resultSection = document.querySelector('#results-section');

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
        const selection = (e.target as HTMLInputElement).value;

        console.log(`User selected JLPT Level ${selection}`);

        //Set JSONs in this file
        words = loadFileJSON(`./lists/${selection}-vocab-kanji-eng.json`);
        hiragana = loadFileJSON(`./lists/${selection}-vocab-kanji-hiragana.json`);

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

    //Check match and update array in wordDef
    if (match) {
        score++;
        wordDef.addWord(true, currentWordIndex);
    } else if (!match)
        wordDef.addWord(false, currentWordIndex);

    //Generate and display new word
    showWord(words);

    //Test
    console.log('Current correct words: ' + wordDef.getArray(true));
    console.log('Current incorrect words: ' + wordDef.getArray(false));

    scoreDisplay!.innerHTML = String(score); //Update score element
}

//Match currentWord to wordInput
function matchWords() {
    if ((wordInput as HTMLInputElement).value === currentWord!.innerHTML)
        return true;
    else
        return false;
}

//Pick and display random word
function showWord(wordArray: any[]) {
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

        //Test
        wordDef.getArray(true).forEach(e => console.log(e));
        wordDef.getArray(false).forEach(f => console.log(f));

        //Show results
        showResults(words, hiragana);
    }
}

function showResults(kanjiList: any[], hiraganaList: any[]) {
    //Test
    console.log(kanjiList);
    console.log(hiraganaList);

    let resultSectionHTML = '';

    resultSectionHTML += `<h5>Correct Words<h5>`;
    wordDef.getArray(true).forEach(e => {
        console.log(`Generating card for index ${e}`);
        //resultSectionHTML += `<div class="card card-body bg-secondary text-white"><p>${kanjiList[e].Front}</p><br><p>${hiraganaList[e].Back}</p></div>`;
        resultSectionHTML += `<div class="card card-body bg-secondary text-white my-2"><p>${kanjiList[e].Front}</p></div>`;
    });

    resultSectionHTML += '<hr class="my-4" style="border-top: 1px solid white" />';

    resultSectionHTML += '<h5>Incorrect Words<h5>';
    wordDef.getArray(false).forEach(f => {
        console.log(`Generating card for index ${f}`);
        //resultSectionHTML += `<div class="card card-body bg-secondary text-white"><p>${kanjiList[f].Front}</p><br><p>${hiraganaList[f].Back}</p></div>`;
        resultSectionHTML += `<div class="card card-body bg-secondary text-white my-2"><p>${kanjiList[f].Front}</p></div>`;
    });

    resultSection!.innerHTML = resultSectionHTML;
}

//Load file (txt)
function loadFileTXT(filepath: string) {
    let req = new XMLHttpRequest();

    req.open("GET", filepath, false);
    req.send();

    if (req.status == 200) return req.responseText;
}

//Load file (json)
function loadFileJSON(filepath: string) {
    let result: any[] = [];
    fetch(filepath).then(response => response.json()).then(json => {
        for (const e of json)
            result.push(e);
    });

    console.log(`Loaded file ${filepath}`);
    return result;
}