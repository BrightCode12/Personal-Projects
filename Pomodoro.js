let timer;
let seconds = 0;
let minutes = 25;
let milliseconds;
let isPaused = false;
let enteredTime = null;

/*const numOfMinute = Number(document.getElementById("numOfMinute"));
const numberOfBreaks = Number(document.getElementById("numberOfBreaks").value);
const numberOfLongBreaks = Number(document.getElementById("numberOfLongBreaks").value);
const numOfHours = Number(document.getElementById("hours"));
*/
function startTimer() {
    timer = setInterval(updateTimer, 100);
}
function updateTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = formatTime(minutes, seconds, milliseconds);
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
                    document.getElementById("Time-up").textContent = `Time is Up! Take a break`
                }
            }
        }

    }
    timerElement.textContent = `${minutes}:${seconds}:${milliseconds}`
}
function formatTime(minutes, seconds, milliseconds) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;

}

function pauseTimer() {

}
function resetTimer() {

}
function stopTimer() {

}
