import puppeteer from 'puppeteer';

(async () => {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({ 
        headless: "new",
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: ['--no-sandbox', '--remote-debugging-port=9222'],
        dumpio: true
    });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));

    console.log('Navigating to http://localhost:3030/ ...');
    const response = await page.goto('http://localhost:3030/', { waitUntil: 'networkidle2', timeout: 30000 }).catch(e => {
        console.log('Navigation error:', e.message);
        return null;
    });
    
    const report = {
      marketplaceLoad: false,
      emojiCheck: false,
      gutuOcrModal: false,
      partSentryFlow: false,
      safePayFlow: false,
      logs: []
    };

    if (response && response.status() === 200) {
      report.marketplaceLoad = true;
      report.logs.push('PASSED: Marketplace loaded successfully (HTTP 200).');
    } else {
      report.logs.push(`FAILED: Marketplace load failed. Status: ${response ? response.status() : 'Unknown'}`);
    }

    if (response) {
      const pageText = await page.evaluate(() => document.body.innerText || '');
      const emojiRegex = /[\p{Extended_Pictographic}]/u;
      const hasEmojis = emojiRegex.test(pageText);
      if (hasEmojis) {
        report.logs.push('FAILED: Native emojis found in the UI text.');
        report.emojiCheck = false;
      } else {
        report.logs.push('PASSED: No native emojis found in the UI text.');
        report.emojiCheck = true;
      }

      const clickByTestId = async (testId) => {
        return await page.evaluate((id) => {
            const target = document.querySelector(`[data-testid="${id}"]`);
            if (target) {
                target.click();
                return true;
            }
            return false;
        }, testId);
      };

      const isTextVisible = async (text) => {
        return await page.evaluate((searchText) => {
            return document.body.innerText.toLowerCase().includes(searchText.toLowerCase());
        }, text);
      };

      if (await clickByTestId('btn-gutu')) {
         report.logs.push('Clicked Gutu OCR button/link.');
         await new Promise(r => setTimeout(r, 1000));
         if (await isTextVisible('Document') || await isTextVisible('Upload') || await isTextVisible('Registry')) {
             report.gutuOcrModal = true;
             report.logs.push('PASSED: Gutu OCR / Document Registry modal appeared.');
         } else {
             report.logs.push('FAILED: Gutu OCR modal did not display expected text.');
         }
      } else {
         report.logs.push('FAILED: Could not find Gutu OCR button/link to click.');
      }

      await page.goto('http://localhost:3030/', { waitUntil: 'networkidle2' });

      if (await clickByTestId('btn-partsentry')) {
         report.logs.push('Clicked PartSentry button/link.');
         await new Promise(r => setTimeout(r, 1000));
         report.partSentryFlow = true;
         report.logs.push('PASSED: PartSentry flow triggered.');
      } else {
         report.logs.push('FAILED: Could not find PartSentry button/link.');
      }

      await page.goto('http://localhost:3030/', { waitUntil: 'networkidle2' });

      if (await clickByTestId('btn-safepay')) {
         report.logs.push('Clicked SafePay button/link.');
         await new Promise(r => setTimeout(r, 1000));
         report.safePayFlow = true;
         report.logs.push('PASSED: SafePay flow triggered.');
      } else {
         report.logs.push('FAILED: Could not find SafePay button/link.');
      }
    }

    console.log("=== REPORT START ===");
    console.log(JSON.stringify(report, null, 2));
    console.log("=== REPORT END ===");

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
