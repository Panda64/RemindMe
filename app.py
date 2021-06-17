import os
import sched
import time
from flask import Flask, request, render_template, jsonify
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from twilio.rest import Client
from datetime import datetime

load_dotenv(dotenv_path="secrets.env")

app = Flask(__name__)

s = sched.scheduler(time.time, time.sleep)

@app.route('/')
def main():
    """Main route that displays the single-paged site"""

    return render_template('index.html')

# Where all of the data processing goes down. When the all of the form data (A completed reminder setup) is sent from 
# the jQuery AJAX, this route will read the data and schedule the proper reminder 
@app.route('/process', methods=['POST'])
def process():
    """Processes all user-inputted data from the main page"""

    user_reminder = request.form['user_reminder']
    user_email = request.form['user_email']
    user_mobile = request.form['user_mobile']
    sms_radio = request.form['sms_radio']
    phone_radio = request.form['phone_radio']
    email_date = request.form['email_date']
    mobile_date = request.form['mobile_date']

    if not user_reminder:
        return 'Please add a reminder!', 200

    elif user_email:
        dt = convert_date(email_date)
        contact = user_email
        method = send_email

    elif sms_radio:
        dt = convert_date(mobile_date)
        contact = user_mobile
        method = send_sms 

    elif phone_radio:
        dt = convert_date(mobile_date)
        contact = user_mobile
        method = send_phone

    s.enterabs(datetime(dt[2], dt[0], dt[1], dt[3],  dt[4]).timestamp(), 
        1, 
        method, 
        argument=(user_reminder, contact))

    s.run()

    return '', 200

# To make the automated phone call capable of reading out the user reminder through TTS, it needs to grab the info from 
# the web (It is how the Twilio API works). This is the route where the TwiML XML file is stored to provide the information.
# The actual message info is passed through here by URL (see the "send_phone" function below)
@app.route('/voice/<url_reminder>', methods=['POST'])
def voice(url_reminder):
    """Creates the custom XML file for the Twilio API phone call"""
    
    user_reminder = url_reminder.replace("+", " ")

    context = {
        'user_reminder': user_reminder
    }

    return render_template('phone.xml', **context)

def send_email(user_reminder, user_email):
    """Executes a call to SendGrid API to send an email with the user-specified information"""

    message = Mail(
        from_email='frazergaming2015@gmail.com',
        to_emails=user_email,
        subject='YOUR REMINDER',
        html_content=f'<strong>{user_reminder}</strong>')
    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e)

def send_sms(user_reminder, user_mobile):
    """Executes a call to Twilio API to send an SMS with the user-specified information"""

    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')

    client = Client(account_sid, auth_token)

    client.messages.create(
        to=f"+1{user_mobile}",
        from_="+13602338064",
        body=f"The Following is Your RemindMe Reminder: \n{user_reminder}"
    )

def send_phone(user_reminder, user_mobile):
    """Executes a call to Twilio API to send a phone call with the user-specified information"""

    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')

    url_reminder = user_reminder.replace(" ", "+")

    client = Client(account_sid, auth_token)

    call = client.calls.create(
        to=f"+1{user_mobile}",
        from_="+13602338064",
        url=f"https://jaylens-remindme.herokuapp.com/voice/{url_reminder}"
    )

    print(call.sid)

# When the scheduled datetime comes in from the user, it is in a human-friendly format. This function turns that datetime
# into the proper integer-only format that the scheduler function in "/process" can understand
def convert_date(date):
    """Converts human-friendly datemine into an integer-only format for scheduler parsing"""

    seperated_date = []
    
    def convert_month(month):
        """Converts month into integer format"""

        months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"]
        
        converted_month = 0

        for i in months:
            if month == i:
                converted_month = months.index(i) + 1
                return converted_month

    def format_date(date):
        """Helper function for convert_date() that formats the final integer-only date properly"""

        date = date.split()
        date[0] = convert_month(date[0])
        date = [int(i) for i in date]

        return date

    if "AM" in date:
        stripped_date = date.replace(',', '').replace('@', '').replace(':', " ").replace(' AM', "")
        seperated_date = format_date(stripped_date)
    else:
        stripped_date = date.replace(',', '').replace('@', '').replace(':', " ").replace(' PM', "")
        seperated_date = format_date(stripped_date)
        seperated_date[3] += 12

    return seperated_date
     

if __name__ == '__main__':
    app.run(debug=True)