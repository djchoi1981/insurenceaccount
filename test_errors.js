const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf-8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (err) => {
  console.error("DOM ERROR:", err);
});
virtualConsole.on("log", (msg) => {
  console.log("DOM LOG:", msg);
});

const dom = new JSDOM(html, { 
  runScripts: "dangerously", 
  virtualConsole,
  url: "http://localhost/"
});
