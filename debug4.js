const fs = require('fs');
const appCode = fs.readFileSync('app.js', 'utf8');

function createDummy() {
  const dummyEl = {
    textContent: '', innerHTML: '', className: '', value: '',
    appendChild: () => {},
    addEventListener: () => {},
    classList: { add: ()=>{}, remove: ()=>{} },
    style: {},
    querySelectorAll: () => [],
    querySelector: () => dummyEl,
    setAttribute: () => {},
    dataset: {}
  };
  return dummyEl;
}

const dummyEl = createDummy();
dummyEl.querySelectorAll = () => [createDummy(), createDummy()];

let initFn = null;
global.window = { addEventListener: () => {} };
global.document = {
  getElementById: (id) => dummyEl,
  createElement: () => dummyEl,
  querySelectorAll: () => [dummyEl],
  querySelector: () => dummyEl,
  addEventListener: (event, cb) => { if (event === "DOMContentLoaded") initFn = cb; }
};
global.requestAnimationFrame = (cb) => {
  try { cb(); } catch (e) { console.error("RAF ERROR:", e); }
};
global.localStorage = { getItem: () => null, setItem: () => {} };

try {
  eval(appCode);
  if (initFn) initFn();
} catch (e) {
  console.error("GLOBAL ERROR:", e);
}
