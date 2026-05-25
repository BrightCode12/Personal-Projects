let timer;
let mode = "pomodoro";

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

const settingsBtn = document.getElementById("settingBtn");
const popMenu = document.getElementById("popMenu");
const closeBtn = document.getElementById("close-btn");


const toggleMode = document.getElementById("toggleMode");
const modeText = document.getElementById("mode");
const currentState = document.getElementById("currentState");

settingsBtn.addEventListener("click", () => {
    popMenu.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    popMenu.classList.remove("active");
})

popMenu.addEventListener("click", (e) => {
    if (e.target === popMenu) {
        popMenu.classList.remove("active");
    }
});

toggleMode.addEventListener("change", () => {

    clearInterval("timer");
    isRunning = false;
    isPaused = false;

    if (toggleMode.checked) {
        mode = "timer";
        modeText.textContent = "Timer Mode";
        currentState.textContent = "Timer Mode";
        const timerElement = document.getElementById("timer");
        timerElement.textContent = "00:00:00";

        minutes = 0;
        seconds = 0;
        milliseconds = 0;

    } else {

        mode = "pomodoro";
        modeText.textContent = "Focus Mode";
        currentState.textContent = "Focus Mode";

        minutes = workMinutes;
        seconds = 0;
    }
    updateDisplay();
});

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

        updateDisplay();
    }
})


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
    if (mode === "pomodoro") {
        return
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
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

    if (mode === "pomodoro") {

        timer = setInterval(focusMode, 1000);
    } else {

        timer = setInterval(normalTimerMode, 10);
    }

    isRunning = true;

    toggleInputs(true);
}

function normalTimerMode() {
    if (!isPaused) {

        milliseconds++;

        if (milliseconds > 99) {

            milliseconds = 0;
            seconds++;

            if (seconds > 59) {
                seconds = 0;
                minutes = 0;
            }
        }
    }
    updateDisplay();
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

    minutes = breakMinutes;
}

function longBreak() {

    sessionsCompleted++;

    messageText.textContent = `Move (Stand up, stretch)`;

    defaultValue();
    clearModes();
    longBreakColorMode();


    minutes = longBreakMinutes;

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
        clearModes();
        focusColorMode();

        minutes = workMinutes;

        defaultValue();

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

        clearModes();

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
    sessionsCompleted = 0;
    minutes = Number(minutesInput.value);
    clearModes();
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

    round.classList.add('break-mode-round');
}

function longBreakColorMode() {
    bodyElement.classList.add('long-break-mode');

    mainElement.classList.add('long-break-mode-main');

    timerElement.classList.add('long-break-mode-timer');

    numberOfCounts.classList.add('long-break-mode-numberOfCounts');

    roundDisplay.classList.add('long-break-mode-roundDisplay');

    messageDisplay.classList.add('long-break-mode-message');

    messageFocus.classList.add('long-break-mode-message-text');

    round.classList.add('long-break-mode-round');
}

function clearModes() {

    bodyElement.classList.remove(
        "focus-mode",
        "break-mode",
        "long-break-mode"
    );

    mainElement.classList.remove(
        "focus-mode-main",
        "break-mode-main",
        "long-break-mode-main"
    );

    timerElement.classList.remove(
        "focus-mode-timer",
        "break-mode-timer",
        "long-break-mode-timer"
    );

    numberOfCounts.classList.remove(
        "focus-mode-numberOfCounts",
        "break-mode-numberOfCounts",
        "long-break-mode-numberOfCounts"
    );


    roundDisplay.classList.remove(
        "focus-mode-roundDisplay",
        "break-mode-roundDisplay",
        "long-break-mode-roundDisplay"
    );

    messageDisplay.classList.remove(
        "focus-mode-message",
        "break-mode-message",
        "long-break-mode-message"
    );

    messageFocus.classList.remove(
        "focus-mode-message-text",
        "break-mode-message-text",
        "long-break-mode-message-text"
    );

    round.classList.remove(
        "focus-mode-round",
        "break-mode-round",
        "long-break-mode-round"
    );
}