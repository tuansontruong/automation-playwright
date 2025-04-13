const { chromium, firefox, webkit } = require('@playwright/test');
const ConfigurationManager = require('./ConfigurationManager');

class BrowserManager {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async initializeBrowser() {
        try {
            await this.setPage();
            return this.page;
        } catch (error) {
            throw new Error(`Failed to initialize browser: ${error.message}`);
        }
    }

    async setPage() {
        const browserType = ConfigurationManager.getProperty('BROWSER').trim();
        const headlessMode = ConfigurationManager.getBooleanProperty('HEADLESS');

        try {
            // Launch browser based on BROWSER environment variable
            switch (browserType.toLowerCase()) {
                case 'chromium':
                case 'chrome':
                    this.browser = await chromium.launch({
                        headless: headlessMode,
                        args: ['--start-maximized']
                    });
                    break;
                case 'firefox':
                    this.browser = await firefox.launch({
                        headless: headlessMode,
                        args: ['--start-maximized']
                    });
                    break;
                case 'webkit':
                case 'safari':
                    this.browser = await webkit.launch({
                        headless: headlessMode,
                        args: ['--start-maximized']
                    });
                    break;
                default:
                    throw new Error(`Unsupported browser type: ${browserType}. Supported types: chromium, firefox, webkit`);
            }

            // Initialize browser context with specific viewport size
            this.context = await this.browser.newContext({
                viewport: { width: 1920, height: 1080 }
            });
            
            this.page = await this.context.newPage();
            return this.page;
        } catch (error) {
            throw new Error(`Browser initialization failed: ${error.message}`);
        }
    }

    getBrowser() {
        if (!this.browser) {
            throw new Error('Browser instance not initialized');
        }
        return this.browser;
    }

    getBrowserContext() {
        return this.context;
    }

    getPage() {
        if (!this.page) {
            throw new Error('Page instance not initialized');
        }
        return this.page;
    }

    async cleanup() {
        try {
            if (this.context) {
                await this.context.close();
            }
            if (this.browser) {
                await this.browser.close();
            }
        } catch (error) {
            throw new Error(`Error during browser cleanup: ${error.message}`);
        }
    }
}

module.exports = BrowserManager; 