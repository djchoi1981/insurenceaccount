const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const mousemoveStart = content.indexOf('// --- FOOLPROOF DRAG AND DROP ---');
const mouseupStart = content.indexOf('document.addEventListener(\'mouseup\'', mousemoveStart);
const functionEnd = content.indexOf('function saveTemplateCoords()', mouseupStart);

const newEvents = `// --- FOOLPROOF DRAG AND DROP ---
document.addEventListener('mousemove', (e) => {
  try {
    if (isRotating && rotatingEl) {
      const parentRect = rotatingEl.parentElement.getBoundingClientRect();
      const currentRenderScale = pdfScale / 1.2;
      const centerX = parentRect.left + (parseFloat(rotatingEl.style.left) * currentRenderScale) + (rotatingEl.offsetWidth / 2);
      const centerY = parentRect.top + (parseFloat(rotatingEl.style.top) * currentRenderScale) + (rotatingEl.offsetHeight / 2);
      const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let deg = (rad * 180) / Math.PI;
      deg = Math.round(deg / 15) * 15;
      rotatingEl.style.transform = \`rotate(\${deg}deg)\`;
      if (rotatingField) rotatingField.rotate = deg;
      return;
    }
    
    if (!isDragging || !draggedEl || dragStartPositions.length === 0) return;
    
    e.preventDefault();
    
    const wrapper = draggedEl.parentElement;
    if (!wrapper) return;

    const parentRect = wrapper.getBoundingClientRect();
    const renderScale = pdfScale / 1.2;
    
    const currentX = e.clientX - parentRect.left;
    const currentY = e.clientY - parentRect.top;
    
    const dx = (currentX - offset.x) / renderScale;
    const dy = (currentY - offset.y) / renderScale;
    
    dragStartPositions.forEach(p => {
      const el = wrapper.querySelector(\`.draggable-field[data-id="\${p.id}"]\`);
      if (el) {
        el.style.left = ((p.x + dx) * renderScale) + 'px';
        el.style.top = ((p.y + dy) * renderScale) + 'px';
      }
    });
  } catch (err) {
    console.error(err);
  }
});

document.addEventListener('mouseup', (e) => {
  try {
    if (isRotating) {
      isRotating = false;
      rotatingEl = null;
      rotatingField = null;
      if (dragStartPositions[0] && dragStartPositions[0].tplId) {
        localforage.setItem('agc_templates', templates).catch(console.error);
      }
    }
    
    if (isDragging && draggedEl) {
      const renderScale = pdfScale / 1.2;
      const wrapper = draggedEl.parentElement;
      if (wrapper) {
        dragStartPositions.forEach(p => {
          const el = wrapper.querySelector(\`.draggable-field[data-id="\${p.id}"]\`);
          if (!el) return;
          
          let newX = parseFloat(el.style.left) / renderScale;
          let newY = parseFloat(el.style.top) / renderScale;
          if (isNaN(newX)) newX = p.x || 0;
          if (isNaN(newY)) newY = p.y || 0;
          
          if (typeof editingFields !== 'undefined' && editingFields && editingFields.length > 0) {
            const field = editingFields.find(f => f.id === p.id);
            if (field) {
              field.x = newX;
              field.y = newY;
            }
          }
          
          if (p.tplId) {
            const tpl = templates.find(t => t.id === p.tplId);
            if (tpl) {
              const mainField = (tpl.fields || []).find(f => f.id === p.id);
              if (mainField) { mainField.x = newX; mainField.y = newY; }
            }
          } else if (typeof editingTemplateId !== 'undefined' && editingTemplateId) {
            const tpl = templates.find(t => t.id === editingTemplateId);
            if (tpl) {
              const mainField = (tpl.fields || []).find(f => f.id === p.id);
              if (mainField) { mainField.x = newX; mainField.y = newY; }
            }
          }
        });
        
        localforage.setItem('agc_templates', templates).catch(console.error);
      }
    }
  } catch(err) {
    console.error('Error in mouseup:', err);
  } finally {
    isDragging = false;
    draggedEl = null;
    hideGuideLine('h');
    hideGuideLine('v');
  }
});

`;

content = content.substring(0, mousemoveStart) + newEvents + content.substring(functionEnd);
fs.writeFileSync('index.html', content, 'utf8');
console.log('Fixed index.html perfectly');
