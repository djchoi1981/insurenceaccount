const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('/Users/djchoi81/.gemini/antigravity/brain/b2174ac1-882b-4a7b-a4e2-bb3f6eb9faf4/scratch/index_dump.html', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

// Mock necessary functions
window.alert = console.log;
window.prompt = () => null;

window.pdfScale = 1.2;
window.isDragging = false;
window.draggedEl = null;

// Fake DOM element for testing
const wrapper = document.createElement('div');
wrapper.id = 'pdf-wrapper';
wrapper.className = 'pdf-page-wrapper';
wrapper.getBoundingClientRect = () => ({ left: 100, top: 100, width: 800, height: 1000 });
document.body.appendChild(wrapper);

const el = document.createElement('div');
el.className = 'draggable-field';
el.dataset.id = 'field_1';
el.style.left = '50px';
el.style.top = '50px';
el.getBoundingClientRect = () => ({ left: 150, top: 150, width: 100, height: 50 });
wrapper.appendChild(el);

// Inject variables directly to window to bypass scoping issues if any
window.dragStartPositions = [];
window.selectedFieldIds = ['field_1'];
window.editingFields = [{ id: 'field_1', x: 50, y: 50 }];

console.log('--- TEST START ---');

// Mousedown logic from renderDraggables
const mousedownEvent = new window.MouseEvent('mousedown', { clientX: 160, clientY: 160, bubbles: true });
el.addEventListener('mousedown', (e) => {
  e.preventDefault();
  window.draggedEl = el;
  window.isDragging = true;
  const parentRect = document.getElementById('pdf-wrapper').getBoundingClientRect();
  const currentRenderScale = window.pdfScale / 1.2;
  window.offset = {
    x: e.clientX - parentRect.left,
    y: e.clientY - parentRect.top
  };
  window.dragStartPositions = [{ id: 'field_1', x: 50, y: 50 }];
  console.log('Mousedown executed. offset:', window.offset);
});
el.dispatchEvent(mousedownEvent);

console.log('After mousedown. isDragging:', window.isDragging);

// Trigger mousemove on document
const mousemoveEvent = new window.MouseEvent('mousemove', { clientX: 200, clientY: 200, bubbles: true });
document.dispatchEvent(mousemoveEvent);

console.log('After mousemove. el.style.left:', el.style.left);

const mouseupEvent = new window.MouseEvent('mouseup', { clientX: 200, clientY: 200, bubbles: true });
document.dispatchEvent(mouseupEvent);

console.log('After mouseup. editingFields[0].x:', window.editingFields[0].x);

