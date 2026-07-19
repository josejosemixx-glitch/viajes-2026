import imaplib
import email
from email.header import decode_header
import re

def get_credentials():
    return "jose.josemixx@gmail.com", "pjsc bpwi bmfi xoei"

def search_emails(query, max_results=20):
    username, password = get_credentials()
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(username, password)
        mail.select("inbox")
        
        status, messages = mail.search(None, query)
        if status != "OK":
            print(f"Error en búsqueda: {status}")
            return
            
        msg_nums = messages[0].split()
        print(f"Encontrados {len(msg_nums)} correos para '{query}'. Mostrando los últimos {max_results}:")
        
        for num in msg_nums[-max_results:]:
            status, msg_data = mail.fetch(num, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding if encoding else "utf-8", errors="ignore")
                    
                    from_header = msg.get("From", "")
                    date_header = msg.get("Date", "")
                    
                    print(f"Date: {date_header}")
                    print(f"From: {from_header}")
                    print(f"Subject: {subject}")
                    
                    if "reserva" in subject.lower() or "confirm" in subject.lower() or "hotel" in subject.lower() or "booking" in subject.lower() or "airbnb" in subject.lower() or "recibo" in subject.lower():
                        if msg.is_multipart():
                            for part in msg.walk():
                                if part.get_content_type() == "text/plain":
                                    try:
                                        body = part.get_payload(decode=True).decode()
                                        print(body[:300])
                                        break
                                    except:
                                        pass
                        else:
                            try:
                                body = msg.get_payload(decode=True).decode()
                                print(body[:300])
                            except:
                                pass
                    print("-" * 50)
                    
    except Exception as e:
        print(f"Error: {e}")

search_emails('(BODY "Bogota" SINCE "01-Jan-2024")')
