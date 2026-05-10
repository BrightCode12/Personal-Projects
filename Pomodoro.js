let timer;
let seconds = 0;
let minutes = 10;
let milliseconds;
let isPaused = false;
let isRunning = false;
let enteredTime = null;

/*const numOfMinute = Number(document.getElementById("numOfMinute"));
const numberOfBreaks = Number(document.getElementById("numberOfBreaks").value);
const numberOfLongBreaks = Number(document.getElementById("numberOfLongBreaks").value);
const numOfHours = Number(document.getElementById("hours"));
*/
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
                    document.getElementById("timeUp").textContent = `Time is Up! Take a break`
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
    const Pause = document.getElementById("pause");

    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(timer);

        isRunning = false;

        Pause.textContent = `Resume`;
    } else {

        Pause.textContent = `Pause`;

        startTimer();
    }

}
function resetTimer() {
    clearInterval(timer);
    seconds = 0
    minutes = 10;
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
