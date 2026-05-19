let timer;

let workMinutes = 25;
let breakMinutes = 5;
let longBreakMinutes = 10;

let seconds = 0;
let minutes = 25;
let milliseconds = 99;

let isPaused = false;
let isRunning = false;
let isBreak = false;

let sessionsCompleted = 0;
let totalMinutes = 0;
let totalHours = 0;

const minutesInput = document.getElementById("numOfMinutes");
const breakInput = document.getElementById("numberOfBreaks");
const longBreaksInput = document.getElementById("numberOfLongBreaks");
const hoursInput = document.getElementById("numOfHours");
const sessionElement = document.querySelector(".round");
const messageText = document.querySelector(".message-text");

const bodyElement = document.body;
const mainElement = document.querySelector("main");
const timerElement = document.querySelector(".timer");
const numberOfCounts = document.querySelector(".numberOfCounts");
const roundDisplay = document.querySelector(".round-display");
const messageDisplay = document.querySelector(".message");
const messageFocus = document.querySelector(".message-text");
const round = document.querySelector(".round");

minutesInput.addEventListener("change", () => {

    const value = Number(minutesInput.value);

    if (value <= 0 || value >= 46) {

        alert("Invalid Focus Input");

        return;
    } else {

        workMinutes = value;

        minutes = workMinutes;

        updateDisplay();
    }
});

breakInput.addEventListener("change", () => {
    const value = Number(breakInput.value);
    if (value <= 0 || value > 15) {

        alert("Break is too Long!");

        return;
    } else {
        breakMinutes = value;

        minutes = breakMinutes;

        updateDisplay();
    }
});

function defaultValue() {
    seconds = 0;
    milliseconds = 99;
}

longBreaksInput.addEventListener("change", () => {

    const value = Number(longBreaksInput.value);

    if (value < 0 || value >= 20) {

        alert("Long Break Invalid");

        return;
    } else {
        longBreakMinutes = value;

        minutes = longBreakMinutes;

        updateDisplay();
    }

});

hoursInput.addEventListener("change", () => {
    const value = Number(hoursInput.value);
    if (value < 0 || value > 8) {
        alert("Invalid Desired Duration");
    }
    totalHours = value;
});

function updateDisplay() {
    const timerElement = document.getElementById("timer");

    timerElement.textContent = formatTime(minutes, seconds, milliseconds);

}

function formatTime(minutes, seconds, milliseconds) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}

function toggleInputs(disabled) {
    minutesInput.disabled = disabled;
    breakInput.disabled = disabled;
    longBreaksInput.disabled = disabled;
    hoursInput.disabled = disabled;
}

function startTimer() {
    if (isRunning) return;

    timer = setInterval(focusMode, 10);

    isRunning = true;

    toggleInputs(true);
}

function focusMode() {
    // This Logic checks if the millisecond is greater than zero and if it is reduces it zero and then checks if it still greater than zero else it moves to the next one.
    focusColorMode();

    if (!isPaused) {

        if (milliseconds > 0) {

            milliseconds--;
        } else {
            milliseconds = 99;
            if (seconds > 0) {
                seconds--;
            } else {
                seconds = 59;
                if (minutes > 0) {
                    minutes--;
                } else {
                    clearInterval(timer);
                    switchMode();
                }
            }
        }

    }

    updateDisplay();
}

function shortBreak() {
    sessionElement.textContent = sessionsCompleted;
   
    messageText.textContent = `Time is Up! Take a break`;
    shortBreakColorMode();
    defaultValue();

    minutes = Number(breakInput.value);
}

function longBreak() {

    messageText.textContent = `Move (Stand up, stretch)`;

    defaultValue();

    minutes = Number(longBreaksInput.value);
}

function switchMode() {

    toggleInputs(false);

    clearInterval(timer);

    isRunning = false;

    isBreak = !isBreak;

    console.log("🔄 switchMode called! isBreak =", isBreak);

    if (isBreak) {

        sessionsCompleted++;

        if (sessionsCompleted % 4 === 0) {

            longBreak();

        } else {
            shortBreak();
        }
    } else {  
        
        focusColorMode();

        messageText.textContent = "Break Over! Back to work";

        defaultValue();

        minutes = Number(minutesInput.value);

        messageText.textContent = `Deep work`;

    }

    updateDisplay();
    startTimer();
}

function numHours() {
    const totalMinutes = sessionsCompleted * workMinutes;

    const focusedHours = totalMinutes / 60;

    if (focusedHours >= totalHours) {

        clearInterval(timer);

        isRunning = false;

        toggleInputs(false);

        messageText.textContent = `🎉 Goal Completed`;

    }
}

function pauseTimer() {
    const pause = document.getElementById("pause");

    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(timer);
        isRunning = false;
        pause.textContent = `Resume`;
    } else {
        pause.textContent = `Pause`;
        startTimer();
    }

}

function resetTimer() {

    clearInterval(timer);
    minutes = Number(minutesInput.value);
    defaultValue();
    isPaused = false;
    isRunning = false;
    updateDisplay();
    toggleInputs(false)
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
    isRunning = false;
    isPaused = false;
}

function focusColorMode() {

    bodyElement.classList.add('focus-mode');

    mainElement.classList.add('focus-mode-main');

    timerElement.classList.add('focus-mode-timer');

    numberOfCounts.classList.add('focus-mode-numberOfCounts');

    roundDisplay.classList.add('focus-mode-roundDisplay');

    messageDisplay.classList.add('focus-mode-message');

    messageFocus.classList.add('focus-mode-message-text');

    round.classList.add('focus-mode-round');

}

function shortBreakColorMode() {
    bodyElement.classList.add('break-mode');

    mainElement.classList.add('break-mode-main');

    timerElement.classList.add('break-mode-timer');

    numberOfCounts.classList.add('break-mode-numberOfCounts');

    roundDisplay.classList.add('break-mode-roundDisplay');

    messageDisplay.classList.add('break-mode-message');

    messageFocus.classList.add('break-mode-message-text');

    round.classList.add('focus-mode-round');
}
function longBreakColorMode() {

}