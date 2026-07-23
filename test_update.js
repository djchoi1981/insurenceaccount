const fs = require('fs');
eval(fs.readFileSync('templates_data.js', 'utf8')); // loads PRELOADED_TEMPLATES

const templates = [
  {
    "id": "tpl_old",
    "name": "삼성화재 보험금청구서",
    "fields": [],
    "lastUpdated": 0
  }
];

let changed = false;
for (const p of PRELOADED_TEMPLATES) {
  const existingIndex = templates.findIndex(t => t.name === p.name);
  const newTpl = { 
    id: p.id || ('tpl_' + Date.now() + Math.random()), 
    name: p.name, 
    pdfUrl: "fake_b64", // p.base64 || p.pdfUrl, 
    fields: p.fields || [],
    category: p.category || '',
    displayName: p.displayName || '',
    lastUpdated: p.lastUpdated || Date.now()
  };
  
  if (existingIndex === -1) {
    templates.push(newTpl);
    changed = true;
  } else {
    const existing = templates[existingIndex];
    const pTime = p.lastUpdated || 0;
    const eTime = existing.lastUpdated || 0;
    if (pTime > eTime) {
      templates[existingIndex] = newTpl;
      changed = true;
    }
  }
}
console.log("Changed:", changed);
console.log("Updated Template:", templates.find(t => t.name === "삼성화재 보험금청구서").lastUpdated > 0);
