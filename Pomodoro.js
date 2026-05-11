let timer;
let seconds = 0;
let minutes = 25;
let milliseconds = 99;
let isPaused = false;
let isRunning = false;
let isBreak = false;

const minutesInput = document.getElementById("numOfMinutes");
const breakInput = document.getElementById("numberOfBreaks");
const longBreaksInput = document.getElementById("numberOfLongBreaks");
const hoursInput = document.getElementById("numOfHours");


minutesInput.addEventListener("change", () => {
    minutes = Number(minutesInput.value);
    const timerElement = document.getElementById("timer");
    timerElement.textContent = `${minutes}:${seconds}:${milliseconds}`;
    timerElement.textContent = formatTime(minutes, seconds, milliseconds);
    startTimer();
});

breakInput.addEventListener("change", () => {
    minutes = Number(breakInput.value);
    seconds = 0;
    milliseconds = 99;
    timerElement.textContent = formatTime(minutes, seconds, milliseconds);
});

breakInput.addEventListener("change", () => {
    minutes = Number(breakInput.value);
    seconds = 0;
    milliseconds = 99;
    timerElement.textContent = formatTime(minutes, seconds, milliseconds);
});

function startTimer() {

    if (isRunning) return;

    timer = setInterval(updateTimer, 10);

    isRunning = true;
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
    timerElement.textContent = formatTime(minutes, seconds, milliseconds);
}
function formatTime(minutes, seconds, milliseconds) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;

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
    minutesInput.addEventListener("input", () => {
        minutes = Number(minutesInput.value);
        seconds = 0;
        milliseconds = 99;
    });
    seconds = 0;
    milliseconds = 99;
    isPaused = false;
    isRunning = false;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = formatTime(minutes, seconds, milliseconds);
}
function stopTimer() {
    clearInterval(timer);
    timer = null;
    isRunning = false;
    isPaused = false;
}
function switchMode() {

    clearInterval(timer);
    isRunning = false;
    isBreak = !isBreak;
    const currentState = document.getElementById("currentState");
    const timeUp = document.getElementById("timeUp");
    console.log("🔄 switchMode called! isBreak =", isBreak);

    if (isBreak) {
        alert(`Time is Up! Take a break`);

        minutes = Number(breakInput.value);

    } else {
        alert("Break Over! Back to work");

        minutes = Number(minutesInput.value);

    }

    seconds = 0;
    milliseconds = 99;

    const timerElement = document.getElementById("timer");

    timerElement.textContent = formatTime(minutes, seconds, milliseconds);

    startTimer();
}