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
        
        status, messages = mail.search(None, '(SINCE "01-Jan-2026")')
        msg_nums = messages[0].split()
        print(f"Total correos en 2026: {len(msg_nums)}")
        
        for num in msg_nums:
            status, msg_data = mail.fetch(num, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding if encoding else "utf-8", errors="ignore")
                    print(f"[{num.decode()}] {subject}")
    except Exception as e:
        print(f"Error: {e}")

search()
