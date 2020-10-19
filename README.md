# RemindMe
 
 As humans, we all need reminders for a various number of things from time to time. Most of the time, a simple sticky note, or a note on ones calendar, whether it be physical or didgital, is more than good enough. However, there are times when more is needed. 

 What if you could set up a reminder in the form of an e-mail or text message sent right to your phone? Not enough? Maybe you would like an actual phone call, or even a physical peice of mail, to remind you of that special day that is around the corner. This is exactly what the RemindMe service hopes to achieve. 

 Right now, as a proof of concept, and until further development, browser notifications are the only way to get reminders through RemindMe. Yes, this does limit the viability of long term reminders at the moment, but know that that is the long term goal for the site.

 As of now, this is the current functionality:

 The main page is where users set the reminder they want to recieve by entering their message, the method to which they would like to recive the reminder, and the amount of time until they want to be reminded. Do note that in future iterations, the minute and second select will not be on the main page. Since the browser notification is on the only reminder method at the moment, it made sense to put configuration for it on the main page as well. This is bound to change as each method is planned to have their own section for configuration.

 ![First Page Screenshot](/resources/Pics_&_GIFS/First_Page.png)

 The second page is currently the place of the countdown.

 ![Second Page Screenshot](/resources/Pics_&_GIFS/Second_Page.png)

 Once configuration on the first page is done and confirmation is given from the user on the first page, the site will then switch sections and begin the user specified countdown.

 ![First to Second Page GIF](/resources/Pics_&_GIFS/RemindMeGif1.gif)

 The third, and currently final section of the site is where the user is notified of the timer being up, with their chosen reminder being presented to them at the middle of the screen. If the user wishes, they can click the "Set Another Reminder" button and do the entire process over again.

 ![Third Page Screenshot](/resources/Pics_&_GIFS/Third_Page.png)

 The transition from the second to the third page is the same as the one before it, only this time happeneing when the time runs out. Note that the user only has access to one page at any time, preventing any forseeable confusion that may arise in relation to use.

 ![Second to Third Page GIF](/resources/Pics_&_GIFS/RemindMeGif2.gif)


The following Javascript and CSS library was used for the countdown transition effect:
Odometer - [Library](https://github.hubspot.com/odometer/)

That is currently the extent of this project. As it is not live at the moment, the only way to use this is through downloading it here.
