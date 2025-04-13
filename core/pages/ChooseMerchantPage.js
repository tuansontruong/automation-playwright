const PPCommonPage = require('../base/PPCommonPage');
const HomePage = require('./HomePage');
const Waiting = require('../constants/Waiting');

/**
 * @typedef {Object} User
 * @property {string} email - The user's email address
 * @property {string} password - The user's password
 */

/**
 * @typedef {import('./HomePage')} HomePage
 */

/**
 * Represents the Choose Merchant page in the ParcelPerform Portal.
 * This page allows users to select a merchant account to work with.
 * Extends PPCommonPage to inherit common ParcelPerform page functionality.
 * @extends PPCommonPage
 */
class ChooseMerchantPage extends PPCommonPage {
    /**
     * XPath selectors for static UI elements
     */
    static #drdSelectMerchant = "//input[@placeholder='Select account' or @placeholder='Search account']";
    static #btnContinue = "//button[text()='Continue']";
    static #optSelectMerchant = "//li[normalize-space(text())='%s']";

    // /**
    //  * Constructor that ensures the page is loaded and the merchant selection dropdown is available.
    //  * Waits for page load and essential elements before proceeding.
    //  * @param {import('playwright').Page} page - The Playwright page object
    //  */
    // constructor(page) {
    //     super(page);
    //     this.waitForPageLoad();
    //     this.waitForElementExist(ChooseMerchantPage.#drdSelectMerchant, Waiting.WAIT_FOR_LOADING);
    // }

    /**
     * Selects a merchant and navigates to the HomePage.
     *
     * @param {string} merchant - The name of the merchant to select
     * @returns {Promise<HomePage>} Returns a new instance of the HomePage
     */
    async selectMerchant(merchant) {
        return this.selectMerchantWithTarget(merchant, HomePage);
    }

    /**
     * Selects a merchant and navigates to the specified page type.
     *
     * @param {string} merchant - The name of the merchant to select
     * @param {Function} TargetPage - The class of the page to navigate to
     * @returns {Promise<Object>} Returns a new instance of the specified page type
     * @throws {Error} if the page instance cannot be created
     */
    async selectMerchantWithTarget(merchant, TargetPage) {
        await this.waitForElementExist(ChooseMerchantPage.#drdSelectMerchant, Waiting.WAIT_FOR_LOADING);
        await this.click(ChooseMerchantPage.#drdSelectMerchant);
        await this.setText(ChooseMerchantPage.#drdSelectMerchant, merchant);
        await this.click(ChooseMerchantPage.#optSelectMerchant.replace('%s', merchant));
        await this.click(ChooseMerchantPage.#btnContinue);
        
        try {
            return new TargetPage(this.page);
        } catch (error) {
            throw new Error(`Failed to create page instance: ${error.message}`);
        }
    }

    /**
     * Verifies if the Choose Merchant page is displayed correctly.
     * Checks for the presence of the merchant selection dropdown and continue button.
     *
     * @returns {Promise<boolean>} Returns true if all essential elements are visible, false otherwise
     */
    async isDisplay() {
        return await this.isElementVisible(ChooseMerchantPage.#drdSelectMerchant) && 
               await this.isElementVisible(ChooseMerchantPage.#btnContinue);
    }
}

module.exports = ChooseMerchantPage; 