import imaplib
import email
from email.header import decode_header
import datetime

def get_credentials():
    return "jose.josemixx@gmail.com", "pjsc bpwi bmfi xoei"

def search_emails():
    username, password = get_credentials()
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(username, password)
        mail.select("inbox")
        
        # Search emails from today
        date_str = datetime.date.today().strftime("%d-%b-%Y")
        status, messages = mail.search(None, f'(SINCE "{date_str}")')
        if status != "OK":
            print(f"Error en búsqueda: {status}")
            return
            
        msg_nums = messages[0].split()
        print(f"Encontrados {len(msg_nums)} correos de hoy. Mostrando todos:")
        
        for num in msg_nums:
            status, msg_data = mail.fetch(num, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding if encoding else "utf-8", errors="ignore")
                    
                    from_header = msg.get("From", "")
                    print(f"From: {from_header}")
                    print(f"Subject: {subject}")
                    print("-" * 50)
                    
    except Exception as e:
        print(f"Error: {e}")

search_emails()
