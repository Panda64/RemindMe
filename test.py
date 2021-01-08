import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


message = Mail(
    from_email='frazergaming2015@gmail.com',
    to_emails='jaylen.schelb@students.makeschool.com',
    subject='Sending with Twilio SendGrid is Fun',
    html_content='<strong>This do be a test doe</strong>')
try:
    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    response = sg.send(message)
    print(response.status_code)
    print(response.body)
    print(response.headers)
except Exception as e:
    print(e)
