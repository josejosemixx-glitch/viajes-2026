import imaplib
import email
from email.header import decode_header
import re

def get_credentials():
    return "jose.josemixx@gmail.com", "pjsc bpwi bmfi xoei"

def search():
    username, password = get_credentials()
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(username, password)
        mail.select("inbox")
        
        status, messages = mail.search(None, '(FROM "airbnb.com" SINCE "01-Jan-2026")')
        msg_nums = messages[0].split()
        print(f"Airbnb since 2026: {len(msg_nums)}")
        
        status, messages = mail.search(None, '(FROM "booking.com" SINCE "01-Jan-2026")')
        msg_nums = messages[0].split()
        print(f"Booking since 2026: {len(msg_nums)}")
        
        status, messages = mail.search(None, '(BODY "Cordillera" SINCE "01-Jan-2026")')
        msg_nums = messages[0].split()
        print(f"Cordillera since 2026: {len(msg_nums)}")
        
    except Exception as e:
        print(f"Error: {e}")

search()
