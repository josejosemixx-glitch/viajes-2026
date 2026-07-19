const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

try {
    const fn = new Function('window', 'document', 'requestAnimationFrame', 'localStorage', code + `
        return { 
            calculateSleepMetrics, renderExecutiveDashboard, calculateUrgency,
            renderDecisionCenter, renderDecemberTripWidget, renderTraceabilityMatrix,
            renderCashFlowTab, renderFinancesLedgerTab, renderRisksTab, SYSTEM_STATE, ACTIVITIES
        };
    `);
    const mockDoc = {
        addEventListener: () => {},
        getElementById: () => ({ innerHTML: "", querySelectorAll: () => [], addEventListener: () => {}, classList: { add: ()=>{}, remove: ()=>{} }, value: "", dataset: {} }),
        querySelectorAll: () => []
    };
    const ctx = fn({}, mockDoc, (cb) => cb(), { getItem: () => null, setItem: () => {} });
    
    ctx.SYSTEM_STATE.settings.selectedTripId = "VIAJE-2026-08-07-CUSCO";
    ctx.SYSTEM_STATE.settings.selectedDay = 1;

    console.log("Testing functions...");
    const funcs = [
        "calculateSleepMetrics", "renderExecutiveDashboard", "calculateUrgency",
        "renderDecisionCenter", "renderDecemberTripWidget", "renderTraceabilityMatrix",
        "renderCashFlowTab", "renderFinancesLedgerTab", "renderRisksTab"
    ];
    
    for (let f of funcs) {
        try {
            ctx[f]();
            console.log(f + " OK");
        } catch (e) {
            console.log(f + " CRASH:", e.message);
        }
    }
    
} catch (e) {
    console.error("RUNTIME ERROR:", e);
}
