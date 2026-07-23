const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

setTimeout(() => {
  try {
    const window = dom.window;
    window.templates = [
      { id: 'tpl_1', name: '현대해상_청구서.pdf', pdfUrl: 'data:application/pdf;base64,', fields: [] }
    ];
    window.localforage = {
      setItem: async (key, val) => { console.log('Saved to localforage:', key, val); }
    };
    
    // Mock prompt
    window.prompt = (msg, defaultVal) => {
      if (msg.includes('회사명')) return '현대해상 (수정됨)';
      if (msg.includes('분류 위치')) return '1';
      return defaultVal;
    };
    
    window.renderModalTemplates();
    window.renderActiveTemplates();
    
    // Trigger edit
    window.editTemplateInfo({ stopPropagation: () => {} }, 'tpl_1').then(() => {
      console.log('After Edit:', window.templates[0]);
      console.log('DOM life:', window.document.getElementById('life-template-list').innerHTML);
    });
  } catch (err) {
    console.error(err);
  }
}, 1000);
