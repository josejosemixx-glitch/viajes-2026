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
        
        # Ampliamos la búsqueda a cualquier cosa que diga "reserva" o "hotel" en 2026
        queries = [
            '(SUBJECT "reserva" SINCE "01-Jan-2026")',
            '(SUBJECT "hotel" SINCE "01-Jan-2026")',
            '(SUBJECT "confirmacion" SINCE "01-Jan-2026")',
            '(BODY "Airbnb" SINCE "01-Jan-2025")'
        ]
        
        for q in queries:
            status, messages = mail.search(None, q)
            msg_nums = messages[0].split()
            print(f"Buscando {q}: encontradas {len(msg_nums)} coincidencias.")
            
            for num in msg_nums:
                status, msg_data = mail.fetch(num, "(RFC822)")
                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])
                        subject, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subject, bytes):
                            subject = subject.decode(encoding if encoding else "utf-8", errors="ignore")
                        print(f"  -> Subject: {subject}")
                        # print first 100 chars of body
                        if msg.is_multipart():
                            for part in msg.walk():
                                if part.get_content_type() == "text/plain":
                                    try:
                                        print("     " + part.get_payload(decode=True).decode('utf-8', errors='ignore')[:100].replace('\n', ' '))
                                    except: pass
                                    break
                        else:
                            try:
                                print("     " + msg.get_payload(decode=True).decode('utf-8', errors='ignore')[:100].replace('\n', ' '))
                            except: pass
    except Exception as e:
        print(f"Error: {e}")

search()
