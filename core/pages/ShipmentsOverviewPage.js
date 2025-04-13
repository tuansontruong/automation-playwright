const Waiting = require('../constants/Waiting');
const PortalPage = require('../enums/PortalPage');
const PPCommonPage = require('../base/PPCommonPage');
const DateTime = require('../../utils/DateTime');
const ShipmentProperty = require('../enums/ShipmentProperty');
const ShipmentDetailsPage = require('./ShipmentDetailsPage');
// const Dialog = require('../components/Dialog');
// const DropdownList = require('../components/DropdownList');
// const Filter = require('../components/Filter');

/**
 * Page Object class representing the Shipments Overview page of Parcel Perform portal.
 * This page displays a list of parcels/shipments and provides functionality for
 * searching, filtering, adding, and managing parcels.
 */
class ShipmentsOverviewPage extends PPCommonPage {
    constructor(page) {
        super(page);
        // Static locators
        this.btnAddParcels = "//button[text()='Add Parcels']";
        this.btnUploadFile = "//input[@type='file']";
        this.btnAddParcel = "//div[contains(@class,'TabPanels')]//button[contains(@class,'primary')]";
        this.txtSearch = "//input[@name='baseInput']";
        this.btnSearch = "//div[contains(@class,'SearchField')]//button";
        this.lblFileIsBeingProcessed = "//h4[text()='Your file is being processed!']";
        this.txtTrackingId = "//div[label[text()='Parcel ID']]//input";
        this.drdCarrier = "//div[label[text()='Carrier']]//div[contains(@class,'ppSelect')]";
        this.lblBeingAddedParcel = "//h4[text()='Your parcels are being added!']";
        this.btnOpenOverflowMenu = "//div[@class='target']/button";
        this.lblSelectedColumn = "(//div[contains(@class,'ColumnItem')])";
        this.btnRemoveFilter = "//div[contains(@class,'filterItemContainer')]//span[contains(@class,'closeBtn')]";
        this.tblParcelOverview = "//table";
        this.lblQuantityParcels = "//div[starts-with(@class,'ppPad__s')]//div[contains(@class,'ppTextAlg')]/span[1]";
        this.btnExport = "//button[text()='Export']";
        this.btnArchive = "//button[text()='Archive']";

        // Dynamic locators
        this.lblTabItem = "//div[@role='tab' and normalize-space()='%s']";
        this.lblUploadParcelName = "//strong[text()='%s']";
        this.dynamicCellItem = "//table/tbody/tr[1]/td[count(//th[div[normalize-space()='%s']]/preceding-sibling::th)+1 and normalize-space()='%s']";
        this.btnExtentMenu = "//div[contains(@class,'ppClickable') and normalize-space()='%s']";
        this.chkColumnWithLabel = "//label[normalize-space()='%s']//input[@type='checkbox']";
        this.btnAddSpecificColumnWithLabel = "//span[normalize-space()='%s']/following-sibling::p[text()='Add']";
        this.lblDisplayDensityMode = "//ul[contains(@class,'densityContainer')]//li[text()='%s']";
        this.lblParcelStatus = "//tr[%s]//div[contains(@class,'StatusLabel')]/span";
        this.lblParcelIssue = "//tr[%s]/td[%s]//span[@title]";
        this.chkTypeExport = "//span[contains(text(),'%s')]";
        this.icoRatingStar = "//tbody/tr[%s]//td[%s]//div[contains(@class,'PpRating')]/span/span[contains(@class,'fullStarIcon')]";
        this.icoTooltip = "//tbody/tr[%s]//td[%s]//*[name()='svg']";
        this.lblAddParcelsTab = "//li[contains(@class,'Tabs') and normalize-space()='%s']";

        this.waitForPageLoad();
        // this.waitForElementExist(this.tblParcelOverview, Waiting.WAIT_FOR_LOADING);
    }

    /**
     * Checks if the Add Parcel button exists on the page
     * @returns {Promise<boolean>} true if the Add Parcel button exists
     */
    async doesAddParcelExist() {
        return await this.isElementVisible(this.btnAddParcels);
    }

    /**
     * Checks if the Add Parcel button does not exist on the page
     * @returns {Promise<boolean>} true if the Add Parcel button does not exist
     */
    async doesAddParcelNotExist() {
        return await this.isElementNotPresent(this.btnAddParcels);
    }

    /**
     * Verifies if the Shipments Overview page is properly displayed
     * @returns {Promise<boolean>} true if the page is displayed correctly
     */
    async isDisplayed() {
        let result = await this.isPageHeader(PortalPage.SHIPMENTS_OVERVIEW);
        
        // Check Filter and Search tabs
        result = result && await this.isElementVisible(this.lblTabItem.replace('%s', 'Filter'));
        result = result && await this.isElementVisible(this.lblTabItem.replace('%s', 'Search'));
        
        // Check default bookmarks
        result = result && await this.doesBookMarkExist(BookMark.RECENTLY_ADDED);
        result = result && await this.doesBookMarkExist(BookMark.RECIPIENT);
        result = result && await this.doesBookMarkExist(BookMark.DELIVERED_PARCELS);
        result = result && await this.doesBookMarkExist(BookMark.ACTIVE_PARCELS);
        result = result && await this.doesBookMarkExist(BookMark.PENDING_PARCELS);
        result = result && await this.doesBookMarkExist(BookMark.PARCELS_WITH_ISSUE);
        
        // Check other elements
        result = result && await this.isElementVisible(this.btnAddParcels);
        result = result && await this.isElementVisible(this.btnOpenOverflowMenu);
        result = result && await this.isElementVisible(this.txtSearch);
        result = result && await this.isElementVisible(this.tblParcelOverview);
        
        return result;
    }

    /**
     * Checks if a specific bookmark exists
     * @param {BookMark} bookMark - The bookmark to check
     * @returns {Promise<boolean>} true if the bookmark exists
     */
    async doesBookMarkExist(bookMark) {
        return await this.isElementVisible(`//div[./span[text()='${bookMark.getName()}']]`);
    }

    /**
     * Clicks the Add Parcels button
     * @returns {Promise<ShipmentsOverviewPage>} this instance
     */
    async clickAddParcelsButton() {
        await this.click(this.btnAddParcels);
        return this;
    }

    /**
     * Selects a specific tab in the Add Parcels dialog
     * @param {AddParcelType} tabName - The type of tab to select
     */
    async selectAddParcelsTab(tabName) {
        await this.click(this.lblAddParcelsTab.replace('%s', tabName.getType()));
        await this.waitForElementPropertyContains(
            this.lblAddParcelsTab.replace('%s', tabName.getType()),
            'class',
            'selected'
        );
    }

    // /**
    //  * Uploads parcels using a CSV file
    //  * @param {string} filePath - Path to the CSV file
    //  * @returns {Promise<ShipmentsOverviewPage>} this instance
    //  */
    // async uploadParcelsByCsv(filePath) {
    //     const path = require('path');
    //     const fileName = path.basename(filePath);
        
    //     await this.selectAddParcelsTab(AddParcelType.FILE_UPLOAD);
    //     await this.uploadFiles(this.btnUploadFile, [filePath]);
    //     await this.waitForUploadParcelSuccess(fileName);
    //     await this.click(this.btnAddParcel);
    //     await this.waitForElementExist(this.lblFileIsBeingProcessed);
    //     return this;
    // }

    /**
     * Waits for a file upload to complete successfully
     * @param {string} fileName - Name of the uploaded file
     */
    async waitForUploadParcelSuccess(fileName) {
        await this.waitForElementExist(this.lblUploadParcelName.replace('%s', fileName));
    }

    /**
     * Adds parcels by uploading a CSV file
     * @param {string} filePath - Path to the CSV file
     * @returns {Promise<ShipmentsOverviewPage>} this instance
     */
    // async addParcelsByCsv(filePath) {
    //     await this.clickAddParcelsButton();
    //     await this.uploadParcelsByCsv(filePath);
    //     return await new Dialog().close(ShipmentsOverviewPage);
    // }

    /**
     * Searches for a parcel using the search field
     * @param {string} searchValue - Value to search for
     * @returns {Promise<ShipmentsOverviewPage>} this instance
     */
    async searchParcel(searchValue) {
        await this.selectSearchTab();
        await this.setText(this.txtSearch, searchValue);
        // First click the input to ensure it's focused
        await this.page.locator(this.txtSearch).click();
        // Then press Enter key
        await this.pressKey('Enter');
        await this.waitForPageLoad();
        return this;
    }

    /**
     * Waits for a parcel to be displayed in the shipments table
     * @param {ShipmentProperty} columnName - The column to check
     * @param {string} searchValue - The value to search for
     * @param {number} timeout - Maximum time to wait in milliseconds
     * @returns {Promise<ShipmentsOverviewPage>} this instance
     */
    async waitForParcelDisplays(columnName, searchValue, timeout) {
        let count = 0;
        await this.searchParcel(searchValue);
        
        while (!(await this.isElementVisible(
            this.dynamicCellItem.replace('%s', columnName.getProperty()).replace('%s', searchValue),
            Waiting.MEDIUM_WAIT
        ))) {
            await DateTime.wait(Waiting.MEDIUM_WAIT);
            await this.pressKey(this.txtSearch, 'Enter');
            await this.waitForPageLoad();
            count += Waiting.MEDIUM_WAIT;
            
            if (count > timeout) {
                throw new Error(`Parcel with property ${columnName} having the value ${searchValue} is not displayed after ${timeout} milliseconds`);
            }
        }
        return this;
    }

    /**
     * Opens the shipment details page for a specific parcel
     * @param {ShipmentProperty} shipmentProperty - The property to identify the parcel
     * @param {string} searchValue - The value to search for
     * @returns {Promise<ShipmentDetailsPage>} New instance of ShipmentDetailsPage
     */
    async openParcelDetailsByProperty(shipmentProperty, searchValue) {
        await this.click(this.dynamicCellItem.replace('%s', shipmentProperty).replace('%s', searchValue));
        await this.waitForElementVisible("//div[contains(@id,'pp-atum-slidein-sections')]");
        // await this.waitForElementVisible("//div[contains(@id,'trackingDetails')]");
        return new ShipmentDetailsPage(this.page);
    }

    async openParcelDetails(parcelId) {
        const searchParcel = await this.searchParcel(parcelId);
        const openParcelDetails = await searchParcel.openParcelDetailsByProperty(ShipmentProperty.PARCEL_ID, parcelId);
        return openParcelDetails.waitForShipmentDetailsLoadingSuccessfully();
    }

    // /**
    //  * Adds a single parcel with tracking ID and carrier
    //  * @param {string} trackingId - The tracking ID of the parcel
    //  * @param {string} carrierReference - The carrier reference
    //  * @returns {Promise<ShipmentsOverviewPage>} this instance
    //  */
    // async addSingleParcel(trackingId, carrierReference) {
    //     await this.clickAddParcelsButton();
    //     await this.selectAddParcelsTab(AddParcelType.SINGLE_PARCEL);
    //     await this.setText(this.txtTrackingId, trackingId);
        
    //     if (carrierReference !== '<ignore>') {
    //         await new DropdownList().selectReactSearchDropdownValueContain(
    //             this.drdCarrier,
    //             `(${carrierReference})`
    //         );
    //     }
        
    //     await this.click(this.btnAddParcel);
    //     await this.waitForElementExist(this.lblBeingAddedParcel);
    //     return await new Dialog().close(ShipmentsOverviewPage);
    // }

    /**
     * Selects an item from the overflow menu
     * @param {ShipmentOverviewExtentMenu} menu - The menu item to select
     */
    async selectExtentMenu(menu) {
        await this.click(this.btnOpenOverflowMenu);
        await this.click(this.btnExtentMenu.replace('%s', menu.getMenu()));
    }

    /**
     * Opens the Edit Columns dialog
     * @returns {Promise<ShipmentsOverviewPage>} this instance
     */
    async openEditColumns() {
        await this.selectExtentMenu(ShipmentOverviewExtentMenu.EDIT_COLUMNS);
        return this;
    }

    /**
     * Removes all currently selected columns
     * @returns {Promise<ShipmentsOverviewPage>} this instance
     */
    async removeOldColumns() {
        await this.waitForPageLoad();
        await this.waitForElementExist(this.lblSelectedColumn, false);
        
        const columnCount = await this.getPage().querySelectorAll(this.lblSelectedColumn).length;
        for (let i = columnCount; i > 0; i--) {
            await this.hover(`${this.lblSelectedColumn}[${i}]`);
            await this.click(`${this.lblSelectedColumn}[${i}]//button`);
        }
        return this;
    }

    /**
     * Adds columns to the shipments table
     * @param {Array<ShipmentProperty>} listColumns - List of columns to add
     * @param {boolean} removeOldColumns - Whether to remove existing columns
     * @returns {Promise<ShipmentsOverviewPage>} this instance
     */
    async addColumns(listColumns, removeOldColumns) {
        await this.openEditColumns();
        await this.clearText(this.txtSearchInput);
        
        if (removeOldColumns) {
            await this.removeOldColumns();
        }
        
        for (const column of listColumns) {
            await this.setText(this.txtSearchInput, column.getProperty());
            await this.checkElement(this.chkColumnWithLabel.replace('%s', column.getProperty()));
        }
        
        await this.click(this.btnConfirm);
        await this.waitForElementStage(this.btnConfirm, WaitForSelectorState.DETACHED, Waiting.WAIT_FOR_ELEMENT);
        return this;
    }

    /**
     * Selects a tab in the shipments overview page
     * @param {string} tabName - Name of the tab to select
     */
    async selectTab(tabName) {
        await this.click(this.lblTabItem.replace('%s', tabName));
    }

    /**
     * Selects the Filter tab
     */
    async selectFilterTab() {
        await this.selectTab('Filter');
    }

    /**
     * Selects the Search tab
     * @returns {Promise<ShipmentsOverviewPage>} this instance
     */
    async selectSearchTab() {
        await this.selectTab('Search');
        return this;
    }

    /**
     * Removes all active filters
     * @returns {Promise<ShipmentsOverviewPage>} this instance
     */
    async removeAllFilters() {
        while ((await this.getPage().querySelectorAll(this.btnRemoveFilter)).length > 0) {
            await this.click(this.btnRemoveFilter, false);
        }
        return this;
    }

    // /**
    //  * Adds a new filter to the shipments overview page
    //  * @param {ShipmentProperty} filterType - The type of filter to add
    //  * @param {Array<string>} filterValue - The values for the filter
    //  * @returns {Promise<ShipmentsOverviewPage>} this instance
    //  */
    // async addNewFilter(filterType, filterValue) {
    //     await this.selectFilterTab();
    //     return await new Filter().clickAddFilter().addFilter(filterType, filterValue, ShipmentsOverviewPage);
    // }

    // /**
    //  * Updates an existing filter with new values
    //  * @param {ShipmentProperty} filterType - The type of filter to update
    //  * @param {Array<string>} filterValue - The new values for the filter
    //  * @returns {Promise<ShipmentsOverviewPage>} this instance
    //  */
    // async updateExistingFilter(filterType, filterValue) {
    //     Reports.logKeywordName();
    //     await this.selectFilterTab();
    //     return await new Filter().updateFilter(filterType, filterValue, ShipmentsOverviewPage);
    // }

    /**
     * Configures the display density of the shipments table
     * @param {DisplayDensityMode} mode - The display density mode to set
     * @returns {Promise<ShipmentsOverviewPage>} this instance
     */
    async configureDisplayDensity(mode) {
        await this.selectExtentMenu(ShipmentOverviewExtentMenu.DISPLAY_DENSITY);
        await this.click(this.lblDisplayDensityMode.replace('%s', mode.getMode()));
        return this;
    }

    /**
     * Gets the number of parcels currently displayed
     * @returns {Promise<string>} The number of parcels
     */
    async getNumberOfParcels() {
        return await this.getText(this.lblQuantityParcels);
    }

    /**
     * Checks if the shipments table does not exist
     * @returns {Promise<boolean>} true if the table does not exist
     */
    async doesShipmentTableNotExist() {
        return await this.isElementNotPresent(this.tblParcelOverview);
    }

    /**
     * Checks if a parcel has all the expected tags
     * @param {string} parcelId - The ID of the parcel
     * @param {Array<string>} listExpectedTags - List of expected tags
     * @returns {Promise<boolean>} true if all expected tags exist
     */
    async doesTagExists(parcelId, listExpectedTags) {
        const tags = await this.getTableCellValue(
            this.tblParcelOverview,
            await this.getTableColumnIndex(this.tblParcelOverview, ShipmentProperty.ALL_TAGS.getProperty()),
            await this.getTableRowIndex(this.tblParcelOverview, ShipmentProperty.PARCEL_ID.getProperty(), parcelId)
        );
        
        const currentTags = tags.split(',');
        return listExpectedTags.every(expectedTag => currentTags.includes(expectedTag));
    }

    // ... More methods to be added ...
}

module.exports = ShipmentsOverviewPage; 