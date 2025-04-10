const { defineConfig, devices } = require('@playwright/test');
const testSuites = require('./config/test-suites');

// Helper function to create project configuration
function createProjectConfig(suiteName, testPaths) {
  return {
    name: suiteName,
    testMatch: testPaths,
    use: { ...devices['Desktop Chrome'] },
  };
}

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:9081',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    createProjectConfig('smoke_test', testSuites.smoke_test),
    createProjectConfig('regression_prod', testSuites.regression_prod),
    createProjectConfig('regression_test', testSuites.regression_test),
    createProjectConfig('carrier_overview', testSuites.carrier_overview),
    createProjectConfig('return_overview', testSuites.return_overview),
    createProjectConfig('shipment_overview', testSuites.shipment_overview),
  ],
}); 