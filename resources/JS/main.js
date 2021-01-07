// Declaring variables
const minutesInput = document.querySelector('#minutes')
const secondsInput = document.querySelector('#seconds')
const minWord = document.querySelector('#min-word')
const secWord = document.querySelector('#sec-word')
const reminderMessage = document.querySelector('#message')
const browserRadio = document.querySelector('#browser')
const emailRadio = document.querySelector('#email')
const phoneRadio = document.querySelector('#phone')
const smsRadio = document.querySelector('#sms')
const continuteButton = document.querySelector('#continue')
const submitButton = document.querySelector('#submit')
const firstPage = document.querySelector('#first-page')
const secondPage = document.querySelector('#second-page')
const thirdPage = document.querySelector('#third-page')
const fourthPage = document.querySelector('#fourth-page')
const countdownMin = document.querySelector('#countdown-min')
const countdownSec = document.querySelector('#countdown-sec')
const countdownPhrase = document.querySelector('#reminder-phrase')
const finalReminderMessage = document.querySelector('#user-message')
const alarmSound = document.querySelector('#alarm')
const resetButton = document.querySelector('#reset')
const allRadios = document.querySelector('.method')

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

// Determining and then displaying whether or not the word "minutes" needs to be plural or singular based on the number 
// inputted by the user
function validateMinutes() {
    minutesValue = minutesInput.value
    if (minutesValue === "1") {
        minWord.innerHTML = "minute"
    } else {
        minWord.innerHTML = "minutes"
    }
}

// Determing and displaying whether or not the word "seconds" needs to be plural or singular based on the number 
// inputted by the user
function validateSeconds() {
    secondsValue = secondsInput.value
    if (secondsValue === "1") {
        secWord.innerHTML = "second."
    } else {
        secWord.innerHTML = "seconds."
    }
}

function validateFirstPage() {
    messageValue = reminderMessage.value
    radioChecked = true
    nextPage = null

    if (browserRadio.checked === true) {
        nextPage = secondPage
    } else if (emailRadio.checked === true) {
        nextPage = fifthPage
    } else if (phoneRadio.checked === true) {
        nextPage = seventhPage
    } else if (smsRadio.checked === true) {
        nextPage = ninthPage
    } else {
        radioChecked = false
    }

    if (messageValue === "" || radioChecked === false) {
        alert("You must fill out all fields")
    } else {
        showPages(nextPage)
        SmoothVerticalScrolling(nextPage, 500, "top")
        setTimeout(hidePages, 500, firstPage)
    }
}

// Making sure that the user has filled out all fields before allowing them to click the "Set Reminder" button.
// If the user fails to fill out all fields and tries to click the button, they will get an alert telling them to fill
// out all of the fields. If the user is successful in filling out all of the fields and then clicks the button, the page
// will then transition to the next section: The page will autoscroll to the second section, removing the first section
// from access in the process, whilst calling on a handful of other functions to get the countdown process started
function validateSecondPage() {
    minutesValue = minutesInput.value
    secondsValue = secondsInput.value

    if (minutesValue === "" || secondsValue === "") {
        alert("You must fill out all fields")
    } else {
        showPages(thirdPage)
        SmoothVerticalScrolling(thirdPage, 500, "top")
        countdownMin.innerHTML = minutesValue
        countdownSec.innerHTML = secondsValue
        countdownHandler()
        randomCountdownPhrases()
        setTimeout(hidePages, 500, secondPage)
    }
}

// Event listeners to run the "minutes" and "seconds" word validation whenver the user changes a timer input
minutesInput.addEventListener('input', validateMinutes)
secondsInput.addEventListener('input', validateSeconds)

// Event listeners for when any of the two buttons throughout the site are clicked
continuteButton.addEventListener('click', validateFirstPage)
submitButton.addEventListener('click', validateSecondPage)
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
    showPages(fourthPage)
    finalReminderMessage.innerHTML = reminderMessage.value
    SmoothVerticalScrolling(fourthPage, 500, "top")
    setTimeout(hidePages, 500, thirdPage)
    alarmSound.play()
}

// Hides the specified sections from view
function hidePages(...args) {
    for (var i = 0; i < args.length; i++) {
        args[i].style.display = "none"
    }
}

function showPages(...args) {
    for (var i = 0; i < args.length; i++) {
        args[i].style.display = "flex"
    }
}

// Clearing the input fields of the initial reminder setup
function clearInputFields() {
    reminderMessage.value = ""
    allRadios.checked = false
    minutesInput.value = ""
    secondsInput.value = ""
}

// Scrolls back up to the first section with now empty fields for the user to setup a new reminder
// This function is only called if the user clicks the button to setup another reminder
function resetReminder() {
    showPages(thirdPage, secondPage, firstPage)
    setTimeout(clearInputFields, 100)
    setTimeout(SmoothVerticalScrolling, 0, firstPage, 750, "top")
    setTimeout(hidePages, 750, secondPage, thirdPage, fourthPage)
}