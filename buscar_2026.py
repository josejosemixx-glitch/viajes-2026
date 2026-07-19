import imaplib
import email
from email.header import decode_header
import re

def get_credentials():
    return "jose.josemixx@gmail.com", "pjsc bpwi bmfi xoei"

def search_2026():
    username, password = get_credentials()
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(username, password)
        mail.select("inbox")
        
        status, messages = mail.search(None, '(SINCE "01-Jan-2026" BODY "Bogota")')
        msg_nums = messages[0].split()
        print(f"Emails found for Bogota since Jan 2026: {len(msg_nums)}")
        
        for num in msg_nums:
            status, msg_data = mail.fetch(num, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() == "text/plain":
                                try:
                                    print(part.get_payload(decode=True).decode('utf-8', errors='ignore')[:300])
                                except:
                                    pass
                                break
                    else:
                        try:
                            print(msg.get_payload(decode=True).decode('utf-8', errors='ignore')[:300])
                        except:
                            pass
                    print("-" * 50)
    except Exception as e:
        print(f"Error: {e}")

search_2026()
