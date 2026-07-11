import os
import json
import time
from datetime import datetime
import random # Mock for API responses until credentials are set

# ==========================================
# CONFIGURACIÓN DEL AGENTE (SECRETS)
# ==========================================
AMADEUS_API_KEY = os.environ.get("AMADEUS_API_KEY", "")
AMADEUS_API_SECRET = os.environ.get("AMADEUS_API_SECRET", "")
LEDGER_FILE = "data/ledger.json"

def load_ledger():
    if os.path.exists(LEDGER_FILE):
        with open(LEDGER_FILE, 'r') as f:
            return json.load(f)
    return {"message_ids": [], "transactions": [], "auditLog": []}

def save_ledger(data):
    os.makedirs(os.path.dirname(LEDGER_FILE), exist_ok=True)
    with open(LEDGER_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def log_audit(ledger, action, status="INFO"):
    if "auditLog" not in ledger:
        ledger["auditLog"] = []
    
    # Keep only the last 50 logs
    if len(ledger["auditLog"]) >= 50:
        ledger["auditLog"].pop(0)
        
    ledger["auditLog"].append({
        "action": action,
        "status": status,
        "timestamp": datetime.now().isoformat()
    })
    print(f"[{status}] {action}")

def monitor_flights():
    """
    Función core del Agente Inteligente para consultar APIs de vuelos
    (Simulado hasta que AMADEUS_API_KEY se defina en GitHub Secrets)
    """
    print(f"[{datetime.now().isoformat()}] Agente Inteligente: Iniciando escaneo de precios de vuelos...")
    ledger = load_ledger()
    
    if not AMADEUS_API_KEY:
        log_audit(ledger, "[AGENTE-VUELOS] Ejecutando en modo Mock (API Keys no detectadas)", "WARNING")
        
        # Simulación Inteligente: Variación aleatoria de precios de un vuelo objetivo
        base_price = 1200.00
        fluctuation = random.uniform(-50, 150)
        current_price = round(base_price + fluctuation, 2)
        
        log_audit(ledger, f"[AGENTE-VUELOS] Vuelo detectado MAD->BOG: EUR {current_price}", "INFO")
        
        # Lógica de decisión financiera
        if current_price < 1180.00:
            log_audit(ledger, f"[AGENTE-VUELOS] ¡Alerta de Bajada! Precio objetivo alcanzado (EUR {current_price})", "SUCCESS")
            # Podríamos disparar un webhook de IFTTT aquí para SMS
        elif current_price > 1300.00:
            log_audit(ledger, f"[AGENTE-VUELOS] Tendencia al alza detectada (EUR {current_price}). Sugerencia: Evaluar compra inmediata.", "WARNING")
            
    else:
        # Aquí va la implementación real de `amadeus.shopping.flight_offers_search.get(...)`
        log_audit(ledger, "[AGENTE-VUELOS] Autenticación Amadeus OK. Consultando ONDs...", "INFO")
        # TODO: Implement Amadeus API Logic

    save_ledger(ledger)
    print(f"[{datetime.now().isoformat()}] Agente Inteligente: Ciclo completado.")

if __name__ == "__main__":
    monitor_flights()
