import imaplib
import email
from email.header import decode_header

def get_credentials():
    return "jose.josemixx@gmail.com", "pjsc bpwi bmfi xoei"

def search_emails():
    username, password = get_credentials()
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(username, password)
        mail.select("inbox")
        status, messages = mail.search(None, '(BODY "samsung")')
        msg_nums = messages[0].split()
        for num in msg_nums[-1:]:
            status, msg_data = mail.fetch(num, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_type() == "text/plain":
                                print(part.get_payload(decode=True).decode('utf-8', errors='ignore'))
                                return
                    else:
                        print(msg.get_payload(decode=True).decode('utf-8', errors='ignore'))
    except Exception as e:
        print(f"Error: {e}")

search_emails()
