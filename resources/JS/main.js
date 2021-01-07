// Declaring variables
const minutesInput = document.querySelector('#minutes')
const secondsInput = document.querySelector('#seconds')
const minWord = document.querySelector('#min-word')
const secWord = document.querySelector('#sec-word')
const reminderMessage = document.querySelector('#message')
const browserCheckbox = document.querySelector('#browser')
const submitButton = document.querySelector('#submit')
const secondPage = document.querySelector('#second-page')
const countdownMin = document.querySelector('#countdown-min')
const countdownSec = document.querySelector('#countdown-sec')
const countdownPhrase = document.querySelector('#reminder-phrase')
const finalReminderMessage = document.querySelector('#user-message')
const thirdPage = document.querySelector('#third-page')
const alarmSound = document.querySelector('#alarm')
const firstPage = document.querySelector('#first-page')
const resetButton = document.querySelector('#reset')
const allCheckboxes = document.querySelector('.method')

const countdownPhrases = ['Got it! Your Reminder is Set.',
                         'All Good to Go!',
                         'Reminder is Locked and Loaded!',
                         'You Have Successfully Set Your Reminder!',
                         'Mission Successful. You will be Reminded when the Timer is Up.',
                         'Nice. Feel Free to Forget Now, I Will Remind You When the Time Comes.']

const time = {
    minutes: minutesInput.value * 1,
    seconds: secondsInput.value * 1
}

// Determining whether or not the word "minutes" needs to be plural or singular based on the number inputted by the user
function validateMinutes() {
    minutesValue = minutesInput.value
    if (minutesValue === "1") {
        return "minute"
    } else {
        return "minutes"
    }
}

// Determing whether or not the word "seconds" needs to be plural or singular based on the number inputted by the user
function validateSeconds() {
    secondsValue = secondsInput.value
    if (secondsValue === "1") {
        return "second"
    } else {
        return "seconds"
    }
}

// Displaying the proper form of "minutes" and "seconds" on the screen
function validateTime() {
    minWord.innerHTML = validateMinutes()
    secWord.innerHTML = validateSeconds()
}

// Making sure that the user has filled out all fields before allowing them to click the "Set Reminder" button.
// If the user fails to fill out all fields and tries to click the button, they will get an alert telling them to fill
// out all of the fields. If the user is successful in filling out all of the fields and then clicks the button, the page
// will then transition to the next section: The page will autoscroll to the second section, removing the first section
// from access in the process, whilst calling on a handful of other functions to get the countdown process started
function validateFields() {
    minutesValue = minutesInput.value
    secondsValue = secondsInput.value
    messageValue = reminderMessage.value

    if (minutesValue === "" || secondsValue === "" || messageValue === "" || browserCheckbox.checked === false) {
        alert("You must fill out all fields")
    } else {
        secondPage.style.display = "flex"
        SmoothVerticalScrolling(secondPage, 500, "top")
        countdownMin.innerHTML = minutesValue
        countdownSec.innerHTML = secondsValue
        countdownHandler()
        randomCountdownPhrases()
        setTimeout(hideFirstPage, 500)
    }
}

// Event listeners to run the "minutes" and "seconds" word validation whenver the user changes a timer input
minutesInput.addEventListener('input', validateTime)
secondsInput.addEventListener('input', validateTime)

// Event listeners for when any of the two buttons throughout the site are clicked
submitButton.addEventListener('click', validateFields)
resetButton.addEventListener('click', resetReminder)

// Function that allows for the smooth scrolling from one section of a page to another even with Safari 
// (Safari does not natively support the "autoscroll: smooth" attribute)
function SmoothVerticalScrolling(e, time, where) {
    var eTop = e.getBoundingClientRect().top;
    var eAmt = eTop / 100;
    var curTime = 0;
    while (curTime <= time) {
        window.setTimeout(SVS_B, curTime, eAmt, where);
        curTime += time / 100;
    }
}

// Function that is connected to the previous smooth scrolling function. Determines what part of the section to scroll to
function SVS_B(eAmt, where) {
    if(where == "center" || where == "")
        window.scrollBy(0, eAmt / 2);
    if (where == "top")
        window.scrollBy(0, eAmt);
}

// Handler function for the countdown timer
function countdownHandler() {

    var time = {
        minutes: minutesInput.value * 1,
        seconds: secondsInput.value * 1
    };

    var timer = setInterval(countdown, 1000)

    // A functional countdown timer. When the timer reaches zero, it will call on the timesUp() function to move on to 
    // the next section of the site
    function countdown() {
        if (time.seconds > 0) {
            time.seconds--
        } 
        else {
            if (time.minutes > 0) {
                time.minutes--
                time.seconds = 60
            }
            else {
                time.minutes = 0
                time.seconds = 0
            }
        }

        if (time.minutes > 0 || time.seconds > 0) {
            countdownMin.innerHTML = time.minutes
            countdownSec.innerHTML = time.seconds
        }  else {
            countdownMin.innerHTML = time.minutes
            countdownSec.innerHTML = time.seconds
            clearInterval(timer)
            timesUp()
        }
       
    }
}

// Randomly chooses a phrase to display when the countdown timer is running
function randomCountdownPhrases() {
    const random = Math.floor(Math.random() * countdownPhrases.length)
    
    countdownPhrase.innerHTML = countdownPhrases[random]
}

// Makes the third section of the site visible, whilst smooth scrolling to it, along with removing access to the second
// section (countdown section). This third section will alert the user the the time is up and finally relay the user's
// intial reminder message back to them. 
function timesUp() {
    thirdPage.style.display = "flex"
    finalReminderMessage.innerHTML = reminderMessage.value
    SmoothVerticalScrolling(thirdPage, 500, "top")
    setTimeout(hideSecondPage, 500)
    alarmSound.play()
}

// These next four functions are for hiding their respective sections from view
function hideFirstPage() {
    firstPage.style.display = "none"
}

function hideSecondPage() {
    secondPage.style.display = "none"
}

function hideThirdPage() {
    thirdPage.style.display = "none"
}

function hideSecThirPages() {
    secondPage.style.display = "none"
    thirdPage.style.display = "none"
}

// Clearing the input fields of the initial reminder setup
function clearInputFields() {
    reminderMessage.value = ""
    allCheckboxes.checked = false
    minutesInput.value = ""
    secondsInput.value = ""
}

// Scrolls back up to the first section with now empty fields for the user to setup a new reminder
// This function is only called if the user clicks the button to setup another reminder
function resetReminder() {
    secondPage.style.display = "flex"
    firstPage.style.display = "flex"

    setTimeout(clearInputFields, 100)
    setTimeout(SmoothVerticalScrolling, 0, firstPage, 500, "top")
    setTimeout(hideSecThirPages, 500)
}