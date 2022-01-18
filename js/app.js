//! CLASS
import Timer from "./timer.js";
import { languages } from "./languages.js";

//! VARIABLES DECLARATION

const languageBtn = document.querySelector(".language-click");
const showLanguage = document.querySelectorAll(".language");
const settingsBtn = document.querySelector(".settings-btn");
const closeBtn = document.querySelector(".close-btn");
const settingsMenu = document.querySelector(".settings-menu");
const modal = document.querySelector(".modal");
const app = document.querySelector(".app");
let root = document.documentElement;
let lang = "en";
let endTimer = "0";
let reload = true;
let newTimer = new Timer(endTimer, reload, lang);
const colorText = document.querySelectorAll(".text");
//? COLORS
const mainColors = ["358", "145", "60", "231", "18"];
//? SOUNDS
const music = new Audio("./Sounds/lofi.m4a");
music.volume = 0.02;

//! EVENT LISTENERS

app.addEventListener("click", callEvent);
settingsBtn.addEventListener("click", () => {
  settingsMenu.classList.toggle("active");
  modal.classList.toggle("active");
});
closeBtn.addEventListener("click", () => {
  settingsMenu.classList.toggle("active");
  modal.classList.toggle("active");
});
settingsMenu.addEventListener("click", translate);
languageBtn.addEventListener("click", () => {
  showLanguage.forEach((element) => {
    element.classList.toggle("active");
  });
});
colorText.forEach((element, index) => {
  let i = index;
  element.addEventListener("click", () => {
    localStorage.setItem("current color", mainColors[i]);
    location.reload();
  });
});
window.addEventListener("load", () => {
  let currentColor = localStorage.getItem("current color");
  root.style.setProperty("--main-color", currentColor);
});

//! FUNCTIONS

function callEvent(e) {
  let event = e.target.innerText;
  if (event === languages[lang]["start"]) {
    newTimer.startTimer();
    setTimeout(() => {
      playRandomMusic();
    }, 300);
    playClick();
  } else if (event === languages[lang]["stop"]) {
    newTimer.callPauseTimer();
    music.pause();
    playClick();
  } else if (event === languages[lang]["resume"]) {
    newTimer.callResume();
    unpause();
    playClick();
  } else if (event === languages[lang]["focus_mode"]) {
    newTimer.callFocus();
    music.pause();
  } else if (event === languages[lang]["break_mode"]) {
    newTimer.callBreak();
    music.pause();
  } else if (event === languages[lang]["fast_forward"]) {
    newTimer.callFastForward();
    music.pause();
  } else if (event === languages[lang]["restart"]) {
    newTimer.callRestart();
    music.pause();
  }
}

function translate(e) {
  const translatedWords = document.querySelectorAll(".lang");
  let x;
  if (e.target.innerText === "Italian") {
    x = "it";
  } else if (e.target.innerText === "English") {
    x = "en";
  } else {
    return;
  }
  translatedWords.forEach((element) => {
    let key = element.id;
    element.innerText = languages[x][key];
  });
  lang = x;
  document.documentElement.setAttribute("lang", x);
}

function playRandomMusic() {
  if (newTimer.isFocus === false) return;
  let random = Math.floor(Math.random() * 6000);
  music.currentTime = random;
  music.play();
}
function unpause() {
  if (newTimer.isFocus === false) return;
  music.play();
}

function playClick() {
  const click = new Audio("./Sounds/click.mp3");
  click.volume = 0.1;
  click.preload = "auto";
  click.load();
  let clickSound = click.cloneNode();
  clickSound.volume = 0.1;
  clickSound.play();
}
