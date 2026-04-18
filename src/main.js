'use strict';

import MajorWords from 'major-words';
import MersenneTwister from 'mersenne-twister';

const MILLISECONDS_PER_DAY = 86400000;
const NUMBER_GENERATOR = new MersenneTwister(daysSinceUnixEpoch());
const DANS_FILEPATH = 'dans.txt';
const CATEGORY_PATTERN = '\\[\\w+]';
const PALETTE_NAMES = [
  'cant-buy-a-thrill', 'countdown-to-ecstasy', 'pretzel-logic', 'katy-lied', 'the-royal-scam', 'aja', 'gaucho',
  'gold', 'the-nightfly', 'remastered', 'two-against-nature', 'everything-must-go'
];
const FADE_IN_ANIMATION_CLASS = 'fade-in';
const APP_EL = document.getElementById('app');
const DAILY_DAN_EL = document.getElementById('daily-dan');

addPalette();
renderDan();
fadeIn(APP_EL);
fadeIn(DAILY_DAN_EL, 1000);

function addPalette() {
  APP_EL.classList.add(randomPalette());
}

async function renderDan() {
  DAILY_DAN_EL.innerText = await dailyDan();
}

async function dailyDan() {
  const randomDan = randomElement(await dans());
  return danWithWordsInserted(randomDan);
}

async function dans() {
  return fetch(DANS_FILEPATH)
    .then(response => response.text())
    .then(text => text.split('\n\n'));
}

function danWithWordsInserted(dan) {
  for (const match of dan.matchAll(RegExp(CATEGORY_PATTERN, 'g'))) {
    const unparsedCategory = match[0];
    const category = unparsedCategory.replace(/[\[\]]/g, ''); // remove square brackets
    dan = dan.replace(RegExp(CATEGORY_PATTERN), randomWord(category));
  }

  return dan;
}

function randomWord(category) {
  return randomElement(MajorWords[category]);
}

function randomPalette() {
  return randomElement(PALETTE_NAMES);
}

function fadeIn(el, delayMs = 0) {
  setTimeout(() => {
    el.classList.add(FADE_IN_ANIMATION_CLASS);
    el.hidden = false;
  }, delayMs);
}

function daysSinceUnixEpoch() {
  return Math.floor(Date.now() / MILLISECONDS_PER_DAY);
}

function randomElement(array) {
  return array[randomInt(array.length)];
}

function randomInt(max) {
  return Math.floor(NUMBER_GENERATOR.random() * max);
}
