const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

// Mock necessary functions
window.alert = console.log;
window.prompt = () => null;
window.HTMLElement.prototype.getBoundingClientRect = function() {
    return { left: 100, top: 100, width: 800, height: 1000 };
};

// Fake DOM element for testing
const wrapper = document.createElement('div');
wrapper.id = 'pdf-wrapper';
wrapper.className = 'pdf-page-wrapper';
document.body.appendChild(wrapper);

const el = document.createElement('div');
el.className = 'draggable-field';
el.dataset.id = 'f_123';
el.style.left = '100px';
el.style.top = '100px';
wrapper.appendChild(el);

window.pdfScale = 1.2;
window.isDragging = false;
window.draggedEl = null;
window.dragStartPositions = [];
window.offset = { x: 0, y: 0 };
window.editingFields = [{ id: 'f_123', x: 100, y: 100 }];

console.log('--- TEST START ---');

window.draggedEl = el;
window.isDragging = true;
window.dragStartPositions = [{ id: 'f_123', x: 100, y: 100 }];
window.offset = { x: 50, y: 50 };

const mousemoveEvent = new window.MouseEvent('mousemove', { clientX: 200, clientY: 200, bubbles: true });
document.dispatchEvent(mousemoveEvent);

console.log('After mousemove:');
console.log('el.style.left =', el.style.left);
console.log('el.style.top =', el.style.top);

