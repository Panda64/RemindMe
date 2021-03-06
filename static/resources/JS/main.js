// Declaring variables
const minutesInput = document.querySelector('#minutes')
const secondsInput = document.querySelector('#seconds')
const emailInput = document.querySelector('#email-input')
const mobileInput = document.querySelector('#mobile-input')
const emailDate = document.querySelector('#email-date')
const mobileDate = document.querySelector('#mobile-date')
const reminderMessage = document.querySelector('#message')

const browserRadio = document.querySelector('#browser')
const emailRadio = document.querySelector('#email')
const phoneRadio = document.querySelector('#phone')
const smsRadio = document.querySelector('#sms')
const allRadios = document.querySelector('.method')

const continueButton = document.querySelector('#continue')
const browserButton = document.querySelector('#submit-browser')
const emailButton = document.querySelector('#submit-email')
const mobileButton = document.querySelector('#submit-mobile')
const resetButton = document.querySelector('#reset')


/* 
   This project is built off of a single page site. Each "page" variable below refers to a specific section of the site.
   
   The description for each page goes as follows:
   
   firstPage - Where the user selects their reminder message, and selects what type of reminder they wish to receive
   secondPage - Where the user selects when they want their browser notification, if that method was selected
   thirdPage - Where the user sees a countdown of how much time is left until they get their browser reminder, if that
               method was selected
   fourthPage - The page that gets displayed when the browser notification timer has expired, if that method was chosen
   fifthPage - Where the user would enter their email address and select the datetime that they wanted the reminder, 
               if that method was selected
   sixthPage - Where the user would enter their phone number and select the datetime that they wanted either their
               SMS or phone call reminder, if either one of those methods was selected
   seventhPage - The final page that confirms the user of their reminder and gives them a summary of their entered
                 entered information. This page is only displayed if a sucessful email, SMS, or phone call reminder
                 has been setup
*/
const firstPage = document.querySelector('#first-page')
const secondPage = document.querySelector('#second-page')
const thirdPage = document.querySelector('#third-page')
const fourthPage = document.querySelector('#fourth-page')
const fifthPage = document.querySelector('#fifth-page')
const sixthPage = document.querySelector('#sixth-page')
const seventhPage = document.querySelector('#seventh-page')

const alarmSound = document.querySelector('#alarm')

const minWord = document.querySelector('#min-word')
const secWord = document.querySelector('#sec-word')
const countdownMin = document.querySelector('#countdown-min')
const countdownSec = document.querySelector('#countdown-sec')
const browserPhrase = document.querySelector('#browser-phrase')
const otherPhrase = document.querySelector('#other-phrase')
const finalReminderMessage = document.querySelector('#user-message')

const recapOne = document.querySelector('#info-1')
const recapTwo = document.querySelector('#info-2')
const recapThree = document.querySelector('#info-3')
const headRecapTwo = document.querySelector('#head-info-2')

const datePicker = flatpickr(".date-select", {
    animate: true,
    enableTime: true,
    dateFormat: "F j, Y @ h:i K",
    plugins: [new confirmDatePlugin({
        confirmText: "Ok",
        theme: "dark"
    })]
})

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

// Smoothly transitions from one section of the page to the other
function validClick(initialPage, endingPage) {
    showPages(endingPage)
    SmoothVerticalScrolling(endingPage, 500, "top")
    setTimeout(hidePages, 500, initialPage)
}

// Making sure that all required fields on the first page are filled out, then reading the data and sending the user to the 
// respective section based on their reminder choice. The other "validate" functions below serve a similar purpose
function validateFirstPage() {
    messageValue = reminderMessage.value
    minutesValue = minutesInput.value
    secondsValue = secondsInput.value
    radioChecked = true
    nextPage = null

    if (browserRadio.checked === true) {
        nextPage = secondPage
    } else if (emailRadio.checked === true) {
        nextPage = fifthPage
    } else if (phoneRadio.checked === true || smsRadio.checked === true) {
        nextPage = sixthPage
    } else {
        radioChecked = false
    }

    if (messageValue === "" || radioChecked === false) {
        alert("You must fill out all fields")
    } else {
        validClick(firstPage, nextPage)
    }
}


function validateSecondPage() {
    if (minutesValue === "" || secondsValue === "") {
        alert("You must fill out all fields")
    } else {
        validClick(secondPage, thirdPage)
        countdownMin.innerHTML = minutesValue
        countdownSec.innerHTML = secondsValue
        countdownHandler()
        randomCountdownPhrases(browserPhrase)
    }
}

function validateEmail() {
    emailValue = emailInput.value

    if (emailValue === "") {
        alert("You must enter a valid email address")
    } else {
        validClick(fifthPage, seventhPage)
        randomCountdownPhrases(otherPhrase)
        infoRecap()
    }
}

function validateMobile() {
    mobileValue = mobileInput.value

    if (mobileValue === "") {
        alert("You must enter a valid phone number")
    } else {
        validClick(sixthPage, seventhPage)
        randomCountdownPhrases(otherPhrase)
        infoRecap()
    }
}

// Event listeners to run the "minutes" and "seconds" word validation whenver the user changes a timer input
minutesInput.addEventListener('input', validateMinutes)
secondsInput.addEventListener('input', validateSeconds)

// Event listeners for when any of the buttons throughout the site are clicked
continueButton.addEventListener('click', validateFirstPage)
browserButton.addEventListener('click', validateSecondPage)
emailButton.addEventListener('click', validateEmail)
mobileButton.addEventListener('click', validateMobile)
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
function randomCountdownPhrases(methodPhrase) {
    const random = Math.floor(Math.random() * countdownPhrases.length)
    
    methodPhrase.innerHTML = countdownPhrases[random]
}

// Makes the fourth section of the site visible, whilst smooth scrolling to it, along with removing access to the second
// section (countdown section). This fourth section will alert the user that the time is up and finally relay the user's
// intial reminder message back to them. (This is in regaurds to the "browser notification" feature)
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

// Puts the specified sections into view
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

// Provides the user with a recap of their reminder information after setup is complete (for all methods except browser)
function infoRecap() {

    function mobile() {
        recapTwo.innerHTML = formatPhoneNumber(mobileInput.value)
        headRecapTwo.innerHTML = "Phone Number:&nbsp;"
        recapThree.innerHTML = mobileDate.value
    }

    if (emailRadio.checked === true) {
        recapOne.innerHTML = "Email"
        headRecapTwo.innerHTML = "Email Address:&nbsp;"
        recapTwo.innerHTML = emailInput.value
        recapThree.innerHTML = emailDate.value

    } else if (smsRadio.checked === true) {
        recapOne.innerHTML = "SMS (Text Message)"
        mobile()

    } else if (phoneRadio.checked === true) {
        recapOne.innerHTML = "Phone Call"
        mobile()
        
    }
}

// Helper function for infoRecap() that formats the user-inputted phone number into something more human-friendly
function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ')-' + match[2] + '-' + match[3]
    }
    return null
  }

  // Because this project is a single-page site, we do not want the page to refresh when we send form data to the server.
  // To combat this, form data is sent using AJAX instead
$(document).ready(function () {
    
    $('#main-form').on('submit', function(event) {

        $.ajax({
            data : {
                user_reminder : $('#message').val(),
                user_email : $('#email-input').val(),
                user_mobile : $('#mobile-input').val(),
                sms_radio : smsRadio.checked,
                phone_radio : phoneRadio.checked,
                email_date : $('#email-date').val(),
                mobile_date : $('#mobile-date').val()
            },
            type : 'POST',
            url : '/process'
        })

        event.preventDefault();

    });

});