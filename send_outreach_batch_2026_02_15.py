import smtplib, ssl
from email.message import EmailMessage

SMTP_HOST = 'smtp.gmail.com'
SMTP_PORT = 587
USERNAME = 'israelakhas1@gmail.com'
PASSWORD = 'oeqb ghre todf ivwc'
FROM_NAME = 'Israel Akhabue'
FROM_EMAIL = USERNAME

emails = [
    {
        'to': 'themoneyvisual@gmail.com',
        'subject': 'Guest Contribution: Abuja Real Estate Investing Insights',
        'body': """Hello Money Visual Team,

I’m Israel Akhabue, CEO of A.I Realent Global Resources Ltd, a real estate company in Abuja focused on verified listings and FCDA‑approved titles.

I’d love to contribute a guest article to MoneyVisual that will help your readers make smarter property investment decisions. Here are two topic options:

1) “Verified Land vs. Risky Deals: A Practical Guide for Abuja Investors”
2) “2026 Abuja Real Estate Outlook: Where Smart Money Is Moving”

I can deliver a well‑researched, original piece (800–1,500 words), with data points and actionable takeaways. If either topic fits your editorial direction, I’ll send a full draft for review.

Best regards,
Israel Akhabue
CEO, A.I Realent Global Resources Ltd
israelakhas@gmail.com
https://airealent.ng
"""
    },
    {
        'to': 'editor@nigeriabusinesspro.com',
        'subject': 'Guest Contribution: Abuja Real Estate Insights for NigeriaBusinessPro',
        'body': """Hello NigeriaBusinessPro Editorial Team,

I’m Israel Akhabue, CEO of A.I Realent Global Resources Ltd, a real estate company in Abuja focused on verified listings and FCDA‑approved titles.

I’d love to contribute a guest article to NigeriaBusinessPro that your audience of entrepreneurs and professionals would find valuable. Here are two topic options:

1) “Why Verified Property Titles Matter in Abuja’s Luxury Market”
2) “The 2026 Outlook: Where Smart Investors Should Watch in Abuja Real Estate”

We can provide a well‑researched, original piece (800–1,500 words), with data points and practical insights. If one of these fits, I’ll send a full draft for review.

Best regards,
Israel Akhabue
CEO, A.I Realent Global Resources Ltd
israelakhas@gmail.com
https://airealent.ng
"""
    },
    {
        'to': 'info@consultease.com',
        'subject': 'Guest Post Proposal: Abuja Property Due Diligence & Investment',
        'body': """Hello ConsultEase Team,

I’m Israel Akhabue, CEO of A.I Realent Global Resources Ltd, an Abuja real estate firm focused on verified properties and FCDA‑approved titles.

I’d like to contribute a guest article aligned with your finance/business readership. Suggested topics:

1) “Property Due Diligence in Nigeria: How Investors Can Avoid Costly Title Risks”
2) “How to Evaluate Abuja Real Estate Deals: A Practical Investor Checklist”

I can deliver a well‑researched, original article (2,000+ words if required), with clear takeaways for investors and business owners. If this works for you, I’ll send a full draft for review.

Best regards,
Israel Akhabue
CEO, A.I Realent Global Resources Ltd
israelakhas@gmail.com
https://airealent.ng
"""
    }
]

context = ssl.create_default_context()
with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
    server.ehlo()
    server.starttls(context=context)
    server.login(USERNAME, PASSWORD)
    for e in emails:
        msg = EmailMessage()
        msg['From'] = f"{FROM_NAME} <{FROM_EMAIL}>"
        msg['To'] = e['to']
        msg['Subject'] = e['subject']
        msg.set_content(e['body'])
        server.send_message(msg)

print('SENT_OK')
