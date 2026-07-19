import imaplib
import email
from email.header import decode_header
import datetime

def get_credentials():
    return "jose.josemixx@gmail.com", "pjsc bpwi bmfi xoei"

def read_email():
    username, password = get_credentials()
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(username, password)
        mail.select("inbox")
        
        status, messages = mail.search(None, '(SUBJECT "[CRÍTICO]")')
        if status != "OK":
            return
            
        msg_nums = messages[0].split()
        if not msg_nums:
            return
            
        status, msg_data = mail.fetch(msg_nums[-1], "(RFC822)")
        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])
                if msg.is_multipart():
                    for part in msg.walk():
                        if part.get_content_type() == "text/plain":
                            print(part.get_payload(decode=True).decode())
                            return
                else:
                    print(msg.get_payload(decode=True).decode())
                    
    except Exception as e:
        print(f"Error: {e}")

read_email()
