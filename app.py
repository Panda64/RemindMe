import os
from flask import Flask, request, render_template, jsonify
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from twilio.rest import Client

load_dotenv()

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

    if user_reminder and user_email:
        send_email(user_reminder, user_email)
        return '', 200
    elif user_reminder and user_mobile and sms_radio == "true":
        send_sms(user_reminder, user_mobile)
        return '', 200
    elif user_reminder and user_mobile and phone_radio == "true":
        send_phone(user_reminder, user_mobile)
        return '', 200
    else:
        return '', 200

@app.route('/voice')
def voice(user_reminder):
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

    voice(user_reminder)

    client = Client(account_sid, auth_token)

    call = client.calls.create(
        to=f"+1{user_mobile}",
        from_="+13602338064",
        url="https://jaylens-remindme.herokuapp.com/voice"
    )

    print(call.sid)

if __name__ == '__main__':
    app.run(debug=True)