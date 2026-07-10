import os
import imaplib
import email
from email.header import decode_header
import json
import re
from datetime import datetime, timedelta

# ==========================================
# CONFIGURACIÓN DE ENTORNO (SECRETS)
# ==========================================
GMAIL_USER = os.environ.get("GMAIL_USER")
GMAIL_PASS = os.environ.get("GMAIL_APP_PASS")
HOTMAIL_USER = os.environ.get("HOTMAIL_USER")
HOTMAIL_PASS = os.environ.get("HOTMAIL_APP_PASS")
LEDGER_FILE = "data/ledger.json"

def load_ledger():
    if os.path.exists(LEDGER_FILE):
        with open(LEDGER_FILE, 'r') as f:
            return json.load(f)
    return {"message_ids": [], "transactions": [], "last_run": None}

def save_ledger(data):
    os.makedirs(os.path.dirname(LEDGER_FILE), exist_ok=True)
    with open(LEDGER_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def extract_amount_and_currency(text):
    # Regex estricto para extraer importes
    patterns = [
        (r'USD\s*\$?\s*([\d,\.]+)', 'USD'),
        (r'\$\s*([\d,\.]+)\s*USD', 'USD'),
        (r'S/\s*([\d,\.]+)', 'PEN'),
        (r'COP\s*\$?\s*([\d,\.]+)', 'COP'),
        (r'EUR\s*€?\s*([\d,\.]+)', 'EUR'),
        (r'\$\s*([\d,\.]+)', 'USD') # Fallback genérico a USD
    ]
    for pattern, currency in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            clean_val = match.group(1).replace(',', '')
            try:
                return float(clean_val), currency
            except:
                pass
    return 0.0, 'UNKNOWN'

def fetch_emails():
    ledger = load_ledger()
    processed_ids = set(ledger.get("message_ids", []))
    
    accounts = []
    if GMAIL_USER and GMAIL_PASS:
        accounts.append({"host": "imap.gmail.com", "user": GMAIL_USER, "pass": GMAIL_PASS, "type": "GMAIL"})
    if HOTMAIL_USER and HOTMAIL_PASS:
        accounts.append({"host": "outlook.office365.com", "user": HOTMAIL_USER, "pass": HOTMAIL_PASS, "type": "HOTMAIL"})
        
    if not accounts:
        print("[ERROR] Credenciales no detectadas en ninguna cuenta. Abortando.")
        exit(1)
        
    new_transactions = 0
    
    for acc in accounts:
        try:
            print(f"[*] Conectando a {acc['type']} ({acc['user']})...")
            mail = imaplib.IMAP4_SSL(acc["host"])
            mail.login(acc["user"], acc["pass"])
            
            if acc["type"] == "GMAIL":
                status, _ = mail.select('"[Gmail]/All Mail"')
                if status != "OK":
                    status, _ = mail.select('"[Gmail]/Todos"')
                    if status != "OK":
                        mail.select("INBOX")
            else:
                mail.select("INBOX")
                
        # Buscar correos de las últimas 48 horas (redundancia de seguridad)
        date_since = (datetime.now() - timedelta(days=2)).strftime("%d-%b-%Y")
        status, data = mail.search(None, f'(SINCE "{date_since}")')
        
        new_transactions = 0
        
        if status == "OK" and data[0]:
            for num in data[0].split():
                # Fetch Message-ID first para deduplicación estricta
                status, msg_data = mail.fetch(num, '(BODY[HEADER.FIELDS (MESSAGE-ID)])')
                msg_id = ""
                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        msg_id = response_part[1].decode(errors='ignore').strip()
                
                if msg_id in processed_ids or not msg_id:
                    continue
                    
                # Fetch full email si es nuevo
                status, full_data = mail.fetch(num, '(RFC822)')
                for response_part in full_data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])
                        
                        sender = str(msg.get("From", "")).lower()
                        # Filtro estricto de remitentes financieros/operativos
                        if not any(k in sender for k in ["bcp", "interbank", "uber", "latam", "airbnb", "factura", "nomina", "pago"]):
                            continue
                            
                        # Extraer fecha
                        date_str = msg.get("Date", "")
                        
                        # Extraer cuerpo (priorizar texto plano)
                        body = ""
                        if msg.is_multipart():
                            for part in msg.walk():
                                if part.get_content_type() == "text/plain":
                                    payload = part.get_payload(decode=True)
                                    if payload:
                                        body += payload.decode(errors="ignore")
                        else:
                            payload = msg.get_payload(decode=True)
                            if payload:
                                body = payload.decode(errors="ignore")
                                
                        amount, curr = extract_amount_and_currency(body)
                        if amount > 0:
                            ledger["transactions"].append({
                                "msg_id": msg_id,
                                "date": date_str,
                                "sender": sender,
                                "amount": amount,
                                "currency": curr,
                                "timestamp": datetime.now().isoformat()
                            })
                            new_transactions += 1
                            
                processed_ids.add(msg_id)
                ledger["message_ids"].append(msg_id)
                
            mail.logout()
            
        except Exception as e:
            print(f"[CRITICAL] Fallo en la ingesta IMAP para {acc['user']}: {str(e)}")
            continue
            
    ledger["last_run"] = datetime.now().isoformat()
    save_ledger(ledger)
    print(f"[SUCCESS] Ingesta completada. {new_transactions} transacciones nuevas registradas.")

if __name__ == "__main__":
    print(f"[{datetime.now().isoformat()}] Iniciando Motor de Ingesta Autónoma...")
    fetch_emails()
