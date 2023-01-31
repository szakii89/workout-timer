const totalRounds = 25;
const roundLength = 15;
const totalLength = totalRounds * roundLength;

// sounds
const countAllSeconds = false;
const countDown = 5;
const countUp = 5;

const countAllSecondSound = 'metronome-01';
const countDownSound = 'metronome-02';
const countUpSound = 'metronome-03';
const roundStartSound = 'beep-01';

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

const transformSeconds = seconds => {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;
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
};

const init = (totalRounds, roundLength, totalLength) => {
  currentRoundDetails.innerText = `${transformSeconds(roundLength)}`;
  intervalsDetails.innerText = `1/${totalRounds}`;
  elapsedDetails.innerText = '00:00';
  remainingDetails.innerText = `${transformSeconds(totalLength)}`;
};

let currentRound = roundLength;

init(totalRounds, roundLength, totalLength);

let seconds = 0,
  minutes = 0,
  hours = 0,
  t;

const addSeconds = () => {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }
  }

  // if (currentRound > 0) {
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
    currentRound = roundLength;

    currentRoundDetails.innerText = transformSeconds(currentRound);
    audioRoundStart.play();
  }
  currentRoundDetails.innerText = transformSeconds(currentRound);
  // }

  const html = hours
    ? `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    : `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;

  elapsedDetails.innerText = html;
  timer();
};
const timer = () => (t = setTimeout(addSeconds, 1000));
const pauseTimer = () => clearTimeout(t);
const resetTimer = () => {
  pauseTimer();
  elapsedDetails.innerText = '00:00';
  seconds = 0;
  minutes = 0;
  hours = 0;
};

/* Start button */
playBtn.addEventListener('click', timer);

/* Stop button */
pauseBtn.addEventListener('click', pauseTimer);

/* Clear button */
resetBtn.addEventListener('click', resetTimer);
