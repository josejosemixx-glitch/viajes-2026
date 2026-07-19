const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Setup mock DOM
const dom = new JSDOM(`<!DOCTYPE html><div id="itineraries-render"></div><div id="day-selector-container"></div>`);
global.document = dom.window.document;
global.window = dom.window;

// Load app.js code
let code = fs.readFileSync('app.js', 'utf8');

// We need to bypass the requestAnimationFrame in app.js if any, but we just want to run renderItinerariesTab
// Let's modify the code slightly to make it executable
code = code.replace(/requestAnimationFrame/g, '(fn) => fn()');

// Mock CountdownEngine
global.window.CountdownEngine = { clearAll: () => {}, register: () => {}, addTimer: () => {} };

try {
    eval(code);
    SYSTEM_STATE.settings.selectedTripId = "VIAJE-2026-08-07-CUSCO";
    SYSTEM_STATE.settings.selectedDay = 1;
    renderItinerariesTab();
    console.log("SUCCESS. InnerHTML length:", document.getElementById("itineraries-render").innerHTML.length);
} catch (e) {
    console.error("ERROR:", e);
}
