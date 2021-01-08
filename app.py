import os
from flask import Flask, request, render_template, jsonify
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

load_dotenv(dotenv_path="secrets.env")

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process():
    user_reminder = request.form['user_reminder']
    user_email = request.form['user_email']

    if user_reminder and user_email:
        send_email(user_reminder, user_email)
        return '', 200
    return '', 200

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


if __name__ == '__main__':
    app.run(debug=True)