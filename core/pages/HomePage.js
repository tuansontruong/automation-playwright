const PPCommonPage = require('../base/PPCommonPage');
const Waiting = require('../constants/Waiting');
const {HOME} = require('../enums/PortalPage');
const Menu = require('../components/Menu');
const ShipmentsOverviewPage = require('./ShipmentsOverviewPage');
const PortalPage = require('../enums/PortalPage');
/**
 * Represents the Home page in the ParcelPerform Portal.
 * This page serves as the main dashboard after logging in.
 * Extends PPCommonPage to inherit common ParcelPerform page functionality.
 */
class HomePage extends PPCommonPage {
    /**
     * Verifies if the Home page is displayed correctly.
     * Checks for the presence of essential elements on the dashboard.
     *
     * @returns {Promise<boolean>} Returns true if all essential elements are visible, false otherwise
     */
    async isDisplayed() {
        return await this.isPageHeader(HOME);
    }

    /**
     * Navigates to a specific section of the dashboard.
     * 
     * @param {string} sectionName - The name of the section to navigate to
     * @returns {Promise<void>}
     */
    async navigateToSection(sectionName) {
        const sectionSelector = `//div[contains(@class,'dashboard-section') and contains(text(),'${sectionName}')]`;
        await this.click(sectionSelector);
    }

    /**
     * Verifies if a specific section is visible on the dashboard.
     * 
     * @param {string} sectionName - The name of the section to check
     * @returns {Promise<boolean>} Returns true if the section is visible, false otherwise
     */
    async isSectionVisible(sectionName) {
        const sectionSelector = `//div[contains(@class,'dashboard-section') and contains(text(),'${sectionName}')]`;
        return await this.isElementVisible(sectionSelector);
    }

     /**
     * Navigates to the Shipments Overview page
     * @returns {Promise<ShipmentsOverviewPage>} Instance of the ShipmentsOverviewPage class
     */
     async goToShipmentsOverviewPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.SHIPMENTS_OVERVIEW, ShipmentsOverviewPage);
    }
}

module.exports = HomePage; 