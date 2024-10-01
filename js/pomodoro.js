/**
 * Variable declaration
 */
const body = document.body; // Reference to the body element of the document

// Input elements for work and rest durations
const inputWorkDuration = document.getElementById('work-duration');
const inputRestDuration = document.getElementById('rest-duration');

// Timer display and progress circle elements
const timerTime = document.getElementById('timer-time');
const circleProgress = document.querySelector('.circle-progress');

// Use local storage to retrieve or set default work and rest durations (in seconds)
let workDuration = (localStorage.getItem('workDuration') || inputWorkDuration.value) * 60; // Default work duration (25 min)
let restDuration = (localStorage.getItem('restDuration') || inputRestDuration.value) * 60; // Default rest duration (5 min)

// Set input fields to current local storage values or defaults
inputWorkDuration.value = localStorage.getItem('workDuration') || inputWorkDuration.value;
inputRestDuration.value = localStorage.getItem('restDuration') || inputRestDuration.value;

// State variables for the timer functionality
let isPaused = true; // Indicates if the timer is paused because had a pause function but decide to delete it on the html to follow the mockup
let isWorking = true; // Indicates if the timer is in work mode
let remainingTime = workDuration; // Initialize remaining time to work duration

// Initialize the progress display
funcUpdateProgress();

/**
 * Update Settings
 */
inputWorkDuration.addEventListener('change', () => { // Event listener for changes in work duration input
    workDuration = inputWorkDuration.value * 60;
    localStorage.setItem('workDuration', inputWorkDuration.value);

    if (isWorking) {
        remainingTime = workDuration;
        funcUpdateProgress();
    }
});
    
inputRestDuration.addEventListener('change', () => { // Event listener for changes in rest duration input
    restDuration = inputRestDuration.value * 60;
    localStorage.setItem('restDuration', inputRestDuration.value);

    if (isWorking) {
        remainingTime = workDuration;
        funcUpdateProgress();
    }
});

/**
 * Button listener
 */
const startBtn = document.getElementById('btn-start'); // Reference to the start button
startBtn.addEventListener('click', () => {
    isPaused = false;

    // Update body classes based on current mode (work or rest)
    if (isWorking) {
        body.classList.add('timer-running');
        body.classList.remove('timer-paused');
    } else {
        body.classList.add('rest-mode');
        body.classList.remove('timer-paused');
    }

    // Start the timer interval
    setInterval(funcUpdateTimer, 1000); // Call funcUpdateTimer every second
});

// Reference to the reset button
const resetBtn = document.getElementById('btn-reset');
resetBtn.addEventListener('click', () => {
    location.reload(); // Reload the page to reset the timer
});

// Reference to the settings button
const settingsBtn = document.getElementById('btn-settings');
settingsBtn.addEventListener('click', () => {
    body.classList.add('settings-open'); // Open settings menu
});

// Reference to the close button in settings
const closeBtn = document.getElementById('btn-close');
closeBtn.addEventListener('click', () => {
    body.classList.remove('settings-open'); // Close settings menu
});

/**
 * Function to update pomodoro timer
 */
function funcUpdateTimer() {
    if (!isPaused) {
        remainingTime--;

        // Check if the time is up
        if (remainingTime <= 0) {
            isWorking = !isWorking;

            // Reset remaining time based on the new mode
            if (isWorking) {
                remainingTime = workDuration; // Reset to work duration
                body.classList.remove('rest-mode');
                body.classList.add('timer-running');
            } else {
                remainingTime = restDuration; // Reset to rest duration
                body.classList.add('rest-mode');
                body.classList.remove('timer-running');
            }

            isPaused = false; // Ensure the timer continues
        }
        
        funcUpdateProgress(); // Update progress display
    }
}

/**
 * Function to update time display and circular progress
 */
function funcUpdateProgress() {
    const radius = 45; // Radius of the circular progress
    const circumference = 2 * Math.PI * radius; // Calculate circumference of the circle

    let totalDuration; // Total duration based on current mode

    // Determine total duration based on whether working or resting
    if (isWorking) {
        totalDuration = workDuration; // Work duration
    } else {
        totalDuration = restDuration; // Rest duration
    }

    // Calculate the offset for the stroke dash based on remaining time
    const dashOffset = circumference * remainingTime / totalDuration;

    // Update the circle's stroke dash offset to create the progress effect
    circleProgress.style.strokeDashoffset = dashOffset;
    timerTime.textContent = toRightFormatTime(remainingTime); // Update the displayed time
}

/**
 * Function to format seconds into MM:SS format
 */
function toRightFormatTime(sec) {
    const min = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${min.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`; // Format and return time
}
