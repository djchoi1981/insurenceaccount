const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('file:///Users/djchoi81/Library/CloudStorage/GoogleDrive-djchoi19810402@gmail.com/내 드라이브/보험금 청구 에이전트/index.html', {waitUntil: 'networkidle0'});
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    // Inject test data
    window.editingFields = [{ id: 'f_1', x: 100, y: 100, type: 'text', text: 'Test' }];
    window.selectedFieldIds = [];
    window.editorCurrentPage = 1;
    window.pdfScale = 1.2;
    const w = document.createElement('div');
    w.id = 'pdf-wrapper';
    w.style.width = '800px';
    w.style.height = '1000px';
    w.style.position = 'absolute';
    w.style.top = '0px';
    w.style.left = '0px';
    document.body.appendChild(w);
    if (typeof renderDraggables === 'function') renderDraggables();
  });
  
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const el = document.querySelector('.draggable-field');
    if (!el) {
      console.log('STILL NO EL');
      return;
    }
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    console.log('Initial left:', el.style.left, 'top:', el.style.top);
    
    // Simulate full mouse interaction
    const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: x, clientY: y });
    el.dispatchEvent(mousedown);
    
    console.log('After mousedown, isDragging:', window.isDragging, 'dragStartPos:', JSON.stringify(window.dragStartPositions));
    
    const mousemove = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x + 50, clientY: y + 50 });
    document.dispatchEvent(mousemove);
    
    console.log('After mousemove, new left:', el.style.left, 'top:', el.style.top);
    
    const mouseup = new MouseEvent('mouseup', { bubbles: true, cancelable: true, clientX: x + 50, clientY: y + 50 });
    document.dispatchEvent(mouseup);
    
    console.log('After mouseup, final editingFields[0].x:', window.editingFields[0].x);
  });
  
  await new Promise(r => setTimeout(r, 500));
  await browser.close();
})();
