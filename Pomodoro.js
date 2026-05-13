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
let numberOfRounds = 0;
let totalBreaks = 0;
let totalNumberHours = 0;
let totalTime = 0;

const minutesInput = document.getElementById("numOfMinutes");
const breakInput = document.getElementById("numberOfBreaks");
const longBreaksInput = document.getElementById("numberOfLongBreaks");
const hoursInput = document.getElementById("numOfHours");


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


longBreaksInput.addEventListener("change", () => {

    const value = Number(longBreaksInput.value);

    if (value < 0 || value >= 20) {

        alert("Long Break Invalid");

        return;
    } else {
        longBreakMinutes = value;

        minutes = breakMinutes;

        updateDisplay();
    }

});

hoursInput.addEventListener("change", () => {

    if (value < 0 || value > 8) {
        alert("Invalid Desired Duration");
    }
    totalNumberHours = Number(hoursInput.value);
});

function updateDisplay() {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = `${minutes}:${seconds}:${milliseconds}`;
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

    timer = setInterval(updateTimer, 10);

    isRunning = true;

    toggleInputs(true);
}

function updateTimer() {
    const timerElement = document.getElementById("timer");

    // This Logic checks if the millisecond is greater than zero and if it is reduces it zero and then checks if it still greater than zero else it moves to the next one.

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
    seconds = 0;
    milliseconds = 99;
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

function switchMode() {

    toggleInputs(true);

    clearInterval(timer);

    isRunning = false;

    isBreak = !isBreak;

    console.log("🔄 switchMode called! isBreak =", isBreak);


    if (isBreak) {

        sessionsCompleted++;

        if (sessionsCompleted % 4 === 0) {

            numberOfRounds++;

            const roundsElement = document.querySelector(".rounds");

            roundsElement.textContent = numberOfRounds;

            const sessionElement = document.querySelector(".count");

            alert(`You've finished 🍅🍅🍅🍅 2 hours of focused work! You've earned a long break.`);

            minutes = Number(longBreaksInput.value);

        } else {
            totalBreaks++;

            const sessionElement = document.querySelector(".count");

            sessionElement.textContent = sessionsCompleted;

            alert(`Time is Up! Take a break`);

            minutes = Number(breakInput.value);
        }
    } else {
        alert("Break Over! Back to work");

        minutes = Number(minutesInput.value);

    }

    updateDisplay();
    startTimer();
}

