const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const injection = `
// --- DIAGNOSTICS INJECTION ---
(function() {
  const diag = document.createElement('div');
  diag.style.position = 'fixed';
  diag.style.bottom = '10px';
  diag.style.right = '10px';
  diag.style.width = '300px';
  diag.style.height = '400px';
  diag.style.background = 'rgba(0,0,0,0.8)';
  diag.style.color = '#0f0';
  diag.style.padding = '10px';
  diag.style.fontFamily = 'monospace';
  diag.style.fontSize = '11px';
  diag.style.overflowY = 'auto';
  diag.style.zIndex = '9999999';
  diag.style.pointerEvents = 'none';
  document.body.appendChild(diag);

  function log(msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    diag.appendChild(div);
    diag.scrollTop = diag.scrollHeight;
  }

  let mousedownCount = 0;
  let mousemoveCount = 0;
  let lastMoveLog = 0;

  document.addEventListener('mousedown', (e) => {
    if (e.target.closest('.draggable-field')) {
      mousedownCount++;
      log('MOUSE DOWN on field: ' + e.target.closest('.draggable-field').dataset.id);
      log('isDragging=' + window.isDragging + ' draggedEl=' + !!window.draggedEl);
    }
  }, true);

  document.addEventListener('mousemove', (e) => {
    if (window.isDragging && window.draggedEl) {
      mousemoveCount++;
      if (Date.now() - lastMoveLog > 200) {
        log('DRAG MOVE ' + mousemoveCount + ' clientX=' + e.clientX + ' left=' + window.draggedEl.style.left);
        lastMoveLog = Date.now();
      }
    }
  }, true);

  document.addEventListener('mouseup', (e) => {
    if (window.isDragging) {
      log('MOUSE UP! final left=' + window.draggedEl.style.left);
    }
  }, true);
})();
// --- END DIAGNOSTICS ---
`;

if (!content.includes('DIAGNOSTICS INJECTION')) {
  content = content.replace('</body>', injection + '\n</body>');
  fs.writeFileSync('index.html', content, 'utf8');
  console.log('Diagnostics injected.');
} else {
  console.log('Already injected.');
}
