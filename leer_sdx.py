import imaplib
import email
from email.header import decode_header
from bs4 import BeautifulSoup

def get_credentials():
    return "jose.josemixx@gmail.com", "pjsc bpwi bmfi xoei"

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
                                    soup = BeautifulSoup(content, 'html.parser')
                                    print(soup.get_text(separator='\n', strip=True)[:1000])
                                else:
                                    print(content[:1000])
                                return
                    else:
                        content = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
                        if "html" in msg.get_content_type():
                            soup = BeautifulSoup(content, 'html.parser')
                            print(soup.get_text(separator='\n', strip=True)[:1000])
                        else:
                            print(content[:1000])
    except Exception as e:
        print(f"Error: {e}")

read_email()
