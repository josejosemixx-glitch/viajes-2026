window.addEventListener('error', function(e) {
    document.body.innerHTML = '<div style="background:red;color:white;padding:50px;font-size:24px;z-index:9999;position:fixed;top:0;left:0;width:100%;height:100%;">' + e.message + '<br>' + e.filename + ':' + e.lineno + '<br><pre>' + (e.error ? e.error.stack : '') + '</pre></div>';
});
window.addEventListener('unhandledrejection', function(e) {
    document.body.innerHTML = '<div style="background:red;color:white;padding:50px;font-size:24px;z-index:9999;position:fixed;top:0;left:0;width:100%;height:100%;">Unhandled Promise Rejection: ' + e.reason + '</div>';
});

// ==========================================
// DATA LEDGER INITIAL VALUES
// ==========================================

const DEFAULT_TRIPS = [
    {
        id: "VIAJE-2026-08-07-CUSCO",
        name: "Cusco Agosto",
        destination: "Cusco, Perú",
        startDate: "2026-08-07",
        endDate: "2026-08-10",
        budget: 4585.00,
        status: "confirmed",
        riskLevel: "Medio",
        pax: 2,
        days: 4
    },
    {
        id: "VIAJE-2026-07-02-CALI",
        name: "Cali Julio",
        destination: "Cali, Colombia",
        startDate: "2026-07-02",
        endDate: "2026-07-06",
        budget: 1078.22,
        status: "completed",
        riskLevel: "Bajo",
        pax: 1,
        days: 5
    },
    {
        id: "VIAJE-2026-07-21-MEXICO",
        name: "México (Trabajo)",
        destination: "Ciudad de México, México",
        startDate: "2026-07-21",
        endDate: "2026-08-05",
        budget: 2000.00,
        status: "confirmed",
        riskLevel: "Medio",
        pax: 1,
        days: 16
    },
    {
        id: "VIAJE-2026-12-22-CALI",
        name: "Cali Diciembre",
        destination: "Cali, Colombia",
        startDate: "2026-12-22",
        endDate: "2027-01-04",
        budget: 2750.00,
        status: "planned",
        riskLevel: "Alto",
        pax: 1,
        days: 14
    },
    {
        id: "VIAJE-2026-09-11-BOGOTA",
        name: "Bogotá Septiembre",
        destination: "Bogotá, Colombia",
        startDate: "2026-09-11",
        endDate: "2026-09-14",
        budget: 1500.00,
        status: "confirmed",
        riskLevel: "Bajo",
        pax: 1,
        days: 4
    },
    {
        id: "VIAJE-2026-09-21-MADRID",
        name: "Madrid (Trabajo)",
        destination: "Madrid, España",
        startDate: "2026-09-21",
        endDate: "2026-09-30",
        budget: 2500.00,
        status: "confirmed",
        riskLevel: "Medio",
        pax: 1,
        days: 10
    },
    {
        id: "VIAJE-2026-10-12-EUROPA",
        name: "Europa Octubre-Noviembre",
        destination: "Europa (Múltiples)",
        startDate: "2026-10-12",
        endDate: "2026-11-01",
        budget: 5000.00,
        status: "confirmed",
        riskLevel: "Medio", // risk decreases since flight is bought
        pax: 1,
        days: 21
    }
];

const CLIMATE_DATA = {
    "VIAJE-2026-08-07-CUSCO": {
        tempRange: "0°C - 20°C",
        condition: "Frío Seco / Soleado",
        description: "Estación seca andina. Radiación solar extremadamente alta durante el día, pero descenso térmico abrupto por la noche rozando los 0°C.",
        recommendations: "Vestirse en capas (cebolla). Gorro, guantes, protector solar SPF 50+, lentes de sol, cacao para labios y medicación para la altura."
    },
    "VIAJE-2026-07-02-CALI": {
        tempRange: "18°C - 32°C",
        condition: "Cálido Húmedo / Tropical",
        description: "Clima cálido tropical con humedad constante. Brisa fresca del Pacífico ('brisa de la tarde') al caer el sol.",
        recommendations: "Prendas muy frescas de algodón/lino, repelente, hidratación constante y calzado cómodo ligero."
    },
    "VIAJE-2026-07-21-MEXICO": {
        tempRange: "13°C - 24°C",
        condition: "Templado / Lluvioso",
        description: "Temporada de lluvias de verano. Mañanas templadas y soleadas, tardes/noches con lluvias fuertes o tormentas dispersas.",
        recommendations: "Chaqueta impermeable ligera o paraguas portátil, zapatos resistentes al agua para caminatas en ciudad y abrigo ligero."
    },
    "VIAJE-2026-12-22-CALI": {
        tempRange: "18°C - 33°C",
        condition: "Caluroso / Tropical",
        description: "Clima festivo muy cálido de fin de año ideal para la Feria de Cali. Alta humedad.",
        recommendations: "Camisas guayaberas frescas, ropa ligera de colores claros, bloqueador solar y calzado apto para eventos de baile."
    },
    "VIAJE-2026-09-11-BOGOTA": {
        tempRange: "9°C - 19°C",
        condition: "Templado Frío / Lluvia",
        description: "Clima de altura andina nublado. Lloviznas frecuentes e inesperadas ('chubascos'). Humedad que acentúa el frío.",
        recommendations: "Chaqueta impermeable gruesa/cortavientos, zapatillas cerradas muy cómodas para el Festival Cordillera, paraguas."
    },
    "VIAJE-2026-09-21-MADRID": {
        tempRange: "14°C - 26°C",
        condition: "Templado Seco / Soleado",
        description: "Otoño temprano muy agradable. Días templados y soleados ideales para caminar, noches frescas.",
        recommendations: "Ropa semi-formal de negocios, camisas x5, blazer, calzado formal cómodo y abrigo ligero para la noche."
    },
    "VIAJE-2026-10-12-EUROPA": {
        tempRange: "6°C - 18°C",
        condition: "Otoño Frío / Lluvioso",
        description: "Otoño consolidado con descensos térmicos marcados en Madrid y París (noches frías de 6°C). Roma más suave. Lluvia ocasional.",
        recommendations: "Abrigo grueso cortavientos, ropa térmica interior (talla XXL), bufanda, calzado resistente al agua y paraguas plegable."
    }
};

const DEFAULT_PAYMENTS = [
    // --- CALI JULIO ---
    { id: "FIN-CAL-JUL-001", tripId: "VIAJE-2026-07-02-CALI", concept: "Vuelo LATAM", amount: 465.00, currency: "USD", status: "paid", dueDate: "2026-06-05", classification: "CONFIRMADA", category: "Logística", notes: "Tarifa Light. Carry-on incluido." },
    { id: "FIN-CAL-JUL-002", tripId: "VIAJE-2026-07-02-CALI", concept: "Airbnb Cali", amount: 178.22, currency: "USD", status: "paid", dueDate: "2026-06-23", classification: "CONFIRMADA", category: "Logística", notes: "Reserva activa. Débito automático programado." },
    { id: "FIN-CAL-JUL-003", tripId: "VIAJE-2026-07-02-CALI", concept: "Alimentación y Eventos", amount: 325.00, currency: "USD", status: "paid", dueDate: "2026-07-02", classification: "CONFIRMADA", category: "Entretenimiento", notes: "$175.00 viáticos + $150.00 cena cumpleaños Victoria." },
    { id: "FIN-CAL-JUL-004", tripId: "VIAJE-2026-07-02-CALI", concept: "Movilidad Uber", amount: 110.00, currency: "USD", status: "paid", dueDate: "2026-07-02", classification: "CONFIRMADA", category: "Logística", notes: "Vehículos tipo Comfort o superior por ergonomía (2.00m)." },

    // --- CALI DICIEMBRE ---
    { id: "FIN-CAL-DIC-001", tripId: "VIAJE-2026-12-22-CALI", concept: "Vuelo Cali Diciembre", amount: 1300.00, currency: "USD", status: "pending", dueDate: "2026-07-15", classification: "ESTIMADA", category: "Logística", notes: "Vuelos Premium Economy (LATAM). Requiere espacio ergonómico." },
    { id: "FIN-CAL-DIC-002", tripId: "VIAJE-2026-12-22-CALI", concept: "Airbnb Cali Diciembre", amount: 650.00, currency: "USD", status: "pending", dueDate: "2026-08-30", classification: "PROYECTADA", category: "Logística", notes: "Alojamiento Airbnb (13 noches). Temporada de Feria de Cali." },
    { id: "FIN-CAL-DIC-003", tripId: "VIAJE-2026-12-22-CALI", concept: "Viáticos Feria Cali", amount: 600.00, currency: "USD", status: "pending", dueDate: "2026-12-22", classification: "ESTIMADA", category: "Entretenimiento", notes: "Salsódromo, conciertos, eventos y comidas en Cali." },
    { id: "FIN-CAL-DIC-004", tripId: "VIAJE-2026-12-22-CALI", concept: "Seguro de viaje Cali", amount: 50.00, currency: "USD", status: "pending", dueDate: "2026-12-15", classification: "ESTIMADA", category: "Logística", notes: "Seguro médico de asistencia en viaje." },
    { id: "FIN-CAL-DIC-005", tripId: "VIAJE-2026-12-22-CALI", concept: "Traslado Aeropuerto Cali", amount: 150.00, currency: "USD", status: "pending", dueDate: "2026-12-22", classification: "ESTIMADA", category: "Logística", notes: "Movilidad local en Uber Comfort." },
    
    // --- EUROPA (MADRID) SEPTIEMBRE ---
    { id: "FIN-EUR-OCT-001", tripId: "VIAJE-2026-10-12-EUROPA", concept: "Vuelo LIM-MAD-LIM (PlusUltra)", amount: 1398.84, currency: "USD", status: "paid", dueDate: "2026-07-14", classification: "CONFIRMADA", category: "Logística", notes: "Localizador: ZVRGTI. Vuelo PU 302 y PU 301. Pagado por Crear Poder Sin Limites." },

    // --- BOGOTÁ SEPTIEMBRE ---
    { id: "FIN-BOG-SEP-001", tripId: "VIAJE-2026-09-11-BOGOTA", concept: "Vuelo LIM-BOG-LIM (LATAM)", amount: 549.20, currency: "USD", status: "paid", dueDate: "2026-07-11", classification: "CONFIRMADA", category: "Logística", notes: "Localizador: MVARPG. Vuelo directo." },
    { id: "FIN-BOG-SEP-002", tripId: "VIAJE-2026-09-11-BOGOTA", concept: "Seguro de viaje Pacífico Seguros (Póliza 21075357) TC Signature", amount: 0.00, currency: "USD", status: "paid", dueDate: "2026-07-15", classification: "CONFIRMADA", category: "Logística", notes: "Cobertura de seguro mediante Tarjeta de Crédito Signature y Pacífico Seguros." },
    { id: "FIN-BOG-SEP-003", tripId: "VIAJE-2026-09-11-BOGOTA", concept: "Hospedaje Airbnb (Chapinero)", amount: 135.63, currency: "USD", status: "paid", dueDate: "2026-07-15", classification: "CONFIRMADA", category: "Hospedaje", notes: "LOFT MODERNO Y ACOGEDOR (Anfitrión: YOJAM). Calle 57 #8-24." },

    // --- MADRID SEPTIEMBRE ---
    { id: "FIN-MAD-SEP-001", tripId: "VIAJE-2026-09-21-MADRID", concept: "Vuelo LIM-MAD-LIM (Plus Ultra)", amount: 1398.84, currency: "USD", status: "paid", dueDate: "2026-07-14", classification: "CONFIRMADA", category: "Logística", notes: "Localizador: ZVRGTI. Viaje de trabajo (Pagado por Crear Poder Sin Limites)." },

    // --- MEXICO JULIO/AGOSTO ---
    { id: "FIN-MEX-JUL-001", tripId: "VIAJE-2026-07-21-MEXICO", concept: "Vuelo LIM-MEX-LIM (Volaris)", amount: 800.00, currency: "USD", status: "paid", dueDate: "2026-07-14", classification: "CONFIRMADA", category: "Logística", notes: "Localizador: XEJP2M. Viaje de trabajo (Pagado por Crear Poder Sin Limites)." },

    // --- CUSCO AGOSTO (NUEVO) ---
    { id: "FIN-CUZ-AGO-001", tripId: "VIAJE-2026-08-07-CUSCO", concept: "Paquete Cusco (Apu Andino)", amount: 2375.00, currency: "PEN", status: "paid", dueDate: "2026-07-08", classification: "CONFIRMADA", category: "Logística", notes: "Prepagado a IZI*Peru Expeditions Travel. Visa Signature ****8778 (3 cuotas)." },
    { id: "FIN-CUZ-AGO-002", tripId: "VIAJE-2026-08-07-CUSCO", concept: "Tour Paracas/Ica (Angelica)", amount: 280.00, currency: "PEN", status: "pending", dueDate: "2026-08-05", classification: "ESTIMADA", category: "Actividades", notes: "Tour de un día completo para Angelica." },
    { id: "FIN-CUZ-AGO-003", tripId: "VIAJE-2026-08-07-CUSCO", concept: "Traslados Aeropuerto (Lima)", amount: 340.00, currency: "PEN", status: "pending", dueDate: "2026-08-07", classification: "PROYECTADA", category: "Logística", notes: "4 tramos (ida y vuelta del aeropuerto en Uber/Cabify Black)." },
    { id: "FIN-CUZ-AGO-004", tripId: "VIAJE-2026-08-07-CUSCO", concept: "Ubers/Cabify Locales (Lima)", amount: 180.00, currency: "PEN", status: "pending", dueDate: "2026-08-07", classification: "PROYECTADA", category: "Logística", notes: "Ubers rápidos de traslado interno." },
    { id: "FIN-CUZ-AGO-005", tripId: "VIAJE-2026-08-07-CUSCO", concept: "Viáticos Cusco (Comidas/Ocio)", amount: 760.00, currency: "PEN", status: "pending", dueDate: "2026-08-08", classification: "ESTIMADA", category: "Alimentación", notes: "Cenas libres en Cusco y Aguas Calientes." },
    { id: "FIN-CUZ-AGO-006", tripId: "VIAJE-2026-08-07-CUSCO", concept: "Viáticos Lima (Comidas/Ocio)", amount: 650.00, currency: "PEN", status: "pending", dueDate: "2026-08-04", classification: "ESTIMADA", category: "Alimentación", notes: "Cena de bienvenida, Punto Azul, 7 Sopas, etc." },
    { id: "FIN-CUZ-AGO-007", tripId: "VIAJE-2026-08-07-CUSCO", concept: "Vuelo LIM-CUZ-LIM (LATAM)", amount: 155100.00, currency: "COP", status: "paid", dueDate: "2026-07-14", classification: "CONFIRMADA", category: "Logística", notes: "Pagado con 10,621 Millas LATAM Pass + Tasas COP 155,100. Localizador: KMTEYF." }
];

const DEFAULT_RISKS = [
    {
        id: "RISK-001",
        tripId: "VIAJE-2026-12-22-CALI",
        concept: "Cali Diciembre sin emitir",
        status: "Sin emitir",
        level: "CRÍTICO",
        probability: 5,
        impact: 5,
        mitigation: "Comprar pasajes antes del 15 de julio para evitar incrementos esperados del 40-60%."
    },
    {
        id: "RISK-005",
        tripId: "VIAJE-2026-12-22-CALI",
        concept: "Cotización Cali Diciembre",
        status: "Pendiente de cotización",
        level: "ALTO",
        probability: 5,
        impact: 4,
        mitigation: "Establecer presupuesto detallado para pasajes, estadía y eventos de feria antes de quincena de agosto."
    }
];

const ACTIVITIES = [
    // --- BOGOTÁ SEPTIEMBRE ---
    { id: "act-bog-1-salida", tripId: "VIAJE-2026-09-11-BOGOTA", day: 1, name: "🚕 Salida al Aeropuerto LIM", startTime: "12:00", endTime: "12:50", priority: "Alta", location: "Hacia el Aeropuerto", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-bog-1-checkin-vuelo", tripId: "VIAJE-2026-09-11-BOGOTA", day: 1, name: "🛂 Check-in LATAM y Controles", startTime: "12:50", endTime: "13:50", priority: "Alta", location: "Aeropuerto Jorge Chávez", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-bog-1-vuelo", tripId: "VIAJE-2026-09-11-BOGOTA", day: 1, name: "✈️ Vuelo Lima ➔ Bogotá (LATAM LA4905)", startTime: "15:50", endTime: "19:05", priority: "Critical", location: "Aeropuerto El Dorado (BOG)", category: "Vuelos", owner: "jose", status: "Confirmado" },
    { id: "act-bog-1-hospedaje", tripId: "VIAJE-2026-09-11-BOGOTA", day: 1, name: "🏠 Llegada y Check-in Airbnb (YOJAM)", startTime: "21:00", endTime: "21:30", priority: "Alta", location: "Calle 57 #8-24, Bogotá", category: "Alojamiento", owner: "jose", status: "Confirmado", notes: "LOFT MODERNO. Check-in ajustado tras llegada." },
    // Día 1 Cordillera
    { id: "act-bog-2-art1", tripId: "VIAJE-2026-09-11-BOGOTA", day: 2, name: "🎺 Llegada y The Latin Brothers (Esc. Cotopaxi)", startTime: "14:00", endTime: "15:00", priority: "Alta", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-2-art2", tripId: "VIAJE-2026-09-11-BOGOTA", day: 2, name: "🏖️ Beéle (Escenario Cocuy)", startTime: "15:15", endTime: "16:00", priority: "Alta", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-2-art3", tripId: "VIAJE-2026-09-11-BOGOTA", day: 2, name: "🎤 Miguel Mateos (Escenario Aconcagua)", startTime: "16:15", endTime: "17:15", priority: "Critical", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-2-art4", tripId: "VIAJE-2026-09-11-BOGOTA", day: 2, name: "🎸 Andrés Cepeda con Poligamia (Esc. Cordillera)", startTime: "17:30", endTime: "18:30", priority: "Critical", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-2-art5", tripId: "VIAJE-2026-09-11-BOGOTA", day: 2, name: "🇯🇲 Dread Mar I (Escenario Cotopaxi)", startTime: "18:45", endTime: "19:45", priority: "Alta", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-2-art6", tripId: "VIAJE-2026-09-11-BOGOTA", day: 2, name: "🌴 Cultura Profética (Escenario Aconcagua)", startTime: "20:00", endTime: "21:00", priority: "Critical", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-2-art7", tripId: "VIAJE-2026-09-11-BOGOTA", day: 2, name: "💃 Grupo Niche (Escenario Cordillera)", startTime: "21:15", endTime: "22:15", priority: "Critical", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-2-art8", tripId: "VIAJE-2026-09-11-BOGOTA", day: 2, name: "🇯🇲 Sean Paul (Escenario Cocuy)", startTime: "22:15", endTime: "23:15", priority: "Alta", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-2-art9", tripId: "VIAJE-2026-09-11-BOGOTA", day: 2, name: "🤘 Andrés Calamaro [Cabeza de Cartel] (Esc. Cordillera)", startTime: "23:15", endTime: "00:45", priority: "Critical", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },

    // Día 2 Cordillera
    { id: "act-bog-3-art1", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🎸 Los de Adentro (Escenario Cotopaxi)", startTime: "14:00", endTime: "14:45", priority: "Media", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-3-art2", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🤘 Doctor Krápula (Escenario Cocuy)", startTime: "15:00", endTime: "15:45", priority: "Alta", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-3-art3", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🎤 Dante Spinetta (Escenario Aconcagua)", startTime: "16:00", endTime: "16:45", priority: "Alta", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-3-art4", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🎸 Jarabe de Palo (Escenario Cordillera)", startTime: "17:00", endTime: "17:45", priority: "Critical", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-3-art5", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🕺 Los Amigos Invisibles (Escenario Cotopaxi)", startTime: "18:00", endTime: "18:45", priority: "Alta", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-3-art6", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🌴 Vicente García (Escenario Cocuy)", startTime: "18:45", endTime: "19:30", priority: "Alta", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-3-art7", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🎙️ Kany García (Escenario Aconcagua)", startTime: "19:30", endTime: "20:30", priority: "Critical", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-3-art8", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🎸 Draco Rosa (Escenario Cotopaxi)", startTime: "20:30", endTime: "21:30", priority: "Alta", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-3-art9", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🤘 Mägo de Oz (Escenario Cocuy)", startTime: "21:30", endTime: "22:30", priority: "Alta", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-3-art10", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🎸 Caifanes (Escenario Cordillera)", startTime: "21:45", endTime: "22:45", priority: "Critical", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-3-art11", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🎤 Andrés Cepeda [Show Solista] (Esc. Aconcagua)", startTime: "22:45", endTime: "23:45", priority: "Critical", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-3-art12", tripId: "VIAJE-2026-09-11-BOGOTA", day: 3, name: "🌟 Ricky Martin [Cabeza de Cartel] (Esc. Cordillera)", startTime: "23:45", endTime: "01:15", priority: "Critical", location: "Parque Simón Bolívar", category: "Actividades", owner: "jose", status: "Confirmado" },
    { id: "act-bog-4-hospedaje", tripId: "VIAJE-2026-09-11-BOGOTA", day: 4, name: "🏠 Check-out Airbnb", startTime: "10:30", endTime: "11:00", priority: "Alta", location: "Calle 57 #8-24, Bogotá", category: "Alojamiento", owner: "jose", status: "Confirmado", notes: "Check-out máximo a las 11:00 a.m." },
    { id: "act-bog-4-traslado", tripId: "VIAJE-2026-09-11-BOGOTA", day: 4, name: "🚕 Traslado al Aeropuerto El Dorado", startTime: "13:30", endTime: "14:15", priority: "Alta", location: "Aeropuerto El Dorado (BOG)", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-bog-4-vuelo", tripId: "VIAJE-2026-09-11-BOGOTA", day: 4, name: "✈️ Vuelo Bogotá ➔ Lima (LATAM LA2387)", startTime: "17:15", endTime: "20:20", priority: "Critical", location: "Aeropuerto El Dorado (BOG)", category: "Vuelos", owner: "jose", status: "Confirmado" },

    { id: "act-mad-sep-1-salida", tripId: "VIAJE-2026-09-21-MADRID", day: 1, name: "🚕 Salida al Aeropuerto LIM", startTime: "14:00", endTime: "15:00", priority: "Alta", location: "Hacia el Aeropuerto", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-mad-sep-1-checkin", tripId: "VIAJE-2026-09-21-MADRID", day: 1, name: "🛂 Check-in Plus Ultra y Controles", startTime: "15:00", endTime: "16:00", priority: "Alta", location: "Aeropuerto Jorge Chávez", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-mad-sep-1-vuelo", tripId: "VIAJE-2026-09-21-MADRID", day: 1, name: "✈️ Vuelo Lima ➔ Madrid (PlusUltra PU 302)", startTime: "18:10", endTime: "13:05", priority: "Critical", location: "Aeropuerto Barajas (MAD)", category: "Vuelos", owner: "jose", status: "Confirmado" },
    { id: "act-mad-sep-2-llegada", tripId: "VIAJE-2026-09-21-MADRID", day: 2, name: "🚕 Llegada a MAD y Traslado", startTime: "14:30", endTime: "15:30", priority: "Alta", location: "Madrid", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-mad-sep-10-salida", tripId: "VIAJE-2026-09-21-MADRID", day: 10, name: "🚕 Salida al Aeropuerto Barajas", startTime: "07:00", endTime: "08:00", priority: "Alta", location: "Aeropuerto Barajas (MAD)", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-mad-sep-10-vuelo", tripId: "VIAJE-2026-09-21-MADRID", day: 10, name: "✈️ Vuelo Madrid ➔ Lima (PlusUltra PU 301)", startTime: "11:00", endTime: "16:10", priority: "Critical", location: "Aeropuerto Barajas (MAD)", category: "Vuelos", owner: "jose", status: "Confirmado" },

    { id: "act-mex-jul-1-salida", tripId: "VIAJE-2026-07-21-MEXICO", day: 1, name: "🚕 Salida al Aeropuerto LIM (Madrugada)", startTime: "02:30", endTime: "03:20", priority: "Alta", location: "Hacia el Aeropuerto", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-mex-jul-1-checkin", tripId: "VIAJE-2026-07-21-MEXICO", day: 1, name: "🛂 Check-in Volaris", startTime: "03:20", endTime: "04:20", priority: "Alta", location: "Aeropuerto LIM", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-mex-jul-1-vuelo", tripId: "VIAJE-2026-07-21-MEXICO", day: 1, name: "✈️ Vuelo Lima ➔ CDMX (Volaris Y4 3919 - Asiento 13F)", startTime: "06:04", endTime: "11:10", priority: "Critical", location: "Aeropuerto (LIM)", category: "Vuelos", owner: "jose", status: "Confirmado", notes: "Incluye maleta 25kg" },
    { id: "act-mex-jul-1-bus", tripId: "VIAJE-2026-07-21-MEXICO", day: 1, name: "🚌 Bus EL CAMINANTE a Lerma", startTime: "12:00", endTime: "13:30", priority: "Alta", location: "Aeropuerto a Lerma", category: "Traslados", owner: "jose", status: "Confirmado", notes: "Avisar a Nora a la altura del Outlet Lerma" },
    { id: "act-mex-jul-1-encuentro", tripId: "VIAJE-2026-07-21-MEXICO", day: 1, name: "👋 Encuentro con Nora", startTime: "13:30", endTime: "14:00", priority: "Alta", location: "Estación Lerma", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-mex-jul-1-airbnb", tripId: "VIAJE-2026-07-21-MEXICO", day: 1, name: "🏠 Check-in Airbnb", startTime: "15:00", endTime: "16:00", priority: "Alta", location: "Casa 217", category: "Alojamiento", owner: "jose", status: "Confirmado", notes: "Puerta: 2829#, Hab. 4, Caja: 2829. Host: Jimmy +52 7229085667" },
    { id: "act-mex-jul-2-oficina", tripId: "VIAJE-2026-07-21-MEXICO", day: 2, name: "🏢 Jornada en Oficina", startTime: "08:00", endTime: "16:00", priority: "Alta", location: "Oficina", category: "Reuniones", owner: "jose", status: "Confirmado", notes: "Horario acordado 8am a 4pm" },
    { id: "act-mex-jul-16-salida", tripId: "VIAJE-2026-07-21-MEXICO", day: 16, name: "🚕 Salida al Aeropuerto AICM", startTime: "18:00", endTime: "19:00", priority: "Alta", location: "Hacia AICM", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-mex-jul-16-vuelo", tripId: "VIAJE-2026-07-21-MEXICO", day: 16, name: "✈️ Vuelo CDMX ➔ Lima (Volaris Y4 3918 - Asiento 13F)", startTime: "22:00", endTime: "05:01", priority: "Critical", location: "Aeropuerto AICM (MEX)", category: "Vuelos", owner: "jose", status: "Confirmado", notes: "Incluye maleta 25kg" },
    
    { id: "act-eur-1-salida", tripId: "VIAJE-2026-10-12-EUROPA", day: 1, name: "🚕 Salida al Aeropuerto LIM", startTime: "14:00", endTime: "15:00", priority: "Alta", location: "Hacia el Aeropuerto", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-eur-1-checkin", tripId: "VIAJE-2026-10-12-EUROPA", day: 1, name: "🛂 Check-in Plus Ultra", startTime: "15:00", endTime: "16:00", priority: "Alta", location: "Aeropuerto Jorge Chávez", category: "Traslados", owner: "jose", status: "Confirmado" },
    {
        id: "act-eur-1-vuelo",
        tripId: "VIAJE-2026-10-12-EUROPA",
        day: 1,
        name: "✈️ Vuelo Lima ➔ Madrid (PU 302)",
        startTime: "18:10",
        endTime: "13:05",
        priority: "Critical",
        location: "Aeropuerto Internacional Jorge Chávez (LIM)",
        category: "Vuelos",
        owner: "jose",
        status: "Confirmado"
    },
    { id: "act-eur-21-salida", tripId: "VIAJE-2026-10-12-EUROPA", day: 21, name: "🚕 Salida al Aeropuerto Barajas", startTime: "07:00", endTime: "08:00", priority: "Alta", location: "Aeropuerto Adolfo Suárez Madrid-Barajas (MAD)", category: "Traslados", owner: "jose", status: "Confirmado" },
    {
        id: "act-eur-21-vuelo",
        tripId: "VIAJE-2026-10-12-EUROPA",
        day: 21,
        name: "✈️ Vuelo Madrid ➔ Lima (PU 301)",
        startTime: "11:00",
        endTime: "17:10",
        priority: "Critical",
        location: "Aeropuerto Adolfo Suárez Madrid-Barajas (MAD)",
        category: "Vuelos",
        owner: "jose",
        status: "Confirmado"
    },
    // --- CUSCO AGOSTO ---
    { id: "act-cuz-1-salida", tripId: "VIAJE-2026-08-07-CUSCO", day: 1, name: "🚕 Salida al Aeropuerto LIM", startTime: "18:00", endTime: "18:50", priority: "Alta", location: "Hacia el Aeropuerto", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-cuz-1-vuelo", tripId: "VIAJE-2026-08-07-CUSCO", day: 1, name: "✈️ Vuelo Lima ➔ Cusco (LATAM LA2200)", startTime: "21:10", endTime: "22:35", priority: "Critical", location: "Aeropuerto LIM (PNR: KMTEYF)", category: "Vuelos", owner: "jose", status: "Confirmado" },
    { id: "act-cuz-1-recojo", tripId: "VIAJE-2026-08-07-CUSCO", day: 1, name: "🚐 Recojo del Aeropuerto (Apu Andino)", startTime: "22:45", endTime: "23:00", priority: "Alta", location: "Aeropuerto CUZ", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-cuz-1-hotel", tripId: "VIAJE-2026-08-07-CUSCO", day: 1, name: "🏠 Llegada a Casa Andina Catedral", startTime: "23:20", endTime: "23:59", priority: "Alta", location: "Cusco, Perú", category: "Alojamiento", owner: "jose", status: "Confirmado" },
    { id: "act-cuz-2-valle", tripId: "VIAJE-2026-08-07-CUSCO", day: 2, name: "🚐 Tour Valle Sagrado (Compartido, Almuerzo Tunupa)", startTime: "08:30", endTime: "16:00", priority: "Critical", location: "Valle Sagrado", category: "Tours", owner: "jose", status: "Confirmado" },
    { id: "act-cuz-2-tren", tripId: "VIAJE-2026-08-07-CUSCO", day: 2, name: "🚂 Tren Vistadome Observatory a Aguas Calientes", startTime: "19:00", endTime: "20:45", priority: "Critical", location: "Estación Ollantaytambo", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-cuz-2-hotel2", tripId: "VIAJE-2026-08-07-CUSCO", day: 2, name: "🏠 Noche en Qoya Palace", startTime: "21:00", endTime: "23:59", priority: "Alta", location: "Machupicchu Pueblo", category: "Alojamiento", owner: "jose", status: "Confirmado" },
    { id: "act-cuz-3-bus", tripId: "VIAJE-2026-08-07-CUSCO", day: 3, name: "🚌 Fila Bus Consettur", startTime: "05:00", endTime: "06:30", priority: "Alta", location: "Aguas Calientes", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-cuz-3-mp", tripId: "VIAJE-2026-08-07-CUSCO", day: 3, name: "⛰️ Visita a Machu Picchu (Circuito 1 + Circuito 3 Realeza)", startTime: "07:00", endTime: "11:00", priority: "Critical", location: "Santuario Histórico", category: "Tours", owner: "jose", status: "Confirmado" },
    { id: "act-cuz-3-retorno", tripId: "VIAJE-2026-08-07-CUSCO", day: 3, name: "🚂 Retorno a Cusco (Tren + Bus Privado a Hotel)", startTime: "14:30", endTime: "19:00", priority: "Critical", location: "Estación de Tren", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-cuz-4-traslado", tripId: "VIAJE-2026-08-07-CUSCO", day: 4, name: "🚕 Traslado Privado al Aeropuerto (Apu Andino)", startTime: "08:00", endTime: "08:45", priority: "Alta", location: "Hotel Casa Andina", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-cuz-4-vuelo", tripId: "VIAJE-2026-08-07-CUSCO", day: 4, name: "✈️ Vuelo Cusco ➔ Lima (LATAM LA2014)", startTime: "10:40", endTime: "12:15", priority: "Critical", location: "Aeropuerto CUZ (PNR: KMTEYF)", category: "Vuelos", owner: "jose", status: "Confirmado" },

    // --- CALI JULIO ---
    { id: "act-jul-1-salida", tripId: "VIAJE-2026-07-02-CALI", day: 1, name: "🚕 Salida al Aeropuerto LIM", startTime: "12:30", endTime: "13:30", priority: "Alta", location: "Hacia el Aeropuerto", category: "Traslados", owner: "jose", status: "Completado" },
    { id: "act-jul-1-checkin-aero", tripId: "VIAJE-2026-07-02-CALI", day: 1, name: "🛂 Check-in LATAM", startTime: "13:30", endTime: "14:30", priority: "Alta", location: "Aeropuerto Jorge Chávez", category: "Traslados", owner: "jose", status: "Completado" },
    { id: "act-jul-1-vuelo", tripId: "VIAJE-2026-07-02-CALI", day: 1, name: "✈️ Vuelo de salida LIM ➔ CLO (LATAM LA2242)", startTime: "15:50", endTime: "22:35", priority: "Critical", location: "Aeropuerto Alfonso Bonilla Aragón (CLO)", category: "Vuelos", owner: "jose", status: "Completado" },
    { id: "act-jul-1-checkin", tripId: "VIAJE-2026-07-02-CALI", day: 1, name: "🏠 Check-in Loft Cali (Av. 8 Norte #23-94 Piso 2)", startTime: "23:30", endTime: "23:59", priority: "Alta", location: "Airbnb Loft Cali", category: "Alojamiento", owner: "jose", status: "Completado" },
    { id: "act-jul-1-desconn", tripId: "VIAJE-2026-07-02-CALI", day: 1, name: "📱 Ventana de desconexión", startTime: "23:30", endTime: "01:30", priority: "Baja", location: "Airbnb Loft Cali", category: "Descanso", owner: "jose", status: "Completado" },
    
    { id: "act-jul-2-cafe", tripId: "VIAJE-2026-07-02-CALI", day: 2, name: "☕ Café con Camila Paredes", startTime: "10:30", endTime: "12:00", priority: "Media", location: "Starbucks Granada", category: "Reuniones", owner: "jose", status: "Completado" },
    { id: "act-jul-2-almuerzo", tripId: "VIAJE-2026-07-02-CALI", day: 2, name: "🍽️ Almuerzo en casa de los papás", startTime: "13:30", endTime: "16:30", priority: "Alta", location: "Casa de los papás (Cali)", category: "Familiar", owner: "jose", status: "Completado" },
    { id: "act-jul-2-lozada", tripId: "VIAJE-2026-07-02-CALI", day: 2, name: "🍹 Encuentro con las Lozada (Límite 23:00)", startTime: "20:00", endTime: "23:00", priority: "Media", location: "Restobar San Antonio", category: "Ocio", owner: "jose", status: "Completado" },

    { id: "act-jul-3-pandem", tripId: "VIAJE-2026-07-02-CALI", day: 3, name: "🍽️ Almuerzo con los pandémicos", startTime: "13:00", endTime: "15:30", priority: "Media", location: "Restaurante El Peñón", category: "Reuniones", owner: "jose", status: "Completado" },
    { id: "act-jul-3-angelica", tripId: "VIAJE-2026-07-02-CALI", day: 3, name: "🦄 Café con Angélica y el unicornio", startTime: "17:00", endTime: "18:30", priority: "Alta", location: "Juan Valdez Granada", category: "Ocio", owner: "jose", status: "Completado" },
    { id: "act-jul-3-bourbon", tripId: "VIAJE-2026-07-02-CALI", day: 3, name: "🥃 Bourbon con Héctor y el cartel (Límite 01:00)", startTime: "20:00", endTime: "01:00", priority: "Media", location: "Bourbon Club Peñón", category: "Ocio", owner: "jose", status: "Completado" },

    { id: "act-jul-4-familiar", tripId: "VIAJE-2026-07-02-CALI", day: 4, name: "🌳 Espacio familiar y cena", startTime: "12:00", endTime: "17:00", priority: "Alta", location: "Casa familiar Cali", category: "Familiar", owner: "jose", status: "Completado" },
    { id: "act-jul-4-cena", tripId: "VIAJE-2026-07-02-CALI", day: 4, name: "🍽️ Cena de despedida familiar", startTime: "20:00", endTime: "22:30", priority: "Alta", location: "Restaurante Ringlete", category: "Familiar", owner: "jose", status: "Completado" },

    { id: "act-jul-5-checkout", tripId: "VIAJE-2026-07-02-CALI", day: 5, name: "🚪 Check-out Airbnb 'Loft en Cali'", startTime: "09:00", endTime: "09:30", priority: "Alta", location: "Airbnb Loft Cali", category: "Alojamiento", owner: "jose", status: "Completado" },
    { id: "act-jul-5-traslado", tripId: "VIAJE-2026-07-02-CALI", day: 5, name: "🚕 Traslado al aeropuerto CLO", startTime: "11:30", endTime: "12:30", priority: "Alta", location: "Aeropuerto Alfonso Bonilla Aragón (CLO)", category: "Traslados", owner: "jose", status: "Completado" },
    { id: "act-jul-5-vuelo", tripId: "VIAJE-2026-07-02-CALI", day: 5, name: "✈️ Vuelo de retorno CLO ➔ LIM (LATAM LA2243)", startTime: "14:35", endTime: "20:20", priority: "Critical", location: "Aeropuerto Internacional Jorge Chávez", category: "Vuelos", owner: "jose", status: "Completado" },

    // --- CALI DICIEMBRE ---
    { id: "act-dic-1-salida", tripId: "VIAJE-2026-12-22-CALI", day: 1, name: "🚕 Salida al Aeropuerto LIM", startTime: "12:30", endTime: "13:30", priority: "Alta", location: "Hacia el Aeropuerto", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-dic-1-checkin-aero", tripId: "VIAJE-2026-12-22-CALI", day: 1, name: "🛂 Check-in LATAM", startTime: "13:30", endTime: "14:30", priority: "Alta", location: "Aeropuerto Jorge Chávez", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-dic-1-vuelo", tripId: "VIAJE-2026-12-22-CALI", day: 1, name: "✈️ Vuelo Lima ➔ Cali (PE - LATAM)", startTime: "15:50", endTime: "22:35", priority: "Critical", location: "Aeropuerto Alfonso Bonilla Aragón (CLO)", category: "Vuelos", owner: "jose", status: "Confirmado" },
    { id: "act-dic-1-hotel", tripId: "VIAJE-2026-12-22-CALI", day: 1, name: "🏠 Traslado al Airbnb & Acomodación", startTime: "22:35", endTime: "23:30", priority: "Alta", location: "Airbnb Feria de Cali (Norte)", category: "Alojamiento", owner: "jose", status: "Confirmado" },
    { id: "act-dic-2-compras", tripId: "VIAJE-2026-12-22-CALI", day: 2, name: "🛍️ Compras Navideñas de Último Minuto", startTime: "10:00", endTime: "15:00", priority: "Media", location: "Centro Comercial Chipichape", category: "Ocio", owner: "jose", status: "Confirmado" },
    { id: "act-dic-3-nochebuena", tripId: "VIAJE-2026-12-22-CALI", day: 3, name: "🎄 Cena Familiar de Nochebuena", startTime: "20:00", endTime: "02:00", priority: "Alta", location: "Casa familiar Cali", category: "Familiar", owner: "jose", status: "Confirmado" },
    { id: "act-dic-4-navidad", tripId: "VIAJE-2026-12-22-CALI", day: 4, name: "🎁 Almuerzo Familiar de Navidad", startTime: "13:00", endTime: "18:00", priority: "Alta", location: "Casa familiar Cali", category: "Familiar", owner: "jose", status: "Confirmado" },
    { id: "act-dic-5-salsa", tripId: "VIAJE-2026-12-22-CALI", day: 5, name: "💃 Feria de Cali: Asistencia al Salsódromo", startTime: "15:00", endTime: "22:00", priority: "Critical", location: "Autopista Suroriental (Cali)", category: "Tours", owner: "jose", status: "Confirmado" },
    { id: "act-dic-6-amigos", tripId: "VIAJE-2026-12-22-CALI", day: 6, name: "🍹 Encuentro con amigos caleños", startTime: "16:00", endTime: "20:00", priority: "Media", location: "El Peñón", category: "Reuniones", owner: "jose", status: "Confirmado" },
    { id: "act-dic-7-concierto", tripId: "VIAJE-2026-12-22-CALI", day: 7, name: "🎤 Superconcierto de la Feria", startTime: "20:00", endTime: "03:00", priority: "Critical", location: "Estadio Pascual Guerrero", category: "Tours", owner: "jose", status: "Confirmado" },
    { id: "act-dic-8-pance", tripId: "VIAJE-2026-12-22-CALI", day: 8, name: "🏞️ Almuerzo Campestre Familiar", startTime: "12:00", endTime: "18:00", priority: "Alta", location: "Río Pance", category: "Familiar", owner: "jose", status: "Confirmado" },
    { id: "act-dic-9-tascas", tripId: "VIAJE-2026-12-22-CALI", day: 9, name: "🎪 Cierre de la Feria / Tascas", startTime: "18:00", endTime: "23:00", priority: "Media", location: "Canales Panamericanas", category: "Ocio", owner: "jose", status: "Confirmado" },
    { id: "act-dic-10-findeano", tripId: "VIAJE-2026-12-22-CALI", day: 10, name: "🍾 Cena y Celebración de Fin de Año", startTime: "20:00", endTime: "04:00", priority: "Alta", location: "Casa familiar Cali", category: "Familiar", owner: "jose", status: "Confirmado" },
    { id: "act-dic-11-relax", tripId: "VIAJE-2026-12-22-CALI", day: 11, name: "🛌 Descanso Absoluto", startTime: "12:00", endTime: "20:00", priority: "Alta", location: "Airbnb Feria de Cali", category: "Descanso", owner: "jose", status: "Confirmado" },
    { id: "act-dic-12-visitas", tripId: "VIAJE-2026-12-22-CALI", day: 12, name: "🚗 Visitas Familiares Pendientes", startTime: "15:00", endTime: "19:00", priority: "Media", location: "Cali Norte", category: "Familiar", owner: "jose", status: "Confirmado" },
    { id: "act-dic-13-maletas", tripId: "VIAJE-2026-12-22-CALI", day: 13, name: "🧳 Organización y Empaque de Maletas", startTime: "14:00", endTime: "16:30", priority: "Alta", location: "Airbnb Feria de Cali", category: "Descanso", owner: "jose", status: "Confirmado" },
    { id: "act-dic-14-checkout", tripId: "VIAJE-2026-12-22-CALI", day: 14, name: "🚪 Check-out Airbnb & Traslados", startTime: "09:00", endTime: "10:00", priority: "Alta", location: "Aeropuerto Alfonso Bonilla Aragón (CLO)", category: "Traslados", owner: "jose", status: "Confirmado" },
    { id: "act-dic-14-vuelo", tripId: "VIAJE-2026-12-22-CALI", day: 14, name: "✈️ Vuelo de Retorno CLO ➔ LIM (Premium Economy)", startTime: "14:35", endTime: "20:20", priority: "Critical", location: "Aeropuerto Internacional Jorge Chávez", category: "Vuelos", owner: "jose", status: "Confirmado" }
];

const BOG_DIC_DIARY_BUDGET = {
    "1": { logistics: 1450.00, entertainment: 0.00, desc: "Vuelo PE ($1300) + Traslado ($150 programado)" },
    "2": { logistics: 0.00, entertainment: 100.00, desc: "Compras navideñas y almuerzo en Chipichape" },
    "3": { logistics: 0.00, entertainment: 80.00, desc: "Aportes para la cena familiar de Nochebuena" },
    "4": { logistics: 0.00, entertainment: 30.00, desc: "Gastos de transporte familiar en Navidad" },
    "5": { logistics: 0.00, entertainment: 120.00, desc: "Entradas y comidas en el Salsódromo" },
    "6": { logistics: 0.00, entertainment: 50.00, desc: "Almuerzo y cócteles en El Peñón con amigos" },
    "7": { logistics: 0.00, entertainment: 180.00, desc: "Boleta y viáticos del Superconcierto" },
    "8": { logistics: 0.00, entertainment: 60.00, desc: "Almuerzo campestre familiar en Pance" },
    "9": { logistics: 0.00, entertainment: 40.00, desc: "Entrada y snacks en las Tascas" },
    "10": { logistics: 0.00, entertainment: 90.00, desc: "Cena de fin de año y brindis familiar" },
    "11": { logistics: 0.00, entertainment: 15.00, desc: "Día libre - snacks y domicilios en Airbnb" },
    "12": { logistics: 0.00, entertainment: 30.00, desc: "Movilidad para visitas familiares" },
    "13": { logistics: 50.00, entertainment: 20.00, desc: "Seguro de viaje ($50) + almuerzo empaque" },
    "14": { logistics: 650.00, entertainment: 0.00, desc: "Alojamiento Airbnb ($650 total estadía)" }
};

const DEFAULT_PACKING_LIST = [
    {
        category: "📄 Documentación & Emergencia",
        pax: "jose",
        bagType: "carryOn",
        items: [
            { id: "pack-dni", text: "DNI original y Pasaporte vigente (vigente hasta 2032)", checked: false },
            { id: "pack-vouchers", text: "Reserva de Airbnb (Cali) / Tickets Machu Picchu impresos", checked: false },
            { id: "pack-seguro", text: "Póliza de Seguro de Asistencia Médica Internacional", checked: false },
            { id: "pack-botiquin", text: "Medicamentos personales (pastillas altura soroche, analgésicos)", checked: false }
        ]
    },
    {
        category: "🔌 Dispositivos & Adaptadores",
        pax: "jose",
        bagType: "carryOn",
        items: [
            { id: "pack-cargador", text: "Cargadores rápidos y cables reforzados de 2m", checked: false },
            { id: "pack-powerbank", text: "🔋 Batería portátil de alta capacidad (20000 mAh)", checked: false },
            { id: "pack-audifonos", text: "Audífonos con cancelación de ruido (para vuelos)", checked: false }
        ]
    },
    {
        category: "🧥 Ropa & Calzado José (Ergonomía 2.00m y 110kg)",
        pax: "jose",
        bagType: "checked",
        items: [
            { id: "pack-calzado-trek", text: "🥾 Zapatillas de trekking Talla 46/47 (horma ancha ablandadas)", checked: false },
            { id: "pack-chaqueta-pluma", text: "🧥 Chaqueta de plumas pesada Talla XXL (frío Cusco)", checked: false },
            { id: "pack-cortaviento", text: "💨 Cortavientos impermeable Talla XXL (vientos Paracas)", checked: false },
            { id: "pack-pantalon-comodo", text: "👖 Pantalones de senderismo Talla XL-T (largos especiales)", checked: false },
            { id: "pack-camisas-cálidas", text: "👕 Camisetas térmicas de manga larga Talla XXL", checked: false },
            { id: "pack-lana", text: "🧤 Guantes térmicos XXL, bufanda y gorro de lana", checked: false }
        ]
    },
    {
        category: "🧥 Equipaje Angélica (Viaje Cusco)",
        pax: "angelica",
        bagType: "checked",
        items: [
            { id: "pack-ang-dni", text: "Cédula de Ciudadanía Colombiana (control migratorio)", checked: false },
            { id: "pack-ang-repelente", text: "🧴 Repelente contra mosquitos con DEET (Machu Picchu)", checked: false },
            { id: "pack-ang-bloqueador", text: "☀️ Bloqueador solar alta protección SPF 50+", checked: false },
            { id: "pack-ang-ropa-cuz", text: "Ropa térmica abrigada en capas (sacos, guantes, bufanda)", checked: false },
            { id: "pack-ang-calzado", text: "Zapatillas cómodas para caminatas empinadas", checked: false }
        ]
    }
];

const EXCHANGE_RATES = {
    "USD": 1.0,
    "PEN": 0.267, // S/ 3.75 por USD
    "COP": 0.00025, // COP 4000 por USD
    "EUR": 1.08
};

const FISCAL_MONTHS = [
    { name: "Junio 2026", key: "2026-06" },
    { name: "Julio 2026", key: "2026-07" },
    { name: "Agosto 2026", key: "2026-08" },
    { name: "Septiembre 2026", key: "2026-09" },
    { name: "Octubre 2026", key: "2026-10" },
    { name: "Noviembre 2026", key: "2026-11" },
    { name: "Diciembre 2026", key: "2026-12" },
    { name: "Enero 2027", key: "2027-01" }
];

function getTotalCashUsd() {
    const cash = SYSTEM_STATE.cash;
    return cash.USD + (cash.PEN * EXCHANGE_RATES.PEN) + (cash.COP * EXCHANGE_RATES.COP);
}

// ==========================================
// CENTRALIZED STATE MASTER SYSTEM
// ==========================================

let SYSTEM_STATE = {
    cash: {
        USD: 2200,
        PEN: 5150,
        COP: 1500000
    },
    creditCardDebt: {
        USD: 3001.90,
        PEN: 3646.44
    },
    trips: DEFAULT_TRIPS,
    payments: DEFAULT_PAYMENTS,
    reservations: {
        "vuelo": "Pendiente",
        "airbnb": "Pendiente",
        "seguro": "Pendiente",
        "traslado": "Pendiente",
        "equipaje": "Emitido",
        "vuelo_europa": "Pendiente",
        "hotel_europa": "Pendiente"
    },
    risks: DEFAULT_RISKS,
    sleep: {
        bedtimes: {},
        wakeTimes: {},
        accumulatedDeficit: 0,
        projectedFatigue: 0
    },
    packingList: null, // Will be initialized by generatePackingList if needed, but defaults to generatePackingList("VIAJE-2026-09-11-BOGOTA", "carryon") if not found in localStorage
    settings: {
        selectedTripId: "VIAJE-2026-08-07-CUSCO",
        selectedDay: 1,
        selectedFinanceTripFilter: "all",
        loanRequested: false
    },
    auditLog: [],
    completedActivityIds: [],
    dynamicActivities: []
};

// Initialize bedtimes and wakeTimes for all trip days
DEFAULT_TRIPS.forEach(t => {
    for (let d = 1; d <= t.days; d++) {
        const key = `${t.id}-${d}`;
        SYSTEM_STATE.sleep.bedtimes[key] = "23:00";
        SYSTEM_STATE.sleep.wakeTimes[key] = "07:00";
    }
});

// Hardcode previous default bedtimes for consistency
const PREV_BEDTIMES = {
    "VIAJE-2026-07-02-CALI-1": "23:30",
    "VIAJE-2026-07-02-CALI-2": "23:00",
    "VIAJE-2026-07-02-CALI-3": "01:00",
    "VIAJE-2026-07-02-CALI-4": "23:00",
    "VIAJE-2026-07-02-CALI-5": "22:00",
    "VIAJE-2026-08-07-CUSCO-1": "22:30",
    "VIAJE-2026-08-07-CUSCO-2": "22:30",
    "VIAJE-2026-08-07-CUSCO-3": "23:00",
    "VIAJE-2026-08-07-CUSCO-4": "23:00",
    "VIAJE-2026-09-11-BOGOTA-1": "22:30",
    "VIAJE-2026-09-11-BOGOTA-2": "23:00",
    "VIAJE-2026-09-11-BOGOTA-3": "23:00",
    "VIAJE-2026-09-11-BOGOTA-4": "22:00",
    "VIAJE-2026-12-22-CALI-1": "23:00",
    "VIAJE-2026-12-22-CALI-2": "23:00",
    "VIAJE-2026-12-22-CALI-3": "02:00",
    "VIAJE-2026-12-22-CALI-4": "23:00",
    "VIAJE-2026-12-22-CALI-5": "22:30",
    "VIAJE-2026-12-22-CALI-6": "22:00",
    "VIAJE-2026-12-22-CALI-7": "03:00",
    "VIAJE-2026-12-22-CALI-8": "22:00",
    "VIAJE-2026-12-22-CALI-9": "23:00",
    "VIAJE-2026-12-22-CALI-10": "04:00",
    "VIAJE-2026-12-22-CALI-11": "22:00",
    "VIAJE-2026-12-22-CALI-12": "22:00",
    "VIAJE-2026-12-22-CALI-13": "22:30",
    "VIAJE-2026-12-22-CALI-14": "22:00"
};
Object.keys(PREV_BEDTIMES).forEach(key => {
    SYSTEM_STATE.sleep.bedtimes[key] = PREV_BEDTIMES[key];
    SYSTEM_STATE.sleep.wakeTimes[key] = addHours(PREV_BEDTIMES[key], 8);
});

// ==========================================
// STARTUP AND BINDINGS
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
    await loadState();

    // --- NUEVO: Sincronización Dynamic Data (Correos) ---
    try {
        const dResp = await fetch('data/dynamic_data.json?t=' + Date.now());
        if (dResp.ok) {
            const dynData = await dResp.json();
            
            // Merge trips
            if (dynData.trips && Array.isArray(dynData.trips)) {
                dynData.trips.forEach(newTrip => {
                    const existingIndex = SYSTEM_STATE.trips.findIndex(t => t.id === newTrip.id);
                    if (existingIndex > -1) {
                        SYSTEM_STATE.trips[existingIndex] = newTrip; // overwrite
                    } else {
                        SYSTEM_STATE.trips.push(newTrip);
                    }
                });
            }
            
            // Merge activities
            if (dynData.activities && Array.isArray(dynData.activities)) {
                SYSTEM_STATE.dynamicActivities = dynData.activities;
                dynData.activities.forEach(newAct => {
                    if (!newAct.startTime) newAct.startTime = newAct.time || "00:00";
                    if (!newAct.endTime) newAct.endTime = newAct.time || "23:59";
                    if (!newAct.category) newAct.category = "Sincronizado";
                    const existingIndex = ACTIVITIES.findIndex(a => a.id === newAct.id);
                    if (existingIndex > -1) {
                        ACTIVITIES[existingIndex] = newAct;
                    } else {
                        ACTIVITIES.push(newAct);
                    }
                });
            }
            saveState();
        }
    } catch (e) {
        console.warn("No se pudo sincronizar dynamic_data.json:", e);
    }

    // --- NUEVO: Sincronización Caja Negra (Agente Vuelos) ---
    try {
        const resp = await fetch('data/ledger.json?t=' + Date.now());
        if (resp.ok) {
            const remoteLedger = await resp.json();
            if (remoteLedger.auditLog && remoteLedger.auditLog.length > 0) {
                const flightLogs = remoteLedger.auditLog.filter(l => l.action.includes("[AGENTE-VUELOS]"));
                if (flightLogs.length > 0) {
                    const lastLog = flightLogs[flightLogs.length - 1];
                    SYSTEM_STATE.flightTrackerStatus = lastLog.action.replace("[AGENTE-VUELOS] ", "");
                    SYSTEM_STATE.flightTrackerTime = new Date(lastLog.timestamp).toLocaleTimeString("es-PE", { hour: '2-digit', minute: '2-digit' });
                }
                
                // Fusionar al audit local evitando duplicados exactos
                remoteLedger.auditLog.forEach(remoteLog => {
                    const exists = SYSTEM_STATE.auditLog.find(l => l.timestamp === remoteLog.timestamp && l.action === remoteLog.action);
                    if (!exists) {
                        SYSTEM_STATE.auditLog.push(remoteLog);
                    }
                });
                SYSTEM_STATE.auditLog = SYSTEM_STATE.auditLog.slice(-50);
            }
        }
    } catch(e) {
        console.warn("Caja negra offline o no accesible localmente", e);
    }
    // ------------------------------------------------

    setupTabs();
    setupTripSelector();
    setupClock();
    setupInteractionListeners();
    setupResetButton();
    setupConfigInputs();
    window.addEventListener('countdown-expired', (e) => {
        const actId = e.detail.activityId;
        const act = ACTIVITIES.find(a => a.id === actId);
        if (act && act.status !== "Completado") {
            act.status = "Completado";
            if (SYSTEM_STATE.completedActivityIds && !SYSTEM_STATE.completedActivityIds.includes(actId)) {
                SYSTEM_STATE.completedActivityIds.push(actId);
            }
            logAction(`[T-0] Actividad '${act.name}' completada automáticamente.`, "SUCCESS");
            if (!window.renderScheduled) {
                window.renderScheduled = true;
                requestAnimationFrame(() => {
                    window.renderScheduled = false;
                    renderAll();
                });
            }
        }
    });

    logAction("Centro de Control de Viajes inicializado", "SUCCESS");
    renderAll();
});

// ==========================================
// STATE MANAGEMENT & PERSISTENCE
// ==========================================

async function loadState() {
    try {
        const saved = localStorage.getItem("cfo_control_center_state_v2");
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Restore structural objects
            if (parsed.trips) {
                // Filter out obsolete Europe IDs to force updates
                SYSTEM_STATE.trips = parsed.trips.filter(t => t.id !== "VIAJE-2026-10-10-EUROPA" && t.id !== "VIAJE-2026-10-01-EUROPA");
                DEFAULT_TRIPS.forEach(dt => {
                    const existing = SYSTEM_STATE.trips.find(t => t.id === dt.id);
                    if (!existing) {
                        SYSTEM_STATE.trips.push(dt);
                    } else {
                        // Merge missing properties (like 'days') from default to existing
                        Object.keys(dt).forEach(key => {
                            if (existing[key] === undefined) {
                                existing[key] = dt[key];
                            }
                        });
                    }
                });
            }
            if (parsed.payments) {
                SYSTEM_STATE.payments = parsed.payments;
                // PATCH: Force 'FIN-BOG-SEP-001' (Lima-Bogotá) to be 'paid' if it was cached as 'pending'
                const bogotaFlight = SYSTEM_STATE.payments.find(p => p.id === "FIN-BOG-SEP-001");
                if (bogotaFlight && bogotaFlight.status === "pending") {
                    bogotaFlight.status = "paid";
                }
                DEFAULT_PAYMENTS.forEach(dp => {
                    const existing = SYSTEM_STATE.payments.find(p => p.id === dp.id);
                    if (!existing) {
                        SYSTEM_STATE.payments.push(dp);
                    } else {
                        Object.keys(dp).forEach(key => {
                            if (existing[key] === undefined) {
                                existing[key] = dp[key];
                            }
                        });
                    }
                });
            }
            if (parsed.reservations) SYSTEM_STATE.reservations = parsed.reservations;
            if (parsed.risks) SYSTEM_STATE.risks = parsed.risks;
            if (parsed.sleep) SYSTEM_STATE.sleep = { ...SYSTEM_STATE.sleep, ...parsed.sleep };
            if (parsed.settings) SYSTEM_STATE.settings = { ...SYSTEM_STATE.settings, ...parsed.settings };
            if (parsed.cash) SYSTEM_STATE.cash = parsed.cash;
            if (parsed.creditCardDebt) SYSTEM_STATE.creditCardDebt = parsed.creditCardDebt;
            if (parsed.packingList) {
                SYSTEM_STATE.packingList = parsed.packingList;
            } else {
                SYSTEM_STATE.packingList = generatePackingList(SYSTEM_STATE.settings.selectedTripId || "VIAJE-2026-08-07-CUSCO", "carryon");
            }
            if (parsed.auditLog) SYSTEM_STATE.auditLog = parsed.auditLog;

            // Restore dynamic activities
            if (parsed.dynamicActivities) {
                // PATCH: Remover actividades cacheadas de Mexico para usar las nuevas hardcodeadas
                parsed.dynamicActivities = parsed.dynamicActivities.filter(a => !a.id.startsWith("act-mex-jul"));
                
                SYSTEM_STATE.dynamicActivities = parsed.dynamicActivities;
                parsed.dynamicActivities.forEach(act => {
                    const existingIndex = ACTIVITIES.findIndex(a => a.id === act.id);
                    if (existingIndex > -1) {
                        ACTIVITIES[existingIndex] = act;
                    } else {
                        ACTIVITIES.push(act);
                    }
                });
            }

            // Restore completed activity statuses
            if (parsed.completedActivityIds) {
                SYSTEM_STATE.completedActivityIds = parsed.completedActivityIds;
                SYSTEM_STATE.completedActivityIds.forEach(id => {
                    const act = ACTIVITIES.find(a => a.id === id);
                    if (act) act.status = "Completado";
                });
            } else {
                SYSTEM_STATE.completedActivityIds = [];
            }
        }
    } catch (e) {
        console.warn("No se pudo leer el estado (Persistence Error):", e);
    }
}

async function saveState() {
    try {
        localStorage.setItem("cfo_control_center_state_v2", JSON.stringify(SYSTEM_STATE));
        
        // Background Sync hook (preparación para Service Worker PWA)
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(reg => {
                // reg.sync.register('sync-cfo-ledger').catch(() => {});
            }).catch(() => {});
        }
    } catch (e) {
        console.warn("No se pudo escribir el estado (Persistence Error):", e);
    }
}

function logAction(action, status = "INFO") {
    SYSTEM_STATE.auditLog = SYSTEM_STATE.auditLog || [];
    if (SYSTEM_STATE.auditLog.length >= 50) {
        SYSTEM_STATE.auditLog.shift();
    }
    const now = new Date();
    const timeStr = now.toLocaleTimeString("es-PE", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const dateStr = now.toLocaleDateString("es-PE", { day: '2-digit', month: '2-digit' });
    
    SYSTEM_STATE.auditLog.push({
        action,
        status,
        timestamp: `${dateStr} ${timeStr}`
    });
    saveState();
}

// ==========================================
// INTERACTIVE LISTENERS
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

function setupTripSelector() {
    const selectEl = document.getElementById("trip-dropdown-select");
    const packingSelectEl = document.getElementById("packing-trip-select");
    if (!selectEl) return;
    
    // Llenar dinámicamente
    let html = "";
    SYSTEM_STATE.trips.forEach(trip => {
        const isSelected = trip.id === SYSTEM_STATE.settings.selectedTripId ? "selected" : "";
        html += `<option value="${trip.id}" ${isSelected}>${trip.name}</option>`;
    });
    selectEl.innerHTML = html;

    // Llenar dinámicamente selector de equipaje
    if (packingSelectEl && packingSelectEl.children.length === 0) {
        let packingHtml = "";
        SYSTEM_STATE.trips.forEach(trip => {
            const label = trip.name + (trip.status === "completed" ? " (Histórico)" : "");
            packingHtml += `<option value="${trip.id}">${label}</option>`;
        });
        packingSelectEl.innerHTML = packingHtml;
    }

    // Escuchar cambios
    selectEl.addEventListener("change", (e) => {
        SYSTEM_STATE.settings.selectedTripId = e.target.value;
        SYSTEM_STATE.settings.selectedDay = 1;
        
        if (packingSelectEl) {
            packingSelectEl.value = e.target.value;
            updatePackingList();
        }
        
        const trip = SYSTEM_STATE.trips.find(t => t.id === SYSTEM_STATE.settings.selectedTripId);
        if (trip) logAction(`Viaje seleccionado: ${trip.name}`, "INFO");
        renderAll();
    });
}

function setupClock() {
    const el = document.getElementById("clock-hms");
    if (!el) return;
    function updateClock() {
        try {
            const t = new Date().toLocaleTimeString("es-PE", {
                timeZone: "America/Lima",
                hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
            });
            el.textContent = `${t} (UTC-5)`;
        } catch (e) {
            el.textContent = new Date().toLocaleTimeString();
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
}

function setupInteractionListeners() {
    // Bedtime time picker change
    const bedtimeInput = document.getElementById("sleep-bedtime-input");
    if (bedtimeInput) {
        bedtimeInput.addEventListener("change", (e) => {
            const key = `${SYSTEM_STATE.settings.selectedTripId}-${SYSTEM_STATE.settings.selectedDay}`;
            SYSTEM_STATE.sleep.bedtimes[key] = e.target.value;
            // Recalculate wake time to keep sleep 8 hours by default unless changed
            SYSTEM_STATE.sleep.wakeTimes[key] = addHours(e.target.value, 8);
            
            const trip = SYSTEM_STATE.trips.find(t => t.id === SYSTEM_STATE.settings.selectedTripId);
            logAction(`Ajustado acostado para ${trip.name} Día ${SYSTEM_STATE.settings.selectedDay} a las ${e.target.value}`, "INFO");
            renderAll();
        });
    }

    // Waketime time picker change
    const waketimeInput = document.getElementById("sleep-waketime-input");
    if (waketimeInput) {
        waketimeInput.addEventListener("change", (e) => {
            const key = `${SYSTEM_STATE.settings.selectedTripId}-${SYSTEM_STATE.settings.selectedDay}`;
            SYSTEM_STATE.sleep.wakeTimes[key] = e.target.value;
            
            const trip = SYSTEM_STATE.trips.find(t => t.id === SYSTEM_STATE.settings.selectedTripId);
            logAction(`Ajustado despertar para ${trip.name} Día ${SYSTEM_STATE.settings.selectedDay} a las ${e.target.value}`, "INFO");
            renderAll();
        });
    }
}

function setupConfigInputs() {
    const cashUsd = document.getElementById("config-cash-usd");
    const cashPen = document.getElementById("config-cash-pen");
    const cashCop = document.getElementById("config-cash-cop");
    const debtUsd = document.getElementById("config-debt-usd");
    const debtPen = document.getElementById("config-debt-pen");
    const loanReq = document.getElementById("config-loan-requested");
    
    if (cashUsd) {
        cashUsd.value = SYSTEM_STATE.cash.USD;
        cashUsd.addEventListener("change", (e) => {
            SYSTEM_STATE.cash.USD = parseFloat(e.target.value) || 0;
            logAction(`Caja USD actualizada a $${e.target.value}`, "SUCCESS");
            renderAll();
        });
    }
    if (cashPen) {
        cashPen.value = SYSTEM_STATE.cash.PEN;
        cashPen.addEventListener("change", (e) => {
            SYSTEM_STATE.cash.PEN = parseFloat(e.target.value) || 0;
            logAction(`Caja PEN actualizada a S/.${e.target.value}`, "SUCCESS");
            renderAll();
        });
    }
    if (cashCop) {
        cashCop.value = SYSTEM_STATE.cash.COP;
        cashCop.addEventListener("change", (e) => {
            SYSTEM_STATE.cash.COP = parseFloat(e.target.value) || 0;
            logAction(`Caja COP actualizada a COP$${e.target.value}`, "SUCCESS");
            renderAll();
        });
    }
    if (debtUsd) {
        debtUsd.value = SYSTEM_STATE.creditCardDebt.USD;
        debtUsd.addEventListener("change", (e) => {
            SYSTEM_STATE.creditCardDebt.USD = parseFloat(e.target.value) || 0;
            logAction(`Deuda TC USD actualizada a $${e.target.value}`, "SUCCESS");
            renderAll();
        });
    }
    if (debtPen) {
        debtPen.value = SYSTEM_STATE.creditCardDebt.PEN;
        debtPen.addEventListener("change", (e) => {
            SYSTEM_STATE.creditCardDebt.PEN = parseFloat(e.target.value) || 0;
            logAction(`Deuda TC PEN actualizada a S/.${e.target.value}`, "SUCCESS");
            renderAll();
        });
    }
    if (loanReq) {
        loanReq.checked = !!SYSTEM_STATE.settings.loanRequested;
        loanReq.addEventListener("change", (e) => {
            SYSTEM_STATE.settings.loanRequested = e.target.checked;
            logAction(`Estado del crédito Europa actualizado: ${e.target.checked ? "Solicitado/Aprobado" : "Pendiente"}`, "SUCCESS");
            renderAll();
        });
    }
}

function setupResetButton() {
    const btnReset = document.getElementById("btn-reset-state");
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (confirm("¿Está seguro de que desea restablecer el estado completo? Se borrarán todos los pagos realizados e historiales.")) {
                localStorage.removeItem("cfo_control_center_state_v2");
                localStorage.removeItem("cfo_control_center_state"); // Clear old one too
                SYSTEM_STATE.payments = DEFAULT_PAYMENTS;
                SYSTEM_STATE.reservations = {
                    "vuelo": "Pendiente",
                    "airbnb": "Pendiente",
                    "seguro": "Pendiente",
                    "traslado": "Pendiente",
                    "equipaje": "Emitido",
                    "vuelo_europa": "Pendiente",
                    "hotel_europa": "Pendiente"
                };
                SYSTEM_STATE.risks = DEFAULT_RISKS;
                SYSTEM_STATE.sleep.bedtimes = {};
                SYSTEM_STATE.sleep.wakeTimes = {};
                DEFAULT_TRIPS.forEach(t => {
                    for (let d = 1; d <= t.days; d++) {
                        const key = `${t.id}-${d}`;
                        SYSTEM_STATE.sleep.bedtimes[key] = "23:00";
                        SYSTEM_STATE.sleep.wakeTimes[key] = "07:00";
                    }
                });
                Object.keys(PREV_BEDTIMES).forEach(key => {
                    SYSTEM_STATE.sleep.bedtimes[key] = PREV_BEDTIMES[key];
                    SYSTEM_STATE.sleep.wakeTimes[key] = addHours(PREV_BEDTIMES[key], 8);
                });
                SYSTEM_STATE.packingList = generatePackingList(SYSTEM_STATE.settings.selectedTripId || "VIAJE-2026-08-07-CUSCO", "carryon");
                SYSTEM_STATE.auditLog = [];
                SYSTEM_STATE.cash = { USD: 2200, PEN: 5150, COP: 1500000 };
                SYSTEM_STATE.settings.loanRequested = false;
                
                logAction("Estado completo restablecido a valores por defecto", "WARNING");
                renderAll();
            }
        });
    }
}

// ==========================================
// TIME & SLEEP COMPUTATIONS
// ==========================================

function addHours(timeStr, hours) {
    if (!timeStr) return "";
    const [hStr, mStr] = timeStr.split(":");
    let h = parseInt(hStr, 10);
    let m = parseInt(mStr, 10);
    if (isNaN(h) || isNaN(m)) return "";
    h = (h + hours) % 24;
    if (h < 0) h += 24;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function isBeforeTime(time1, time2) {
    if (!time1 || !time2) return false;
    return time1.localeCompare(time2) < 0;
}

function getSleepDuration(bedTime, wakeTime) {
    if (!bedTime || !wakeTime) return 8.0;
    const [bh, bm] = bedTime.split(":").map(Number);
    const [wh, wm] = wakeTime.split(":").map(Number);
    
    let bedMinutes = bh * 60 + bm;
    let wakeMinutes = wh * 60 + wm;
    
    if (wakeMinutes <= bedMinutes) {
        wakeMinutes += 24 * 60; // Crosses midnight
    }
    
    return (wakeMinutes - bedMinutes) / 60;
}

function calculateSleepMetrics() {
    const trip = SYSTEM_STATE.trips.find(t => t.id === SYSTEM_STATE.settings.selectedTripId);
    if (!trip) return;
    
    let totalDeficit = 0;
    let totalSleepHours = 0;
    for (let d = 1; d <= trip.days; d++) {
        const key = `${trip.id}-${d}`;
        const bedtime = SYSTEM_STATE.sleep.bedtimes[key] || "23:00";
        const waketime = SYSTEM_STATE.sleep.wakeTimes[key] || "07:00";
        const duration = getSleepDuration(bedtime, waketime);
        totalSleepHours += duration;
        totalDeficit += Math.max(0, 8.0 - duration);
    }
    SYSTEM_STATE.sleep.accumulatedDeficit = totalDeficit;
    SYSTEM_STATE.sleep.averageSleep = totalSleepHours / trip.days;
    
    // Day deficit
    const key = `${trip.id}-${SYSTEM_STATE.settings.selectedDay}`;
    const bedtime = SYSTEM_STATE.sleep.bedtimes[key] || "23:00";
    const waketime = SYSTEM_STATE.sleep.wakeTimes[key] || "07:00";
    const duration = getSleepDuration(bedtime, waketime);
    const dayDeficit = Math.max(0, 8.0 - duration);
    
    // Density of activities for next day
    const nextDay = SYSTEM_STATE.settings.selectedDay + 1;
    const nextDayActs = ACTIVITIES.filter(a => a.tripId === trip.id && a.day === nextDay && a.owner !== "angelica");
    const criticalActsCount = nextDayActs.filter(a => a.priority === "Critical" || a.priority === "Alta").length;
    
    // MODELO DE FATIGA EXPONENCIAL (Contextura Biomecánica 2.00m / 110kg)
    const WEIGHT_PENALTY_FACTOR = 1.15;
    let fatigue = (Math.pow(1.5, dayDeficit) * 10) 
                + (totalDeficit * 5) 
                + (criticalActsCount * 15 * WEIGHT_PENALTY_FACTOR);
    
    SYSTEM_STATE.sleep.projectedFatigue = Math.min(100, Math.max(0, Math.round(fatigue)));
}

function getFatigueLabel(val) {
    if (val <= 20) return "Baja";
    if (val <= 50) return "Media";
    if (val <= 85) return "Alta";
    return "Crítica";
}

// ==========================================
// RENDER GENERAL SYSTEM
// ==========================================

function renderAll() {
    // Check de seguridad: Si el viaje seleccionado ya no existe en la BD, forzar al primero disponible
    if (SYSTEM_STATE.trips.length > 0) {
        const tripExists = SYSTEM_STATE.trips.find(t => t.id === SYSTEM_STATE.settings.selectedTripId);
        if (!tripExists) {
            SYSTEM_STATE.settings.selectedTripId = SYSTEM_STATE.trips[0].id;
            SYSTEM_STATE.settings.selectedDay = 1;
        }
    }

    // Renderizado Asíncrono mediante requestAnimationFrame (Evita bloqueos de UI)
    requestAnimationFrame(() => {
        calculateSleepMetrics();
        renderExecutiveDashboard();
        calculateUrgency();
        const selectEl = document.getElementById("trip-dropdown-select");
        if (selectEl && selectEl.value !== SYSTEM_STATE.settings.selectedTripId) {
            selectEl.value = SYSTEM_STATE.settings.selectedTripId;
        }
        
        // Lazy rendering: Pestañas secundarias
        requestAnimationFrame(() => {
            renderDecisionCenter();
            renderDecemberTripWidget();
            renderTraceabilityMatrix();
            renderCashFlowTab();
            renderFinancesLedgerTab();
            renderRisksTab();
            
            requestAnimationFrame(() => {
                renderItinerariesTab();
                renderSleepTab();
                renderPackingTab();
                renderConfigTab();
                saveState(); // Sincronización optimista final
            });
        });
    });
}

const PAYMENT_TO_RESERVATION_KEY = {
    "FIN-CAL-DIC-001": "vuelo",
    "FIN-CAL-DIC-002": "airbnb",
    "FIN-CAL-DIC-004": "seguro",
    "FIN-CAL-DIC-005": "traslado"
};

function getReservationState(payment) {
    const key = PAYMENT_TO_RESERVATION_KEY[payment.id];
    if (key && SYSTEM_STATE.reservations[key]) {
        return SYSTEM_STATE.reservations[key];
    }
    return payment.status;
}

function calculateCoverageRatio() {
    const totalCashUsd = getTotalCashUsd();
    
    let commitments30Usd = 0;
    SYSTEM_STATE.payments.forEach(p => {
        if (p.status === "paid" || !p.dueDate) return;
        const diffDays = getDaysToDate(p.dueDate);
        if (diffDays >= 0 && diffDays <= 30) {
            commitments30Usd += p.amount * (EXCHANGE_RATES[p.currency] || 1);
        }
    });

    if (commitments30Usd === 0) return { score: "∞", desc: "Sin compromisos a 30d" };
    
    const ratio = (totalCashUsd / commitments30Usd).toFixed(2);
    
    let desc = "Peligro de Default";
    if (ratio >= 2.0) desc = "Cobertura Sólida";
    else if (ratio >= 1.0) desc = "Cobertura Aceptable";
    else if (ratio >= 0.5) desc = "Cobertura Vulnerable";
    
    return { score: `${ratio}x`, desc };
}

function calculateRunwayScore() {
    const totalCashUsd = getTotalCashUsd();
    const totalDebtUsd = (SYSTEM_STATE.creditCardDebt?.USD || 0) + ((SYSTEM_STATE.creditCardDebt?.PEN || 0) * EXCHANGE_RATES.PEN);
    const netCashUsd = totalCashUsd - totalDebtUsd;
    
    let commitments30Usd = 0;
    SYSTEM_STATE.payments.forEach(p => {
        if (p.status === "paid" || !p.dueDate) return;
        const diffDays = getDaysToDate(p.dueDate);
        if (diffDays >= 0 && diffDays <= 30) {
            commitments30Usd += p.amount * (EXCHANGE_RATES[p.currency] || 1);
        }
    });

    // To avoid infinity, assume a baseline daily expense of at least $50/day plus projected commitments
    const dailyAverageUsd = (commitments30Usd / 30) + 50; 
    const runwayDays = Math.floor(netCashUsd / dailyAverageUsd);
    
    let desc = "Salud Crítica";
    if (runwayDays >= 60) desc = "Sistema Estable";
    else if (runwayDays >= 30) desc = "Atención Requerida";
    else if (runwayDays >= 14) desc = "Riesgo Operativo";

    return { score: runwayDays, desc };
}

function renderExecutiveDashboard() {
    try {
        const safeSetText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
        const safeSetHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

        // 1. Next Trip count
        const baseDate = new Date();
        baseDate.setHours(0,0,0,0);
        const nextTrip = SYSTEM_STATE.trips.filter(t => new Date(t.startDate + "T00:00:00") >= baseDate).sort((a,b) => new Date(a.startDate) - new Date(b.startDate))[0];
        
        if (nextTrip) {
            const diffDays = getDaysToDate(nextTrip.startDate);
            safeSetText("ceo-kpi-next-trip-dest", nextTrip.name);
            safeSetText("ceo-kpi-next-trip-days", `${diffDays} días`);
        } else {
            safeSetText("ceo-kpi-next-trip-dest", "Ninguno");
            safeSetText("ceo-kpi-next-trip-days", "--");
        }

        // 2. Next payment in ledger
        const unpaidPayments = SYSTEM_STATE.payments.filter(p => p.status !== "paid" && p.dueDate).sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
        const nextPayment = unpaidPayments[0];
        if (nextPayment) {
            safeSetText("ceo-kpi-next-payment-concept", nextPayment.concept);
            safeSetText("ceo-kpi-next-payment-details", `${nextPayment.currency} ${nextPayment.amount.toLocaleString()} (${formatDateShort(nextPayment.dueDate)})`);
        } else {
            safeSetText("ceo-kpi-next-payment-concept", "Ninguno");
            safeSetText("ceo-kpi-next-payment-details", "--");
        }

        // 3. Consolidated Multi-currency Exposure (Exposición total)
        let totalUnpaidUsd = 0;
        let totalCommittedUsd = 0;
        let totalPaidUsd = 0;
        
        SYSTEM_STATE.payments.forEach(p => {
            const rate = EXCHANGE_RATES[p.currency] || 1.0;
            const val = p.amount * rate;
            if (p.status === "paid") {
                totalPaidUsd += val;
            } else if (p.status === "committed" || p.status === "reserved") {
                totalCommittedUsd += val;
                totalUnpaidUsd += val;
            } else {
                totalUnpaidUsd += val;
            }
        });

        const totalExposureUsd = totalUnpaidUsd;
        const totalExposurePen = totalExposureUsd / EXCHANGE_RATES.PEN;
        
        safeSetText("ceo-kpi-total-exposure", `USD ${Math.round(totalExposureUsd).toLocaleString()}`);
        safeSetText("ceo-kpi-total-exposure-pen", `Equiv: S/. ${Math.round(totalExposurePen).toLocaleString()}`);

        // 4. Ratio de Cobertura (reemplaza Travel Readiness)
        const coverage = calculateCoverageRatio();
        safeSetText("ceo-kpi-coverage-score", coverage.score);
        safeSetText("ceo-kpi-coverage-desc", coverage.desc);

        // 4.2. Runway Operativo (reemplaza Health Score)
        const runway = calculateRunwayScore();
        const runwayScoreEl = document.getElementById("ceo-kpi-runway-score");
        const runwayDescEl = document.getElementById("ceo-kpi-runway-desc");
        if (runwayScoreEl && runwayDescEl) {
            runwayScoreEl.textContent = `${runway.score} Días`;
            runwayDescEl.textContent = runway.desc;
            runwayScoreEl.className = "val " + (runway.score >= 60 ? "text-emerald" : (runway.score >= 30 ? "text-yellow" : "text-red"));
        }

        // 4.1. Flight Tracker Status
        const trackerStatusEl = document.getElementById("ceo-kpi-flight-tracker-status");
        const trackerDescEl = document.getElementById("ceo-kpi-flight-tracker-desc");
        if (trackerStatusEl && trackerDescEl) {
            if (SYSTEM_STATE.flightTrackerStatus) {
                trackerStatusEl.textContent = SYSTEM_STATE.flightTrackerStatus;
                trackerDescEl.textContent = "Última act. " + (SYSTEM_STATE.flightTrackerTime || "--:--");
            } else {
                trackerStatusEl.textContent = "Sin datos recientes";
                trackerDescEl.textContent = "Agente en espera";
            }
        }

        // 5. Active Risks Count
        const activeRisks = SYSTEM_STATE.risks.length;
        safeSetText("ceo-kpi-risks", activeRisks);

        // 6. Unissued Reservations
        const unissuedCount = SYSTEM_STATE.payments.filter(p => p.status === "pending" && p.category === "Logística").length;
        safeSetText("ceo-kpi-unissued", unissuedCount);

        // 7. Q&A immediate answers
        // Q1
        safeSetHTML("q-next-payment", nextPayment 
            ? `<span style='color: var(--primary); font-weight: bold;'>${formatDateShort(nextPayment.dueDate)}</span> - ${nextPayment.concept} (<strong>${nextPayment.currency} ${nextPayment.amount.toLocaleString()}</strong>)`
            : "Ninguno pendiente.");
        const currentYearMonth = new Date().toISOString().slice(0, 7);
        const thisMonthPayments = SYSTEM_STATE.payments.filter(p => p.status !== "paid" && p.dueDate && p.dueDate.startsWith(currentYearMonth));
        const thisMonthTotalUsd = thisMonthPayments.reduce((acc, curr) => acc + (curr.amount * (EXCHANGE_RATES[curr.currency] || 1)), 0);
        safeSetHTML("q-money-this-month", `<strong style="color: #f8fafc;">$${thisMonthTotalUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</strong> (~S/. ${(thisMonthTotalUsd / EXCHANGE_RATES.PEN).toLocaleString('es-PE', { maximumFractionDigits: 0 })} PEN)`);
        
        // Q3: Money until Jan 2027
        safeSetHTML("q-money-until-dec", `<strong style="color: #34d399;">$${totalUnpaidUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</strong>`);
        
        // Q4: Most expensive trip
        const tripCosts = SYSTEM_STATE.trips.map(t => {
            const cost = SYSTEM_STATE.payments.filter(p => p.tripId === t.id).reduce((acc, curr) => acc + (curr.amount * (EXCHANGE_RATES[curr.currency] || 1)), 0);
            return { name: t.name, cost };
        });
        tripCosts.sort((a,b) => b.cost - a.cost);
        safeSetHTML("q-most-expensive-trip", tripCosts.length > 0 ? `${tripCosts[0].name} (<strong>$${tripCosts[0].cost.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</strong>)` : "--");

        // Q5: Missing reservations
        const missingLogistics = SYSTEM_STATE.payments.filter(p => p.status === "pending" && p.category === "Logística").map(p => p.concept);
        if (missingLogistics.length > 0) {
            const firstTwo = missingLogistics.slice(0, 2).join(", ");
            if (missingLogistics.length > 2) {
                const others = missingLogistics.slice(2).join("&#10;• ");
                safeSetHTML("q-missing-reservations", `${firstTwo} <span title="• ${others}" style="cursor: help; border-bottom: 1px dashed #94a3b8;">y ${missingLogistics.length - 2} más</span>`);
            } else {
                safeSetText("q-missing-reservations", firstTwo);
            }
        } else {
            safeSetText("q-missing-reservations", "Ninguna.");
        }
        // Exposure, committed, executed totals
        safeSetText("q-total-exposure", `$${totalUnpaidUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD`);
        safeSetText("q-total-committed", `$${totalCommittedUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD`);
        safeSetText("q-total-executed", `$${totalPaidUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD`);

        // 8. stacked bar execution chart
        const totalFinancialsUsd = totalPaidUsd + totalUnpaidUsd;
        const paidPct = totalFinancialsUsd > 0 ? Math.round((totalPaidUsd / totalFinancialsUsd) * 100) : 0;
        const committedPct = totalFinancialsUsd > 0 ? Math.round((totalCommittedUsd / totalFinancialsUsd) * 100) : 0;
        const pendingPct = 100 - paidPct - committedPct;

        const barPaid = document.getElementById("exec-bar-paid");
        const barCommitted = document.getElementById("exec-bar-committed");
        const barPending = document.getElementById("exec-bar-pending");
        
        if (barPaid) { barPaid.style.width = `${paidPct}%`; barPaid.textContent = paidPct > 8 ? `${paidPct}%` : ""; }
        if (barCommitted) { barCommitted.style.width = `${committedPct}%`; barCommitted.textContent = committedPct > 8 ? `${committedPct}%` : ""; }
        if (barPending) { barPending.style.width = `${pendingPct}%`; barPending.textContent = pendingPct > 8 ? `${pendingPct}%` : ""; }

        safeSetText("exec-pct-paid", `${paidPct}%`);
        safeSetText("exec-pct-committed", `${committedPct}%`);
        safeSetText("exec-pct-pending", `${pendingPct}%`);

        // 9. Liquidity module calculation
        const totalCashUsd = getTotalCashUsd();
        
        // Commitments in next 30 days
        let commitments30Usd = 0;
        SYSTEM_STATE.payments.forEach(p => {
            if (p.status === "paid" || !p.dueDate) return;
            const diffDays = getDaysToDate(p.dueDate);
            if (diffDays >= 0 && diffDays <= 30) {
                commitments30Usd += p.amount * (EXCHANGE_RATES[p.currency] || 1);
            }
        });

        const totalDebtUsd = (SYSTEM_STATE.creditCardDebt?.USD || 0) + ((SYSTEM_STATE.creditCardDebt?.PEN || 0) * EXCHANGE_RATES.PEN);
        const remainingLiquidityUsd = totalCashUsd - totalDebtUsd - commitments30Usd;
        
        safeSetText("liq-cash-available", `$${Math.round(totalCashUsd).toLocaleString()} USD`);
        const cash = SYSTEM_STATE.cash || { USD: 0, PEN: 0, COP: 0 };
        safeSetHTML("liq-cash-breakdown", `
            <span>USD: $${(cash.USD || 0).toLocaleString()}</span>
            <span>PEN: S/.${(cash.PEN || 0).toLocaleString()}</span>
            <span>COP: $${(cash.COP || 0).toLocaleString()}</span>
        `);
        
        safeSetText("liq-debt-tc", `$${Math.round(totalDebtUsd).toLocaleString()} USD`);
        safeSetText("liq-commitments-30", `$${Math.round(commitments30Usd).toLocaleString()} USD`);
        
        const remStatus = document.getElementById("liq-remaining-status");
        if (remStatus) {
            remStatus.textContent = `$${Math.round(remainingLiquidityUsd).toLocaleString()} USD`;
            const liqAlert = document.getElementById("liquidity-alert-box");
            if (remainingLiquidityUsd < 0) {
                remStatus.style.color = "var(--danger)";
                if (liqAlert) liqAlert.innerHTML = `<div class="alert-box critical" style="padding: 10px; margin-top: 10px;"><i class="fa-solid fa-circle-xmark"></i> <strong>DÉFICIT DE CAJA:</strong> Liquidez insuficiente para cubrir compromisos a 30 días.</div>`;
            } else {
                remStatus.style.color = "var(--success)";
                if (liqAlert) liqAlert.innerHTML = `<div class="alert-box safe" style="padding: 10px; margin-top: 10px;"><i class="fa-solid fa-circle-check"></i> <strong>Caja Suficiente:</strong> Liquidez para los próximos 30 días garantizada.</div>`;
            }
        }

        renderCriticalAlerts();
    } catch(e) {
        console.error("Error renderizando Executive Dashboard:", e);
    }
}

function renderCriticalAlerts() {
    const container = document.getElementById("urgent-payments");
    if (!container) return;

    const alerts = [];

    SYSTEM_STATE.payments.forEach(item => {
        const isPaid = item.status === "paid";
        if (isPaid) return;

        if (item.dueDate) {
            const days = getDaysToDate(item.dueDate);
            if (days >= 0 && days <= 10) {
                alerts.push({
                    priority: "P0",
                    text: `PAGO INMINENTE: <strong>${item.concept}</strong> de ${item.currency} ${item.amount.toLocaleString()} vence en <strong>${days} días</strong> (${formatDateShort(item.dueDate)}).`
                });
            } else if (days > 10 && days <= 30) {
                alerts.push({
                    priority: "P1",
                    text: `Pago Próximo: <strong>${item.concept}</strong> vence el ${formatDateShort(item.dueDate)}.`
                });
            } else if (days < 0) {
                alerts.push({
                    priority: "P0",
                    text: `⚠️ PAGO VENCIDO: <strong>${item.concept}</strong> venció hace ${Math.abs(days)} días (${formatDateShort(item.dueDate)}).`
                });
            }
        }
    });

    // Risky items check
    SYSTEM_STATE.risks.forEach(risk => {
        const correspondingPayment = SYSTEM_STATE.payments.find(p => p.concept.toLowerCase().includes(risk.concept.toLowerCase()) || risk.concept.toLowerCase().includes(p.concept.toLowerCase()));
        const isResolved = correspondingPayment && correspondingPayment.status === "paid";
        if (!isResolved && (risk.level === "CRÍTICO" || risk.level === "ALTO")) {
            alerts.push({
                priority: "Riesgo",
                text: `<strong>${risk.concept}:</strong> Probabilidad ${risk.probability} | Mitigación: ${risk.mitigation}`
            });
        }
    });

    if (alerts.length === 0) {
        container.innerHTML = "<div class='alert-box safe'><i class='fa-solid fa-circle-check'></i> Sin alertas críticas de caja u operacionales.</div>";
        return;
    }

    container.innerHTML = `
        <h4 style="color: #fca5a5; font-size: 0.85rem; margin-bottom: 8px;"><i class="fa-solid fa-triangle-exclamation"></i> Alertas y Riesgos de Caja:</h4>
        <ul style="padding-left: 15px; font-size: 0.75rem; display: flex; flex-direction: column; gap: 8px; list-style-type: none;">
            ${alerts.map(a => `
                <li class="alert-item ${a.priority.toLowerCase() === 'p0' ? 'p0' : 'p1'}" style="margin-bottom: 4px; padding: 6px; border-radius: 4px;">
                    <span class="badge-priority" style="background: rgba(0,0,0,0.3); font-weight: bold; border-radius: 3px; padding: 2px 4px;">${a.priority}</span> ${a.text}
                </li>
            `).join("")}
        </ul>
    `;
}

// --- NEW PHASE II WIDGETS ---

function renderDecisionCenter() {
    const container = document.getElementById("decision-center-actions");
    if (!container) return;

    const actions = [];

    // 1. Airbnb Cali (Julio)
    const airbnbCali = SYSTEM_STATE.payments.find(p => p.id === "FIN-CAL-JUL-002");
    if (airbnbCali && airbnbCali.status !== "paid") {
        actions.push({
            id: "dec-airbnb-cali",
            title: "Pagar Airbnb Cali (Julio)",
            desc: `Vence el 23 de junio (${airbnbCali.currency} ${airbnbCali.amount.toLocaleString()}). Débito automático programado.`,
            dueDate: "2026-06-23"
        });
    }

    // 2. Confirmar Cordillera Saldo
    const cordilleraSaldo = SYSTEM_STATE.payments.find(p => p.id === "FIN-BOG-SEP-002");
    if (cordilleraSaldo && cordilleraSaldo.status !== "paid") {
        actions.push({
            id: "dec-cordillera-saldo",
            title: "Confirmar Cordillera (Saldo)",
            desc: `Pagar saldo restante (COP 1,382,400) en Armatuvaca con fondos de Cadena Colombia. Vence el 28 de agosto.`,
            dueDate: "2026-08-28"
        });
    }

    // 3. Solicitar crédito de S/. 22,000 para Europa
    if (!SYSTEM_STATE.settings.loanRequested) {
        actions.push({
            id: "dec-loan-europa",
            title: "Solicitar Crédito Europa (S/. 22,000)",
            desc: "Iniciar trámite bancario para amortización de 14 meses (S/. 1,571.43/mes). Recomendado completar en septiembre.",
            dueDate: "2026-09-15"
        });
    }

    // 4. Emitir vuelo Cali Dic
    const vueloCaliDic = SYSTEM_STATE.payments.find(p => p.id === "FIN-CAL-DIC-001");
    if (vueloCaliDic && vueloCaliDic.status !== "paid") {
        actions.push({
            id: "dec-vuelo-dic",
            title: "Emitir Vuelo Cali (Diciembre)",
            desc: `Vuelo Premium Economy (USD ${vueloCaliDic.amount.toLocaleString()}) para evitar incremento inflacionario de +35% en septiembre.`,
            dueDate: "2026-07-15"
        });
    }

    // 5. Reservar Europa
    const europaTrip = SYSTEM_STATE.trips.find(t => t.id === "VIAJE-2026-10-12-EUROPA");
    const reservationsPending = SYSTEM_STATE.reservations["vuelo_europa"] === "Pendiente" || SYSTEM_STATE.reservations["hotel_europa"] === "Pendiente";
    if (europaTrip && (europaTrip.status === "planned" || reservationsPending)) {
        actions.push({
            id: "dec-res-europa",
            title: "Completar Reservas de Europa",
            desc: "Cotizar y bloquear hoteles y vuelos para el Grand Tour usando el fondo de la Junta Dorada y el crédito bancario.",
            dueDate: "2026-08-15"
        });
    }

    // Sort by due date ascending
    actions.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (actions.length === 0) {
        container.innerHTML = `
            <div class="alert-box safe" style="padding: 12px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-circle-check"></i>
                <div>
                    <strong>¡Todo al día!</strong> No hay acciones recomendadas para hoy.
                </div>
            </div>
        `;
        return;
    }

    let html = "";
    actions.forEach(act => {
        const diffDays = getDaysToDate(act.dueDate);
        let badgeColor = "var(--info)";
        if (diffDays <= 10) badgeColor = "var(--danger)";
        else if (diffDays <= 30) badgeColor = "var(--warning)";

        html += `
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 8px;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span style="font-size: 0.7rem; font-weight: bold; background: ${badgeColor}; color: #000; padding: 2px 6px; border-radius: 4px;">
                            ${diffDays < 0 ? 'VENCIDO' : (diffDays === 0 ? 'HOY' : `Faltan ${diffDays} días`)}
                        </span>
                        <h4 style="font-size: 0.85rem; font-weight: bold; color: #fff; margin: 0;">${act.title}</h4>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 4px 0 0 0; line-height: 1.3;">${act.desc}</p>
                </div>
                <button onclick="executeDecisionAction('${act.id}')" class="btn btn-sm" style="background: var(--primary); font-size: 0.7rem; padding: 4px 8px; border-radius: 4px; border: none; color: #fff; cursor: pointer; white-space: nowrap;">
                    <i class="fa-solid fa-check"></i> Resolver
                </button>
            </div>
        `;
    });

    container.innerHTML = html;
}

window.executeDecisionAction = function(id) {
    if (id === "dec-airbnb-cali") {
        const p = SYSTEM_STATE.payments.find(x => x.id === "FIN-CAL-JUL-002");
        if (p) {
            p.status = "paid";
            logAction("Airbnb Cali marcado como PAGADO desde el Centro de Decisiones.", "SUCCESS");
        }
    } else if (id === "dec-cordillera-saldo") {
        const p = SYSTEM_STATE.payments.find(x => x.id === "FIN-BOG-SEP-002");
        if (p) {
            p.status = "paid";
            logAction("Saldo de Cordillera marcado como PAGADO desde el Centro de Decisiones.", "SUCCESS");
        }
    } else if (id === "dec-loan-europa") {
        SYSTEM_STATE.settings.loanRequested = true;
        logAction("Crédito bancario de S/. 22,000 para Europa marcado como SOLICITADO y APROBADO.", "SUCCESS");
        const checkbox = document.getElementById("config-loan-requested");
        if (checkbox) checkbox.checked = true;
    } else if (id === "dec-vuelo-dic") {
        const p = SYSTEM_STATE.payments.find(x => x.id === "FIN-CAL-DIC-001");
        if (p) {
            p.status = "paid";
            logAction("Vuelo Cali Diciembre marcado como EMITIDO/PAGADO desde el Centro de Decisiones.", "SUCCESS");
        }
    } else if (id === "dec-res-europa") {
        const t = SYSTEM_STATE.trips.find(x => x.id === "VIAJE-2026-10-12-EUROPA");
        if (t) t.status = "confirmed";
        SYSTEM_STATE.reservations["vuelo_europa"] = "Emitido";
        SYSTEM_STATE.reservations["hotel_europa"] = "Emitido";
        logAction("Reservas de Europa (vuelo y hotel) marcadas como EMITIDAS desde el Centro de Decisiones.", "SUCCESS");
    }
    renderAll();
};

function renderDecemberTripWidget() {
    const container = document.getElementById("december-trip-widget-content");
    if (!container) return;

    const pVuelo = SYSTEM_STATE.payments.find(p => p.id === "FIN-CAL-DIC-001");
    const pAirbnb = SYSTEM_STATE.payments.find(p => p.id === "FIN-CAL-DIC-002");
    const pSeguro = SYSTEM_STATE.payments.find(p => p.id === "FIN-CAL-DIC-004");
    const pTraslado = SYSTEM_STATE.payments.find(p => p.id === "FIN-CAL-DIC-005");

    const vueloStatus = pVuelo && pVuelo.status === "paid";
    const airbnbStatus = pAirbnb && pAirbnb.status === "paid";
    const seguroStatus = pSeguro && pSeguro.status === "paid";
    const trasladoStatus = pTraslado && pTraslado.status === "paid";

    let itemsCount = 4;
    let emittedCount = 0;
    if (vueloStatus) emittedCount++;
    if (airbnbStatus) emittedCount++;
    if (seguroStatus) emittedCount++;
    if (trasladoStatus) emittedCount++;
    const readinessPct = Math.round((emittedCount / itemsCount) * 100);

    let alertHtml = "";
    if (!vueloStatus) {
        alertHtml = `
            <div class="alert-box critical" style="margin-top: 12px; padding: 8px 10px; font-size: 0.75rem;">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <strong>RIESGO DE INFLACIÓN (+35%):</strong> Vuelo sin emitir. Comprar antes de <strong>septiembre</strong> para asegurar espacio ergonómico y tarifa base.
            </div>
        `;
    } else {
        alertHtml = `
            <div class="alert-box safe" style="margin-top: 12px; padding: 8px 10px; font-size: 0.75rem;">
                <i class="fa-solid fa-circle-check"></i>
                <strong>Vuelo asegurado:</strong> Tarifa y espacio ergonómico (Premium Economy) blindados.
            </div>
        `;
    }

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.8rem; color: var(--text-secondary);">Progreso de Preparación:</span>
            <strong style="font-size: 0.95rem; color: ${readinessPct >= 80 ? 'var(--success)' : (readinessPct >= 50 ? 'var(--warning)' : 'var(--danger)')};">${readinessPct}%</strong>
        </div>
        <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; margin-bottom: 15px;">
            <div style="width: ${readinessPct}%; height: 100%; background: ${readinessPct >= 80 ? 'var(--success)' : (readinessPct >= 50 ? 'var(--warning)' : 'var(--danger)')};"></div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
                <span>✈️ Vuelo Cali (Premium Economy)</span>
                <span class="status-cfo ${vueloStatus ? 'green' : 'red'}" style="font-size: 0.65rem;">
                    ${vueloStatus ? 'EMITIDO' : 'PENDIENTE'}
                </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
                <span>🏠 Airbnb Cali (13 noches)</span>
                <span class="status-cfo ${airbnbStatus ? 'green' : 'red'}" style="font-size: 0.65rem;">
                    ${airbnbStatus ? 'EMITIDO' : 'PENDIENTE'}
                </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
                <span>🛡️ Seguro de viaje Cali</span>
                <span class="status-cfo ${seguroStatus ? 'green' : 'red'}" style="font-size: 0.65rem;">
                    ${seguroStatus ? 'EMITIDO' : 'PENDIENTE'}
                </span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
                <span>🚕 Traslados (Uber Comfort)</span>
                <span class="status-cfo ${trasladoStatus ? 'green' : 'red'}" style="font-size: 0.65rem;">
                    ${trasladoStatus ? 'EMITIDO' : 'PENDIENTE'}
                </span>
            </div>
        </div>
        ${alertHtml}
    `;
}

function renderBurnForecast() {
    const months = FISCAL_MONTHS;

    let html = `
        <div class="finance-card" style="margin-top: 20px;">
            <h3><i class="fa-solid fa-fire-flame-curved" style="color: var(--danger);"></i> Pronóstico de Velocidad de Gasto (Cash Burn Forecast)</h3>
            <p class="desc" style="margin-bottom: 15px;">Proyección mensual de egresos consolidados en el ledger. Integra las amortizaciones del crédito de S/. 22,000 PEN (S/. 1,571.43 / mes) a partir de noviembre.</p>
            <div class="scrollable-x">
                <table class="cfo-table">
                    <thead>
                        <tr>
                            <th>Mes</th>
                            <th>Egresos Ejecutados</th>
                            <th>Egresos Proyectados</th>
                            <th>Total Flujo Salida</th>
                            <th>Progreso del Mes</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    months.forEach(m => {
        const monthItems = SYSTEM_STATE.payments.filter(p => p.dueDate && p.dueDate.startsWith(m.key));
        let executedUsd = 0;
        let projectedUsd = 0;

        monthItems.forEach(item => {
            const val = item.amount * (EXCHANGE_RATES[item.currency] || 1);
            if (item.status === "paid") {
                executedUsd += val;
            } else {
                projectedUsd += val;
            }
        });

        const totalUsd = executedUsd + projectedUsd;
        const totalPen = totalUsd / EXCHANGE_RATES.PEN;
        
        let progressPercent = 0;
        if (totalUsd > 0) {
            progressPercent = Math.round((executedUsd / totalUsd) * 100);
        }

        html += `
            <tr>
                <td><strong>${m.name}</strong></td>
                <td style="color: var(--success); font-weight: 500;">$${Math.round(executedUsd).toLocaleString()} USD</td>
                <td style="color: var(--warning); font-weight: 500;">$${Math.round(projectedUsd).toLocaleString()} USD</td>
                <td style="font-weight: bold; color: #fff;">$${Math.round(totalUsd).toLocaleString()} USD <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:normal;">(S/. ${Math.round(totalPen).toLocaleString()} PEN)</span></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; min-width: 80px;">
                            <div style="width: ${progressPercent}%; height: 100%; background: var(--success);"></div>
                        </div>
                        <span style="font-size: 0.75rem; font-weight: bold; color: var(--text-secondary);">${progressPercent}%</span>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return html;
}

// --- PESTAÑA 2: VIAJES ---

function renderTraceabilityMatrix() {
    const container = document.getElementById("traceability-matrix-render");
    if (!container) return;

    let html = `
        <div class="scrollable-x">
            <table class="cfo-table">
                <thead>
                    <tr>
                        <th>ID Único</th>
                        <th>Viaje / Destino</th>
                        <th>Fechas</th>
                        <th>Estado</th>
                        <th>Riesgo</th>
                        <th>Avance Pago</th>
                    </tr>
                </thead>
                <tbody>
    `;

    SYSTEM_STATE.trips.forEach(t => {
        const tripItems = SYSTEM_STATE.payments.filter(item => item.tripId === t.id);
        const total = tripItems.reduce((acc, curr) => acc + (curr.amount * (EXCHANGE_RATES[curr.currency] || 1)), 0);
        const paid = tripItems.filter(item => item.status === "paid").reduce((acc, curr) => acc + (curr.amount * (EXCHANGE_RATES[curr.currency] || 1)), 0);
        
        const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
        const riskClass = t.riskLevel === "Alto" ? "red" : (t.riskLevel === "Medio" ? "yellow" : "green");

        html += `
            <tr style="cursor: pointer;" onclick="document.querySelector('[data-trip=\\'${t.id}\\']').click(); document.querySelector('[data-target=\\'tab-viajes\\']').click();">
                <td><code>${t.id}</code></td>
                <td><strong>${t.name}</strong><br><small style="color: var(--text-secondary);">${t.destination}</small></td>
                <td>${formatDateShort(t.startDate)} al ${formatDateShort(t.endDate)}</td>
                <td><span class="status-cfo ${t.status === 'confirmed' ? 'green' : 'yellow'}">${t.status.toUpperCase()}</span></td>
                <td><span class="status-cfo ${riskClass}">${t.riskLevel}</span></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="progress-bar-container" style="flex: 1; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; width: 60px;">
                            <div style="width: ${pct}%; height: 100%; background: var(--primary);"></div>
                        </div>
                        <span style="font-size: 0.7rem; font-weight: bold;">${pct}%</span>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML = html;
}

// --- PESTAÑA 3: FLUJO DE CAJA & TIMELINE (GANTT) ---

function renderCashFlowTab() {
    const container = document.getElementById("cash-flow-render-content");
    if (!container) return;

    // Build timeline grouped by month
    const months = FISCAL_MONTHS;

    const totalCashUsd = getTotalCashUsd();
    const totalDebtUsd = (SYSTEM_STATE.creditCardDebt?.USD || 0) + ((SYSTEM_STATE.creditCardDebt?.PEN || 0) * EXCHANGE_RATES.PEN);
    const netCashUsd = totalCashUsd - totalDebtUsd;
    
    let totalPendingPaymentsUsd = 0;
    SYSTEM_STATE.payments.forEach(p => {
        if (p.status !== "paid" && p.dueDate) {
            totalPendingPaymentsUsd += p.amount * (EXCHANGE_RATES[p.currency] || 1);
        }
    });
    
    let weeklySavePen = 0;
    const deficitUsd = totalPendingPaymentsUsd - netCashUsd;
    if (deficitUsd > 0) {
        const weeksRemaining = Math.max(1, Math.ceil((new Date("2026-12-31") - new Date()) / (1000 * 60 * 60 * 24 * 7)));
        const weeklySaveUsd = deficitUsd / weeksRemaining;
        weeklySavePen = weeklySaveUsd / EXCHANGE_RATES.PEN;
    }

    let html = `
        <!-- Flujo de Caja y Ahorros -->
        <div class="finance-card">
            <h3 style="margin-bottom: 15px;"><i class="fa-solid fa-wallet"></i> Planificación y Ahorros</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; padding: 15px;">
                    <small style="font-size: 0.75rem; color: var(--text-secondary);">Liquidez Neta Real (Consolidado)</small>
                    <div style="font-size: 1.15rem; font-weight: bold; color: ${netCashUsd >= 0 ? '#34d399' : '#ef4444'}; margin-top: 5px;">$${Math.round(netCashUsd).toLocaleString()} USD <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:normal;">(S/. ${Math.round(netCashUsd/EXCHANGE_RATES.PEN).toLocaleString()} PEN)</span></div>
                </div>
                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; padding: 15px;">
                    <small style="font-size: 0.75rem; color: var(--text-secondary);">Ahorro Semanal Sugerido (Hacia Dec 2026)</small>
                    <div style="font-size: 1.15rem; font-weight: bold; color: var(--primary); margin-top: 5px;">S/. ${Math.round(weeklySavePen).toLocaleString()} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-secondary);">(cada domingo)</span></div>
                </div>
            </div>

            <h4 style="font-size: 0.9rem; margin-bottom: 10px;">Metas Mensuales de Ahorro Programado</h4>
            <div class="scrollable-x">
                <table class="cfo-table">
                    <thead>
                        <tr>
                            <th>Mes</th>
                            <th>Ahorro Requerido</th>
                            <th>Hitos y Compras Clave</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td><strong>Junio 2026</strong></td><td>S/. 1,500.00</td><td>Airbnb Cali Julio y Vuelos Cusco (Completado)</td></tr>
                        <tr><td><strong>Julio 2026</strong></td><td>S/. 2,000.00</td><td>Comprar Vuelo Cali Diciembre (Premium Economy)</td></tr>
                        <tr><td><strong>Agosto 2026</strong></td><td>S/. 2,500.00</td><td>Abonar saldo Apu Andino Cusco y liquidar Cordillera</td></tr>
                        <tr><td><strong>Septiembre 2026</strong></td><td>S/. 1,500.00</td><td>Viáticos Bogotá y abono para Airbnb de Diciembre</td></tr>
                        <tr><td><strong>Octubre 2026</strong></td><td>S/. 2,000.00</td><td>Europa Grand Tour (Ahorro Junta Dorada S/. 11,000)</td></tr>
                        <tr><td><strong>Noviembre 2026</strong></td><td>S/. 2,000.00</td><td>Saldar reservas de Fin de Año en Cali</td></tr>
                        <tr><td><strong>Diciembre 2026</strong></td><td>S/. 1,500.00</td><td>Viáticos Feria de Cali y transporte local</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Proyecciones temporales -->
        ${renderCashProjectionWidget()}

        <!-- Pronóstico de Velocidad de Gasto -->
        ${renderBurnForecast()}

        <!-- Timeline Gantt Financiero -->
        <div class="finance-card" style="margin-top: 20px;">
            <h3><i class="fa-solid fa-chart-gantt"></i> Timeline Financiero (Outflows Gantt)</h3>
            <p class="desc" style="margin-bottom: 15px;">Cronograma visual de egresos proyectados y pagados por mes:</p>
            <div style="display: flex; flex-direction: column; gap: 15px;">
    `;

    months.forEach(m => {
        const monthItems = SYSTEM_STATE.payments.filter(p => p.dueDate && p.dueDate.startsWith(m.key));
        let monthPaid = 0;
        let monthUnpaid = 0;
        let itemsHtml = "";

        monthItems.forEach(item => {
            const val = item.amount * (EXCHANGE_RATES[item.currency] || 1);
            const isPaid = item.status === "paid";
            if (isPaid) monthPaid += val;
            else monthUnpaid += val;

            itemsHtml += `
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; border-left: 2px solid ${isPaid ? 'var(--success)' : 'var(--primary)'}; padding-left: 8px; margin-top: 5px; color: ${isPaid ? 'var(--text-muted)' : '#fff'};">
                    <span>${item.concept} (${item.currency} ${item.amount.toLocaleString()})</span>
                    <span>${isPaid ? '🟢 Pagado' : '⏳ Pendiente'}</span>
                </div>
            `;
        });

        const totalMonth = monthPaid + monthUnpaid;
        const paidPct = totalMonth > 0 ? Math.round((monthPaid / totalMonth) * 100) : 0;

        if (totalMonth > 0) {
            html += `
                <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-glass); border-radius: 10px; padding: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <strong style="font-size: 0.9rem; color: #fff;">${m.name}</strong>
                        <span style="font-size: 0.85rem; font-weight: bold; color: var(--primary);">$${Math.round(totalMonth).toLocaleString()} USD</span>
                    </div>
                    <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
                        <div style="width: ${paidPct}%; height: 100%; background: var(--success);"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 10px;">
                        <span>Pagado: $${Math.round(monthPaid).toLocaleString()} USD</span>
                        <span>Pendiente: $${Math.round(monthUnpaid).toLocaleString()} USD</span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        ${itemsHtml}
                    </div>
                </div>
            `;
        }
    });

    html += `
            </div>
        </div>
    `;
    container.innerHTML = html;
}

function renderCashProjectionWidget() {
    const timeframes = [7, 30, 60, 90, 120];
    const projection = {};

    timeframes.forEach(days => {
        projection[days] = { USD: 0, PEN: 0, COP: 0, EUR: 0, totalUsd: 0 };
    });

    SYSTEM_STATE.payments.forEach(item => {
        if (item.status === "paid" || !item.dueDate) return;

        const daysToDue = getDaysToDate(item.dueDate);
        const rate = EXCHANGE_RATES[item.currency] || 1.0;
        const usdValue = item.amount * rate;
        
        timeframes.forEach(tf => {
            if (daysToDue <= tf) {
                projection[tf][item.currency] += item.amount;
                projection[tf].totalUsd += usdValue;
            }
        });
    });

    let html = `
        <div class="finance-card" style="margin-top: 20px;">
            <h3><i class="fa-solid fa-hourglass-half"></i> Proyección de Vencimientos</h3>
            <p class="desc" style="margin-bottom: 12px;">Caja requerida por horizonte temporal para evitar caídas de liquidez:</p>
            <div class="scrollable-x">
                <table class="cfo-table">
                    <thead>
                        <tr>
                            <th>Horizonte</th>
                            <th>USD</th>
                            <th>PEN (S/.)</th>
                            <th>COP ($)</th>
                            <th>Consolidado USD</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    timeframes.forEach(tf => {
        const data = projection[tf];
        html += `
            <tr>
                <td><strong>En ${tf} días</strong></td>
                <td>$${data.USD.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td>S/. ${data.PEN.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</td>
                <td>$${data.COP.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</td>
                <td style="color: #34d399; font-weight: bold;">$${data.totalUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return html;
}

// --- PESTAÑA 4: LIBRO MAYOR FINANZAS ---

function renderFinancesLedgerTab() {
    const container = document.getElementById("finances-ledger-content");
    if (!container) return;

    // Filter selector options
    let filterOptions = `<option value="all" ${SYSTEM_STATE.settings.selectedFinanceTripFilter === 'all' ? 'selected' : ''}>🌍 Todos los Viajes</option>`;
    SYSTEM_STATE.trips.forEach(t => {
        filterOptions += `<option value="${t.id}" ${SYSTEM_STATE.settings.selectedFinanceTripFilter === t.id ? 'selected' : ''}>${t.name}</option>`;
    });

    const filteredItems = SYSTEM_STATE.payments.filter(item => {
        if (SYSTEM_STATE.settings.selectedFinanceTripFilter !== "all" && item.tripId !== SYSTEM_STATE.settings.selectedFinanceTripFilter) return false;
        return true;
    });

    let html = `
        <!-- Control de Emisión (Viaje Diciembre) -->
        ${renderDecemberEmissionControl()}

        <!-- Listado Libro Mayor -->
        <div class="finance-card" style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0;"><i class="fa-solid fa-list-check"></i> Libro Mayor de Egresos</h3>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <label for="finance-trip-filter" style="font-size: 0.8rem; color: var(--text-secondary);">Filtrar por viaje:</label>
                    <select id="finance-trip-filter" class="cfo-select" style="font-size: 0.8rem; padding: 4px 8px;">
                        ${filterOptions}
                    </select>
                </div>
            </div>

            <div class="scrollable-x">
                <table class="cfo-table">
                    <thead>
                        <tr>
                            <th style="width: 40px; text-align: center;">Pagado</th>
                            <th>Vencimiento</th>
                            <th>Concepto</th>
                            <th>Monto Original</th>
                            <th>Equiv. USD</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    filteredItems.forEach(item => {
        const isPaid = item.status === "paid";
        const rate = EXCHANGE_RATES[item.currency] || 1.0;
        const usdValue = item.amount * rate;
        
        let statusLabel = item.status.toUpperCase();
        let statusClass = "blue";
        if (isPaid) {
            statusClass = "green";
            statusLabel = "PAGADO";
        } else if (item.status === "committed" || item.status === "reserved") {
            statusClass = "yellow";
            statusLabel = "RESERVADO";
        } else if (item.dueDate && getDaysToDate(item.dueDate) < 0) {
            statusClass = "red";
            statusLabel = "VENCIDO ⚠️";
        }

        html += `
            <tr class="${isPaid ? 'row-paid' : ''}">
                <td style="text-align: center;">
                    <input type="checkbox" class="finance-checkbox" data-id="${item.id}" ${isPaid ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px;">
                </td>
                <td><code>${item.dueDate ? formatDateShort(item.dueDate) : 'N/A'}</code></td>
                <td>
                    <strong>${item.concept}</strong>
                    <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px;">${item.notes || ''}</div>
                </td>
                <td>${item.currency} ${item.amount.toLocaleString()}</td>
                <td style="font-weight: bold;">$${usdValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</td>
                <td><span class="status-cfo ${statusClass}" style="font-size: 0.65rem;">${statusLabel}</span></td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Checkbox changes in ledger
    const checkboxes = container.querySelectorAll(".finance-checkbox");
    checkboxes.forEach(cb => {
        cb.addEventListener("change", (e) => {
            const id = e.target.dataset.id;
            const item = SYSTEM_STATE.payments.find(f => f.id === id);
            item.status = e.target.checked ? "paid" : "pending";
            logAction(`Gasto de ${item.concept} marcado como ${e.target.checked ? 'PAGADO' : 'PENDIENTE'}`, e.target.checked ? "SUCCESS" : "WARNING");
            renderAll();
        });
    });

    // Select filter
    const filterSelect = container.querySelector("#finance-trip-filter");
    if (filterSelect) {
        filterSelect.addEventListener("change", (e) => {
            SYSTEM_STATE.settings.selectedFinanceTripFilter = e.target.value;
            saveState();
            renderAll();
        });
    }

    // December bookings selector changes
    const selects = container.querySelectorAll(".dec-emission-select");
    selects.forEach(sel => {
        sel.addEventListener("change", (e) => {
            const key = e.target.dataset.item;
            SYSTEM_STATE.reservations[key] = e.target.value;
            
            // Sync with payments status as well
            const mapping = {
                "vuelo": "FIN-CAL-DIC-001",
                "airbnb": "FIN-CAL-DIC-002",
                "seguro": "FIN-CAL-DIC-004",
                "traslado": "FIN-CAL-DIC-005"
            };
            const payId = mapping[key];
            if (payId) {
                const pItem = SYSTEM_STATE.payments.find(p => p.id === payId);
                if (pItem) {
                    if (e.target.value === "Emitido") pItem.status = "paid";
                    else if (e.target.value === "En Proceso") pItem.status = "committed";
                    else pItem.status = "pending";
                }
            }

            logAction(`Estado de reserva [${key.toUpperCase()}] actualizado a: ${e.target.value}`, "INFO");
            renderAll();
        });
    });
}

function renderDecemberEmissionControl() {
    const decItems = SYSTEM_STATE.payments.filter(item => item.tripId === "VIAJE-2026-12-22-CALI" && PAYMENT_TO_RESERVATION_KEY[item.id]);
    
    let html = `
        <div class="finance-card">
            <h3><i class="fa-solid fa-passport"></i> Estado de Emisión (Viaje Diciembre)</h3>
            <p class="desc" style="margin-bottom: 12px;">Actualiza el estado de las reservas de la Feria de Cali. Los KPIs ejecutivos se recalculan automáticamente:</p>
            <div class="scrollable-x">
                <table class="cfo-table">
                    <thead>
                        <tr>
                            <th>Servicio</th>
                            <th>Presupuesto</th>
                            <th>Estado de Emisión</th>
                            <th>Límite de Compra</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    decItems.forEach(item => {
        const itemKey = PAYMENT_TO_RESERVATION_KEY[item.id];
        const currentEmissionState = SYSTEM_STATE.reservations[itemKey] || "Pendiente";
        
        const isPaid = item.status === "paid";
        const statusClass = isPaid || currentEmissionState === "Emitido" 
            ? "green" 
            : (currentEmissionState === "En Proceso" ? "yellow" : "red");

        html += `
            <tr>
                <td><strong>${item.concept}</strong></td>
                <td>$${item.amount.toLocaleString()} USD</td>
                <td>
                    <select class="dec-emission-select cfo-select ${statusClass}" data-item="${itemKey}" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-glass);">
                        <option value="Pendiente" ${currentEmissionState === 'Pendiente' ? 'selected' : ''}>❌ Pendiente</option>
                        <option value="En Proceso" ${currentEmissionState === 'En Proceso' ? 'selected' : ''}>⏳ En Proceso</option>
                        <option value="Emitido" ${currentEmissionState === 'Emitido' ? 'selected' : ''}>✅ Emitido / Pagado</option>
                    </select>
                </td>
                <td><code>${formatDateShort(item.dueDate)}</code></td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return html;
}

// --- PESTAÑA 5: RIESGOS ---

function renderRisksTab() {
    const container = document.getElementById("risks-render-tab");
    if (!container) return;

    // First calculate score for each risk and sort descending
    const risksWithScore = SYSTEM_STATE.risks.map(r => {
        const prob = parseInt(r.probability) || 1;
        const imp = parseInt(r.impact) || 1;
        const score = prob * imp;
        
        // Find corresponding payment to see if resolved
        const correspondingPayment = SYSTEM_STATE.payments.find(p => p.concept.toLowerCase().includes(r.concept.toLowerCase()) || r.concept.toLowerCase().includes(p.concept.toLowerCase()));
        const isResolved = correspondingPayment && correspondingPayment.status === "paid";
        
        return {
            ...r,
            prob,
            imp,
            score,
            isResolved
        };
    });

    // Sort by score descending (active first, resolved last)
    risksWithScore.sort((a, b) => {
        if (a.isResolved !== b.isResolved) {
            return a.isResolved ? 1 : -1;
        }
        return b.score - a.score;
    });

    let html = `
        <div class="finance-card">
            <h3 style="margin-bottom: 15px;"><i class="fa-solid fa-triangle-exclamation" style="color: var(--danger);"></i> Matriz de Riesgos Cuantitativa (Risk Scoring)</h3>
            <p class="desc" style="margin-bottom: 20px;">Los riesgos se calculan como <strong>Score = Probabilidad (1-5) &times; Impacto (1-5)</strong>. Ordenados automáticamente por nivel de severidad.</p>
            <div class="scrollable-x">
                <table class="cfo-table">
                    <thead>
                        <tr>
                            <th>Riesgo</th>
                            <th>Viaje Asociado</th>
                            <th>Probabilidad</th>
                            <th>Impacto</th>
                            <th>Risk Score</th>
                            <th>Nivel</th>
                            <th>Mitigación Propuesta</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    risksWithScore.forEach(r => {
        const trip = SYSTEM_STATE.trips.find(t => t.id === r.tripId);
        const tripName = trip ? trip.name : "N/A";
        
        let scoreColor = "var(--success)";
        let levelText = "BAJO";
        if (r.score >= 15) {
            scoreColor = "var(--danger)";
            levelText = "CRÍTICO";
        } else if (r.score >= 8) {
            scoreColor = "var(--warning)";
            levelText = "MEDIO / ALTO";
        }
        
        if (r.isResolved) {
            scoreColor = "var(--text-secondary)";
            levelText = "MITIGADO";
        }

        const opacity = r.isResolved ? 0.5 : 1.0;
        const textDecoration = r.isResolved ? "line-through" : "none";

        html += `
            <tr style="opacity: ${opacity};">
                <td style="font-weight: bold; color: #fff; text-decoration: ${textDecoration};">${r.concept}</td>
                <td><span style="font-size: 0.8rem; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">${tripName}</span></td>
                <td style="text-align: center; font-weight: bold;">${r.prob} / 5</td>
                <td style="text-align: center; font-weight: bold;">${r.imp} / 5</td>
                <td style="text-align: center; font-weight: bold; font-size: 1.1rem; color: ${scoreColor};">${r.score}</td>
                <td>
                    <span class="status-cfo ${r.isResolved ? 'green' : (r.score >= 15 ? 'red' : (r.score >= 8 ? 'yellow' : 'blue'))}" style="font-size: 0.65rem; font-weight: bold;">
                        ${levelText}
                    </span>
                </td>
                <td style="font-size: 0.8rem; max-width: 250px; line-height: 1.3;">${r.mitigation}</td>
                <td style="font-size: 0.8rem; font-weight: bold;">${r.isResolved ? "✅ Mitigado" : "⚠️ Activo"}</td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

// --- PESTAÑA 6: AGENDA ---

function renderItinerariesTab() {
    const renderContainer = document.getElementById("itineraries-render");
    const daySelector = document.getElementById("day-selector-container");
    if (!renderContainer || !daySelector) return;

    const trip = SYSTEM_STATE.trips.find(t => t.id === SYSTEM_STATE.settings.selectedTripId);
    if (!trip) return;

    // Helper para íconos de clima
    const getWeatherIcon = (condStr) => {
        const cond = condStr.toLowerCase();
        if (cond.includes("lluvia") || cond.includes("lluvioso")) return "🌧️";
        if (cond.includes("frío") || cond.includes("seco")) return "❄️";
        if (cond.includes("cálido") || cond.includes("caluroso") || cond.includes("tropical")) return "☀️";
        if (cond.includes("otoño") || cond.includes("fresco")) return "⛅";
        return "☁️";
    };

    // Renderizar widget de clima activo
    const weatherWidget = document.getElementById("trip-weather-widget");
    if (weatherWidget) {
        const climate = CLIMATE_DATA[trip.id];
        if (climate) {
            weatherWidget.style.display = "block";
            weatherWidget.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 15px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 2rem; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.05); color: var(--primary);">
                            ${getWeatherIcon(climate.condition)}
                        </div>
                        <div>
                            <h3 style="font-size: 1.1rem; font-weight: 600; margin: 0; color: #fff;">${trip.destination}</h3>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 3px 0 0 0;">Pronóstico: <strong style="color: var(--primary);">${climate.condition}</strong></p>
                        </div>
                    </div>
                    <div style="text-align: right; min-width: 100px;">
                        <span class="val mono" style="font-size: 1.3rem; font-weight: 700; color: #fff; display: block; line-height: 1.1;">${climate.tempRange}</span>
                        <span style="font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Rango Promedio</span>
                    </div>
                </div>
                <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-glass); font-size: 0.8rem; line-height: 1.4; color: var(--text-muted);">
                    <p style="margin: 0 0 6px 0;"><i class="fa-solid fa-cloud-sun" style="color: var(--primary);"></i> ${climate.description}</p>
                    <p style="margin: 0; color: var(--text-secondary); font-style: italic;"><strong style="color: var(--primary); font-style: normal;"><i class="fa-solid fa-suitcase"></i> Tip de Empaque:</strong> ${climate.recommendations}</p>
                </div>
            `;
        } else {
            weatherWidget.style.display = "none";
        }
    }

    if (typeof window.CountdownEngine !== 'undefined') {
        window.CountdownEngine.clearAll();
    }

    let daySelectorHtml = "";
    for (let d = 1; d <= trip.days; d++) {
        const isActive = d === SYSTEM_STATE.settings.selectedDay ? "active" : "";
        daySelectorHtml += `<button class="day-btn ${isActive}" data-day="${d}">Día ${d}</button>`;
    }
    daySelector.innerHTML = daySelectorHtml;

    const dayBtns = daySelector.querySelectorAll(".day-btn");
    dayBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            SYSTEM_STATE.settings.selectedDay = parseInt(btn.dataset.day);
            saveState();
            renderAll();
        });
    });

    const key = `${SYSTEM_STATE.settings.selectedTripId}-${SYSTEM_STATE.settings.selectedDay}`;
    const bedtime = SYSTEM_STATE.sleep.bedtimes[key] || "23:00";
    const waketime = SYSTEM_STATE.sleep.wakeTimes[key] || "07:00";

    const nextDayActs = ACTIVITIES.filter(a => a.tripId === SYSTEM_STATE.settings.selectedTripId && a.day === (SYSTEM_STATE.settings.selectedDay + 1));
    const firstActNextDay = nextDayActs.length > 0 
        ? nextDayActs.filter(a => a.category !== "Descanso").sort((a, b) => (a.startTime || "00:00").localeCompare(b.startTime || "00:00"))[0] 
        : null;

    let sleepAlertHtml = "";
    if (firstActNextDay) {
        const conflict = isBeforeTime(firstActNextDay.startTime, waketime);
        if (conflict) {
            if (firstActNextDay.priority === "Critical" || firstActNextDay.priority === "Alta") {
                const suggestedBedtime = addHours(firstActNextDay.startTime, -8);
                sleepAlertHtml = `
                    <div class="alert-box critical" style="margin-top: 10px;">
                        <h4 style="color: #fca5a5; font-size: 0.8rem; margin-bottom: 4px;"><i class="fa-solid fa-triangle-exclamation"></i> Conflicto de Despertar Crítico:</h4>
                        <p style="font-size: 0.75rem;">Tu hora de despertar es a las <strong>${waketime} AM</strong>, pero mañana la actividad <strong>"${firstActNextDay.name}"</strong> inicia a las <strong>${firstActNextDay.startTime} AM</strong>.</p>
                        <p style="font-size: 0.75rem; margin-top: 5px; color: #fcd34d;">💡 Sugerencia: Acuéstate a las <strong>${suggestedBedtime}</strong> para dormir 8 horas completas.</p>
                    </div>
                `;
            } else {
                sleepAlertHtml = `
                    <div class="alert-box warning" style="margin-top: 10px;">
                        <h4 style="color: #fcd34d; font-size: 0.8rem; margin-bottom: 4px;"><i class="fa-solid fa-circle-exclamation"></i> Ajuste automático de descanso:</h4>
                        <p style="font-size: 0.75rem;">La actividad flexible de mañana <strong>"${firstActNextDay.name}"</strong> (${firstActNextDay.startTime} AM) choca con tu despertar (<strong>${waketime} AM</strong>) y ha sido pospuesta en la visualización.</p>
                    </div>
                `;
            }
        }
    }

    const dayActs = ACTIVITIES.filter(a => a.tripId === SYSTEM_STATE.settings.selectedTripId && a.day === SYSTEM_STATE.settings.selectedDay);
    
    // Europe trip dynamic placeholder fallback
    if (dayActs.length === 0 && SYSTEM_STATE.settings.selectedTripId === "VIAJE-2026-10-12-EUROPA") {
        dayActs.push({
            id: `act-eur-${SYSTEM_STATE.settings.selectedDay}-placeholder`,
            tripId: "VIAJE-2026-10-12-EUROPA",
            day: SYSTEM_STATE.settings.selectedDay,
            name: "🌍 Turismo y Recorrido libre (París / Roma / Florencia)",
            startTime: "09:00",
            endTime: "18:00",
            priority: "Media",
            location: "Europa",
            category: "Tours",
            owner: "jose",
            status: "Confirmado"
        });
    }
    
    dayActs.sort((a, b) => (a.startTime || "00:00").localeCompare(b.startTime || "00:00"));

    // Calendar conflict checking
    const conflicts = [];
    const gaps = [];
    let activeDurationMin = 0;

    for (let i = 0; i < dayActs.length; i++) {
        const act = dayActs[i];
        if (act.category === "Descanso") continue;

        const startTimeStr = act.startTime || "00:00";
        const endTimeStr = act.endTime || "23:59";
        const [sh, sm] = startTimeStr.split(":").map(Number);
        const [eh, em] = endTimeStr.split(":").map(Number);
        const durationMin = (eh * 60 + em) - (sh * 60 + sm);
        activeDurationMin += durationMin;

        if (i > 0) {
            const prev = dayActs[i-1];
            if (prev.category !== "Descanso" && isBeforeTime(act.startTime, prev.endTime)) {
                conflicts.push(`Solapamiento entre "${prev.name}" (${prev.startTime}-${prev.endTime}) y "${act.name}" (${act.startTime}-${act.endTime}).`);
            }

            const prevEndTimeStr = prev.endTime || "23:59";
            const [ph, pm] = prevEndTimeStr.split(":").map(Number);
            const gapMin = (sh * 60 + sm) - (ph * 60 + pm);
            if (gapMin > 120 && prev.category !== "Descanso") {
                const gapH = Math.floor(gapMin / 60);
                const gapM = gapMin % 60;
                gaps.push(`Tiempo muerto de <strong>${gapH}h ${gapM}m</strong> entre "${prev.name}" y "${act.name}".`);
            }
        }
    }

    const overloadHtml = activeDurationMin > 480 
        ? `<div class="alert-item p2" style="font-size: 0.75rem; background: rgba(245,158,11,0.05); padding: 5px; border-radius: 4px;"><span class="badge-priority">P2</span> <strong>Sobrecarga:</strong> ${Math.round(activeDurationMin/60)} horas de actividad neta hoy.</div>` 
        : "";

    let diagnosisHtml = "";
    if (conflicts.length > 0 || gaps.length > 0 || overloadHtml) {
        diagnosisHtml = `
            <div class="cfo-card" style="margin-top: 20px; border-left: 4px solid var(--primary);">
                <div class="cfo-card-header" style="padding: 10px 0;">
                    <i class="fa-solid fa-brain" style="color: var(--primary);"></i>
                    <h3 style="font-size: 0.9rem;">Diagnóstico de Agenda Inteligente</h3>
                </div>
                <div class="cfo-card-body" style="font-size: 0.75rem; display: flex; flex-direction: column; gap: 8px;">
                    ${conflicts.map(c => `<div class="alert-item p0" style="background: rgba(239,68,68,0.05); padding: 5px; border-radius: 4px;"><span class="badge-priority">P0</span> ${c}</div>`).join("")}
                    ${gaps.map(g => `<div class="alert-item p3" style="background: rgba(99,102,241,0.05); padding: 5px; border-radius: 4px;"><span class="badge-priority">P3</span> ${g}</div>`).join("")}
                    ${overloadHtml}
                </div>
            </div>
        `;
    }

    let itineraryHtml = "";
    if (dayActs.length === 0) {
        itineraryHtml = "<p class='desc'>Sin actividades agendadas hoy.</p>";
    } else {
        itineraryHtml += `<ul class="timeline">`;
        dayActs.forEach(act => {
            let priorityClass = (act.priority || "baja").toLowerCase();
            let isReprog = false;
            
            if (SYSTEM_STATE.settings.selectedDay > 1) {
                const prevKey = `${SYSTEM_STATE.settings.selectedTripId}-${SYSTEM_STATE.settings.selectedDay - 1}`;
                const prevBedtime = SYSTEM_STATE.sleep.bedtimes[prevKey] || "23:00";
                const prevWakeTime = addHours(prevBedtime, 8);
                if (isBeforeTime(act.startTime, prevWakeTime) && (act.priority === "Baja" || act.priority === "Media")) {
                    isReprog = true;
                }
            }

            let budgetBadge = "";
            if (SYSTEM_STATE.settings.selectedTripId === "VIAJE-2026-12-22-CALI") {
                const dayBudget = BOG_DIC_DIARY_BUDGET[SYSTEM_STATE.settings.selectedDay];
                if (dayBudget && (act.category === "Vuelos" || act.category === "Alojamiento" || act.category === "Tours")) {
                    budgetBadge = `
                        <div class="budget-badge" style="margin-top: 8px; font-size: 0.75rem; display: flex; gap: 8px; flex-wrap: wrap;">
                            <span class="status-cfo green">Logística: $${dayBudget.logistics} USD</span>
                            <span class="status-cfo yellow">Ocio: $${dayBudget.entertainment} USD</span>
                        </div>
                    `;
                }
            }

            let gateSearchHtml = "";
            if (act.category === "Vuelos" || (act.name && act.name.toLowerCase().includes("vuelo"))) {
                let searchStr = "estado de vuelo";
                const match = act.name.match(/\((.*?)(?:\s-|\))/);
                if (match && match[1]) {
                    searchStr = `estado de vuelo ${match[1].trim()}`;
                } else {
                    searchStr = `estado de ${act.name.replace(/[^\w\s]/gi, '')}`;
                }
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchStr)}`;
                gateSearchHtml = `
                    <div style="margin-top: 8px;">
                        <a href="${searchUrl}" target="_blank" class="btn btn-sm" style="background: rgba(99,102,241,0.15); color: #fff; border: 1px solid var(--primary); font-size: 0.7rem; padding: 4px 8px; border-radius: 4px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; font-weight: bold; transition: all 0.2s ease;">
                            <i class="fa-solid fa-plane-departure"></i> Buscar Sala / Estado
                        </a>
                    </div>
                `;
            }

            let countdownHtml = "";
            let isoTarget = null;
            if ((priorityClass === 'critical' || priorityClass === 'alta') && act.status !== "Completado") {
                try {
                    const start = new Date(trip.startDate + "T00:00:00Z");
                    start.setUTCDate(start.getUTCDate() + (act.day - 1));
                    const [h, m] = act.startTime.split(':');
                    start.setUTCHours(parseInt(h) + 5, parseInt(m), 0);
                    isoTarget = start.toISOString();
                    
                    if (start.getTime() > Date.now()) {
                        countdownHtml = `
                            <div class="cfo-countdown-widget" style="margin-top: 10px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; font-size: 0.85rem; font-family: monospace; display: flex; align-items: center; gap: 10px;">
                                <i class="fa-solid fa-stopwatch"></i>
                                <span id="countdown-${act.id}" class="status-calma">Calculando...</span>
                            </div>
                        `;
                    }
                } catch(e) {}
            }

            itineraryHtml += `
                <li style="opacity: ${isReprog ? '0.5' : '1'};">
                    <span class="time-badge ${priorityClass}">${act.startTime} - ${act.endTime}</span>
                    <span class="status-cfo ${priorityClass === 'critical' || priorityClass === 'alta' ? 'red' : 'yellow'}" style="float: right; font-size: 0.65rem;">
                        ${isReprog ? 'REPROGRAMADO' : (act.status === 'Completado' ? 'COMPLETADO' : act.priority.toUpperCase())}
                    </span>
                    <div class="timeline-content">
                        <div class="content-header">
                            <h4 style="${isReprog || act.status === 'Completado' ? 'text-decoration: line-through;' : ''}">${act.name}</h4>
                        </div>
                        <p style="margin-top: 5px; font-size: 0.8rem; color: var(--text-secondary);"><i class="fa-solid fa-location-dot"></i> ${act.location}</p>
                        ${budgetBadge}
                        ${gateSearchHtml}
                        ${countdownHtml}
                    </div>
                </li>
            `;
            
            if (isoTarget && countdownHtml && typeof window.CountdownEngine !== 'undefined') {
                // Registrar después de que el DOM se haya pintado
                requestAnimationFrame(() => {
                    window.CountdownEngine.register(`countdown-${act.id}`, isoTarget, act.id);
                });
            }
        });
        itineraryHtml += `</ul>`;
    }

    const fatigue = SYSTEM_STATE.sleep.projectedFatigue || 0;
    const debt = SYSTEM_STATE.sleep.accumulatedDeficit || 0;
    let fatigueColor = "var(--success)";
    let fatigueDesc = "Óptima (Déficit controlado)";
    if (fatigue > 80) {
        fatigueColor = "var(--danger)";
        fatigueDesc = "Crítica (Riesgo alto de agotamiento)";
    } else if (fatigue > 50) {
        fatigueColor = "var(--warning)";
        fatigueDesc = "Media (Fatiga moderada)";
    } else if (fatigue > 20) {
        fatigueColor = "var(--info)";
        fatigueDesc = "Baja (Cansancio leve)";
    }

    const fatigueHtml = `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; padding: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 15px; flex-wrap: wrap;">
            <div>
                <span style="font-size: 0.75rem; color: var(--text-secondary); display: block;">Estado de Fatiga & Adaptabilidad (Día ${SYSTEM_STATE.settings.selectedDay}):</span>
                <strong style="font-size: 0.95rem; color: #fff;">${fatigueDesc}</strong>
            </div>
            <div style="display: flex; gap: 20px;">
                <div style="text-align: right;">
                    <span style="font-size: 0.7rem; color: var(--text-secondary); display: block;">Fatiga:</span>
                    <strong style="color: ${fatigueColor}; font-size: 1.1rem;">${fatigue}%</strong>
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 0.7rem; color: var(--text-secondary); display: block;">Deuda de Sueño:</span>
                    <strong style="color: ${debt > 0 ? 'var(--danger)' : 'var(--success)'}; font-size: 1.1rem;">${debt.toFixed(1)}h</strong>
                </div>
            </div>
        </div>
    `;

    renderContainer.innerHTML = fatigueHtml + itineraryHtml + diagnosisHtml + sleepAlertHtml;
}

// --- PESTAÑA 7: DESCANSO ---

function renderSleepTab() {
    const trip = SYSTEM_STATE.trips.find(t => t.id === SYSTEM_STATE.settings.selectedTripId);
    if (!trip) return;
    
    const key = `${trip.id}-${SYSTEM_STATE.settings.selectedDay}`;
    const bedtime = SYSTEM_STATE.sleep.bedtimes[key] || "23:00";
    const waketime = SYSTEM_STATE.sleep.wakeTimes[key] || "07:00";
    
    // Update inputs values
    const bedtimeInput = document.getElementById("sleep-bedtime-input");
    const waketimeInput = document.getElementById("sleep-waketime-input");
    if (bedtimeInput) bedtimeInput.value = bedtime;
    if (waketimeInput) waketimeInput.value = waketime;
    
    const sleepOutput = document.getElementById("sleep-engine-output");
    if (!sleepOutput) return;
    
    const duration = getSleepDuration(bedtime, waketime);
    const deficit = Math.max(0, 8.0 - duration);
    
    let fatigueColor = "var(--success)";
    if (SYSTEM_STATE.sleep.projectedFatigue > 80) fatigueColor = "var(--danger)";
    else if (SYSTEM_STATE.sleep.projectedFatigue > 50) fatigueColor = "var(--warning)";
    else if (SYSTEM_STATE.sleep.projectedFatigue > 20) fatigueColor = "var(--info)";
    
    let sleepAlertHtml = "";
    const nextDay = SYSTEM_STATE.settings.selectedDay + 1;
    const nextDayActs = ACTIVITIES.filter(a => a.tripId === trip.id && a.day === nextDay);
    const firstActNextDay = nextDayActs.filter(a => a.category !== "Descanso").sort((a, b) => a.startTime.localeCompare(b.startTime))[0];
    
    if (firstActNextDay) {
        const conflict = isBeforeTime(firstActNextDay.startTime, waketime);
        if (conflict) {
            if (firstActNextDay.priority === "Critical" || firstActNextDay.priority === "Alta") {
                const suggestedBedtime = addHours(firstActNextDay.startTime, -8);
                sleepAlertHtml = `
                    <div class="alert-box critical" style="margin-top: 15px;">
                        <h4 style="color: #fca5a5; font-size: 0.85rem; margin-bottom: 5px;"><i class="fa-solid fa-triangle-exclamation"></i> Conflicto Crítico de Horario de Despertar:</h4>
                        <p style="font-size: 0.75rem;">Tu hora de despertar es a las <strong>${waketime} AM</strong>, pero la actividad crítica de mañana <strong>"${firstActNextDay.name}"</strong> inicia a las <strong>${firstActNextDay.startTime} AM</strong>.</p>
                        <p style="font-size: 0.75rem; margin-top: 6px; color: #fcd34d;">💡 Sugerencia: Para cumplir con las 8 horas mínimas de descanso, debes acostarte a más tardar a las <strong>${suggestedBedtime}</strong> de la noche.</p>
                    </div>
                `;
            } else {
                sleepAlertHtml = `
                    <div class="alert-box warning" style="margin-top: 15px;">
                        <h4 style="color: #fcd34d; font-size: 0.85rem; margin-bottom: 5px;"><i class="fa-solid fa-circle-exclamation"></i> Ajuste automático por descanso:</h4>
                        <p style="font-size: 0.75rem;">La actividad flexible <strong>"${firstActNextDay.name}"</strong> (${firstActNextDay.startTime} AM) choca con tu despertar (<strong>${waketime} AM</strong>) y ha sido <strong>reprogramada automáticamente</strong>.</p>
                    </div>
                `;
            }
        }
    }
    
    const avgSleep = SYSTEM_STATE.sleep.averageSleep || 0;
    
    sleepOutput.innerHTML = `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; padding: 15px; display: grid; grid-template-columns: repeat(auto-fit, minmax(135px, 1fr)); gap: 15px; margin-top: 15px;">
            <div>
                <small style="font-size: 0.75rem; color: var(--text-secondary);">Sueño esta noche:</small>
                <div style="font-size: 1.25rem; font-weight: bold; color: #fff; margin-top: 5px;">${duration.toFixed(1)} hrs</div>
            </div>
            <div>
                <small style="font-size: 0.75rem; color: var(--text-secondary);">Déficit esta noche:</small>
                <div style="font-size: 1.25rem; font-weight: bold; color: ${deficit > 0 ? 'var(--danger)' : 'var(--success)'}; margin-top: 5px;">${deficit.toFixed(1)} hrs</div>
            </div>
            <div>
                <small style="font-size: 0.75rem; color: var(--text-secondary);">Promedio Viaje:</small>
                <div style="font-size: 1.25rem; font-weight: bold; color: ${avgSleep < 8 ? 'var(--warning)' : 'var(--success)'}; margin-top: 5px;">${avgSleep.toFixed(1)} hrs</div>
            </div>
            <div>
                <small style="font-size: 0.75rem; color: var(--text-secondary);">Deuda de Sueño:</small>
                <div style="font-size: 1.25rem; font-weight: bold; color: ${SYSTEM_STATE.sleep.accumulatedDeficit > 0 ? 'var(--danger)' : 'var(--success)'}; margin-top: 5px;">${SYSTEM_STATE.sleep.accumulatedDeficit.toFixed(1)} hrs</div>
            </div>
            <div>
                <small style="font-size: 0.75rem; color: var(--text-secondary);">Fatiga Proyectada:</small>
                <div style="font-size: 1.25rem; font-weight: bold; color: ${fatigueColor}; margin-top: 5px;">${SYSTEM_STATE.sleep.projectedFatigue}% (${getFatigueLabel(SYSTEM_STATE.sleep.projectedFatigue)})</div>
            </div>
        </div>
        ${sleepAlertHtml}
    `;
}

// --- PESTAÑA 8: EQUIPAJE ---

function generatePackingList(tripId, luggageType) {
    const baseDocs = [
        { id: "pack-dni", text: "Pasaporte / DNI Vigente", checked: false },
        { id: "pack-cards", text: "Tarjetas de Crédito / Débito (Signature)", checked: false },
        { id: "pack-seguro", text: "Póliza de Seguro de Asistencia Médica Internacional", checked: false },
        { id: "pack-itinerario", text: "Impresión de Vuelos y Reservas (Airbnb/Hotel)", checked: false }
    ];

    const baseElec = [
        { id: "pack-phone", text: "Smartphone y Cargador Rápido", checked: false },
        { id: "pack-powerbank", text: "Powerbank (10,000mAh+)", checked: false },
        { id: "pack-laptop", text: "Laptop y Cargador", checked: false },
        { id: "pack-headphones", text: "Audífonos con Cancelación de Ruido", checked: false }
    ];

    const baseToiletries = [
        { id: "pack-toothbrush", text: "Cepillo y Pasta Dental", checked: false },
        { id: "pack-deodorant", text: "Desodorante", checked: false },
        { id: "pack-skincare", text: "Crema hidratante y Protector Solar", checked: false }
    ];

    let clothes = [];
    
    // Ropa y artículos según Destino (Contextura: 2.00m, 110kg)
    if (tripId === "VIAJE-2026-08-07-CUSCO") {
        clothes = [
            { id: "pack-ropa-cuz1", text: "Casaca gruesa abrigadora / Puffer (Talla XXL)", checked: false },
            { id: "pack-ropa-cuz2", text: "Chompas / Polares abrigadores x2", checked: false },
            { id: "pack-ropa-cuz3", text: "Polos de algodón manga larga x3", checked: false },
            { id: "pack-ropa-cuz4", text: "Pantalones gruesos (jeans/trekking) x3", checked: false },
            { id: "pack-ropa-cuz5", text: "Zapatillas de trekking cómodas (Machu Picchu)", checked: false },
            { id: "pack-ropa-cuz6", text: "Chullo/Gorro de lana y guantes para la noche", checked: false },
            { id: "pack-ropa-cuz7", text: "Pastillas Sorojchi Pills (Altitud) y bloqueador", checked: false }
        ];
    } else if (tripId === "VIAJE-2026-07-02-CALI" || tripId === "VIAJE-2026-12-22-CALI") {
        const isDec = tripId.includes("12-22");
        clothes = [
            { id: "pack-ropa-cal1", text: isDec ? "Guayaberas formales o camisas de lino x3 (Feria)" : "Camisas de lino o algodón fresco x3", checked: false },
            { id: "pack-ropa-cal2", text: "Bermudas / Shorts cómodos x3", checked: false },
            { id: "pack-ropa-cal3", text: "Polos ligeros de algodón transpirable x5", checked: false },
            { id: "pack-ropa-cal4", text: "Zapatos frescos (mocasines/zapatillas ligeras)", checked: false },
            { id: "pack-ropa-cal5", text: "Sandalias y ropa de baño", checked: false },
            { id: "pack-ropa-cal6", text: "Sombrero / Gorra de sol y lentes oscuros", checked: false },
            { id: "pack-ropa-cal7", text: "Repelente de mosquitos (OFF!) e hidratantes", checked: false }
        ];
    } else if (tripId === "VIAJE-2026-07-21-MEXICO") {
        clothes = [
            { id: "pack-ropa-mex1", text: "Chaqueta impermeable ligera (tormentas de tarde)", checked: false },
            { id: "pack-ropa-mex2", text: "Camisas casual-elegantes para trabajo x5", checked: false },
            { id: "pack-ropa-mex3", text: "Pantalones chinos / Jeans cómodos x4", checked: false },
            { id: "pack-ropa-mex4", text: "Zapatos formales de cuero cómodos para caminar", checked: false },
            { id: "pack-ropa-mex5", text: "Polos básicos x4 y blazer ligero", checked: false },
            { id: "pack-ropa-mex6", text: "Paraguas portátil resistente al viento", checked: false }
        ];
    } else if (tripId === "VIAJE-2026-09-11-BOGOTA") {
        clothes = [
            { id: "pack-ropa-bog1", text: "Chaqueta impermeable gruesa (cortavientos para lluvia)", checked: false },
            { id: "pack-ropa-bog2", text: "Sweaters / Hoodies cómodos x2", checked: false },
            { id: "pack-ropa-bog3", text: "Jeans gruesos resistentes x3", checked: false },
            { id: "pack-ropa-bog4", text: "Zapatillas muy cómodas (Caminatas en Festival Cordillera)", checked: false },
            { id: "pack-ropa-bog5", text: "Polos oscuros x4 y medias térmicas", checked: false },
            { id: "pack-ropa-bog6", text: "Paraguas plegable e impermeable extra", checked: false }
        ];
    } else if (tripId === "VIAJE-2026-09-21-MADRID") {
        clothes = [
            { id: "pack-ropa-mad1", text: "Blazer o saco semi-formal de negocios (Talla XXL)", checked: false },
            { id: "pack-ropa-mad2", text: "Camisas de cuello formal/casual x5", checked: false },
            { id: "pack-ropa-mad3", text: "Pantalones chinos o de vestir formales x4", checked: false },
            { id: "pack-ropa-mad4", text: "Zapatos de cuero cómodos y correa combinando", checked: false },
            { id: "pack-ropa-mad5", text: "Abrigo ligero para las noches frescas", checked: false },
            { id: "pack-ropa-mad6", text: "Adaptador de enchufe europeo (Tipo C/E/F)", checked: false }
        ];
    } else if (tripId === "VIAJE-2026-10-12-EUROPA") {
        clothes = [
            { id: "pack-ropa-eur1", text: "Abrigo grueso cortavientos / Puffer largo (Talla XXL)", checked: false },
            { id: "pack-ropa-eur2", text: "Polos / Camisetas térmicas interiores x3 (Indispensable)", checked: false },
            { id: "pack-ropa-eur3", text: "Sweaters de lana o polares gruesos x3", checked: false },
            { id: "pack-ropa-eur4", text: "Jeans o pantalones de tela pesada x4", checked: false },
            { id: "pack-ropa-eur5", text: "Zapatillas urbanas de cuero con soporte (caminatas largas)", checked: false },
            { id: "pack-ropa-eur6", text: "Bufanda gruesa, guantes y gorro otoñal", checked: false },
            { id: "pack-ropa-eur7", text: "Adaptadores europeos y paraguas reforzado", checked: false }
        ];
    } else {
        clothes = [
            { id: "pack-ropa-gen1", text: "Pantalones casuales x3", checked: false },
            { id: "pack-ropa-gen2", text: "Camisas o Polos x4", checked: false },
            { id: "pack-ropa-gen3", text: "Zapatos / Zapatillas cómodas", checked: false },
            { id: "pack-ropa-gen4", text: "Abrigo medio / Cortavientos", checked: false }
        ];
    }

    // Reglas según Maleta
    if (luggageType === "carryon") {
        baseToiletries.push({ id: "pack-liquids-rule", text: "Líquidos en envases < 100ml (Bolsa Ziploc transparente)", checked: false });
        clothes.push({ id: "pack-layering-rule", text: "Llevar la chaqueta más voluminosa puesta en el vuelo", checked: false });
    } else if (luggageType === "bodega") {
        baseToiletries.push({ id: "pack-liquids-rule", text: "Perfume grande y artículos de aseo full-size", checked: false });
        clothes.push({ id: "pack-extra-shoes", text: "Par de zapatos extra (opcional)", checked: false });
    } else if (luggageType === "mochila") {
        baseToiletries.push({ id: "pack-liquids-rule", text: "Neceser minimalista (Solo esenciales < 100ml)", checked: false });
        clothes = clothes.filter((c, index) => index < 3); // Reducir cantidad de ropa
        clothes.push({ id: "pack-backpack-rule", text: "Enrollar ropa tipo militar para maximizar espacio", checked: false });
    }

    return [
        { category: "Documentos y Dinero", items: baseDocs },
        { category: "Ropa y Calzado (Adaptado)", items: clothes },
        { category: "Electrónicos", items: baseElec },
        { category: "Aseo Personal", items: baseToiletries }
    ];
}

function updatePackingList() {
    const tripId = document.getElementById("packing-trip-select")?.value || SYSTEM_STATE.settings.selectedTripId;
    const luggageType = document.getElementById("packing-luggage-select")?.value || "carryon";
    
    SYSTEM_STATE.packingList = generatePackingList(tripId, luggageType);
    saveState();
    renderPackingTab();
}

function renderPackingTab() {
    const container = document.getElementById("packing-list-render");
    const climateInfo = document.getElementById("packing-climate-info");
    if (!container) return;

    const tripId = document.getElementById("packing-trip-select")?.value || SYSTEM_STATE.settings.selectedTripId;
    const selectEl = document.getElementById("packing-trip-select");
    if (selectEl && selectEl.value !== tripId) {
        selectEl.value = tripId;
    }

    if (climateInfo) {
        const climate = CLIMATE_DATA[tripId];
        if (climate) {
            const selectEl = document.getElementById("packing-trip-select");
            const tripName = selectEl?.selectedOptions[0]?.text || "Destino";
            climateInfo.style.display = "block";
            climateInfo.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="font-size: 1.5rem; margin-top: 2px; color: var(--primary);">⛅</div>
                    <div>
                        <h4 style="margin: 0; font-size: 0.9rem; color: #fff;">Condiciones de ${tripName}: <strong style="color: var(--primary);">${climate.tempRange} (${climate.condition})</strong></h4>
                        <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: var(--text-secondary);">${climate.description}</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.75rem; color: var(--text-muted);"><strong style="color: var(--primary);">Recomendación:</strong> ${climate.recommendations}</p>
                    </div>
                </div>
            `;
        } else {
            climateInfo.style.display = "none";
        }
    }

    let html = "";
    
    SYSTEM_STATE.packingList.forEach(group => {
        html += `
            <div class="checklist-day-group" style="margin-bottom: 20px;">
                <h3 style="font-size: 1rem; color: var(--primary); border-bottom: 1px solid var(--border-glass); padding-bottom: 8px; margin-bottom: 12px;">${group.category}</h3>
        `;

        group.items.forEach(item => {
            const isChecked = !!item.checked;
            
            html += `
                <div class="checklist-item ${isChecked ? 'checked' : ''}" data-id="${item.id}" style="cursor: pointer; display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 8px; margin-bottom: 6px; background: rgba(255,255,255,0.01); border: 1px solid var(--border-glass);">
                    <div class="checkbox-container" style="width: 20px; height: 20px; border: 1px solid var(--primary); border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-check" style="font-size: 0.75rem; color: #fff; display: ${isChecked ? 'block' : 'none'};"></i>
                    </div>
                    <div class="item-info">
                        <h4 style="font-size: 0.85rem; font-weight: 500; ${isChecked ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${item.text}</h4>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
    });

    container.innerHTML = html;

    const items = container.querySelectorAll(".checklist-item");
    items.forEach(item => {
        item.addEventListener("click", () => {
            const id = item.dataset.id;
            
            // Toggle in state
            SYSTEM_STATE.packingList.forEach(g => {
                const found = g.items.find(i => i.id === id);
                if (found) {
                    found.checked = !found.checked;
                    logAction(`Equipaje ${found.text} marcado como ${found.checked ? 'EMPACADO' : 'PENDIENTE'}`, "INFO");
                }
            });
            renderAll();
        });
    });
}

// --- PESTAÑA 9: CONFIGURACIÓN & AUDITORÍA ---

function renderConfigTab() {
    const loanReq = document.getElementById("config-loan-requested");
    if (loanReq) {
        loanReq.checked = !!SYSTEM_STATE.settings.loanRequested;
    }
    const container = document.getElementById("audit-log-render");
    if (!container) return;
    
    if (!SYSTEM_STATE.auditLog || SYSTEM_STATE.auditLog.length === 0) {
        container.innerHTML = "<p style='font-size: 0.75rem; color: var(--text-secondary); text-align: center; padding: 10px 0;'>No hay registros de auditoría.</p>";
        return;
    }
    
    let html = "<ul style='list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 8px;'>";
    const logs = [...SYSTEM_STATE.auditLog].reverse();
    logs.forEach(log => {
        let statusBadge = "info";
        if (log.status === "SUCCESS") statusBadge = "green";
        if (log.status === "WARNING") statusBadge = "yellow";
        if (log.status === "ERROR") statusBadge = "red";
        
        html += `
            <li style="font-size: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 6px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                <div>
                    <span style="color: var(--text-secondary); font-family: monospace;">[${log.timestamp}]</span>
                    <span style="color: #f8fafc; margin-left: 5px;">${log.action}</span>
                </div>
                <span class="status-cfo ${statusBadge}" style="font-size: 0.6rem; padding: 2px 5px;">${log.status}</span>
            </li>
        `;
    });
    html += "</ul>";
    container.innerHTML = html;
}

// ==========================================
// DATE AND HELPERS
// ==========================================

function getDaysToDate(dateStr) {
    const due = new Date(dateStr);
    const today = new Date(); // Dynamic system date context
    due.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function formatDateShort(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        const monthIndex = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        return `${day} ${months[monthIndex]}`;
    }
    
    return `${date.getDate()} ${months[date.getMonth()]}`;
}

// ==========================================
// MOTOR DE URGENCIA (NUEVO)
// ==========================================
function calculateUrgency() {
    const bannerContainer = document.getElementById("urgency-banner-container");
    if (!bannerContainer) return;
    
    const missing = ACTIVITIES.filter(a => a.status === "Falta Emitir");
    if (missing.length > 0) {
        bannerContainer.innerHTML = `
            <div class="urgency-banner critical">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                    <strong>ALERTA OPERATIVA:</strong> Tienes ${missing.length} reserva(s) sin emitir. 
                    <a href="#" onclick="document.querySelector('.cfo-qna-card').scrollIntoView({behavior: 'smooth', block: 'start'})" style="color: inherit; text-decoration: underline;">Revisar</a>
                </div>
            </div>
        `;
        bannerContainer.style.display = "block";
        return;
    }
    
    bannerContainer.innerHTML = "";
    bannerContainer.style.display = "none";
}
