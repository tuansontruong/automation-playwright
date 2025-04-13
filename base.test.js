const { test, expect } = require('@playwright/test');
const Browsers = require('./core/helper/Browsers');
const Assert = require('./core/helper/Assert');

// Create a singleton instance of Browsers
const PPBrowser = new Browsers();

// Extend the base test with our custom fixtures
exports.test = test.extend({
    // Define a fixture for browser
    browser: async ({ browser }, use) => {
        await use(browser);
    },

    // Define a fixture for page
    page: async ({ browser }, use) => {
        const page = await PPBrowser.initializeBrowser();
        await use(page);
    },

    // Define fixtures for different page objects
    adminLoginPage: async ({ page }, use) => {
        await use(page);
    },
    
    adminDashboardPage: async ({ page }, use) => {
        await use(page);
    },
    
    portalLoginPage: async ({ page }, use) => {
        await use(page);
    }
});

// Export expect for use in tests
exports.expect = expect;

// Export PPBrowser for direct use in tests
exports.PPBrowser = PPBrowser;

// Export Assert for use in tests
exports.Assert = Assert;

// Global setup - runs once before all tests
exports.beforeAll = async () => {
    // Any global setup code here
};

// Global teardown - runs once after all tests
exports.afterAll = async () => {
    await PPBrowser.cleanup();
}; 