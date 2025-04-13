/**
 * Enum representing different sections of the Shipment Details page.
 * Each enum constant defines a section with its display name, XPath container selector,
 * and an optional message to display when the section is empty.
 */
const ShipmentDetailsSection = {
    HEADER: {
        section: "Header",
        container: "//div[contains(@class,'ParcelDetailsHeader-module_ppModContainer')]",
        sectionEmptyMessage: null,
        getSection: function() { return this.section; },
        getContainer: function() { return this.container; },
        getSectionEmptyMessage: function() { return this.sectionEmptyMessage; }
    },
    TRACKING_DETAILS: {
        section: "Tracking Details",
        container: "//div[@id='trackingDetails']/section",
        sectionEmptyMessage: null,
        getSection: function() { return this.section; },
        getContainer: function() { return this.container; },
        getSectionEmptyMessage: function() { return this.sectionEmptyMessage; }
    },
    CUSTOMER_DATA: {
        section: "Customer Data",
        container: "//div[@id='customerData']",
        sectionEmptyMessage: "There is no customer data for this parcel.",
        getSection: function() { return this.section; },
        getContainer: function() { return this.container; },
        getSectionEmptyMessage: function() { return this.sectionEmptyMessage; }
    },
    LINE_ITEMS: {
        section: "Line Items",
        container: "//div[@id='lineItems']",
        sectionEmptyMessage: "There are no line items for this shipment.",
        getSection: function() { return this.section; },
        getContainer: function() { return this.container; },
        getSectionEmptyMessage: function() { return this.sectionEmptyMessage; }
    },
    TAGS: {
        section: "Tags",
        container: "//div[@id='tags']",
        sectionEmptyMessage: "There are no tags for this parcel.",
        getSection: function() { return this.section; },
        getContainer: function() { return this.container; },
        getSectionEmptyMessage: function() { return this.sectionEmptyMessage; }
    },
    SHIPPING_COSTS: {
        section: "Shipping Costs",
        container: "//div[@id='shippingCost']",
        sectionEmptyMessage: "There are no shipping costs for this parcel.",
        getSection: function() { return this.section; },
        getContainer: function() { return this.container; },
        getSectionEmptyMessage: function() { return this.sectionEmptyMessage; }
    },
    ADDITIONAL_DETAILS: {
        section: "Additional Details",
        container: "//div[@id='additionalDetails']/section",
        sectionEmptyMessage: null,
        getSection: function() { return this.section; },
        getContainer: function() { return this.container; },
        getSectionEmptyMessage: function() { return this.sectionEmptyMessage; }
    },
    NOTIFICATIONS: {
        section: "Notifications",
        container: "//div[@id='notifications']",
        sectionEmptyMessage: "There are no notifications for this parcel.",
        getSection: function() { return this.section; },
        getContainer: function() { return this.container; },
        getSectionEmptyMessage: function() { return this.sectionEmptyMessage; }
    },
    RATING: {
        section: "Rating",
        container: "//div[@id='rating']/section",
        sectionEmptyMessage: "There is no rating for this parcel.",
        getSection: function() { return this.section; },
        getContainer: function() { return this.container; },
        getSectionEmptyMessage: function() { return this.sectionEmptyMessage; }
    },
    DOCUMENTS: {
        section: "Documents",
        container: "//div[@id='documents']/section",
        sectionEmptyMessage: "There are no documents for this parcel.",
        getSection: function() { return this.section; },
        getContainer: function() { return this.container; },
        getSectionEmptyMessage: function() { return this.sectionEmptyMessage; }
    },
    NOTES: {
        section: "Notes",
        container: "//div[@id='notes']",
        sectionEmptyMessage: "There are no notes for this parcel.",
        getSection: function() { return this.section; },
        getContainer: function() { return this.container; },
        getSectionEmptyMessage: function() { return this.sectionEmptyMessage; }
    }
};

module.exports = ShipmentDetailsSection; 