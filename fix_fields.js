const fs = require('fs');
const file = '/Users/djchoi81/Library/CloudStorage/GoogleDrive-djchoi19810402@gmail.com/내 드라이브/보험금 청구 에이전트/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add type="button" to toolbar buttons
content = content.replace(
  /<button class="btn btn-outline" style="padding: 0\.25rem 0\.5rem;" onclick="addField/g,
  '<button type="button" class="btn btn-outline" style="padding: 0.25rem 0.5rem;" onclick="addField'
).replace(
  /<button class="btn btn-outline" style="padding: 0\.25rem 0\.5rem; border-color: #3b82f6; color: #3b82f6;" onclick="addCustomField\(\)">\+ 자유 텍스트/g,
  '<button type="button" class="btn btn-outline" style="padding: 0.25rem 0.5rem; border-color: #3b82f6; color: #3b82f6;" onclick="addCustomField()">+ 자유 텍스트'
).replace(
  /<button class="btn btn-outline" style="padding: 0\.25rem 0\.5rem; border-color: #f59e0b; color: #d97706; font-weight: bold;" onclick="autoDetectFieldsWithOCR\(\)">/g,
  '<button type="button" class="btn btn-outline" style="padding: 0.25rem 0.5rem; border-color: #f59e0b; color: #d97706; font-weight: bold;" onclick="autoDetectFieldsWithOCR()">'
);

// 2. Fix getVisibleCenterCoords
content = content.replace(
  /let x = targetPxX \/ pdfScale;\s*let y = targetPxY \/ pdfScale;/g,
  'const renderScale = pdfScale / 1.2;\n  let x = targetPxX / renderScale;\n  let y = targetPxY / renderScale;'
);

// 3. Fix addField and addCustomField to autosave to template
content = content.replace(
  /editingFields\.push\(f\);\s*renderDraggables\(\);\s*\}/,
  `editingFields.push(f); 
  if (typeof editingTemplateId !== 'undefined' && editingTemplateId) {
    const tpl = templates.find(t => t.id === editingTemplateId);
    if (tpl) {
      if (!tpl.fields) tpl.fields = [];
      tpl.fields.push(JSON.parse(JSON.stringify(f)));
      localforage.setItem('agc_templates', templates).catch(console.error);
    }
  }
  renderDraggables(); 
}`
);

content = content.replace(
  /editingFields\.push\(f\);\s*renderDraggables\(\);\s*\}\s*\}/,
  `editingFields.push(f); 
    if (typeof editingTemplateId !== 'undefined' && editingTemplateId) {
      const tpl = templates.find(t => t.id === editingTemplateId);
      if (tpl) {
        if (!tpl.fields) tpl.fields = [];
        tpl.fields.push(JSON.parse(JSON.stringify(f)));
        localforage.setItem('agc_templates', templates).catch(console.error);
      }
    }
    renderDraggables(); 
  }
}`
);

// 4. Remove snap logic from mousemove
content = content.replace(
  /let snapDx = dx;\s*let snapDy = dy;\s*const primaryId = draggedEl\.dataset\.id;\s*const primaryStart = dragStartPositions\.find\(p => p\.id === primaryId\);\s*if \(primaryStart\) \{[\s\S]*?else hideGuideLine\('h'\);\s*\}/,
  ''
);

// Remove snapDx and snapDy usage in mousemove
content = content.replace(
  /el\.style\.left = \(\(p\.x \+ snapDx\) \* renderScale\) \+ 'px';\s*el\.style\.top = \(\(p\.y \+ snapDy\) \* renderScale\) \+ 'px';/g,
  `el.style.left = ((p.x + dx) * renderScale) + 'px';
      el.style.top = ((p.y + dy) * renderScale) + 'px';`
);

// 5. Add template auto-save in mouseup
const mouseupReplacement = `
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
          if (mainField) {
            mainField.x = newX;
            mainField.y = newY;
            localforage.setItem('agc_templates', templates).catch(console.error);
          }
        }
      } else {
        if (typeof editingTemplateId !== 'undefined' && editingTemplateId) {
          const tpl = templates.find(t => t.id === editingTemplateId);
          if (tpl) {
            const mainField = (tpl.fields || []).find(f => f.id === p.id);
            if (mainField) {
              mainField.x = newX;
              mainField.y = newY;
              localforage.setItem('agc_templates', templates).catch(console.error);
            }
          }
        }
      }`;

content = content.replace(
  /if \(typeof editingFields !== 'undefined' && editingFields && editingFields\.length > 0\) \{[\s\S]*?catch\(console\.error\);\s*\}\s*\}\s*\}/,
  mouseupReplacement.trim()
);

fs.writeFileSync(file, content);
console.log("Fixes applied successfully.");
