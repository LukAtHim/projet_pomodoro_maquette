/**
 * Variable declaration
 */
const body = document.body

const inputWorkDuration = document.getElementById('work-duration')
const inputRestDuration = document.getElementById('rest-duration')

const timerTime = document.getElementById('timer-time')
const circleProgress = document.querySelector('.circle-progress')

let workDuration = (localStorage.getItem('workDuration') || inputWorkDuration.value) * 60
let restDuration = (localStorage.getItem('restDuration') || inputRestDuration.value) * 60

inputWorkDuration.value = localStorage.getItem('workDuration') || inputWorkDuration.value
inputRestDuration.value = localStorage.getItem('restDuration') || inputRestDuration.value

let isPaused = true
let isWorking = true
let remainingTime = workDuration

funcUpdateProgress()

/**
 * Update Settings
 */
inputWorkDuration.addEventListener('change', () => {
    workDuration = inputWorkDuration.value * 60
    localStorage.setItem('workDuration', inputWorkDuration.value)

    if(isWorking) {
        remainingTime = workDuration
        funcUpdateProgress()
    }
})
    
inputRestDuration.addEventListener('change', () => {
    restDuration = inputRestDuration.value * 60
    localStorage.setItem('restDuration', inputRestDuration.value)

    if(isWorking) {
        remainingTime = workDuration
        funcUpdateProgress()
    }
})

/**
 * Button listener
 */
const startBtn = document.getElementById('btn-start')
startBtn.addEventListener('click', () => {
    isPaused = false

    if(isWorking) {
        body.classList.add('timer-running')
        body.classList.remove('timer-paused')
    } else {
        body.classList.add('rest-mode');
        body.classList.remove('timer-paused')
    }

    setInterval(funcUpdateTimer, 1000)
})

const resetBtn = document.getElementById('btn-reset')
resetBtn.addEventListener('click', () => {
    location.reload()
})

const settingsBtn = document.getElementById('btn-settings');
settingsBtn.addEventListener('click', () => {
    body.classList.add('settings-open');
});

const closeBtn = document.getElementById('btn-close')
closeBtn.addEventListener('click', () => {
    body.classList.remove('settings-open')
})

/**
 * Function to update pomodoro
 */
function funcUpdateTimer() {
    if(!isPaused) {
        remainingTime--

        if(remainingTime <= 0) {
            isWorking = !isWorking

            if (isWorking) {
                remainingTime = workDuration;
                body.classList.remove('rest-mode')
                body.classList.add('timer-running')
            } else {
                remainingTime = restDuration
                body.classList.add('rest-mode')
                body.classList.remove('timer-running')

            }

            isPaused = false
        }
        
        funcUpdateProgress();
    }
}

function funcUpdateProgress() {
    const radius = 45
    const circumference = 2 * Math.PI * radius

    let totalDuration;

    if (isWorking) {
        totalDuration = workDuration;
    } else {
        totalDuration = restDuration;
    }

    const dashOffset = circumference * remainingTime / totalDuration

    circleProgress.style.strokeDashoffset = dashOffset
    timerTime.textContent = toRightFormatTime(remainingTime);
}

function funcSettingsChanged(){

}

function toRightFormatTime(sec) {
    const min = Math.floor(sec / 60)
    const remainingSec = sec % 60
    return `${min.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`
}
