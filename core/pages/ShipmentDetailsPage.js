// TODO: Uncomment and implement these imports when available

const PPCommonPage = require("../base/PPCommonPage");
const DateTime = require("../../utils/DateTime");
const Waiting = require("../constants/Waiting");
// const ShipmentsOverviewPage = require("./ShipmentsOverviewPage");
const ShipmentDetailsSection = require("../enums/ShipmentDetailsSection");

/**
 * Page Object Model class representing the Shipment Details page in the ParcelPerform Portal.
 * This class provides methods to interact with and validate various elements on the shipment details page
 * including tracking details, customer data, line items, notifications, and other shipment-related information.
 */
class ShipmentDetailsPage extends PPCommonPage {
	constructor(page) {
		super(page);
		// Static locators
		this.btnCopyTrackingURL = "//div[@class='tracking-url-copy']//button";
		this.iconEDDDescription =
			"//div[./div[text()='Source: %s']]//span[@data-testid='edd-description']/*[local-name()='svg']";
		this.btnUpdateParcel = "//button[span[text()='Update']]";

		// Dynamic locators
		this.lblParcelDetailsSection = "//div[text()='%s']";
		this.lblEventWithTimeAndLocation =
			"//span[contains(@data-testid,'time') and normalize-space()='%s']/parent::div/following-sibling::div[//span[contains(@data-testid,'displayName') and normalize-space()='%s'] and //div[contains(@data-testid,'location') and normalize-space()='%s']]";
		this.lblProgressIndicator =
			"//div[./*[local-name()='svg']/*[local-name()='g' and @fill-rule='evenodd']]/following-sibling::span[text()='%s']";
		this.lblIssueMessage =
			"//div[@aria-label='issue-message']/span[text()='%s']";
		this.iconEventIssue = `${this.lblEventWithTimeAndLocation}//span[contains(@data-testid,'event-issue-tooltip')]`;
		this.lblParcelDetailsLabel = "//*[normalize-space()='%s']";
		this.lblParcelDetailsWithValue = `${this.lblParcelDetailsLabel}/parent::*//div[normalize-space()='%s']`;
		this.trNotificationItemWithStatus =
			"//div[@id='notifications']//table//tr[.//td[.='%s'] and ./td[./img[contains(@alt,'channel: %s')]] and ./td[./img[contains(@alt,'status: %s')]]]";
		this.btnEditSection = `${this.lblParcelDetailsSection}/parent::div/following-sibling::div/button`;
		
	}

	/**
	 * Scrolls to a specific section in the shipment details page.
	 * @param {string} section - The section to scroll to
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	scrollToShipmentDetailsSection(section) {
		this.scrollToView(this.lblParcelDetailsSection.replace("%s", section));
		return this;
	}

	/**
	 * Copies the tracking URL to clipboard.
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	copyTrackingURL() {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.click(this.btnCopyTrackingURL);
		return this;
	}

	/**
	 * Verifies the behavior of the copy tracking URL functionality.
	 * @returns {boolean} - true if the copy behavior works as expected, false otherwise
	 */
	doesCopyTrackingURLBehavior() {
		const messageCopiedSuccessfully =
			"//span[@aria-label='copied-message' and text()='Link copied!']";
		this.copyTrackingURL();
		let result = this.isElementVisible(messageCopiedSuccessfully);
		result = result && this.isElementNotPresent(this.btnCopyTrackingURL);
		DateTime.wait(Waiting.MEDIUM_WAIT);
		result = result && this.isElementNotPresent(messageCopiedSuccessfully);
		result = result && this.isElementVisible(this.btnCopyTrackingURL);
		return result;
	}

	/**
	 * Edits the notes section of the shipment details.
	 * @param {string} notes - The new notes text to be added
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	editNotes(notes) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.scrollToShipmentDetailsSection("NOTES");
		const txtEditNotes = "//textarea[@name='parcelNote']";
		this.clearText(txtEditNotes);
		this.setText(txtEditNotes, notes);
		return this;
	}

	/**
	 * Checks if a specific event exists in the tracking timeline.
	 * @param {string} event - The event text to check for
	 * @returns {boolean} - true if the event exists, false otherwise
	 */
	doesEventExist(event) {
		const lblOnlyEvent =
			"//span[contains(@data-testid,'tracking-details-event') and normalize-space(text())='%s']";
		return this.isElementVisible(lblOnlyEvent.replace("%s", event));
	}

	/**
	 * Checks if a specific event with time exists in the tracking timeline.
	 * @param {string} event - The event text to check for
	 * @param {string} time - The time of the event
	 * @returns {boolean} - true if the event exists with the specified time, false otherwise
	 */
	doesEventExistWithTime(event, time) {
		const lblEventWithTime =
			"//span[contains(@data-testid,'time') and normalize-space()='%s']/ancestor::div[contains(@data-testid,'tracking-details-event')]//span[contains(@data-testid,'displayName') and normalize-space()='%s']";
		return this.isElementVisible(
			lblEventWithTime.replace("%s", time).replace("%s", event),
		);
	}

	/**
	 * Checks if a specific event with time and location exists in the tracking timeline.
	 * @param {string} event - The event text to check for
	 * @param {string} time - The time of the event
	 * @param {string} eventLocation - The location of the event
	 * @returns {boolean} - true if the event exists with the specified time and location, false otherwise
	 */
	doesEventExistWithTimeAndLocation(event, time, eventLocation) {
		return this.isElementVisible(
			this.lblEventWithTimeAndLocation
				.replace("%s", time)
				.replace("%s", event)
				.replace("%s", eventLocation),
		);
	}

	/**
	 * Checks if the shipment has a specific status.
	 * @param {string} status - The status to check for
	 * @returns {boolean} - true if the shipment has the specified status, false otherwise
	 */
	isShipmentStatus(status) {
		const lblShipmentStatus =
			"//div[starts-with(@class,'SlideIn')]//div[contains(@class,'StatusLabel-module_spacious')]//span";
		return this.getText(lblShipmentStatus).includes(status);
	}

	/**
	 * Checks if a specific progress indicator exists.
	 * @param {string} progressIndicator - The progress indicator to check for
	 * @returns {boolean} - true if the progress indicator exists, false otherwise
	 */
	doesProgressIndicatorExist(progressIndicator) {
		return this.isElementVisible(
			this.lblProgressIndicator.replace("%s", progressIndicator),
		);
	}

	/**
	 * Checks if a specific progress indicator does not exist.
	 * @param {string} progressIndicator - The progress indicator to check for
	 * @returns {boolean} - true if the progress indicator does not exist, false otherwise
	 */
	doesProgressIndicatorNotExist(progressIndicator) {
		return this.isElementNotVisible(
			this.lblProgressIndicator.replace("%s", progressIndicator),
		);
	}

	/**
	 * Checks if a specific issue message is displayed.
	 * @param {string} message - The issue message to check for
	 * @returns {boolean} - true if the issue message is displayed, false otherwise
	 */
	doesIssueMessageDisplay(message) {
		return this.isElementVisible(this.lblIssueMessage.replace("%s", message));
	}

	/**
	 * Checks if a specific issue message is not displayed.
	 * @param {string} message - The issue message to check for
	 * @returns {boolean} - true if the issue message is not displayed, false otherwise
	 */
	doesIssueMessageNotDisplay(message) {
		return this.isElementNotVisible(
			this.lblIssueMessage.replace("%s", message),
		);
	}

	/**
	 * Checks if an issue icon is displayed for a specific event.
	 * @param {string} eventTime - The time of the event
	 * @param {string} eventName - The name of the event
	 * @param {string} eventLocation - The location of the event
	 * @returns {boolean} - true if the issue icon is displayed, false otherwise
	 */
	doesEventIssueIconDisplays(eventTime, eventName, eventLocation) {
		return this.isElementVisible(
			this.iconEventIssue
				.replace("%s", eventTime)
				.replace("%s", eventName)
				.replace("%s", eventLocation),
		);
	}

	/**
	 * Hovers over the issue icon for a specific event.
	 * @param {string} eventTime - The time of the event
	 * @param {string} eventName - The name of the event
	 * @param {string} eventLocation - The location of the event
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	hoverOnEventIssueIcon(eventTime, eventName, eventLocation) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.hover(
			this.iconEventIssue
				.replace("%s", eventTime)
				.replace("%s", eventName)
				.replace("%s", eventLocation),
		);
		return this;
	}

	/**
	 * Checks if a specific issue tooltip is displayed.
	 * @param {string} tooltip - The tooltip text to check for
	 * @returns {boolean} - true if the tooltip is displayed, false otherwise
	 */
	doesEventIssueTooltipDisplay(tooltip) {
		const lblEventIssueTooltip =
			"//div[contains(@class,'Tooltip') and normalize-space()='%s']";
		return this.isElementVisible(lblEventIssueTooltip.replace("%s", tooltip));
	}

	/**
	 * Checks if a specific shipment details field exists with a given value.
	 * @param {string} label - The field label
	 * @param {string} value - The expected value
	 * @returns {boolean} - true if the field exists with the specified value, false otherwise
	 */
	doesShipmentDetailsFieldExist(label, value) {
		return this.isElementVisible(
			this.lblParcelDetailsWithValue.replace("%s", label).replace("%s", value),
		);
	}

	/**
	 * Checks if a specific shipment details field does not exist.
	 * @param {string} label - The field label
	 * @returns {boolean} - true if the field does not exist, false otherwise
	 */
	doesShipmentDetailsFieldNotExist(label) {
		return this.isElementNotVisible(
			this.lblParcelDetailsLabel.replace("%s", label),
		);
	}

	/**
	 * Checks if the shipment on-time status icon is displayed.
	 * @param {string} icon - The icon type
	 * @returns {boolean} - true if the status icon is displayed, false otherwise
	 */
	doesShipmentOnTimeStatusDisplay(icon) {
		const iconShipmentOnTimeStatus = `//div[div[text()='On Time']]//*[local-name()='svg' and ./*[local-name()='path' and @d='${icon}']]`;
		return this.isElementVisible(iconShipmentOnTimeStatus);
	}

	/**
	 * Gets the tooltip content when hovering over the shipment on-time status.
	 * @returns {string} - The tooltip content text
	 */
	getOnShipmentOnTimeToolTip() {
		const iconShipmentOnTime =
			"//div[div[text()='On Time']]//*[local-name()='svg']";
		this.hover(iconShipmentOnTime);
		// TODO: Uncomment when ToolTip is available
		// return new ToolTip().getToolTipContent();
		return "";
	}

	/**
	 * Checks if a specific shipment details field exists within a section.
	 * @param {string} section - The section name
	 * @param {string} label - The field label
	 * @param {string} value - The expected value
	 * @returns {boolean} - true if the field exists with the specified value in the section, false otherwise
	 */
	doesShipmentDetailsFieldExistInSection(section, label, value) {
		const lblParcelDetailsByLabelInSection = `//div[normalize-space()='%s']/following-sibling::div${this.lblParcelDetailsWithValue}`;
		return this.isElementVisible(
			lblParcelDetailsByLabelInSection
				.replace("%s", section)
				.replace("%s", label)
				.replace("%s", value),
		);
	}

	/**
	 * Closes the shipment details slide-out panel.
	 * @returns {ShipmentsOverviewPage} - A new instance of ShipmentsOverviewPage
	 */
	closeShipmentDetails() {
		// TODO: Uncomment when Reports and SlideOut are available
		// Reports.logKeywordName();
		// return new SlideOut().closeSlideOut(ShipmentsOverviewPage);
		return null;
	}

	/**
	 * Updates the parcel information.
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	updateParcel() {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.click(this.btnUpdateParcel);
		return this;
	}

	/**
	 * Checks if a section can be edited.
	 * @param {string} section - The section to check
	 * @returns {boolean} - true if the section can be edited, false otherwise
	 */
	canEditSection(section) {
		this.scrollToShipmentDetailsSection(section);
		return this.isElementVisible(this.btnEditSection.replace("%s", section));
	}

	/**
	 * Opens the edit mode for a specific section.
	 * @param {string} section - The section to edit
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	openEditSection(section) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.scrollToShipmentDetailsSection(section);
		this.click(this.btnEditSection.replace("%s", section));
		return this;
	}

	/**
	 * Saves the changes made to a specific section.
	 * @param {string} section - The section being edited
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	saveEditSection(section) {
		this.scrollToShipmentDetailsSection(section);
		const btnSaveSection = `${this.lblParcelDetailsSection}/parent::div/following-sibling::div${this.btnSave}`;
		this.click(btnSaveSection.replace("%s", section));
		this.waitForElementExist(this.btnEditSection.replace("%s", section));
		DateTime.wait(Waiting.SHORT_WAIT);
		return this;
	}

	/**
	 * Edits notification settings by adding email and phone numbers.
	 * @param {string[]} emails - List of email addresses to add
	 * @param {string[]} phones - List of phone numbers to add
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	editNotification(emails, phones) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.scrollToShipmentDetailsSection("RATING");
		for (const email of emails) {
			const txtNotificationEmail = "//input[@aria-label='new email input']";
			this.typeValue(txtNotificationEmail, email);
			this.pressKey("Enter");
		}
		for (const phone of phones) {
			const txtNotificationPhone = "//input[@aria-label='new phone input']";
			this.typeValue(txtNotificationPhone, phone);
			this.pressKey("Enter");
		}
		return this;
	}

	/**
	 * Checks if a notification exists with specific parameters.
	 * @param {string} notificationName - The name of the notification
	 * @param {string} channel - The notification channel
	 * @param {string} status - The notification status
	 * @returns {boolean} - true if the notification exists with the specified parameters, false otherwise
	 */
	doesNotificationExist(notificationName, channel, status) {
		return this.isElementVisible(
			this.trNotificationItemWithStatus
				.replace("%s", notificationName)
				.replace("%s", channel.toLowerCase())
				.replace("%s", status),
		);
	}

	/**
	 * Checks if a notification exists with a specific creation date.
	 * @param {string} notificationName - The name of the notification
	 * @param {string} channel - The notification channel
	 * @param {string} createdDate - The creation date to check for
	 * @returns {boolean} - true if the notification exists with the specified parameters, false otherwise
	 */
	doesNotificationExistWithDate(notificationName, channel, createdDate) {
		const trNotificationItemWithTime =
			'//div[@id="notifications"]//table/tbody/tr[td/img[contains(@alt,"%s\'s channel: %s")] and td//span[normalize-space()="%s"]]';
		return this.isElementVisible(
			trNotificationItemWithTime
				.replace("%s", notificationName)
				.replace("%s", channel.toLowerCase())
				.replace("%s", createdDate),
		);
	}

	/**
	 * Counts the number of notifications matching specific criteria.
	 * @param {string} notificationName - The name of the notification
	 * @param {string} channel - The notification channel
	 * @param {string} status - The notification status
	 * @returns {number} - The number of matching notifications
	 */
	countNumberOfNotification(notificationName, channel, status) {
		return this.page.querySelectorAll(
			this.trNotificationItemWithStatus
				.replace("%s", notificationName)
				.replace("%s", channel.toLowerCase())
				.replace("%s", status),
		).length;
	}

	/**
	 * Removes specified notifications from the list.
	 * @param {string[]} notificationList - List of notification names to remove
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	removeNotificationInfo(notificationList) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		const btnRemoveNotificationInfo =
			"//div[@id='notifications']//div[normalize-space()='%s']//span[@role='presentation']/*[local-name()='svg']";
		this.scrollToShipmentDetailsSection("RATING");
		for (const notification of notificationList) {
			this.click(btnRemoveNotificationInfo.replace("%s", notification));
		}
		return this;
	}

	/**
	 * Edits an existing custom field's data.
	 * @param {string} fieldName - The name of the custom field
	 * @param {string} fieldValue - The new value for the custom field
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	editCustomFieldData(fieldName, fieldValue) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.setText(
			`//input[@aria-label='parcel custom field ${fieldName} input']`,
			fieldValue,
		);
		return this;
	}

	/**
	 * Adds a new custom field with data.
	 * @param {string} fieldName - The name of the new custom field
	 * @param {string} fieldValue - The value for the new custom field
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	addCustomFieldData(fieldName, fieldValue) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		const txtCustomFieldName = "//input[@aria-label='new custom field input']";
		this.setText(txtCustomFieldName, fieldName);
		const btnEnterCustomField = `${txtCustomFieldName}/following-sibling::div/button`;
		this.click(btnEnterCustomField);
		this.editCustomFieldData(fieldName, fieldValue);
		return this;
	}

	/**
	 * Removes a custom field.
	 * @param {string} fieldName - The name of the custom field to remove
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	removeCustomField(fieldName) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.click(
			`//div[./input[@aria-label='parcel custom field ${fieldName} input']]/following-sibling::button`,
		);
		return this;
	}

	/**
	 * Checks if a field does not exist.
	 * @param {string} label - The label of the field to check
	 * @returns {boolean} - true if the field does not exist, false otherwise
	 */
	doesFieldNotExist(label) {
		const locator = `//div[contains(@class,'fieldLabel') and text()='${label}']/following-sibling::div//span | //div[text()='${label}']/following-sibling::span`;
		return this.isElementNotPresent(locator);
	}

	/**
	 * Checks if an editing field does not exist.
	 * @param {string} field - The field to check
	 * @returns {boolean} - true if the editing field does not exist, false otherwise
	 */
	doesEditingFieldNotExist(field) {
		return this.isElementNotPresent(field);
	}

	/**
	 * Adds tags to a parcel.
	 * @param {string[]} tags - List of tags to add
	 * @param {string} pressButton - The button to press for adding each tag ("Enter" or "Tab")
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	addTags(tags, pressButton) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		for (const tag of tags) {
			const txtInputTag =
				"//div[@id='tags']//input[@id='react-select-2-input']";
			this.click(txtInputTag);
			this.typeValue(txtInputTag, tag);
			this.pressKey(pressButton);
		}
		return this;
	}

	/**
	 * Checks if a line item exists with specific details.
	 * @param {string} productName - The name of the product
	 * @param {string} productId - The ID of the product
	 * @param {number} quantity - The quantity of the product
	 * @param {string} totalPrice - The total price of the line item
	 * @returns {boolean} - true if the line item exists with the specified details, false otherwise
	 */
	doesLineItemExist(productName, productId, quantity, totalPrice) {
		const lineItemXpath = `//div[./div[contains(@class,'tableBody') and ./div[text()='${productName}'] and ./div[normalize-space()='ID: ${productId}']] and ./div[normalize-space()='${quantity}'] and ./div[normalize-space()='${totalPrice}']]`;
		return this.isElementVisible(lineItemXpath);
	}

	/**
	 * Checks if a line item exists with specific details (without price).
	 * @param {string} productName - The name of the product
	 * @param {string} productId - The ID of the product
	 * @param {number} quantity - The quantity of the product
	 * @returns {boolean} - true if the line item exists with the specified details, false otherwise
	 */
	doesLineItemExistWithoutPrice(productName, productId, quantity) {
		return this.doesLineItemExist(productName, productId, quantity, "");
	}

	/**
	 * Checks if a line item exists with specific details (default quantity).
	 * @param {string} productName - The name of the product
	 * @param {string} productId - The ID of the product
	 * @returns {boolean} - true if the line item exists with the specified details, false otherwise
	 */
	doesLineItemExistWithDefaultQuantity(productName, productId) {
		return this.doesLineItemExist(productName, productId, 1, "");
	}

	/**
	 * Checks if a line item exists by product name only.
	 * @param {string} productName - The name of the product
	 * @returns {boolean} - true if the line item exists, false otherwise
	 */
	doesLineItemExistByName(productName) {
		const lineItemXpath = `//div[contains(@class,'tableBodyCell') and ./div[text()='${productName}']]`;
		return this.isElementVisible(lineItemXpath);
	}

	/**
	 * Checks if a line item is expanded.
	 * @param {string} productName - The name of the product
	 * @returns {boolean} - true if the line item is expanded, false otherwise
	 */
	isLineItemExpanded(productName) {
		const xpath = `//div[contains(@class,'CollapsableTable-module_collapsableContainer') and //span[text()='${productName}']]`;
		return this.isElementVisible(xpath);
	}

	/**
	 * Expands a line item's details.
	 * @param {string} productName - The name of the product
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	expandLineItem(productName) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		if (!this.isLineItemExpanded(productName)) {
			this.click(`//div[text()='${productName}']`);
		}
		return this;
	}

	/**
	 * Shows more line items in the list.
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	showMoreLineItems() {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		const showMoreButton = "//div[@id='lineItems']//button[text()='Show more']";
		this.click(showMoreButton);
		return this;
	}

	/**
	 * Shows fewer line items in the list.
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	showLessLineItem() {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		const showLessButton = "//div[@id='lineItems']//button[text()='Show less']";
		this.click(showLessButton);
		return this;
	}

	/**
	 * Gets line item detail by label.
	 * @param {string} productName - The name of the product
	 * @param {string} label - The label
	 * @param {string} additionalHeader - Additional header information
	 * @returns {string} - The line item detail value
	 */
	getLineItemDetailByLabel(productName, label, additionalHeader) {
		const lblLineItemPropertyXpath =
			label === "ADDITIONAL_INFO" && additionalHeader !== "<ignore>"
				? `${label.getFieldContainer().replace("%s", additionalHeader)}${label.getFieldValuePath()}`
				: `${label.getFieldContainer().replace("%s", label)}${label.getFieldValuePath()}`;
		return productName !== "<ignore>"
			? this.getText(
					`${label.getLineItemContainer().replace("%s", productName)}${lblLineItemPropertyXpath}`,
				)
			: this.getText(lblLineItemPropertyXpath);
	}

	/**
	 * Gets line item detail by label (without additional header).
	 * @param {string} productName - The name of the product
	 * @param {string} label - The label
	 * @returns {string} - The line item detail value
	 */
	getLineItemDetailByLabelWithoutHeader(productName, label) {
		return this.getLineItemDetailByLabel(productName, label, "<ignore>");
	}

	/**
	 * Gets the source information for a line item detail.
	 * @param {string} productName - The name of the product
	 * @param {string} label - The label
	 * @returns {string} - The source information
	 */
	getLineItemDetailsSource(productName, label) {
		const labelPath =
			label === "WEIGHT_LINE_ITEM"
				? "//span[contains(@class,'module_textTiny')]"
				: "/following-sibling::div//span[contains(@class,'module_textTiny')]";
		return productName !== "<ignore>"
			? this.getText(
					`${label.getLineItemContainer().replace("%s", productName)}${label.getFieldContainer().replace("%s", label)}${labelPath}`,
				)
			: this.getText(
					`${label.getFieldContainer().replace("%s", label)}${labelPath}`,
				);
	}

	/**
	 * Checks if the source information exists for a line item detail.
	 * @param {string} productName - The name of the product
	 * @param {string} label - The label
	 * @returns {boolean} - true if the source information exists, false otherwise
	 */
	doesLineItemDetailSourceExist(productName, label) {
		const labelPath = "//span[contains(@class,'LineItemDetails-module_label')]";
		return productName !== "<ignore>"
			? this.isElementVisible(
					`${label.getLineItemContainer().replace("%s", productName)}${label.getFieldContainer().replace("%s", label)}${labelPath}`,
				)
			: this.isElementVisible(
					`${label.getFieldContainer().replace("%s", label)}${labelPath}`,
				);
	}

	/**
	 * Checks if an active timestamp exists with specific details.
	 * @param {string} timeStone - The timestamp type
	 * @param {string} date - The date to check
	 * @param {string} time - The time to check
	 * @param {string} additionalInfo - Additional information for the timestamp
	 * @returns {boolean} - true if the active timestamp exists with the specified details, false otherwise
	 */
	async doesActiveTimeStoneExist(timeStone, date, time, additionalInfo) {
		let fullTimeStone = timeStone;
		if (additionalInfo) fullTimeStone += ` ${additionalInfo}`;
		const lblTimeStone =
			"//span[contains(@class,'PpStepIcon') and contains(@class,'active')]/following-sibling::span[text()='%s']/parent::div/following-sibling::span/span[1][text()='%s']/following-sibling::span[text()='%s']";
		return await this.isElementVisible(
			lblTimeStone
				.replace("%s", fullTimeStone)
				.replace("%s", date)
				.replace("%s", time),
		);
	}

	/**
	 * Checks if an active timestamp exists (without additional info).
	 * @param {string} timeStone - The timestamp type
	 * @param {string} date - The date to check
	 * @param {string} time - The time to check
	 * @returns {boolean} - true if the active timestamp exists with the specified details, false otherwise
	 */
	doesActiveTimeStoneExistWithoutInfo(timeStone, date, time) {
		return this.doesActiveTimeStoneExist(timeStone, date, time, null);
	}

	/**
	 * Checks if additional timestamps exist.
	 * @param {string} additionalLabel - The label of the additional timestamp
	 * @param {string} value - The value to check
	 * @returns {boolean} - true if the additional timestamp exists, false otherwise
	 */
	doesAdditionalTimestampsExist(additionalLabel, value) {
		const additionalTimeStampXpath = `//div[./span[text()='${additionalLabel}:'] and ./span[normalize-space()='${value}']]`;
		return this.isElementVisible(additionalTimeStampXpath);
	}

	/**
	 * Hovers over the information icon for a line item.
	 * @param {string} productName - The name of the product
	 * @param {string} label - The label to hover over
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	hoverOnLineItemInformation(productName, label) {
		const lblInformationLineItem = `//div[@id='lineItems' and .//div[normalize-space()='${productName}']]//div[./span[text()='${label}']]//*[local-name()='svg']`;
		this.hover(lblInformationLineItem);
		return this;
	}

	/**
	 * Gets the shipment rating value.
	 * @returns {number} - The rating value (number of stars)
	 */
	getShipmentRatingValue() {
		this.waitForElementExist(
			"//div[@id='rating']//div[contains(@class,'PpRating')]/span/span",
			false,
		);
		return this.getElementCount(
			"//div[@id='rating']//div[contains(@class,'PpRating')]/span/span[contains(@class,'fullStarIcon')]",
		);
	}

	/**
	 * Gets the rating comment.
	 * @returns {string} - The rating comment text
	 */
	getRatingComment() {
		return this.getText(
			"//div[@id='rating']//span[text()='Additional Comment']/following-sibling::span",
		);
	}

	/**
	 * Checks if rating categories exist.
	 * @param {string[]} categories - List of categories
	 * @param {boolean} isTranslate - Whether to use translated names
	 * @returns {boolean} - true if all specified categories exist, false otherwise
	 */
	doesRatingCategoriesExist(categories, isTranslate) {
		let exist = true;
		for (const category of categories) {
			const selectedCategory = isTranslate
				? category.getTranslateName()
				: category.getName();
			exist =
				exist &&
				this.isElementVisible(
					`//span[contains(@class,'PpTag-module_label') and text()='${selectedCategory}']`,
				);
		}
		return exist;
	}

	/**
	 * Checks if rating categories exist (using original names).
	 * @param {string[]} categories - List of categories
	 * @returns {boolean} - true if all specified categories exist, false otherwise
	 */
	doesRatingCategoriesExistWithoutTranslation(categories) {
		return this.doesRatingCategoriesExist(categories, false);
	}

	/**
	 * Waits for the shipment details page to load completely.
	 * @returns {ShipmentDetailsPage} The current page instance
	 */
	async waitForShipmentDetailsLoadingSuccessfully() {
		await this.waitForElementVisible(`${this.lblParcelDetailsSection.replace('%s', ShipmentDetailsSection.TRACKING_DETAILS.getSection())}`);
		await this.waitForElementVisible(`${this.lblParcelDetailsSection.replace('%s', ShipmentDetailsSection.CUSTOMER_DATA.getSection())}`);
		await this.waitForElementVisible(`${this.lblParcelDetailsSection.replace('%s', ShipmentDetailsSection.LINE_ITEMS.getSection())}`);
		await this.waitForElementVisible(`${this.lblParcelDetailsSection.replace('%s', ShipmentDetailsSection.TAGS.getSection())}`);
		await this.waitForElementVisible(`${this.lblParcelDetailsSection.replace('%s', ShipmentDetailsSection.SHIPPING_COSTS.getSection())}`);
		await this.waitForElementVisible(`${this.lblParcelDetailsSection.replace('%s', ShipmentDetailsSection.ADDITIONAL_DETAILS.getSection())}`);
		await this.waitForElementVisible(`${this.lblParcelDetailsSection.replace('%s', ShipmentDetailsSection.RATING.getSection())}`);
		await this.waitForElementVisible(`${this.lblParcelDetailsSection.replace('%s', ShipmentDetailsSection.DOCUMENTS.getSection())}`);
		await this.waitForElementVisible(`${this.lblParcelDetailsSection.replace('%s', ShipmentDetailsSection.NOTES.getSection())}`);
		return this;
	}

	/**
	 * Checks if the carrier dropdown does not exist.
	 * @returns {boolean} - true if the carrier dropdown does not exist, false otherwise
	 */
	doesCarrierDropdownNotExist() {
		const drdCarrier = "//span[text()='Select a carrier']";
		return this.isElementNotVisible(drdCarrier);
	}

	/**
	 * Checks if the update shipment button does not exist.
	 * @returns {boolean} - true if the update shipment button does not exist, false otherwise
	 */
	doesUpdateShipmentNotExist() {
		return this.isElementNotVisible(this.btnUpdateParcel);
	}

	/**
	 * Removes the current parcel.
	 * @returns {ShipmentsOverviewPage} - A new instance of ShipmentsOverviewPage
	 */
	removeParcel() {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		const btnRemoveParcel =
			"//div[@data-testid='parcel-status-container']/following-sibling::div//button";
		this.click(btnRemoveParcel);
		this.click(this.btnYes);
		// return new ShipmentsOverviewPage();
	}

	/**
	 * Checks if the rating created date matches.
	 * @param {string} createdDate - The date to check
	 * @returns {boolean} - true if the rating created date matches, false otherwise
	 */
	isRatingCreatedDate(createdDate) {
		const lblRatingCreatedDate =
			"//div[starts-with(@class,'PpRating-module')]/following-sibling::span[normalize-space()='%s']";
		return this.isElementVisible(
			lblRatingCreatedDate.replace("%s", createdDate),
		);
	}

	/**
	 * Edits an address field.
	 * @param {string} addressType - The type of address
	 * @param {string} addressEditingField - The field to edit
	 * @param {string} value - The new value for the field
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	editAddressField(addressType, addressEditingField, value) {
		// TODO: Uncomment when Reports and DropdownList are available
		// Reports.logKeywordName();
		if (
			addressEditingField === "COUNTRY" ||
			addressEditingField === "LOCATION_TYPE"
		) {
			// new DropdownList().selectReactSearchDropdownValue(addressEditingField.getFieldLocator(addressType), value);
		} else {
			this.setText(addressEditingField.getFieldLocator(addressType), value);
		}
		return this;
	}

	/**
	 * Edits address information using a JSON object.
	 * @param {string} addressType - The type of address
	 * @param {Object} objAddress - JSON object containing address information
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	editAddressInfo(addressType, objAddress) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		if (objAddress.entity_reference) {
			this.editAddressField(
				addressType,
				"REFERENCE",
				objAddress.entity_reference,
			);
		}
		if (objAddress.salutation) {
			this.editAddressField(addressType, "SALUTATION", objAddress.salutation);
		}
		if (objAddress.first_name) {
			this.editAddressField(addressType, "FIRST_NAME", objAddress.first_name);
		}
		if (objAddress.last_name) {
			this.editAddressField(addressType, "LAST_NAME", objAddress.last_name);
		}
		if (objAddress.company) {
			this.editAddressField(addressType, "COMPANY", objAddress.company);
		}
		if (objAddress.line1) {
			this.editAddressField(addressType, "ADDRESS_1", objAddress.line1);
		}
		if (objAddress.line2) {
			this.editAddressField(addressType, "ADDRESS_2", objAddress.line2);
		}
		if (objAddress.line3) {
			this.editAddressField(addressType, "ADDRESS_3", objAddress.line3);
		}
		if (objAddress.postal_code) {
			this.editAddressField(addressType, "POSTAL_CODE", objAddress.postal_code);
		}
		if (objAddress.country) {
			this.editAddressField(addressType, "COUNTRY", objAddress.country);
		}
		if (objAddress.city) {
			this.editAddressField(addressType, "CITY", objAddress.city);
		}
		if (objAddress.region) {
			this.editAddressField(addressType, "REGION", objAddress.region);
		}
		if (objAddress.state_or_province) {
			this.editAddressField(addressType, "STATE", objAddress.state_or_province);
		}
		if (objAddress.email) {
			this.editAddressField(addressType, "EMAIL", objAddress.email);
		}
		if (objAddress.phone) {
			this.editAddressField(addressType, "MOBILE", objAddress.phone);
		}
		if (objAddress.tax_id) {
			this.editAddressField(addressType, "TAX_ID", objAddress.tax_id);
		}
		if (objAddress.location_type) {
			this.editAddressField(
				addressType,
				"LOCATION_TYPE",
				objAddress.location_type,
			);
		}
		return this;
	}

	/**
	 * Edits an order information field.
	 * @param {string} field - The field to edit
	 * @param {string} value - The new value for the field
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	editOrderInformationField(field, value) {
		// TODO: Uncomment when Reports and DropdownList are available
		// Reports.logKeywordName();
		if (field === "CASH_ON_DELIVERY_UNIT") {
			// new DropdownList().selectReactSearchDropdownValue(field.getFieldLocator(), value);
		} else {
			this.setText(field.getFieldLocator(), value);
		}
		return this;
	}

	/**
	 * Edits order information using a JSON object.
	 * @param {Object} orderInfo - JSON object containing order information
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	editOrderInformation(orderInfo) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.scrollToShipmentDetailsSection("LINE_ITEMS");
		if (orderInfo.order_id) {
			this.editOrderInformationField("ORDER_ID", orderInfo.order_id);
		}
		if (orderInfo.order_reference) {
			this.editOrderInformationField(
				"ORDER_REFERENCE",
				orderInfo.order_reference,
			);
		}
		if (orderInfo.cod_value) {
			const [codValue, codUnit] = orderInfo.cod_value
				.split(" ")
				.map((s) => s.trim());
			this.editOrderInformationField(
				"CASH_ON_DELIVERY_UNIT",
				codUnit.toUpperCase(),
			);
			this.editOrderInformationField("CASH_ON_DELIVERY_VALUE", codValue);
		}
		if (orderInfo.order_url) {
			this.editOrderInformationField("URL", orderInfo.order_url);
		}
		if (orderInfo.payment_type) {
			this.editOrderInformationField("PAYMENT_TYPE", orderInfo.payment_type);
		}
		if (orderInfo.order_source_name) {
			this.editOrderInformationField(
				"ORDER_SOURCE_NAME",
				orderInfo.order_source_name,
			);
		}
		if (orderInfo.order_source_type) {
			this.editOrderInformationField(
				"ORDER_SOURCE_TYPE",
				orderInfo.order_source_type,
			);
		}
		return this;
	}

	/**
	 * Edits an additional details field.
	 * @param {string} field - The field to edit
	 * @param {string} value - The new value for the field
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	editAdditionalDetailsField(field, value) {
		// TODO: Uncomment when Reports and DropdownList are available
		// Reports.logKeywordName();
		if (field === "DIMENSIONS_UNIT" || field === "WEIGHT_UNIT") {
			// new DropdownList().selectReactDropdownValue(field.getFieldLocator(), value);
		} else if (field === "SHIPMENT_VALUE_UNIT") {
			// new DropdownList().selectReactSearchDropdownValue(field.getFieldLocator(), value);
		} else {
			this.setText(field.getFieldLocator(), value);
		}
		return this;
	}

	/**
	 * Edits the dimensions of the shipment.
	 * @param {number} height - The height value
	 * @param {number} width - The width value
	 * @param {number} length - The length value
	 * @param {string} unit - The dimension unit
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	editDimensions(height, width, length, unit) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.scrollToShipmentDetailsSection("NOTIFICATIONS");
		this.editAdditionalDetailsField("DIMENSIONS_HEIGHT", String(height));
		this.editAdditionalDetailsField("DIMENSIONS_WIDTH", String(width));
		this.editAdditionalDetailsField("DIMENSIONS_LENGTH", String(length));
		this.editAdditionalDetailsField("DIMENSIONS_UNIT", unit);
		return this;
	}

	/**
	 * Edits the weight of the shipment.
	 * @param {number} weight - The weight value
	 * @param {string} unit - The weight unit
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	editWeight(weight, unit) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.scrollToShipmentDetailsSection("NOTIFICATIONS");
		this.editAdditionalDetailsField("WEIGHT_VALUE", String(weight));
		this.editAdditionalDetailsField("WEIGHT_UNIT", unit);
		return this;
	}

	/**
	 * Edits the shipment value.
	 * @param {number} value - The value amount
	 * @param {string} unit - The currency unit
	 * @returns {ShipmentDetailsPage} - The current ShipmentDetailsPage instance
	 */
	editShipmentValue(value, unit) {
		// TODO: Uncomment when Reports is available
		// Reports.logKeywordName();
		this.scrollToShipmentDetailsSection("NOTIFICATIONS");
		this.editAdditionalDetailsField("SHIPMENT_VALUE", String(value));
		this.editAdditionalDetailsField("SHIPMENT_VALUE_UNIT", unit);
		return this;
	}

	/**
	 * Gets the value of an additional details editing field.
	 * @param {string} field - The field
	 * @returns {string} - The field value
	 */
	getAdditionalDetailsEditingFieldValue(field) {
		if (
			field === "DIMENSIONS_UNIT" ||
			field === "WEIGHT_UNIT" ||
			field === "SHIPMENT_VALUE_UNIT"
		) {
			return this.getText(field.getFieldLocator()).trim();
		}
		return this.getAttribute(field.getFieldLocator(), "value");
	}

	/**
	 * Checks if a section is empty.
	 * @param {string} section - The section to check
	 * @returns {boolean} - true if the section is empty, false otherwise
	 */
	isSectionEmpty(section) {
		return (
			this.isElementVisible(
				`${section.getContainer()}//span/*[name()='svg']`,
			) &&
			this.isElementVisible(
				`${section.getContainer()}//span[text()='${section.getSectionEmptyMessage()}']`,
			)
		);
	}

	/**
	 * Checks if the sidebar icon is displayed for a section.
	 * @param {string} section - The section to check
	 * @returns {boolean} - true if the sidebar icon is displayed, false otherwise
	 */
	doesSidebarIconDisplay(section) {
		const baseIconXpath = `${section.getContainer()}//div[text()='Line Items']/preceding-sibling::*[name()='svg']`;
		const currentSidebarXpath = "//div[contains(@class,'Menus-module_menus_')]";
		const sidebarHtml = this.getInnerHTML(currentSidebarXpath);
		const baseIconHtml = this.getInnerHTML(baseIconXpath);
		return sidebarHtml.includes(baseIconHtml);
	}

	/**
	 * Checks if a section is displayed.
	 * @param {string} section - The section to check
	 * @returns {boolean} - true if the section is displayed, false otherwise
	 */
	doesSectionDisplay(section) {
		return this.isElementVisible(`//div[text()='${section}']`);
	}

	/**
	 * Gets the value of a shipment details field.
	 * @param {string} section - The section
	 * @param {string} label - The label
	 * @returns {string} - The field value
	 */
	getShipmentDetailsValue(section, label) {
		if (label === "MAIN_CARRIER_LINK" || label === "OTHER_CARRIER_LINK") {
			return this.getAttribute(
				`${section.getContainer()}${label.getLocator()}`,
				"href",
			);
		}
		if (label === "MAIN_CARRIER_LOGO" || label === "OTHER_CARRIER_LOGO") {
			return this.getAttribute(
				`${section.getContainer()}${label.getLocator()}`,
				"src",
			);
		}
		return this.getText(label.getLocator()).trim();
	}

	/**
	 * Gets the value of a shipment details field by label.
	 * @param {string} label - The label text
	 * @returns {string} The field value
	 */
	getShipmentDetailsValueByLabel(label) {
		const locator = `//div[contains(@class,'fieldLabel') and text()='${label}']/following-sibling::div//span | //div[text()='${label}']/following-sibling::span`;
		return this.getText(locator);
	}

	/**
	 * Gets the header label value for a shipment detail.
	 * @param {string} label - The label text
	 * @returns {string} The header label value
	 */
	getShipmentDetailsHeaderLabel(label) {
		const xpath = `//span[text()='${label}']/parent::div`;
		return this.getText(xpath).substring(label.length()).trim();
	}

	/**
	 * Checks if the EDD description does not display for a source type.
	 * @param {string} sourceType - The source type
	 * @returns {boolean} True if the EDD description does not display, false otherwise
	 */
	doesEDDDescriptionNotDisplay(sourceType) {
		return this.isElementNotVisible(
			`${sourceType.getContainer()}${this.iconEDDDescription.replace("%s", sourceType.getType())}`,
		);
	}

	/**
	 * Hovers over the EDD description icon.
	 * @param {string} sourceType - The source type
	 * @returns {ShipmentDetailsPage} The current page instance
	 */
	hoverOnEDDDescriptionIcon(sourceType) {
		this.hover(
			`${sourceType.getContainer()}${this.iconEDDDescription.replace("%s", sourceType.getType())}`,
		);
		return this;
	}

	/**
	 * Gets the EDD description tooltip content.
	 * @param {string} sourceType - The source type
	 * @returns {string} The tooltip content
	 */
	getEddDescriptionTooltip(sourceType) {
		this.hoverOnEDDDescriptionIcon(sourceType);
		return new ToolTip().getToolTipContent();
	}

	/**
	 * Checks if POD (Proof of Delivery) exists.
	 * @returns {boolean} True if POD exists, false otherwise
	 */
	doesPODExist() {
		return this.isElementVisible("//span[@title='Download Proof of Delivery']");
	}

	/**
	 * Gets address information for a specific address type and field.
	 * @param {string} addressType - The type of address
	 * @param {string} info - The information field to get
	 * @returns {string} The address information value
	 */
	getAddressInfo(addressType, info) {
		return this.getText(
			`//div[contains(text(),'${addressType}') ]/parent::div//div[text()='${info}']/following-sibling::div`,
		).trim();
	}

	/**
	 * Checks if tags exist.
	 * @param {Array|JsonArray} tags - List or JsonArray of tags to check
	 * @returns {boolean} True if all specified tags exist, false otherwise
	 */
	doTagsExist(tags) {
		let result = true;
		const tagLocator = "//div[@id='tags']//span[text()='%s']";
		
		if (tags instanceof JsonArray) {
			for (let i = 0; i < tags.size(); i++) {
				result = result && this.isElementVisible(String.format(tagLocator, tags.get(i).getAsString()));
			}
		} else if (Array.isArray(tags)) {
			for (let i = 0; i < tags.length; i++) {
				result = result && this.isElementVisible(String.format(tagLocator, tags[i]));
			}
		}
		return result;
	}

	/**
	 * Checks if a single tag exists.
	 * @param {string} tag - The tag to check for
	 * @returns {boolean} True if the tag exists, false otherwise
	 */
	doesTagExist(tag) {
		const tags = new JsonArray();
		tags.add(tag);
		return this.doTagsExist(tags);
	}

	/**
	 * Gets shipping cost information.
	 * @param {string} shippingCostName - The name of the shipping cost
	 * @param {ShippingCostInfo} info - The type of information
	 * @returns {string} The shipping cost information
	 */
	getShippingCostInfo(shippingCostName, info) {
		const xpath = `//tbody/tr[td[text()='${shippingCostName}']]/td[count(//div[@id='shippingCost']//thead//th[contains(.,'${info.getName()}')]/preceding-sibling::th)+1]`;
		return this.getText(xpath);
	}

	/**
	 * Gets the total shipping cost.
	 * @returns {string} The total shipping cost value
	 */
	getTotalShippingCost() {
		const lblTotalShippingCost = "//td[span[text()='Total']]/following-sibling::td";
		return this.getText(lblTotalShippingCost);
	}

	/**
	 * Gets the source of the total shipping cost.
	 * @returns {string} The shipping cost source
	 */
	getTotalShippingCostSource() {
		const locator = `${this.ShipmentDetailsSection.SHIPPING_COSTS.getContainer()}//span[contains(text(),'Source')]`;
		return this.getText(locator).split(":")[1].split("\\)")[0].trim();
	}

	/**
	 * Gets document information.
	 * @param {string} documentName - The name of the document
	 * @param {ShipmentDetailsDocumentInfo} info - The type of information
	 * @returns {string} The document information
	 */
	getDocumentInfo(documentName, info) {
		const container = `//div[./button and .//div[text()='${documentName}']]/parent::div`;
		const xpath = container + info.getLocator();
		return this.getText(xpath);
	}

	/**
	 * Gets the notes content.
	 * @returns {string} The notes text
	 */
	getNotes() {
		const lblNotes = "//div[@id='notes']//span[@class='Linkify']";
		return this.getText(lblNotes);
	}

	/**
	 * Checks if an additional linked shipment exists.
	 * @param {string} trackingNumber - The tracking number
	 * @param {string} carrierReference - The carrier reference
	 * @returns {boolean} True if the linked shipment exists, false otherwise
	 */
	doesAdditionalLinkedShipmentExist(trackingNumber, carrierReference) {
		return this.isElementVisible(`${this.ShipmentDetailsSection.ADDITIONAL_DETAILS.getContainer()}//div[./div[text()='Linked Shipments'] and .//span[text()='${trackingNumber}'] and .//span[text()='${carrierReference}']]`);
	}

	/**
	 * Checks if other carrier information exists.
	 * @returns {boolean} True if other carrier information exists, false otherwise
	 */
	doesOtherCarrierExist() {
		return this.isElementVisible(`${this.ShipmentDetailsSection.TRACKING_DETAILS.getContainer()}//div[text()='Other Carrier']`);
	}

	/**
	 * Checks if the booking failed header exists.
	 * @returns {boolean} True if the booking failed header exists, false otherwise
	 */
	doesBookingFailedHeaderExist() {
		return this.isElementVisible("//div[@id='failedBookingAttempt']/section/div[contains(@class,'SectionHeader-module_container')]");
	}

	/**
	 * Checks if a booking error container exists with specific details.
	 * @param {string} error - The error type
	 * @param {string} field - The field name
	 * @param {string} apiFieldName - The API field name
	 * @param {string} message - The error message
	 * @returns {boolean} True if the booking error container exists with the specified details, false otherwise
	 */
	doesBookingErrorContainerExist(error, field, apiFieldName, message) {
		return this.isElementVisible(`//div[@id='failedBookingAttempt']//strong[contains(normalize-space(),'Error Type: ${error}')]`) &&
			this.isElementVisible(`//div[@id='failedBookingAttempt']//p[contains(normalize-space(),'Field: ${field}')]`) &&
			this.isElementVisible(`//div[@id='failedBookingAttempt']//p[contains(normalize-space(),'API Field Name: ${apiFieldName}')]`) &&
			this.isElementVisible(`//div[@id='failedBookingAttempt']//p[contains(normalize-space(),'Message: ${message}')]`);
	}

	/**
	 * Clicks the try again button.
	 * @returns {ShipmentDetailsPage} The current page instance
	 */
	clickTryAgain() {
		this.click("//button[text()='Try again']");
		return this;
	}

	/**
	 * Gets the base header label value.
	 * @param {string} label - The label text
	 * @returns {string} The base header label value
	 */
	getShipmentDetailBaseHeaderLabel(label) {
		const xpath = `//div[contains(@class,'BaseHeader-module_container')]//span[text()='${label}']/parent::div`;
		return this.getText(xpath).substring(label.length()).trim();
	}
}

module.exports = ShipmentDetailsPage;
