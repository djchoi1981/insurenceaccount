const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

setTimeout(() => {
  document.getElementById('cus-name').value = '홍길동';
  document.getElementById('cus-rrn').value = '800101-1234567';
  document.getElementById('cus-insuredPhone').value = '010-1234-5678';
  
  // Trigger onchange manually if needed, or just call the function
  document.getElementById('cus-sameAsInsured').checked = true;
  window.toggleSameAsInsured();
  
  console.log("Name:", document.getElementById('cus-policyholderName').value);
  console.log("Phone:", document.getElementById('cus-policyholderPhone').value);
}, 1000);
