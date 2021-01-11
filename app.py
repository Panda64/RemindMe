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

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process():
    user_reminder = request.form['user_reminder']
    user_email = request.form['user_email']
    user_mobile = request.form['user_mobile']
    sms_radio = request.form['sms_radio']
    phone_radio = request.form['phone_radio']

    s = sched.scheduler(time.time, time.sleep)

    if user_reminder and user_email:
        send_email(user_reminder, user_email)
        return '', 200
    elif user_reminder and user_mobile and sms_radio == "true":
        s.enterabs(datetime(2021, 1, 10, 15, 7).timestamp(), 1, send_sms, argument=(user_reminder, user_mobile))
    elif user_reminder and user_mobile and phone_radio == "true":
        s.enterabs(datetime(2021, 1, 10, 15, 9).timestamp(), 1, send_phone, argument=(user_reminder, user_mobile))
    else:
        return '', 200

    print(s.queue)
    
    s.run()

    return '', 200

@app.route('/voice/<url_reminder>', methods=['POST'])
def voice(url_reminder):
    user_reminder = url_reminder.replace("+", " ")

    context = {
        'user_reminder': user_reminder
    }

    return render_template('phone.xml', **context)

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
        body=f"The following is your RemindMe reminder: \n{user_reminder}"
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

if __name__ == '__main__':
    app.run(debug=True)