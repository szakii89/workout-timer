const warmUpLength = 3;
const totalRounds = 5;
const roundLength = 5;
const totalLength = totalRounds * roundLength;

// sounds
const countAllSeconds = false;
const countDown = 20;
const countUp = 0;

const countAllSecondSound = 'metronome-01';
// const countDownSound = 'metronome-07';
const countDownSound = 'metronome-01';
const countUpSound = 'metronome-03';
const roundStartSound = 'bell-01';

const audioCountAll = new Audio(`..\\audio\\${countAllSecondSound}.mp3`);
const audioCountDown = new Audio(`..\\audio\\${countDownSound}.mp3`);
const audioCountUp = new Audio(`..\\audio\\${countUpSound}.mp3`);
const audioRoundStart = new Audio(`..\\audio\\${roundStartSound}.mp3`);

// Elements
const currentRoundDetails = document.querySelector('.current-round');
const elapsedDetails = document.querySelector('.elapsed-details');
const intervalsDetails = document.querySelector('.intervals-details');
const remainingDetails = document.querySelector('.remaining-details');
const playBtn = document.querySelector('.play-btn');
const pauseBtn = document.querySelector('.pause-btn');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.previous-btn');
const resetBtn = document.querySelector('.reset-btn');

// Transform seconds
// IDEA - transformSeconds(seconds,'secs') to display ss
// IDEA - transformSeconds(seconds,'mins') to display mm:ss
// IDEA - transformSeconds(seconds,'hrs') to display hh:mm:ss

const transformSeconds = (seconds, displaySettings = 'auto') => {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;
  if (displaySettings === 'secs') {
    return `${remainingSeconds.toString().padStart(2, '0')}`;
  } else if (displaySettings === 'mins') {
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  } else if (displaySettings === 'hrs') {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    if (hours) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else if (minutes) {
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`;
    } else {
      return `${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }
};

const init = (totalRounds, roundLength, totalLength) => {
  currentRoundDetails.innerText = `${
    warmUpLength
      ? transformSeconds(warmUpLength)
      : transformSeconds(roundLength)
  }`;
  intervalsDetails.innerText = `${warmUpLength ? 0 : 1}/${totalRounds}`;
  elapsedDetails.innerText = `${transformSeconds(0, 'mins')}`;
  remainingDetails.innerText = `${transformSeconds(totalLength, 'mins')}`;
};

let currentRound = roundLength;
let totalRemaining = totalLength;
let currentInterval = 1;
let warmUpPassed = 0;

init(totalRounds, roundLength, totalLength);

let elapsedSeconds = 0,
  t;

const addSeconds = () => {
  // TODO - Create a description in the current round
  // If warm up is going display Warm Up and the show the warm up (how many secs left), If the workout is going show the round number and the remaining secs of the current round
  // TODO - First Show The Warm Up if the app is starting
  if (warmUpLength > warmUpPassed) {
    currentRoundDetails.innerText = transformSeconds(
      warmUpLength - warmUpPassed
    );
    warmUpPassed++;
    console.log(currentRoundDetails);
    console.log(warmUpPassed);
    if (warmUpLength === warmUpPassed) {
      intervalsDetails.innerText = `${currentInterval}/${totalRounds}`;
      audioRoundStart.play();
    }
  } else {
    elapsedSeconds++;
    totalRemaining--;
    currentRound--;

    if (currentRound > 0) {
      if (countAllSeconds) {
        audioCountAll.play();
      } else {
        if (currentRound < countDown) {
          audioCountDown.play();
        }
        if (currentRound >= roundLength - countUp) {
          audioCountUp.play();
        }
      }
    } else if (currentRound <= 0) {
      currentInterval++;
      currentRound = roundLength;
      // the ternary operator is for not increase the interval if the workout is over
      intervalsDetails.innerText = `${
        currentInterval < totalRounds ? currentInterval : totalRounds
      }/${totalRounds}`;

      currentRoundDetails.innerText = transformSeconds(currentRound);
      audioRoundStart.play();
    }
    currentRoundDetails.innerText = transformSeconds(currentRound);
    elapsedDetails.innerText = transformSeconds(elapsedSeconds, 'mins');
    remainingDetails.innerText = transformSeconds(totalRemaining, 'mins');
  }

  if (totalRemaining === 0) {
    console.log(totalRemaining);
    clearInterval(t);
  } else {
    timer();
  }
};

const timer = () => (t = setTimeout(addSeconds, 1000));
const pauseTimer = () => clearTimeout(t);
const resetTimer = () => {
  pauseTimer();
  init(totalRounds, roundLength, totalLength);
  elapsedSeconds = 0;
  warmUpPassed = 0;
  playBtn.classList.remove('hidden');
  pauseBtn.classList.add('hidden');
};

// TODO - Toggle pause and play

//  Start button
playBtn.addEventListener('click', function () {
  playBtn.classList.toggle('hidden');
  pauseBtn.classList.toggle('hidden');
  timer();
});

//  Pause button
pauseBtn.addEventListener('click', function () {
  playBtn.classList.toggle('hidden');
  pauseBtn.classList.toggle('hidden');
  pauseTimer();
});

//  Stop button
resetBtn.addEventListener('click', resetTimer);
