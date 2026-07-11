/**
 * CountdownTimerEngine - Motor de Alta Precisión
 * Dependencias: Ninguna (Vanilla JS)
 * Ciclo: requestAnimationFrame
 */

window.CountdownEngine = (function() {
    let activeCountdowns = new Map();
    let isRunning = false;

    // Constantes de Riesgo (en ms)
    const THRESHOLD_ZOZOBRA = 86400000; // 24 horas
    const THRESHOLD_PELIGRO = 7200000;  // 2 horas

    function updateDOM(id, state) {
        const el = document.getElementById(id);
        if (!el) return false; // El elemento ya no existe en DOM

        el.innerHTML = `<span class="mono">${state.text}</span>`;
        
        // Mutación Cromática
        el.classList.remove('status-calma', 'status-zozobra', 'status-peligro');
        el.classList.add(state.cssClass);
        return true;
    }

    function tick() {
        const now = Date.now();
        let activeCount = 0;

        for (let [id, targetEpoch] of activeCountdowns.entries()) {
            const diff = targetEpoch - now;

            if (diff <= 0) {
                // T-Minus Zero (Expirado)
                activeCountdowns.delete(id);
                const el = document.getElementById(id);
                if (el) {
                    el.innerHTML = `<span class="mono">00:00:00 (COMPLETADO)</span>`;
                    el.classList.remove('status-calma', 'status-zozobra');
                    el.classList.add('status-peligro');
                    
                    // Callback Irreversible: Dispatch custom event
                    const actId = el.dataset.actId;
                    if (actId) {
                        window.dispatchEvent(new CustomEvent('countdown-expired', { detail: { activityId: actId } }));
                    }
                }
            } else {
                activeCount++;
                
                // Matemáticas seguras
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / 1000 / 60) % 60);
                const s = Math.floor((diff / 1000) % 60);
                
                const text = d > 0 
                    ? `T-${d}D ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
                    : `T-${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                
                let cssClass = 'status-calma';
                if (diff <= THRESHOLD_PELIGRO) {
                    cssClass = 'status-peligro';
                } else if (diff <= THRESHOLD_ZOZOBRA) {
                    cssClass = 'status-zozobra';
                }

                if (!updateDOM(id, { text, cssClass })) {
                    // Limpieza de memoria si el DOM Node fue removido por cambio de pestaña
                    activeCountdowns.delete(id);
                }
            }
        }

        if (activeCount > 0) {
            requestAnimationFrame(tick);
        } else {
            isRunning = false;
        }
    }

    return {
        register: function(elementId, isoDateString, activityId) {
            const target = Date.parse(isoDateString);
            if (isNaN(target)) return;

            activeCountdowns.set(elementId, target);
            
            const el = document.getElementById(elementId);
            if (el) el.dataset.actId = activityId;

            if (!isRunning) {
                isRunning = true;
                requestAnimationFrame(tick);
            }
        },
        clearAll: function() {
            activeCountdowns.clear();
            isRunning = false;
        }
    };
})();
