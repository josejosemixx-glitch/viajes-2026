import imaplib
import email
from email.header import decode_header
import re

EMAIL = "jose.josemixx@gmail.com"
PASSWORD = "pjsc bpwi bmfi xoei"

def decodificar_cabecera(txt):
    if not txt: return ""
    try:
        dec, enc = decode_header(txt)[0]
        if isinstance(dec, bytes): return dec.decode(enc or "utf-8", errors="replace")
        return dec
    except: return str(txt)

def obtener_cuerpo(msg):
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                try: return part.get_payload(decode=True).decode(errors='ignore')
                except: return ""
    else:
        try: return msg.get_payload(decode=True).decode(errors='ignore')
        except: return ""
    return ""

def buscar():
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(EMAIL, PASSWORD)
    mail.select('"[Gmail]/Todos"')

    palabras_clave = ["pacifico seguros", "visa signature", "airbnb", "cordillera"]
    
    with open("resultados_busqueda.txt", "w", encoding="utf-8") as f:
        for kw in palabras_clave:
            f.write(f"\nBuscando '{kw}'...\n")
            status, messages = mail.search('UTF-8', 'TEXT', f'"{kw}"')
            if status == 'OK' and messages[0]:
                ids = messages[0].split()
                # Últimos 10 correos
                for msg_id in ids[-10:]:
                    st, data = mail.fetch(msg_id, '(RFC822)')
                    if st == 'OK':
                        for rp in data:
                            if isinstance(rp, tuple):
                                msg = email.message_from_bytes(rp[1])
                                sub = decodificar_cabecera(msg.get('subject', ''))
                                sender = decodificar_cabecera(msg.get('from', ''))
                                date = msg.get('date', '')
                                body = obtener_cuerpo(msg)
                                
                                if "airbnb" in kw or "cordillera" in kw or "pacifico" in kw or "visa" in kw:
                                    f.write(f"\n--- MATCH: {kw} ---\n")
                                    f.write(f"Date: {date}\nFrom: {sender}\nSubject: {sub}\nBody:\n{body[:1000]}...\n")
                                    f.write("-" * 50 + "\n")

    mail.logout()

if __name__ == "__main__":
    buscar()
