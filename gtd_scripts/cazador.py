import os
import json
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta

LEDGER_FILE = "data/ledger.json"
GMAIL_USER = os.environ.get("GMAIL_USER")
GMAIL_PASS = os.environ.get("GMAIL_APP_PASS")

# Presupuesto semanal a 13 semanas (Target)
WEEKLY_BUDGET_USD = 500.00
EXCHANGE_RATES = {"USD": 1.0, "PEN": 0.267, "COP": 0.00025, "EUR": 1.08}

def load_ledger():
    if os.path.exists(LEDGER_FILE):
        with open(LEDGER_FILE, 'r') as f:
            return json.load(f)
    return {"transactions": []}

def check_liquidity_and_broken_words(ledger):
    alerts = []
    total_expenses_usd_30d = 0.0
    now = datetime.now()
    thirty_days_ago = now - timedelta(days=30)
    
    # 1. Auditoría de Liquidez a 30 días
    for txn in ledger.get("transactions", []):
        try:
            # Parse RFC2822 date
            from email.utils import parsedate_to_datetime
            txn_date = parsedate_to_datetime(txn["date"]).replace(tzinfo=None)
            
            if thirty_days_ago <= txn_date <= now:
                rate = EXCHANGE_RATES.get(txn["currency"], 1.0)
                amount_usd = txn["amount"] * rate
                total_expenses_usd_30d += amount_usd
                
                # 2. Cazador de Péndulos (Variaciones Atípicas > $200 USD)
                if amount_usd > 200.0:
                    alerts.append(f"[ALERTA PÉNDULO] Gasto atípico detectado: {txn['currency']} {txn['amount']} de {txn['sender']}")
        except:
            continue
            
    # Comparar contra KPI a 13 Semanas (aprox 4.3 semanas en 30 días = $2150 USD)
    TARGET_30D = WEEKLY_BUDGET_USD * 4.33
    if total_expenses_usd_30d > TARGET_30D:
        alerts.append(f"[RIESGO LIQUIDEZ] Desviación detectada. Gasto 30D (USD {total_expenses_usd_30d:.2f}) excede presupuesto (USD {TARGET_30D:.2f}).")
        
    return alerts, total_expenses_usd_30d

def emit_alert_report(alerts, total_expenses):
    if not alerts:
        print("[INFO] Consistencia interna verificada. Sin palabras rotas.")
        return
        
    if not GMAIL_USER or not GMAIL_PASS:
        print("[WARNING] Alertas detectadas pero no hay credenciales SMTP.")
        for a in alerts:
            print(a)
        return

    report = "=== CEREBRO DIGITAL: REPORTE DE AUDITORÍA ===\n\n"
    report += f"Gasto Consolidado 30D: USD {total_expenses:.2f}\n"
    report += "-"*40 + "\n"
    for alert in alerts:
        report += f"{alert}\n"
    report += "-"*40 + "\n"
    report += "Acción requerida: Revisar Dashboard.\n"

    try:
        msg = EmailMessage()
        msg.set_content(report)
        msg['Subject'] = "[CRÍTICO] CFO Action Required: Alertas de Liquidez y Péndulos"
        msg['From'] = GMAIL_USER
        msg['To'] = GMAIL_USER

        s = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        s.login(GMAIL_USER, GMAIL_PASS)
        s.send_message(msg)
        s.quit()
        print("[SUCCESS] Reporte sintético emitido por correo.")
    except Exception as e:
        print(f"[ERROR] No se pudo enviar el reporte: {str(e)}")

if __name__ == "__main__":
    print(f"[{datetime.now().isoformat()}] Iniciando Cazador de Péndulos...")
    ledger_data = load_ledger()
    if not ledger_data.get("transactions"):
        print("[INFO] Ledger vacío. Abortando auditoría.")
        exit(0)
        
    detected_alerts, expenses = check_liquidity_and_broken_words(ledger_data)
    emit_alert_report(detected_alerts, expenses)
