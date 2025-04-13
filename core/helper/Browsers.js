const BrowserManager = require('./BrowserManager');
const ConfigurationManager = require('./ConfigurationManager');
const PortalLoginPage = require('../pages/PortalLoginPage');
const ShipmentsOverviewPage = require('../pages/ShipmentsOverviewPage');
const { WAIT_FOR_LOADING } = require('../constants/Waiting');

class Browsers extends BrowserManager {
    async waitForPageLoad(stage) {
        await this.getPage().waitForLoadState(stage, { timeout: 30000 });
    }

    async maximize() {
        try {
            const page = this.getPage();
            await page.setViewportSize({ width: 1920, height: 1080 });
        } catch (error) {
            // Silently handle headless mode
        }
    }

    async navigateToUrl(url) {
        try {
            await this.getPage().goto(url, {
                timeout: WAIT_FOR_LOADING,
                waitUntil: 'networkidle'
            });
            await this.waitForPageLoad('networkidle');
            await this.waitForPageLoad('domcontentloaded');
        } catch (error) {
            throw new Error(`Navigation failed: ${url} - ${error.message}`);
        }
    }

    async openPortal() {
        await this.setPage();
        await this.navigateToUrl(`${ConfigurationManager.getProperty('BASE_URL')}/login`);
        await this.maximize();
        return new PortalLoginPage(this.getPage());
    }

    async closeBrowser() {
        try {
            if (this.page) {
                await this.page.close();
            }
            if (this.browser) {
                await this.browser.close();
            }
        } catch (error) {
            console.error(error.message);
        }
    }
}

module.exports = Browsers; 