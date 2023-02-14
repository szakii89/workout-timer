// ---------- Elements ----------
const settingsBtn = document.querySelector('.settings-btn');
const currentRoundDetails = document.querySelector('.current-round-details');
const elapsedDetails = document.querySelector('.elapsed-details');
const intervalsDetails = document.querySelector('.intervals-details');
const remainingDetails = document.querySelector('.remaining-details');
const playBtn = document.querySelector('.play-btn');
const pauseBtn = document.querySelector('.pause-btn');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.previous-btn');
const resetBtn = document.querySelector('.reset-btn');
const displayRounds = document.querySelector('.display-rounds');
const settings = document.querySelector('.settings');
const warmUplengthEl = document.querySelector('#warm-up-length');
const totalRoundsEl = document.querySelector('#total-rounds');
const roundLengthEl = document.querySelector('#round-length');
const countEverySecondsEl = document.querySelector('#count-every-seconds');
const countFirstSecondsEl = document.querySelector('#count-first-seconds');
const countLastSecondsEl = document.querySelector('#count-last-seconds');
const warmUplengthGroup = document.querySelector('.warm-up-length');
const totalRoundsGroup = document.querySelector('.group total-rounds');
const roundLengthGroup = document.querySelector('.group round-length');
const countEverySecondsGroup = document.querySelector('.count-every-seconds');
const countFirstSecondsGroup = document.querySelector('.count-first-seconds');
const countLastSecondsGroup = document.querySelector('.count-last-seconds');
const settingCloseBtn = document.querySelector('.settings-close');
const overlay = document.querySelector('.overlay');

// ---------- Audio ----------

const countAllSecondSound = 'metronome-19';
// const countAllSecondSound = 'blip';
// const countDownSound = 'metronome-07';
const countDownSound = 'metronome-01';
const countUpSound = 'metronome-03';
const roundStartSound = 'bell-01';

const audioCountAll = new Audio(`..\\audio\\${countAllSecondSound}.mp3`);
const audioCountDown = new Audio(`..\\audio\\${countDownSound}.mp3`);
const audioCountUp = new Audio(`..\\audio\\${countUpSound}.mp3`);
const audioRoundStart = new Audio(`..\\audio\\${roundStartSound}.mp3`);

// Play audio whet start/pause is clicked
const pause = 'ping-01';
const unpause = 'ping-01';
const audioPause = new Audio(`..\\audio\\${pause}.mp3`);
const audioUnpause = new Audio(`..\\audio\\${unpause}.mp3`);

// ---------- Variables ----------
let warmUpLength = 30;
let totalRounds = 25;
let roundLength = 120;
let totalLength = totalRounds * roundLength;

let countAllSeconds = false;
let countDown = 10;
let countUp = 0;

let currentRound = roundLength;
let totalRemaining = totalLength;
let currentInterval = 1;
let warmUpPassed = 0;
let elapsedSeconds = 0;
let t;

const showSettings = () => {
  settings.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const hideSettings = () => {
  settings.classList.add('hidden');
  overlay.classList.add('hidden');
};

// ---------- Functions ----------
const setWorkout = function (e) {
  e.preventDefault();
  warmUpLength = warmUplengthEl.value * 1;
  totalRounds = totalRoundsEl.value * 1;
  roundLength = roundLengthEl.value * 1;
  totalLength = totalRounds * roundLength;

  countAllSeconds = countEverySecondsEl.checked ? true : false;
  countDown = countLastSecondsEl.value * 1;
  countUp = countFirstSecondsEl.value * 1;

  currentRound = roundLength;
  totalRemaining = totalLength;
  currentInterval = 1;
  warmUpPassed = 0;
  displayRoundsFunction();
  // init(totalRounds, roundLength, totalLength);
  resetTimer();
  resetSettings();
  hideSettings();
};

// Disable / Enable count first and last 'n' seconds options visibility
const toggleSecondsOption = function () {
  if (this.checked) {
    countFirstSecondsEl.disabled = true;
    countLastSecondsEl.disabled = true;
    console.log('Checkbox is checked..');
  } else {
    countFirstSecondsEl.disabled = false;
    countLastSecondsEl.disabled = false;
    console.log('Checkbox is not checked..');
  }
};

// Transform seconds
const transformSeconds = (seconds, displaySettings = 'auto') => {
  // IDEA - transformSeconds(seconds,'secs') to display ss
  // IDEA - transformSeconds(seconds,'mins') to display mm:ss
  // IDEA - transformSeconds(seconds,'hrs') to display hh:mm:ss

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

// Display rounds as small rectangles
const displayRoundsFunction = () => {
  let boxes = 0;
  let html = '';
  if (warmUpLength) {
    boxes = 1;
    html = `<div class="box box--warm-up box-0" >
    <span class="box-info">Warm Up
    ${transformSeconds(warmUpLength)}</span>
    </div>`;
  }
  let startCounting = boxes;
  boxes += totalRounds;
  for (let i = startCounting; i < boxes; i++) {
    html += `<div class="box box--round box-${i}">
    <span class="box-info">Round ${i}
    ${transformSeconds(roundLength)}</span>
    </div>`;
  }

  displayRounds.innerHTML = html;
  displayRounds.style.gridTemplateColumns = `repeat(${boxes}, 1fr)`;
  if (boxes <= 6) {
    displayRounds.style.gridGap = '8px';
  } else if (boxes > 6 && boxes <= 11) {
    displayRounds.style.gridGap = '5px';
  } else if (boxes > 11 && boxes <= 31) {
    displayRounds.style.gridGap = '3px';
  } else {
    displayRounds.style.gridGap = '1px';
  }
};

// Count seconds
const addSeconds = () => {
  // If warm up is going display Warm Up and the show the warm up (how many secs left), If the workout is going show the round number and the remaining secs of the current round
  if (warmUpLength > warmUpPassed) {
    document.querySelector('.box-0').classList.add('box--active');
    currentRoundDetails.innerText = transformSeconds(
      warmUpLength - warmUpPassed
    );
    warmUpPassed++;
    if (warmUpLength === warmUpPassed) {
      intervalsDetails.innerText = `${currentInterval}/${totalRounds}`;
      document.querySelector('.box-0').classList.remove('box--active');
      audioRoundStart.play();
    }
  } else {
    elapsedSeconds++;
    totalRemaining--;
    currentRound--;

    if (currentRound > 0) {
      document
        .querySelector(`.box-${currentInterval}`)
        .classList.add('box--active');
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
      document
        .querySelector(`.box-${currentInterval}`)
        .classList.remove('box--active');
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
    elapsedDetails.innerText =
      totalLength >= 3600
        ? transformSeconds(elapsedSeconds, 'hrs')
        : totalLength < 3600 && totalLength >= 60
        ? transformSeconds(elapsedSeconds, 'mins')
        : transformSeconds(elapsedSeconds, 'secs');
    remainingDetails.innerText =
      totalLength >= 3600
        ? transformSeconds(totalRemaining, 'hrs')
        : totalLength < 3600 && totalLength >= 60
        ? transformSeconds(totalRemaining, 'mins')
        : transformSeconds(totalRemaining, 'secs');
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

// Pause function
const pauseClick = function () {
  playBtn.classList.toggle('hidden');
  pauseBtn.classList.toggle('hidden');
  // audioPause.play();
  pauseTimer();
};

// Play function
const playClick = function () {
  playBtn.classList.toggle('hidden');
  pauseBtn.classList.toggle('hidden');
  // audioUnpause.play();
  timer();
};

const nextRound = () => {
  console.log('next');
};

const prevRound = () => {
  console.log('prev');
};

// Reset settings
const resetSettings = () => {
  warmUplengthEl.value = '';
  totalRoundsEl.value = '';
  roundLengthEl.value = '';
  countEverySecondsEl.checked = false;
  countLastSecondsEl.value = '';
  countFirstSecondsEl.value = '';
  countFirstSecondsEl.disabled = false;
  countLastSecondsEl.disabled = false;
};

// Initial function
const init = (totalRounds, roundLength, totalLength) => {
  currentRoundDetails.innerText = `${
    warmUpLength
      ? transformSeconds(warmUpLength)
      : transformSeconds(roundLength)
  }`;
  intervalsDetails.innerText = `${warmUpLength ? 0 : 1}/${totalRounds}`;
  elapsedDetails.innerText = `${
    totalLength >= 3600
      ? transformSeconds(0, 'hrs')
      : totalLength < 3600 && totalLength >= 60
      ? transformSeconds(0, 'mins')
      : transformSeconds(0, 'secs')
  }`;
  remainingDetails.innerText = `${
    totalLength >= 3600
      ? transformSeconds(totalLength, 'hrs')
      : totalLength < 3600 && totalLength >= 60
      ? transformSeconds(totalLength, 'mins')
      : transformSeconds(totalLength, 'secs')
  }`;
  document.querySelectorAll('.box').forEach(el => {
    el.classList.remove('box--active');
  });
};

// ---------- Event Listeners ----------
// Set Workout
settings.addEventListener('submit', setWorkout);

//  Start button
playBtn.addEventListener('click', playClick);

//  Pause button
pauseBtn.addEventListener('click', pauseClick);

//  Stop button
resetBtn.addEventListener('click', resetTimer);

// Next button
nextBtn.addEventListener('click', nextRound);

// Prev Button
prevBtn.addEventListener('click', prevRound);

// Show Settings
settingsBtn.addEventListener('click', showSettings);

// Hide Settings
settingCloseBtn.addEventListener('click', hideSettings);

//
countEverySecondsEl.addEventListener('change', toggleSecondsOption);

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !settings.classList.contains('hidden')) {
    hideSettings();
  } else if (e.key === 's' && settings.classList.contains('hidden')) {
    showSettings();
  } else if (e.key === 's' && !settings.classList.contains('hidden')) {
    hideSettings();
  } else if (e.key === ' ' && playBtn.classList.contains('hidden')) {
    pauseClick();
  } else if (e.key === ' ' && !playBtn.classList.contains('hidden')) {
    playClick();
  }
});

// Init
displayRoundsFunction();
init(totalRounds, roundLength, totalLength);

// TODO - Justify checkbox in settings to left

// TODO - Implement next/prev buttons

// IDEA - Implement named workouts, that's probably backend
// TODO - Create a description in the current round
