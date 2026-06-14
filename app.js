// ==========================================
// 1. CONFIGURACIÓN Y ESTADO INICIAL
// ==========================================

// Definición de todos los viajes para la cuenta regresiva global
const TRIPS = [
    { id: "cali-jul", name: "Cali, Colombia", date: new Date("2026-07-02T15:00:00").getTime() },
    { id: "cusco", name: "Lima / Cusco, Perú", date: new Date("2026-08-04T15:00:00").getTime() },
    { id: "bogota", name: "Bogotá, Colombia", date: new Date("2026-09-11T15:00:00").getTime() },
    { id: "europa", name: "Grand Tour Europa", date: new Date("2026-10-12T15:00:00").getTime() },
    { id: "cali-dic", name: "Cali, Colombia (Fin de Año)", date: new Date("2026-12-22T15:00:00").getTime() }
];

let state = {
    checkedItems: {}, // Formato: { "item-id": true/false }
};

// ==========================================
// 2. INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    setupTabs();
    setupTripSelector();
    setupGlobalCountdown();
    initChecklist();
});

// Cargar estado de localStorage
function loadState() {
    try {
        const saved = localStorage.getItem("global_trips_state");
        if (saved) {
            state = JSON.parse(saved);
        }
    } catch (e) {
        console.warn("No se pudo cargar el estado desde localStorage:", e);
    }
}

// Guardar estado en localStorage
function saveState() {
    try {
        localStorage.setItem("global_trips_state", JSON.stringify(state));
    } catch (e) {
        console.warn("No se pudo guardar el estado en localStorage:", e);
    }
}

// ==========================================
// 3. NAVEGACIÓN ENTRE PESTAÑAS (TABS GLOBALES)
// ==========================================
function setupTabs() {
    const navItems = document.querySelectorAll(".nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetId = item.dataset.target;
            
            navItems.forEach(n => n.classList.remove("active"));
            tabPanes.forEach(p => p.classList.remove("active"));
            
            item.classList.add("active");
            document.getElementById(targetId).classList.add("active");
            
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
}

// ==========================================
// 4. SELECTOR DE VIAJES (ITINERARIOS)
// ==========================================
function setupTripSelector() {
    const tripBtns = document.querySelectorAll(".trip-btn");
    const tripContents = document.querySelectorAll(".trip-content");

    tripBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const tripId = btn.dataset.trip;
            
            tripBtns.forEach(b => b.classList.remove("active"));
            tripContents.forEach(c => c.classList.remove("active"));
            
            btn.classList.add("active");
            document.getElementById("content-" + tripId).classList.add("active");
        });
    });
}

// ==========================================
// 5. CUENTA REGRESIVA GLOBAL
// ==========================================
function setupGlobalCountdown() {
    // Encontrar el viaje más próximo que aún no ha pasado
    const now = new Date().getTime();
    let nextTrip = null;

    for (const trip of TRIPS) {
        if (trip.date > now) {
            nextTrip = trip;
            break; // Porque están ordenados cronológicamente
        }
    }

    if (!nextTrip) {
        document.getElementById("countdown-widget").innerHTML = "<h4>¡Todos los viajes de 2026 completados! 🎉</h4>";
        return;
    }

    document.getElementById("next-trip-name").textContent = nextTrip.name;

    const timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const diff = nextTrip.date - currentTime;
        
        if (diff <= 0) {
            clearInterval(timer);
            setupGlobalCountdown(); // Recalcular el siguiente viaje
            return;
        }
        
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById("countdown-days").textContent = String(d).padStart(2, '0');
        document.getElementById("countdown-hours").textContent = String(h).padStart(2, '0');
        document.getElementById("countdown-mins").textContent = String(m).padStart(2, '0');
    }, 1000);
}

// ==========================================
// 6. SISTEMA DE CHECKLIST AUTOMÁTICO
// ==========================================
const PACKING_ITEMS = [
    { id: "doc-pass", text: "Pasaporte vigente" },
    { id: "doc-id", text: "Documento de Identidad (DNI/CC)" },
    { id: "doc-mig", text: "Pre-registro migratorio" },
    { id: "tech-charger", text: "Cargadores y Adaptadores Universales" },
    { id: "fin-cards", text: "Tarjetas de Crédito / Efectivo local" },
    { id: "med-pills", text: "Botiquín personal básico" }
];

function initChecklist() {
    const listContainer = document.getElementById("docs-checklist");
    if (!listContainer) return;
    
    listContainer.innerHTML = "";
    
    PACKING_ITEMS.forEach(item => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.gap = "10px";
        li.style.marginBottom = "10px";
        
        const checked = state.checkedItems[item.id] ? "checked" : "";
        
        li.innerHTML = `
            <input type="checkbox" id="${item.id}" ${checked} style="width: 18px; height: 18px; cursor: pointer;">
            <label for="${item.id}" style="cursor: pointer; text-decoration: ${checked ? 'line-through' : 'none'}; opacity: ${checked ? 0.6 : 1}">${item.text}</label>
        `;
        
        const checkbox = li.querySelector("input");
        const label = li.querySelector("label");
        
        checkbox.addEventListener("change", () => {
            state.checkedItems[item.id] = checkbox.checked;
            saveState();
            label.style.textDecoration = checkbox.checked ? "line-through" : "none";
            label.style.opacity = checkbox.checked ? 0.6 : 1;
        });
        
        listContainer.appendChild(li);
    });
}
