// Import Playwright Test
const { test, expect } = require('@playwright/test');
const credentials = require('../test_data/credentials.js');

test.describe('Login Page Tests', () => {

  test('should login with valid credentials', async ({ page, context, browserName }) => {
    // Launch page
    await page.goto('https://o2.openmrs.org/openmrs/login.htm');

    // ✅ Set browser window to maximum size (for all browsers)
    const screenSize = { width: 1920, height: 1080 }; // Full HD
    await page.setViewportSize(screenSize);

    // For Chromium (Chrome, Edge), maximize window
    if (browserName === 'chromium') {
      const session = await context.newCDPSession(page);
      const { windowId } = await session.send('Browser.getWindowForTarget');
      await session.send('Browser.setWindowBounds', {
        windowId,
        bounds: { windowState: 'maximized' },
      });
    }

    // Input username and password
    await page.fill('#username', credentials.username);
    await page.fill('#password', credentials.password);

    // Select location and click login
    await page.getByText('Outpatient Clinic').click();
    await page.click('#loginButton');

    // Add delay before checking redirect (for stability)
    await page.waitForTimeout(3000); // Wait 3 seconds

    // Verify successful login
    await expect(page).toHaveURL(/home\.page/);
    await expect(page.locator('h4')).toHaveText(
      'Logged in as Super User (admin) at Outpatient Clinic.',
      { timeout: 30000 }
    );
  });

});
