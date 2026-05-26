let timer;

let workMinutes = 25;
let breakMinutes = 5;
let longBreakMinutes = 10;

let seconds = 0;
let minutes = 25;

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
const errorMenu = document.getElementById("error-menu");

const settingsBtn = document.getElementById("settingBtn");
const popMenu = document.getElementById("popMenu");
const closeBtn = document.getElementById("close-btn");


const toggleInputsBtn = document.getElementById("toggleInputBtn");

settingsBtn.addEventListener("click", () => {
    popMenu.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    popMenu.classList.remove("active");
    savedInputs();
    loadInputs();
})

popMenu.addEventListener("click", (e) => {
    if (e.target === popMenu) {
        popMenu.classList.remove("active");
        savedInputs();
        loadInputs();
    }
});


minutesInput.addEventListener("change", () => {

    workMinutes = Number(minutesInput.value);
    minutes = workMinutes;
    savedInputs();
    updateDisplay();
});

breakInput.addEventListener("change", () => {

    if (!validateInputs()) return;
    breakMinutes = Number(breakInput.value);
    minutes = breakMinutes;
    savedInputs();
    updateDisplay();
});

longBreaksInput.addEventListener("change", () => {

    if (!validateInputs()) return;
    longBreakMinutes = Number(longBreaksInput.value);
    savedInputs();
    updateDisplay();
});

hoursInput.addEventListener("change", () => {

    if (!validateInputs()) return;
    totalHours = Number(hoursInput.value);
    savedInputs();
});

function validateInputs() {
    const minutes = Number(minutesInput.value);
    const breaks = Number(breakInput.value);
    const longBreak = Number(longBreaksInput.value);
    const hours = Number(hoursInput.value);

    if (minutes <= 0 || minutes > 45) {
        errorMenu.textContent = "Focus minutes must be between 1 and 45";
        return false;
    }

    if (breaks <= 0 || breaks > 30) {
        errorMenu.textContent = "Break time must be between 1 and 30";
        return false;
    }

    if (longBreak <= 0 || longBreak > 60) {
        errorMenu.textContent = "Long break must be between 1 and 60";
        return false;
    }

    if (hours < 0 || hours > 8) {
        errorMenu.textContent = "Hours must be between 0 and 8";
        return false;
    }

    return true;
}

function defaultValue() {
    seconds = 0;
}

function savedInputs() {

    if (!validateInputs()) return;

    const inputs = {
        minutes: minutesInput.value,
        breaks: breakInput.value,
        longBreak: longBreaksInput.value,
        hour: hoursInput.value
    };

    localStorage.setItem(
        "timerInputs",
        JSON.stringify(inputs)
    );
}

function loadInputs() {
    const savedInputs = JSON.parse(localStorage.getItem("timerInputs"));

    if (!savedInputs) return;

    minutesInput.value = savedInputs.minutes;
    breakInput.value = savedInputs.breaks;
    longBreaksInput.value = savedInputs.longBreak;
    hoursInput.value = savedInputs.hour;

    workMinutes = Number(savedInputs.minutes);
    breakMinutes = Number(savedInputs.breaks);
    longBreakMinutes = Number(savedInputs.longBreak);
    totalHours = Number(savedInputs.hour);



    if (isBreak) {
        minutes = breakMinutes;
    } else {
        minutes = workMinutes;
    }
    updateDisplay();
}

function updateDisplay() {
    const timerElement = document.getElementById("timer");

    timerElement.textContent = formatTime(minutes, seconds);

}

function formatTime(minutes, seconds) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function toggleInputs(disabled) {
    minutesInput.disabled = disabled;
    breakInput.disabled = disabled;
    longBreaksInput.disabled = disabled;
    hoursInput.disabled = disabled;
}


function startTimer() {
    if (isRunning) return;

    timer = setInterval(focusMode, 1000);

    isRunning = true;

    console.log("startTimer called, minutes =", minutes); // 👈 add this
    console.log("workMinutes =", workMinutes); //

    updateDisplay();

    toggleInputs(true);
}

function focusMode() {
    // This Logic checks if the millisecond is greater than zero and if it is reduces it zero and then checks if it still greater than zero else it moves to the next one.
    focusColorMode();

    if (!isPaused) {
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

    messageText.textContent = sessionsCompleted;

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
loadInputs();