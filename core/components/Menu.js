const Waiting = require('../constants/Waiting');
const PortalPage = require('../enums/PortalPage');
const DateTime = require('../../utils/DateTime');
const PPCommonPage = require('../base/PPCommonPage');
/**
 * Component class for handling navigation menu interactions in the ParcelPerform application.
 * Manages both main menu and submenu selections with dynamic page routing.
 */
class Menu extends PPCommonPage {
    constructor(page) {
        super(page);
        this.menuItemXpath = "//div[@role='menu' and @data-id='%s']";
        this.subMenuItemXpath = "//div[@role='option' and @data-id='%s']";
    }

    /**
     * Selects a menu item and navigates to the corresponding page.
     * Handles both direct menu items and nested submenu selections.
     * @param {PortalPage} page - PortalPage enum value specifying the destination page
     * @param {Function} targetClass - Constructor of the page to return to
     * @returns {Promise<typeof targetClass>} Instance of the target page class
     */
    async selectMenuItem(page, targetClass) {
        const menuXpath = this.menuItemXpath.replace('%s', page.getMenuDataId());
        await this.click(menuXpath);

        if (page.getSubMenuDataId() && page.getSubMenuDataId().length > 0) {
            const subMenuXpath = this.subMenuItemXpath.replace('%s', page.getSubMenuDataId());
            let tryCount = 0;
            while (!(await this.isElementVisible(subMenuXpath, Waiting.SHORT_WAIT)) && tryCount < 3) {
                await this.click(menuXpath);
                await DateTime.wait(Waiting.SHORT_WAIT);
                tryCount++;
            }
            await this.click(subMenuXpath);
        }

        // await this.waitForPageLoad();
        // await this.waitForElementExist("//ol", Waiting.WAIT_FOR_LOADING);
        return new targetClass(this.page);
    }

    /**
     * Verifies if a menu item exists in the navigation structure.
     * For submenu items, checks both parent menu and submenu existence.
     * @param {PortalPage} page - PortalPage enum value to check for existence
     * @returns {Promise<boolean>} true if the menu item exists, false otherwise
     */
    async doesMenuItemExist(page) {
        const menuXpath = this.menuItemXpath.replace('%s', page.getMenuDataId());
        
        if (page.getSubMenuDataId() && page.getSubMenuDataId().length > 0) {
            await this.click(menuXpath);
            const subMenuXpath = this.subMenuItemXpath.replace('%s', page.getSubMenuDataId());
            return await this.isElementVisible(subMenuXpath);
        }
        
        return await this.isElementVisible(menuXpath);
    }
}

module.exports = Menu; 