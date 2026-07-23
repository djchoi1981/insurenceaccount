const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('https://djchoi1981.github.io/insurenceaccount/', {waitUntil: 'networkidle0'});
  
  await page.type('#cus-name', '홍길동');
  await page.type('#cus-rrn', '800101-1234567');
  
  await page.click('#cus-sameAsInsured');
  
  const policyName = await page.$eval('#cus-policyholderName', el => el.value);
  console.log('Policyholder Name after check:', policyName);
  
  await browser.close();
})();
