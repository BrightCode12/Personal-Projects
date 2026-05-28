const timerData = {
    // ---- Data -----
    seconds: 0,
    minutes: 25,

    workMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 10,

    isPaused: false,
    isRunning: false,
    isBreak: false,

    sessionsCompleted: 0,
    totalMinutes: 0,
    totalHours: 0,

    startTime: null,
    timer: null,
    endTime: null,
    remainingTime: 0,

    // ------ modes -------
    shortBreak() {
        sessionElement.textContent = this.sessionsCompleted;

        messageText.textContent = `Time is Up! Take a break`;
        shortBreakColorMode();
        this.defaultValue();

        this.minutes = this.breakMinutes;
    },

    longBreak() {
        this.minutes = this.longBreakMinutes;
        sessionElement.textContent = this.sessionsCompleted;

        messageText.textContent = `Move (Stand up, stretch)`;

        this.defaultValue();
        clearModes();
        longBreakColorMode();

    },

    switchMode() {

        toggleInputs(false);

        clearInterval(this.timer);

        this.isRunning = false;

        this.isBreak = !this.isBreak;

        console.log("🔄 switchMode called! isBreak =", this.isBreak);

        if (this.isBreak) {

            this.sessionsCompleted++;

            if (this.sessionsCompleted % 4 === 0) {

                this.longBreak();

            } else {
                this.shortBreak();
            }
        } else {
            clearModes();
            focusColorMode();

            this.minutes = this.workMinutes;

            this.defaultValue();

            messageText.textContent = `Deep work`;

        }

        this.updateDisplay();
        this.startTimer();
    },


    // ----- Controls --------

    startTimer() {
        if (this.isRunning) return;

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.remainingTime = (this.minutes * 60 + this.seconds) * 1000;

        this.startTime = Date.now();

        this.endTime = this.startTime + this.remainingTime;
       
        this.timer = setInterval(() => this.updateTimer(), 1000);

        this.isRunning = true;

        console.log("startTimer called, minutes =", this.minutes); // 👈 add this
        console.log("workMinutes =", this.workMinutes); //

        this.updateDisplay();
        focusColorMode();

        toggleInputs(true);
    },

    pauseTimer() {
        const pause = document.querySelector(".pause");

        this.isPaused = !this.isPaused;

        if (this.isPaused) {

            this.remainingTime = this.endTime - Date.now();
            clearInterval(this.timer);
            this.isRunning = false;
            pause.textContent = `Resume`;
        } else {
            pause.textContent = `Pause`;
            this.startTimer();
        }

    },


    resetTimer() {

        clearInterval(this.timer);
        this.sessionsCompleted = 0;
        this.minutes = Number(minutesInput.value);
        clearModes();
        this.defaultValue();
        this.isPaused = false;
        this.isRunning = false;
        this.updateDisplay();
        toggleInputs(false)
    },


    stopTimer() {
        clearInterval(this.timer);
        this.timer = null;
        this.isRunning = false;
        this.isPaused = false;
    },

    // ---- TIMER ENGINE ------------
    // focusMode() {
    //     // This Logic checks if the millisecond is greater than zero and if it is reduces it zero and then checks if it still greater than zero else it moves to the next one.
    //     


    //     if (!this.isPaused) {
    //         if (this.seconds > 0) {
    //             this.seconds--;
    //         } else {
    //             this.seconds = 59;
    //             if (this.minutes > 0) {
    //                 this.minutes--;
    //             } else {
    //                 clearInterval(this.timer);
    //                 this.switchMode();
    //             }
    //         }
    //     }

    //     this.updateDisplay();
    // },

    updateTimer() {
        const currentTime = Date.now();
        this.remainingTime = this.endTime - currentTime;

        if (this.remainingTime <= 0) {
            clearInterval(this.timer);
            this.minutes = 0;
            this.seconds = 0;
            this.updateDisplay();
            this.switchMode();
            return;
        }

        const totalSeconds = Math.floor(this.remainingTime / 1000);

        this.minutes = Math.floor(totalSeconds / 60);
        this.seconds = totalSeconds % 60;

        this.updateDisplay();
    },


    // ----- TIMER UI DISPLAY -----------

    updateDisplay() {
        const timerElement = document.getElementById("timer");

        timerElement.textContent = formatTime(
            this.minutes,
            this.seconds,
        );
    },


    defaultValue() {
        this.seconds = 0;
    }
};


const minutesInput = document.getElementById("numOfMinutes");
const breakInput = document.getElementById("numberOfBreaks");
const longBreaksInput = document.getElementById("numberOfLongBreaks");
const hoursInput = document.getElementById("numOfHours");
const sessionElement = document.querySelector(".round");
const messageText = document.querySelector(".message-texts");

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

    timerData.workMinutes = Number(minutesInput.value);
    timerData.minutes = timerData.workMinutes;
    savedInputs();
    timerData.updateDisplay();
});

breakInput.addEventListener("change", () => {

    if (!validateInputs()) return;
    timerData.breakMinutes = Number(breakInput.value);

    if (timerData.isBreak) {
        timerData.minutes = timerData.breakMinutes;
    }

    savedInputs();
    timerData.updateDisplay();
});

longBreaksInput.addEventListener("change", () => {

    if (!validateInputs()) return;
    timerData.longBreakMinutes = Number(longBreaksInput.value);
    savedInputs();
    timerData.updateDisplay();
});

hoursInput.addEventListener("change", () => {

    if (!validateInputs()) return;
    timerData.totalHours = Number(hoursInput.value);
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

    timerData.workMinutes = Number(savedInputs.minutes);
    timerData.breakMinutes = Number(savedInputs.breaks);
    timerData.longBreakMinutes = Number(savedInputs.longBreak);
    timerData.totalHours = Number(savedInputs.hour);

    if (timerData.isBreak) {
        timerData.minutes = timerData.breakMinutes;
    } else {
        timerData.minutes = timerData.workMinutes;
    }
    timerData.updateDisplay();
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

function numHours() {
    timerData.totalMinutes = timerData.sessionsCompleted * timerData.workMinutes;

    const focusedHours = timerData.totalMinutes / 60;

    if (focusedHours >= timerData.totalHours) {

        clearInterval(timerData.timer);

        timerData.isRunning = false;

        toggleInputs(false);

        clearModes();

        messageText.textContent = `🎉 Goal Completed`;

    }
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