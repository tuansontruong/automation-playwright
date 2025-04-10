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
    createProjectConfig(testSuites.smoke_test.name, testSuites.smoke_test.tests),
    createProjectConfig(testSuites.regression_prod.name, testSuites.regression_prod.tests),
    createProjectConfig(testSuites.regression_test.name, testSuites.regression_test.tests),
    createProjectConfig(testSuites.carrier_overview.name, testSuites.carrier_overview.tests),
    createProjectConfig(testSuites.return_overview.name, testSuites.return_overview.tests),
    createProjectConfig(testSuites.shipment_overview.name, testSuites.shipment_overview.tests),
  ],
}); 