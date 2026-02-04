#!/usr/bin/env python3
"""
Send guest post outreach emails to Nigeria blogs
Usage: python send-outreach-emails.py
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import csv
import os

# Credentials
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL = "israelakhas1@gmail.com"
APP_PASSWORD = "retq wqqp ijsr rwur"

# Recipients - Nigeria Guest Post Targets
RECIPIENTS = [
    {
        "name": "Editor",
        "email": "contact@nairametrics.com",
        "site": "Nairametrics",
        "url": "https://nairametrics.com",
        "topic": "Property Investment Trends in Nigeria for 2026"
    },
    {
        "name": "Editor",
        "email": "editor@businessday.ng",
        "site": "BusinessDay NG",
        "url": "https://businessday.ng",
        "topic": "Abuja Real Estate Market Analysis"
    },
    {
        "name": "Editor",
        "email": "hello@nigeriabusinesspro.com",
        "site": "Nigeria Business Pro",
        "url": "https://nigeriabusinesspro.com",
        "topic": "How Technology is Transforming Real Estate in Nigeria"
    },
    {
        "name": "Editor",
        "email": "contact@techpoint.africa",
        "site": "Techpoint Africa",
        "url": "https://techpoint.africa",
        "topic": "PropTech: The Future of Property Buying in Nigeria"
    },
    {
        "name": "Editor",
        "email": "editorial@thisdaylive.com",
        "site": "Thisdaylive",
        "url": "https://www.thisdaylive.com",
        "topic": "AI and Real Estate: Opportunities for Nigerian Buyers"
    },
    {
        "name": "Editor",
        "email": "hello@techcabal.com",
        "site": "TechCabal",
        "url": "https://techcabal.com",
        "topic": "Nigeria's PropTech Revolution"
    },
    {
        "name": "Editor",
        "email": "info@homers.ng",
        "site": "Homers Nigeria",
        "url": "https://blog.homers.ng",
        "topic": "Best Areas to Invest in Abuja Real Estate"
    },
    {
        "name": "Editor",
        "email": "contact@naijatechguide.com",
        "site": "NaijaTechGuide",
        "url": "https://naijatechguide.com",
        "topic": "Virtual Property Tours: The New Normal in Nigeria"
    },
    {
        "name": "Editor",
        "email": "info@theafricanvestor.com",
        "site": "The Africanvestor",
        "url": "https://theafricanvestor.com",
        "topic": "Fractional Ownership in African Real Estate"
    },
    {
        "name": "Editor",
        "email": "hello@carolinewabara.com",
        "site": "Caroline Wabara",
        "url": "https://carolinewabara.com",
        "topic": "Digital Marketing for Real Estate in Nigeria"
    },
]

# Email template
EMAIL_SUBJECT = "Guest Post Proposal: {topic}"

EMAIL_BODY = """Hi {name},

I hope this email finds you well.

I'm reaching out from A.I Realent Global Resources Ltd., a leading real estate company based in Abuja, Nigeria.

I'd like to contribute a guest post to {site} on the topic:

**{topic}**

This article would provide valuable insights for your readers about the Nigerian real estate market, covering:
- Current market trends and opportunities
- Practical advice for property buyers and investors
- Expert analysis backed by real-world experience

We believe this content would resonate well with your audience and provide genuine value.

Would you be interested in reviewing a draft? I'd be happy to send it over.

Thank you for your time.

Best regards,
Israel Akhabue
CEO, A.I Realent Global Resources Ltd.
Website: https://airealent.ng
Phone: +234 818 162 4267
"""

def send_email(recipient):
    """Send an outreach email to a single recipient."""
    
    msg = MIMEMultipart()
    msg['From'] = EMAIL
    msg['To'] = recipient['email']
    msg['Subject'] = EMAIL_SUBJECT.format(topic=recipient['topic'])
    
    body = EMAIL_BODY.format(
        name=recipient['name'],
        site=recipient['site'],
        topic=recipient['topic']
    )
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL, APP_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL, recipient['email'], text)
        server.quit()
        print(f"✓ Sent to {recipient['site']} ({recipient['email']})")
        return True
    except Exception as e:
        print(f"✗ Failed {recipient['site']}: {e}")
        return False

def main():
    print("=" * 60)
    print("Nigeria Guest Post Outreach")
    print("=" * 60)
    print(f"Account: {EMAIL}")
    print(f"Recipients: {len(RECIPIENTS)}")
    print("=" * 60)
    
    success = 0
    for recipient in RECIPIENTS:
        if send_email(recipient):
            success += 1
    
    print("=" * 60)
    print(f"Complete: {success}/{len(RECIPIENTS)} emails sent")
    print("=" * 60)

if __name__ == "__main__":
    main()
