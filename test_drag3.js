const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const scriptIndex = html.indexOf('<script>');
const scriptContent = html.substring(scriptIndex + 8, html.indexOf('</script>', scriptIndex));

const dom = new JSDOM(`<body><div id="pdf-wrapper" class="pdf-page-wrapper"></div></body>`);
const window = dom.window;
const document = window.document;

window.HTMLElement.prototype.getBoundingClientRect = function() {
    return { left: 100, top: 100, width: 800, height: 1000 };
};

// Inject script
const script = document.createElement('script');
script.textContent = scriptContent;
document.body.appendChild(script);

// Set state
window.pdfScale = 1.2;
const wrapper = document.getElementById('pdf-wrapper');
const el = document.createElement('div');
el.className = 'draggable-field';
el.dataset.id = 'f_123';
el.style.left = '100px';
el.style.top = '100px';
wrapper.appendChild(el);

window.draggedEl = el;
window.isDragging = true;
window.dragStartPositions = [{ id: 'f_123', x: 100, y: 100 }];
window.offset = { x: 50, y: 50 };

// override wrapper.querySelector to make sure it works
const origQuery = wrapper.querySelector.bind(wrapper);
wrapper.querySelector = function(sel) {
  console.log('querySelector called with:', sel);
  const res = origQuery(sel);
  console.log('querySelector returned:', !!res);
  return res;
};

const mousemoveEvent = new window.MouseEvent('mousemove', { clientX: 200, clientY: 200, bubbles: true });
document.dispatchEvent(mousemoveEvent);

console.log('After mousemove:');
console.log('el.style.left =', el.style.left);
console.log('el.style.top =', el.style.top);

