import imaplib
import email
from email.header import decode_header
import re

EMAIL = "jose.josemixx@gmail.com"
PASSWORD = "pjsc bpwi bmfi xoei"

def conectar_imap():
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(EMAIL, PASSWORD)
        return mail
    except Exception as e:
        print(f"Error al conectar: {e}")
        return None

def decodificar_cabecera(txt):
    if not txt:
        return ""
    try:
        dec, encoding = decode_header(txt)[0]
        if isinstance(dec, bytes):
            return dec.decode(encoding or "utf-8", errors="replace")
        return dec
    except:
        return str(txt)

def obtener_cuerpo(msg):
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                try:
                    return part.get_payload(decode=True).decode(errors='ignore')
                except:
                    return ""
    else:
        try:
            return msg.get_payload(decode=True).decode(errors='ignore')
        except:
            return ""
    return ""

def buscar_correos():
    mail = conectar_imap()
    if not mail:
        return

    # Buscar la carpeta Todos o All Mail
    status, folders = mail.list()
    selected = "INBOX"
    for folder in folders:
        f_str = folder.decode('utf-8')
        if "Todos" in f_str or "All Mail" in f_str:
            import re
            match = re.search(r'"([^"]+)"$', f_str)
            if match:
                selected = f'"{match.group(1)}"'
            else:
                selected = f_str.split()[-1]
            break
            
    print(f"Seleccionando: {selected}")
    status, res = mail.select(selected)
    if status != 'OK':
        mail.select("INBOX")

    # Palabras clave a buscar en todo el mensaje (cuerpo + asunto)
    palabras_clave = ["pacifico", "visa signature", "airbnb", "cordillera", "cordilera", "seguro de viaje"]
    
    correos_encontrados = []
    ids_procesados = set()

    for kw in palabras_clave:
        print(f"Buscando '{kw}'...")
        # Búsqueda TEXT incluye cuerpo y asunto
        status, messages = mail.search('UTF-8', 'TEXT', f'"{kw}"')
        if status == 'OK' and messages[0]:
            ids = messages[0].split()
            # Tomamos los últimos 5 para no demorar
            for msg_id in ids[-5:]:
                if msg_id in ids_procesados:
                    continue
                ids_procesados.add(msg_id)
                
                status, data = mail.fetch(msg_id, '(RFC822)')
                if status == 'OK':
                    for response_part in data:
                        if isinstance(response_part, tuple):
                            msg = email.message_from_bytes(response_part[1])
                            subject = decodificar_cabecera(msg.get('subject', ''))
                            sender = decodificar_cabecera(msg.get('from', ''))
                            date = msg.get('date', '')
                            body = obtener_cuerpo(msg)
                            
                            print(f"\n--- MATCH: {kw} ---")
                            print(f"Date: {date}")
                            print(f"From: {sender}")
                            print(f"Subject: {subject}")
                            print(f"Body: {body[:1000]}...")
                            print("-" * 50)

    mail.logout()

if __name__ == "__main__":
    buscar_correos()
