window.addEventListener('load', init);

//Globals
let score = 0;
let time, isPlaying;

//DOM Elements
const levelSelection = document.querySelector('#level-selection');
const timeSelection = document.querySelector('#time-selection');
const wordInput = document.querySelector('#word-input');  
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');

//const words = loadFileTXT('./scripts/file.txt').split('\n');
let words, hiragana;

let levelSelected = false, timeSelected = false;

let gameStarted = false, timerStarted = false;

//Initialize Game
function init() {
    //Start matching on word input
    wordInput.addEventListener('keypress', function(e) {
        if(e.key === 'Enter') startMatch();
    });    

    //Add event listener to level select dropdown box and load correct JSON
    levelSelection.addEventListener('change', e => {
        const selection = e.target.value;

        console.log(`User selected JLPT Level ${selection}`);
        words = loadFileJSON(`./lists/${selection}-vocab-kanji-eng.json`);
        levelSelected = true;
    });

    //Add event listener to time select dropdown box
    timeSelection.addEventListener('change', e => {
        const selection = e.target.value;

        console.log(`User selected time limit of ${selection / 60000} seconds`);
        time = selection;
        timeSelected = true;
    })

    setInterval(checkStartReq, 100) //Check requirements for game start
    
    setInterval(checkStatus, 50);   //Check game status
}

function checkStartReq() {
    if(!gameStarted && levelSelected && timeSelected) {
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
    wordInput.value = '';
    showWord(words);
    
    if(match)    
        score++;

    scoreDisplay.innerHTML = score; //Update score element
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
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    
    //Try accessing the wordArray JSON
    let word;
    try {
        word = wordArray[randomIndex].Front;
    } catch (error) {
        console.log('Failed accessing wordArray');
        return false;
    }
    
    console.log(`New word sent: ${word}`);
    currentWord.innerHTML = word;
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
    timeDisplay.innerHTML = `${Math.floor(time / 60000).toString().padStart(2, '0')}:${(Math.floor((time % 60000) / 1000).toFixed(0)).padStart(2, '0')}`;
}

//Check game status
function checkStatus() {
    if(!isPlaying && time === 0) {
        message.innerHTML = 'Finished';
        document.querySelectorAll('.remove-when-finished').forEach(e => {
            e.innerHTML = null;
        });
    }
}

//Load file (txt)
function loadFileTXT(filepath) {
    let result;
    let req = new XMLHttpRequest();
    
    req.open("GET", filepath, false);
    req.send();

    if (req.status == 200) return result = req.responseText;
}

//Load file (json)
function loadFileJSON(filepath) {
    let result = [];
    fetch(filepath).then(response => response.json()).then(json => {
        for (const e of json)
            result.push(e);
    });

    console.log(`Loaded file ${filepath}`);
    return result;
}