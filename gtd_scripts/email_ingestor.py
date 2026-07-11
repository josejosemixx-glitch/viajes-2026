import os
import imaplib
import email
from email.header import decode_header
import json
import re
from datetime import datetime, timedelta

def get_email_credentials():
    # En Github Actions, estos valores vendrán de los Secrets
    gmail_user = os.environ.get("GMAIL_USER", "")
    gmail_pass = os.environ.get("GMAIL_PASS", "")
    hotmail_user = os.environ.get("HOTMAIL_USER", "")
    hotmail_pass = os.environ.get("HOTMAIL_PASS", "")
    return [
        {"user": gmail_user, "pass": gmail_pass, "server": "imap.gmail.com"},
        {"user": hotmail_user, "pass": hotmail_pass, "server": "imap-mail.outlook.com"}
    ]

def extract_dates(text):
    # Regex básica para buscar fechas (ej. 15/09/2026, 10-10-2026)
    dates = re.findall(r'\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b', text)
    return dates

def fetch_itineraries():
    creds = get_email_credentials()
    trips = []
    activities = []
    
    # Base activities id tracker
    act_counter = 100

    for account in creds:
        if not account['user'] or not account['pass']:
            continue
            
        print(f"[{datetime.now().isoformat()}] Conectando a {account['server']}...")
        try:
            mail = imaplib.IMAP4_SSL(account['server'])
            mail.login(account['user'], account['pass'])
            mail.select("inbox")
            
            # Buscar correos de los últimos 30 días
            date = (datetime.now() - timedelta(days=30)).strftime("%d-%b-%Y")
            status, messages = mail.search(None, f'(SINCE "{date}")')
            
            email_ids = messages[0].split()
            print(f"Encontrados {len(email_ids)} correos recientes.")
            
            for e_id in email_ids[-20:]: # Analizamos los últimos 20 para no demorar
                status, msg_data = mail.fetch(e_id, '(RFC822)')
                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])
                        subject, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subject, bytes):
                            subject = subject.decode(encoding if encoding else 'utf-8', errors='ignore')
                        
                        body = ""
                        if msg.is_multipart():
                            for part in msg.walk():
                                if part.get_content_type() == "text/plain":
                                    try:
                                        body += part.get_payload(decode=True).decode(errors='ignore')
                                    except:
                                        pass
                        else:
                            body = msg.get_payload(decode=True).decode(errors='ignore')
                        
                        # LOGICA DE EXTRACCION
                        combined = (subject + " " + body).lower()
                        
                        trip_id = None
                        loc = None
                        if "bogot" in combined or "bogota" in combined:
                            trip_id = "VIAJE-2026-09-15-BOGOTA"
                            loc = "Bogotá"
                        elif "europa" in combined or "madrid" in combined or "paris" in combined:
                            trip_id = "VIAJE-2026-10-12-EUROPA"
                            loc = "Europa"
                        
                        if trip_id and ("vuelo" in combined or "reserva" in combined or "itinerario" in combined or "latam" in combined or "avianca" in combined):
                            print(f"Extrayendo datos de: {subject}")
                            # Extraemos fechas (simplificado)
                            dates_found = extract_dates(combined)
                            
                            act = {
                                "id": f"ACT-SYNC-{act_counter}",
                                "tripId": trip_id,
                                "day": 1,
                                "type": "flight",
                                "time": "12:00",
                                "name": f"Vuelo/Reserva Encontrada: {subject[:30]}...",
                                "description": f"Sincronizado de correo. Revisa tus confirmaciones. Fechas encontradas: {dates_found}",
                                "location": loc,
                                "status": "Confirmado",
                                "icon": "fa-solid fa-plane",
                                "outfit": "Casual"
                            }
                            activities.append(act)
                            act_counter += 1
            
            mail.logout()
        except Exception as e:
            print(f"Error con la cuenta {account['user']}: {e}")

    # Guardar de forma incremental en dynamic_data.json
    file_path = "data/dynamic_data.json"
    
    # Cargar datos existentes
    existing_data = {"trips": [], "activities": []}
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
                if not isinstance(existing_data, dict):
                    existing_data = {"trips": [], "activities": []}
                if "trips" not in existing_data:
                    existing_data["trips"] = []
                if "activities" not in existing_data:
                    existing_data["activities"] = []
        except Exception as e:
            print(f"Error leyendo {file_path}: {e}")

    # Evitar duplicados por título de actividad
    existing_names = {act["name"] for act in existing_data["activities"] if "name" in act}
    existing_ids = {act["id"] for act in existing_data["activities"] if "id" in act}

    new_added = 0
    for act in activities:
        if act["name"] not in existing_names:
            while f"ACT-SYNC-{act_counter}" in existing_ids:
                act_counter += 1
            act["id"] = f"ACT-SYNC-{act_counter}"
            existing_data["activities"].append(act)
            existing_ids.add(act["id"])
            existing_names.add(act["name"])
            new_added += 1

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, indent=4, ensure_ascii=False)
    
    print(f"Sincronizados {new_added} nuevos eventos ({len(existing_data['activities'])} totales) a dynamic_data.json.")

if __name__ == "__main__":
    fetch_itineraries()
