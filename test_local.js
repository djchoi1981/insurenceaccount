const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('file:///Users/djchoi81/Library/CloudStorage/GoogleDrive-djchoi19810402@gmail.com/내 드라이브/보험금 청구 에이전트/insurenceaccount/index.html', {waitUntil: 'networkidle0'});
  
  await page.type('#cus-name', '홍길동');
  await page.type('#cus-rrn', '800101-1234567');
  
  await page.click('#cus-sameAsInsured');
  
  const policyName = await page.$eval('#cus-policyholderName', el => el.value);
  console.log('Local Policyholder Name after check:', policyName);
  
  await browser.close();
})();
