const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    headless: false,
    launchOptions: {
      args: ['--start-maximized'],
    },
    viewport: null, 
  },
});
