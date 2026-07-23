const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('https://djchoi1981.github.io/insurenceaccount/', {waitUntil: 'networkidle0'});
  
  // Wait for templates to load
  await new Promise(r => setTimeout(r, 2000));
  
  // Click the first template (생명보험)
  await page.evaluate(() => {
    document.querySelector('.template-card').click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.type('#cus-name', '홍길동');
  await page.type('#cus-rrn', '800101-1234567');
  
  await page.click('#cus-sameAsInsured');
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Get all text drawn over the PDF
  const pdfTexts = await page.$$eval('#preview-container .pdf-page-wrapper div', divs => divs.map(d => d.innerText));
  console.log('PDF TEXTS:', pdfTexts.filter(t => t === '홍길동' || t.includes('홍길동')));
  
  await browser.close();
})();
