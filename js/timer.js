import { languages } from "./languages.js";
//! CLASS

const timer = document.querySelector(".timer");
const start = document.querySelector(".start");
let root = document.documentElement;
const colorText = document.querySelectorAll(".text");
let currColorIndex =
  localStorage.getItem("index") === null ? 0 : localStorage.getItem("index");

const music = new Audio("./Sounds/lofi.m4a");
music.volume = 0.02;

export default class Timer {
  constructor(endTimer, reload, currColorIndex) {
    this.endTimer = endTimer;
    this.reload = reload;
    this.isFocus = true;
    this.lang = document.documentElement.lang;
    this.currColorIndex = currColorIndex;
  }

  startTimer() {
    if (this.isFocus === true) {
      this.endTimer = new Date().getTime() + 1500000;
    } else if (this.isFocus === false) {
      this.endTimer = new Date().getTime() + 300000;
    }
    this.reload = false;
    this.displayTime();
  }

  displayTime() {
    let now = new Date().getTime();
    this.remainingTime = this.endTimer - now;
    let minutes = Math.floor(this.remainingTime / 1000 / 60);
    let seconds = Math.floor((this.remainingTime / 1000) % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    timer.innerHTML = `<h1>${minutes}:${seconds}</h1>`;
    start.innerHTML = `
    <p class="lang no-pointer-event" id="stop" lang=${this.lang}>${
      languages[this.lang]["stop"]
    }</p>
          <i class="fas fa-pause"></i>
      `;
    if (this.reload === false) {
      this.startInterval();
      this.reload = true;
    }
    if (this.remainingTime < 0) {
      timer.innerHTML = `<h1>00:00</h1>`;
      music.pause();
      this.clearInterval();
      if (this.isFocus === true) {
        start.innerHTML = `
        ${languages[this.lang]["break_mode"]}
          <i class="fas fa-bed"></i>
      `;
      } else if (this.isFocus === false) {
        start.innerHTML = `
        ${languages[this.lang]["focus_mode"]}
          <i class="fas fa-brain"></i>
      `;
      }
    }
  }

  callResume() {
    let currTime = new Date().getTime();
    let elapsedTime = currTime - this.pausedTime;
    this.endTimer += elapsedTime;
    this.displayTime();
  }

  startInterval() {
    this.interval = setInterval(() => this.displayTime(), 100);
  }

  clearInterval() {
    clearInterval(this.interval);
  }

  callPauseTimer() {
    this.clearInterval();
    this.reload = false;
    start.innerHTML = `
    <p class="lang" id="resume" lang=${this.lang}>${
      languages[this.lang]["resume"]
    }</p>
          <i class="fas fa-play"></i>
      `;
    let pausedTime = new Date().getTime();
    this.pausedTime = pausedTime;
    localStorage.setItem("currentTimeLeft", this.remainingTime);
  }

  callFocus() {
    if (this.isFocus === false || this.endTimer === "0") {
      this.endTimer = new Date().getTime() + 1500000;
      this.callPauseTimer();
      start.innerHTML = `<p class="lang" id="start" lang=${this.lang}>${
        languages[this.lang]["start"]
      }</p>
        <i class="fas fa-play"></i>`;
      timer.innerHTML = `<h1>25:00</h1>`;
      this.checkTheme("main");
      root.style.setProperty("--main-color", this.mainColor);
    }
    this.isFocus = true;
  }

  callBreak() {
    if (this.isFocus === true || this.endTimer === "0") {
      this.endTimer = new Date().getTime() + 300000;
      this.callPauseTimer();
      this.checkLanguage();
      start.innerHTML = `<p class="lang" id="start" lang=${this.lang}>${
        languages[this.lang]["start"]
      }</p>
        <i class="fas fa-play"></i>`;
      timer.innerHTML = `<h1>05:00</h1>`;
      this.checkTheme("secondary");
      root.style.setProperty("--main-color", this.mainColor);
    }
    this.isFocus = false;
  }

  callFastForward() {
    if (timer.innerHTML === `25:00` || timer.innerHTML === `05:00`) return;
    this.endTimer = "0";
    this.displayTime();
  }

  callRestart() {
    this.endTimer = "0";
    this.displayTime();
    if (this.isFocus === true) {
      this.callFocus();
    } else {
      this.callBreak();
    }
  }

  checkLanguage() {
    this.lang = root.lang;
    return this.lang;
  }

  checkTheme(theme) {
    console.log(currColorIndex);
    const mainColors = ["358", "145", "60", "231", "18"];
    const secondaryColors = ["194", "283", "283", "50", "230"];
    let mainColor;
    if (theme === "main") {
      mainColor = mainColors[currColorIndex];
    } else if (theme === "secondary") {
      mainColor = secondaryColors[currColorIndex];
    }
    this.mainColor = mainColor;
  }
}

colorText.forEach((element, index) => {
  element.addEventListener("click", () => {
    currColorIndex = index;
    localStorage.setItem("index", currColorIndex);
  });
});
