const fs = require('fs');
const appCode = fs.readFileSync('app.js', 'utf8');

const dummyEl = {
  textContent: '',
  innerHTML: '',
  appendChild: () => {},
  addEventListener: () => {},
  classList: { add: ()=>{}, remove: ()=>{} },
  style: {},
  className: '',
  value: ''
};

let initFn = null;

global.window = {
  addEventListener: () => {}
};
global.document = {
  getElementById: (id) => dummyEl,
  createElement: () => dummyEl,
  querySelectorAll: () => [],
  querySelector: () => dummyEl,
  addEventListener: (event, cb) => {
    if (event === "DOMContentLoaded") {
      initFn = cb;
    }
  }
};

global.requestAnimationFrame = (cb) => {
  try {
    cb();
  } catch (e) {
    console.error("RAF ERROR:", e);
  }
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};

try {
  eval(appCode);
  if (initFn) initFn();
} catch (e) {
  console.error("GLOBAL ERROR:", e);
}
