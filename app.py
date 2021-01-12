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

# The main route that displays the single page site
@app.route('/')
def main():
    return render_template('index.html')

# Where all of the data processing goes down. When the all of the form data (A completed reminder setup) is sent from 
# the jQuery AJAX, this route will read the data and schedule the proper reminder 
@app.route('/process', methods=['POST'])
def process():
    user_reminder = request.form['user_reminder']
    user_email = request.form['user_email']
    user_mobile = request.form['user_mobile']
    sms_radio = request.form['sms_radio']
    phone_radio = request.form['phone_radio']
    email_date = request.form['email_date']
    mobile_date = request.form['mobile_date']

    if user_reminder and user_email:
        formatted_date = convert_date(email_date)

        s.enterabs(datetime(formatted_date[2], formatted_date[0], formatted_date[1], formatted_date[3], 
        formatted_date[4]).timestamp(), 1, send_email, argument=(user_reminder, user_email))

    elif user_reminder and user_mobile and sms_radio == "true":
        formatted_date = convert_date(mobile_date)

        s.enterabs(datetime(formatted_date[2], formatted_date[0], formatted_date[1], formatted_date[3], 
        formatted_date[4]).timestamp(), 1, send_sms, argument=(user_reminder, user_mobile))

    elif user_reminder and user_mobile and phone_radio == "true":
        formatted_date = convert_date(mobile_date)

        s.enterabs(datetime(formatted_date[2], formatted_date[0], formatted_date[1], formatted_date[3], 
        formatted_date[4]).timestamp(), 1, send_phone, argument=(user_reminder, user_mobile))

    else:
        return 'Something went wrong. All needed information given by the user?', 200

    print(s.queue)
    s.run()

    return '', 200

# To make the automated phone call capable of reading out the user reminder through TTS, it needs to grab the info from 
# the web (It is how the Twilio API works). This is the route where the TwiML XML file is stored to provide the information.
# The actual message info is passed through here by URL (see the "send_phone" function below)
@app.route('/voice/<url_reminder>', methods=['POST'])
def voice(url_reminder):
    user_reminder = url_reminder.replace("+", " ")

    context = {
        'user_reminder': user_reminder
    }

    return render_template('phone.xml', **context)

# Executes a call to SendGrid to send an email with the user-specified information. Both "send_sms" and "send_phone" functions
# below work in a similar way to this.
def send_email(user_reminder, user_email):
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
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')

    client = Client(account_sid, auth_token)

    client.messages.create(
        to=f"+1{user_mobile}",
        from_="+13602338064",
        body=f"The Following is Your RemindMe Reminder: \n{user_reminder}"
    )

def send_phone(user_reminder, user_mobile):
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
    seperated_date = []
    
    def convert_month(month):
        months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"]
        
        converted_month = 0

        for i in months:
            if month == i:
                converted_month = months.index(i) + 1
                return converted_month

    def format_date(date):
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