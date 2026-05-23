const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    // Capture console messages
    page.on('console', msg => {
      console.log(`BROWSER_CONSOLE: [${msg.type()}] ${msg.text()}`);
    });
    
    // Capture page errors (unhandled exceptions)
    page.on('pageerror', err => {
      console.log(`BROWSER_ERROR: ${err.message}`);
    });

    console.log('Navigating to http://localhost:3030/ ...');
    const response = await page.goto('http://localhost:3030/', { waitUntil: 'networkidle0', timeout: 10000 });
    
    console.log(`HTTP Status: ${response.status()}`);
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log(`Body Length: ${bodyHTML.length} characters`);
    
    if (bodyHTML.length < 500) {
      console.log('Body HTML snippet:', bodyHTML.substring(0, 500));
    }
    
    await browser.close();
  } catch (err) {
    console.error('PUPPETEER_ERROR:', err.message);
  }
})();
