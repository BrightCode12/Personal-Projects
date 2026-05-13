let timer;
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
    const timerElement = document.getElementById("timer");
    timerElement.textContent = formatTime(minutes, seconds, milliseconds);
});

longBreaksInput.addEventListener("change", () => {
    minutes = Number(longBreaksInput.value);
    seconds = 0;
    milliseconds = 99;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = formatTime(minutes, seconds, milliseconds);
});

hoursInput.addEventListener("change", () => {
    totalNumberHours = Number(hoursInput.value);
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
    minutes = Number(minutesInput.value);
    seconds = 0;
    milliseconds = 99;
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

    totalTime = (sessionsCompleted * Number(minutesInput.value)) + (totalBreaks * Number(breakInput.value)) + (numberOfRounds * Number(longBreaksInput.value));

    if (totalTime >= totalNumberHours * 60) {
        clearInterval(timer)
        alert("Goal Completed");
    } else {
        if (isBreak) {

            sessionsCompleted++;

            if (sessionsCompleted % 4 === 0) {

                numberOfRounds++;

                const roundsElement = document.querySelector(".rounds");

                roundsElement.textContent = numberOfRounds;

                const sessionElement = document.querySelector(".count");

                sessionElement.textContent = sessionsCompleted;

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

        seconds = 0;
        milliseconds = 99;

        const timerElement = document.getElementById("timer");

        timerElement.textContent = formatTime(minutes, seconds, milliseconds);

        startTimer();
    }
}
