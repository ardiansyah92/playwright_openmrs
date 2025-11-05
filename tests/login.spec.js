// Import Playwright Test
const { test, expect } = require('@playwright/test');
const credentials = require('../test_data/credentials.js');
const envConfig = require('../env/env.config.js');

const ENV = process.env.ENV || 'dev';
const config = envConfig[ENV];

test.describe('Login Page OpenMRS', () => {

  test('berhasil login dan masuk ke halaman utama openMRS', async ({ page, context, browserName }) => {
   
    // await page.goto('https://o2.openmrs.org/openmrs/login.htm');
    await page.goto(config.baseUrl);
    
    const screenSize = { width: 1920, height: 1080 }; 
    await page.setViewportSize(screenSize);

    
    if (browserName === 'chromium') {
      const session = await context.newCDPSession(page);
      const { windowId } = await session.send('Browser.getWindowForTarget');
      await session.send('Browser.setWindowBounds', {
        windowId,
        bounds: { windowState: 'maximized' },
      });
    }

    
    await page.fill('#username', credentials.username);
    await page.fill('#password', credentials.password);

    
    await page.getByText('Outpatient Clinic').click();
    await page.click('#loginButton');

    
    await page.waitForTimeout(3000); 

    
    await expect(page).toHaveURL(/home\.page/);
    await expect(page.locator('h4')).toHaveText(
      'Logged in as Super User (admin) at Outpatient Clinic.',
      { timeout: 30000 }
    );
  });

});
