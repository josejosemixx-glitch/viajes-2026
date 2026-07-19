import imaplib
import email
from email.header import decode_header
import re

def get_credentials():
    return "jose.josemixx@gmail.com", "pjsc bpwi bmfi xoei"

def search_all():
    username, password = get_credentials()
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(username, password)
        mail.select("inbox")
        
        # We will search for all emails from airbnb or booking, or containing cordillera
        queries = [
            '(FROM "airbnb.com")',
            '(FROM "booking.com")',
            '(BODY "Cordillera")',
            '(BODY "Simon Bolivar")',
            '(SUBJECT "reserva" BODY "Bogota")'
        ]
        
        for q in queries:
            status, messages = mail.search(None, q)
            msg_nums = messages[0].split()
            print(f"Buscando {q}: encontradas {len(msg_nums)} coincidencias.")
            
            for num in msg_nums[-5:]: # solo los ultimos 5
                status, msg_data = mail.fetch(num, "(RFC822)")
                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])
                        subject, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subject, bytes):
                            subject = subject.decode(encoding if encoding else "utf-8", errors="ignore")
                        date = msg.get("Date", "")
                        print(f"[{q}] Date: {date} | Subject: {subject}")
                        
                        # Extraer un poco de texto
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

search_all()
