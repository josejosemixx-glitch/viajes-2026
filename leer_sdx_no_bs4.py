import imaplib
import email
from email.header import decode_header
import re

def get_credentials():
    return "jose.josemixx@gmail.com", "pjsc bpwi bmfi xoei"

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, ' ', raw_html)
    return ' '.join(cleantext.split())

def read_email():
    username, password = get_credentials()
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(username, password)
        mail.select("inbox")
        
        status, messages = mail.search(None, '(SUBJECT "SDXSFJ")')
        msg_nums = messages[0].split()
        for num in msg_nums:
            status, msg_data = mail.fetch(num, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() in ["text/plain", "text/html"]:
                                content = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                                if part.get_content_type() == "text/html":
                                    print(clean_html(content)[:2000])
                                else:
                                    print(content[:2000])
                                return
                    else:
                        content = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
                        if "html" in msg.get_content_type():
                            print(clean_html(content)[:2000])
                        else:
                            print(content[:2000])
    except Exception as e:
        print(f"Error: {e}")

read_email()
