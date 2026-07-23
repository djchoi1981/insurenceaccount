const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setContent(`
    <input type="text" id="myInput" value="initial">
    <script>
      const el = document.getElementById('myInput');
      el.readOnly = true;
      el.value = 'new_value';
    </script>
  `);
  
  const val = await page.$eval('#myInput', el => el.value);
  console.log('Value is:', val);
  
  await browser.close();
})();
