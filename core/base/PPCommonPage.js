// const fs = require('node:fs');
// const { PortalPage } = require('../enums/PortalPage');
// const Menu = require('../component/Menu');
// const { Waiting } = require('../../constants/Waiting');
// const DateTime = require('../../utils/helpers/DateTime');
// const Reports = require('../../utils/reports/Reports');

class PPCommonPage {
    constructor(page) {
        this.page = page;
        this.selectors = {
            btnContactUs: "//button[text()='Contact Us']",
            btnLogout: "//button[text()='Log out']",
            drdAccountInfo: "//div[starts-with(@class,'dropdown-toggle')]",
            txtSearch: "//input[@placeholder='Search for keywords']",
            txtSearchInput: "//div[contains(@class,'PpTextInput')]//input[@placeholder='Search']",
            btnConfirm: "//button[text()='Confirm']",
            btnAdd: "//button[text()='Add']",
            btnDynamicRemoveItemInTextBox: "//div[normalize-space()='%s']/following-sibling::div//div[normalize-space()='%s']//*[name()='svg']",
            btnRemoveItemInTextBox: "//div[normalize-space()='%s']/following-sibling::div//div[contains(@class,'multiValue')]//*[name()='svg']",
            btnSave: "//button[text()='Save']",
            btnEdit: "//button[@aria-label='edit']",
            btnYes: "//button[text()='Yes']",
            hdrPageTitle: "//ol//span[text()='%s']",
            lblOverlayTitle: "//div[contains(@class,'PpPermissionOverlay-module_title') and normalize-space(text())='%s']",
            lblOverlayDescription: "//div[contains(@class,'PpPermissionOverlay-module_description') and normalize-space(text())='%s']",
            lblPermissionOverlayTitle: "//div[@class='boost-your-e-commerc' and normalize-space(text())='%s']",
            lblPermissionOverlayDescription: "//div[@class='please-subscribe-to' and normalize-space()=\"%s\"]",
            txtWithLabel: "//div[normalize-space()='%s']/following-sibling::div//*[name()='input' or name()='textarea']",
            chkItemWithLabel: "//span[normalize-space()=='%s']/following-sibling::input",
            drdModal: "//div[contains(@id,'dialog') and not (@aria-hidden='true')]//div[starts-with(@class,'SelectV2-module_ppSelect')]"
        };
    }

    async isPageHeader(page) {
        let result = true;
        const headers = page.getPageHeader().split("->");
        for (const header of headers) {
            result = result && await this.isElementVisible(
                this.selectors.hdrPageTitle.replace('%s', header)
                // , Waiting.WAIT_FOR_ELEMENT
            );
        }
        return result;
    }

    async isPaywallDisplayed() {
        const permissionOverlayTitle = "//div[contains(@class,'ppContent')]//h2[.='Tracking Experience Coming Soon']";
        const permissionOverlayDescription = "Please contact us to subscribe to our platform or to get a free trial of our comprehensive features to boost your customers' e-commerce logistics experience.";
        return await this.isElementVisible(this.selectors.lblPermissionOverlayTitle.replace('%s', permissionOverlayTitle)) &&
               await this.isElementVisible(this.selectors.lblPermissionOverlayDescription.replace('%s', permissionOverlayDescription)) &&
               await this.isElementVisible(this.selectors.btnContactUs);
    }

    async isPermissionPageDisplayed() {
        const permissionOverlayTitle = "Unlock this feature & many more!";
        const permissionOverlayDescription = "Contact your administrator to gain access!";
        return await this.isElementVisible(this.selectors.lblOverlayTitle.replace('%s', permissionOverlayTitle)) &&
               await this.isElementVisible(this.selectors.lblOverlayDescription.replace('%s', permissionOverlayDescription));
    }

    async isTrackingExperienceComingSoonPageDisplayed() {
        const lblTEComingSoon = "//div[contains(@class,'ppContent')]//h2[.='Tracking Experience Coming Soon']";
        const lblPowerFull = "//div[contains(@class,'ppContent')]//p[contains(text(),'Soon you will see an overview and powerful')]";
        return await this.isElementVisible(lblTEComingSoon) &&
               await this.isElementVisible(lblPowerFull);
    }

    async logout() {
        // Reports.logKeywordName();
        await this.click(this.selectors.drdAccountInfo);
        await this.click(this.selectors.btnLogout);
        await this.waitForPageLoad();
        return new PortalLoginPage(this.page);
    }

    async switchMerchant(merchant, targetClass) {
        // Reports.logKeywordName();
        await this.click(this.selectors.drdAccountInfo);
        await this.click("//div[contains(@class,'dropdown-menu show')]/li[.//div[contains(@class,'pp-text-primary-sup')]]");
        await this.setText("//div[normalize-space()='Search Organization']/input", merchant);
        await this.click(`//div[text()='${merchant}']`);
        await this.waitForPageLoad();
        // await DateTime.wait(Waiting.SHORT_WAIT);
        return new targetClass(this.page);
    }

    async removeItemInTextBox(label, value) {
        if (value === "all") {
            const count = await this.getElementCount(this.selectors.btnRemoveItemInTextBox.replace('%s', label));
            for (let i = 0; i < count; i++) {
                await this.click(this.selectors.btnDynamicRemoveItemInTextBox.replace('%s', label).replace('%s', value), false);
            }
        } else {
            await this.click(this.selectors.btnDynamicRemoveItemInTextBox.replace('%s', label).replace('%s', value));
        }
    }

    async typeValueByLabel(label, value) {
        await this.typeValue(this.selectors.txtWithLabel.replace('%s', label), value);
        await this.pressKey("Enter");
    }

    async selectCheckBoxByLabel(label) {
        await this.checkElement(this.selectors.chkItemWithLabel.replace('%s', label));
    }

    // Helper methods
    async waitForPageLoad() {
        await this.page.waitForLoadState('load', { timeout: 30000 });
    }

    async waitForElementExist(selector, timeout = 30000) {
        await this.page.waitForSelector(selector, { state: 'attached', timeout });
    }

    async waitForElementVisible(selector, timeout = 30000) {
        await this.page.waitForSelector(selector, { state: 'visible', timeout });
    }

    async isElementVisible(selector, timeout = 30000) {
        try {
            const element = this.page.locator(selector);
            return await element.isVisible({ timeout });
        } catch (error) {
            return false;
        }
    }

    async setText(selector, text) {
        await this.waitForElementVisible(selector);
        await this.page.locator(selector).fill(text);
    }

    async click(selector, waitForVisible = true) {
        if (waitForVisible) {
            await this.waitForElementVisible(selector);
        }
        await this.page.locator(selector).click();
    }

    async typeValue(selector, value) {
        await this.waitForElementVisible(selector);
        await this.page.locator(selector).type(value);
    }

    async pressKey(key) {
        await this.page.keyboard.press(key);
    }

    async getElementCount(selector) {
        return (await this.page.locator(selector).count());
    }

    async checkElement(selector) {
        await this.waitForElementVisible(selector);
        await this.page.locator(selector).check();
    }

    async getAttribute(selector, attribute) {
        await this.waitForElementVisible(selector);
        return await this.page.locator(selector).getAttribute(attribute);
    }


    // Navigation methods
    /*
    async goToHomePage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.HOME, HomePage);
    }

    

    async goToNotificationsPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.NOTIFICATIONS, NotificationsPage);
    }

    async goToNotificationTemplatesPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.NOTIFICATION_TEMPLATES, NotificationTemplatesPage);
    }

    async goToTrackingPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.TRACKING_PAGE, TrackingPage);
    }

    async goToTrackingExperiencePage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.TRACKING_PAGE_V1, TrackingExperiencePage);
    }

    async goToCustomerRatingsPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.CUSTOMER_RATINGS, CustomerRatingsPage);
    }

    async goToPostPurchaseReportsAnalysisPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.POST_PURCHASE_REPORTS_ANALYSIS, PostPurchaseReportsAnalysisPage);
    }

    async goToReturnsReportsAnalysisPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.RETURNS_REPORTS_ANALYSIS, ReturnsReportsAnalysisPage);
    }

    async goToReturnsOverviewPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.RETURNS_OVERVIEW, ReturnsOverviewPage);
    }

    async goToBusinessIntelligencePage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.BUSINESS_INTELLIGENCE, BusinessIntelligencePage);
    }

    async goToAlertsOverviewPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.ALERTS_OVERVIEW, AlertsOverviewPage);
    }

    async goToCompanyProfilePage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.COMPANY_PROFILE, CompanyProfilePage);
    }

    async goToUsersPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.USERS, UsersPage);
    }

    async goToCarriersPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.CARRIERS, CarriersPage);
    }

    async goToIntegrationsPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.INTEGRATIONS, IntegrationsPage);
    }

    async goToBookingOverviewPage() {
        return await new Menu(this.page).selectMenuItem(PortalPage.BOOKING_OVERVIEW, BookingOverviewPage);
    }

    async doesMenuItemNotExist(page) {
        return !(await new Menu(this.page).doesMenuItemExist(page));
    }

    async doesMenuItemExist(page) {
        return await new Menu(this.page).doesMenuItemExist(page);
    }
    */
}

module.exports = PPCommonPage; 