#!/bin/bash
# ==========================================
# CEREBRO DIGITAL - SINCRONIZACIÓN CRÍTICA
# ==========================================
# Script de auditoría de consistencia entre el entorno local
# y el repositorio en GitHub (Branch: main).

echo "=== INICIANDO AUDITORÍA DE SINCRONIZACIÓN (ZERO TOLERANCE) ==="

# 1. Verificar estado del árbol de trabajo
STATUS=$(git status --porcelain)

if [ -n "$STATUS" ]; then
    echo "[CRÍTICO] Inconsistencia detectada. Existen archivos locales sin versionar o modificados:"
    echo "$STATUS"
    echo ""
    echo "[ACCIÓN] Sincronizando de forma automática..."
    git add .
    git commit -m "Auto-Sync Crítico: Mantenimiento de consistencia local vs remote"
    git push origin main
    echo "[SUCCESS] Estado local persistido y subido a la nube."
else
    echo "[INFO] Árbol de trabajo local completamente limpio."
fi

# 2. Verificar sincronización con origen (Fetch & Status)
echo "[INFO] Verificando paridad con GitHub (origin/main)..."
git fetch origin main >/dev/null 2>&1

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})
BASE=$(git merge-base @ @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "[SUCCESS] Paridad absoluta. Entorno local alineado con la Caja Negra en GitHub."
elif [ $LOCAL = $BASE ]; then
    echo "[WARNING] El repositorio local está desactualizado respecto a la nube (GitOps ha modificado el ledger)."
    echo "[ACCIÓN] Ejecutando pull automático..."
    git pull origin main
    echo "[SUCCESS] Desfase corregido. Ledger sincronizado localmente."
elif [ $REMOTE = $BASE ]; then
    echo "[WARNING] Tienes commits locales sin subir a GitHub."
    echo "[ACCIÓN] Ejecutando push automático..."
    git push origin main
    echo "[SUCCESS] Desfase corregido. La nube ha sido actualizada."
else
    echo "[PELIGRO] Se ha detectado una divergencia crítica en el historial de Git (conflictos posibles)."
    echo "Aborta operaciones manuales y revisa el repositorio."
    exit 1
fi

echo "=== AUDITORÍA FINALIZADA ==="
exit 0
