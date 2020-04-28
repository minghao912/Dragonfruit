window.addEventListener('load', init);

//Globals
let time = 10000;   //Start with 60 seconds
let score = 0;
let isPlaying;

//DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');

const words = [
    'test',
    'abc',
    'change',
    'later'
];

//Initialize Game
function init() {
    //Get word
    showWord(words);

    //Start timer - run every 100ms
    setInterval(countdown, 100);

    //Check game status
    setInterval(checkStatus, 50);
}

//Pick and display random word
function showWord(wordArray) {
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    currentWord.innerHTML = wordArray[randomIndex]; //Output the random word to the 'currentWord' element
}

//Timer
function countdown() {
    //Check time valid
    if(time > 0) {
        time -= 100;    //Decrement time by 100ms
    } else if(time === 0) {
        isPlaying = false;  //Game Over
    }

    //Show time and formatting
    timeDisplay.innerHTML = `${Math.floor(time / 60000).toString().padStart(2, '0')}:${(Math.floor((time % 60000) / 1000).toFixed(0)).padStart(2, '0')}`;
}

//Check game status
function checkStatus() {
    if(!isPlaying && time === 0) message.innerHTML = 'Finished';
}