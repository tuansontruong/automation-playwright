/**
 * Object representing different properties of a shipment that can be displayed or used in the system.
 * This object provides a mapping between property names and their display strings
 * for UI automation and testing.
 */
const ShipmentProperty = {
    ADDITIONAL_REFERENCE: "Additional Reference",
    ALL_TAGS: "All Tags",
    AT_COLLECTION_POINT_DATE: "At Collection Point Date",
    BOOKING: "Booking",
    CARRIER: "Carrier",
    CARRIER_CS_PHONE: "Carrier CS Phone",
    CARRIER_DEPARTMENT: "Carrier Department",
    CARRIER_NAME_REFERENCE: "Carrier (Reference)",
    CARRIER_REFERENCE: "Carrier Reference",
    CARRIER_URL: "Carrier URL",
    CASH_ON_DELIVERY: "Cash on Delivery",
    CHANNEL: "Channel",
    COLLECTED_DATE: "Collected Date",
    CURRENT_STAGE: "Current Stage",
    CUSTOMS: "Customs",
    DATE_ADDED: "Date Added",
    DATE_SHIPPED: "Date Shipped",
    DELIVERED_DATE: "Delivered Date",
    DESTINATION_COUNTRY: "Destination Country",
    DESTINATION_FIXED_LOCATION: "Destination Fixed Location",
    DESTINATION_LOCATION_TYPE: "Destination Location Type",
    DESTINATION_POSTAL_CODE: "Destination Postal Code",
    DOMESTIC_INTERNATIONAL: "Domestic / International",
    DUTIES_BOURNE_BY: "Duties Bourne By",
    EXPECTED_DELIVERY_CARRIER: "Expected delivery (carrier)",
    EXPECTED_DELIVERY_USER: "Expected delivery (user)",
    FIRST_ATTEMPT_DATE: "First Attempt Date",
    FIRST_IN_TRANSIT_DATE: "First In Transit Date",
    FROM_ADDRESS: "From Address",
    ISSUE: "Issue",
    ISSUE_TYPE: "Issue Type",
    ITEM_COUNT: "Item Count",
    LAST_EVENT: "Last Event",
    LINE_ITEMS: "Line Items",
    LINKED_CARRIER_REFERENCE: "Linked Carrier (Reference)",
    LINKED_TRACKING_NUMBER: "Linked Tracking Number",
    NOTIFICATION_EMAIL: "Notification Email",
    NOTIFICATION_PHONE: "Notification Phone",
    NOTIFICATION_SENT: "Notification Sent",
    ORDER_CREATED_DATE: "Order Created Date",
    ORDER_ID: "Order ID",
    ORDER_REFERENCE: "Order Reference",
    ORDER_SOURCE: "Order Source",
    ORDER_URL: "Order URL",
    ORDER_UUID: "Order UUID",
    ORIGIN_COUNTRY: "Origin Country",
    ORIGIN_LOCATION_TYPE: "Origin Location Type",
    ORIGIN_POSTAL_CODE: "Origin Postal Code",
    OUT_FOR_DELIVERY: "Out for Delivery",
    PARCEL_EXPECTED_TIME: "Parcel Expected Time",
    PARCEL_ID: "Parcel ID",
    PARCEL_PACKAGING_TYPE: "Parcel Packaging Type",
    PAYMENT_TYPE: "Payment Type",
    PICKED_UP: "Picked Up",
    PRE_ALERT_DATE: "Pre Alert Date",
    RATING: "Rating",
    RATING_CATEGORIES: "Rating Categories",
    RATING_COMMENT: "Rating Comment",
    RECEIVED_BY: "Received By",
    RECIPIENT_ADDRESS: "Recipient Address",
    RECIPIENT_COUNTRY: "Recipient Country",
    RECIPIENT_REFERENCE: "Recipient Reference",
    RETURN_ADDRESS: "Return Address",
    SALES_CHANNEL: "Sales Channel",
    SENDER_ADDRESS: "Sender Address",
    SENDER_COUNTRY: "Sender Country",
    SHIPMENT_ID: "Shipment ID",
    SHIPMENT_REFERENCE: "Shipment Reference",
    SHIPMENT_TYPE: "Shipment Type",
    SHIPMENT_UUID: "Shipment UUID",
    SHIPMENT_VALUE: "Shipment Value",
    SHIPPING_COST: "Shipping Cost",
    SHIPPING_PRODUCT: "Shipping Product",
    SHIPPING_SERVICE: "Shipping Service",
    SPECIAL_HANDLING: "Special Handling",
    STATUS: "Status",
    TO_ADDRESS: "To Address",
    TO_POSTCODE: "To Postcode",
    TO_REGION: "To Region",
    TRACKING_NUMBER: "Tracking Number",
    TRACKING_PAGE_REFERENCE: "Tracking Page Reference",
    TRANSIT_TIME_FINAL_DELIVERY: "Transit Time Final Delivery",
    TRANSIT_TIME_FIRST_ATTEMPT: "Transit Time First Attempt",
    TRANSIT_TIME_FIRST_IN_TRANSIT_FIRST_ATTEMPT: "Transit Time First In Transit - First Attempt",
    TAGS: "Tags",
    SHOW_SPECIFIC_TAG_S: "Show Specific Tag(s)",
    SHOW_SPECIFIC_ADDITIONAL_INFO_FIELD: "Show Specific Additional Info Field",

    /**
     * Gets the display string for a given property key.
     * @param {string} key - The property key
     * @returns {string} The display string associated with the property
     */
    getProperty: function(key) {
        return this[key];
    },

    /**
     * Gets all available property keys.
     * @returns {string[]} Array of all property keys
     */
    getKeys: function() {
        return Object.keys(this).filter(key => key !== 'getProperty' && key !== 'getKeys');
    },

    /**
     * Gets all available property values.
     * @returns {string[]} Array of all property values
     */
    getValues: function() {
        return this.getKeys().map(key => this[key]);
    },

    /**
     * Checks if a given key exists in the properties.
     * @param {string} key - The property key to check
     * @returns {boolean} True if the key exists, false otherwise
     */
    hasKey: function(key) {
        return this.getKeys().includes(key);
    },

    /**
     * Checks if a given value exists in the properties.
     * @param {string} value - The property value to check
     * @returns {boolean} True if the value exists, false otherwise
     */
    hasValue: function(value) {
        return this.getValues().includes(value);
    },

    /**
     * Gets the key for a given property value.
     * @param {string} value - The property value
     * @returns {string|null} The key associated with the value, or null if not found
     */
    getKeyByValue: function(value) {
        const entry = Object.entries(this).find(([k, v]) => v === value && k !== 'getProperty' && k !== 'getKeys' && k !== 'hasKey' && k !== 'hasValue' && k !== 'getKeyByValue');
        return entry ? entry[0] : null;
    }
};

module.exports = ShipmentProperty; 