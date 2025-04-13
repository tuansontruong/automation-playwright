/**
 * Object representing different pages in the portal application.
 * This object provides a mapping between page names and their corresponding
 * menu identifiers and navigation paths for UI automation and testing.
 */
class PortalPage {
    constructor(name, menuDataId, subMenuDataId, pageHeader) {
        this.name = name;
        this.menuDataId = menuDataId;
        this.subMenuDataId = subMenuDataId;
        this.pageHeader = pageHeader;
    }

    getName() {
        return this.name;
    }

    getMenuDataId() {
        return this.menuDataId;
    }

    getSubMenuDataId() {
        return this.subMenuDataId;
    }

    getPageHeader() {
        return this.pageHeader;
    }
}

// Create static instances for each page
PortalPage.HOME = new PortalPage("Home", "DASHBOARD", "", "Home");
PortalPage.SHIPMENTS_OVERVIEW = new PortalPage("Shipments Overview", "POST_PURCHASE_EXPERIENCE", "SHIPMENTS_OVERVIEW", "Post-Purchase Experience->Shipments Overview");
PortalPage.NOTIFICATIONS = new PortalPage("Notifications", "POST_PURCHASE_EXPERIENCE", "DELIVERY_NOTIFICATIONS", "Post-Purchase Experience->Notifications");
PortalPage.NOTIFICATIONS_EDITOR = new PortalPage("Notifications Editor", "", "", "Post-Purchase Experience->Notifications->Editor");
PortalPage.TWO_WAY_NOTIFICATION = new PortalPage("Two-way Notification", "POST_PURCHASE_EXPERIENCE", "TWO_WAY_NOTIFICATION", "Post-Purchase Experience->Two-way Notification");
PortalPage.NOTIFICATION_TEMPLATES = new PortalPage("Notification Templates", "POST_PURCHASE_EXPERIENCE", "NOTIFICATION_TEMPLATES", "Post-Purchase Experience->Notification Templates");
PortalPage.NOTIFICATION_TEMPLATES_EDITOR = new PortalPage("Notification Templates Editor", "", "", "Post-Purchase Experience->Notification Templates->Editor");
PortalPage.TRACKING_PAGE = new PortalPage("Tracking Page", "POST_PURCHASE_EXPERIENCE", "TRACKING_PAGE", "Post-Purchase Experience->Tracking Page");
PortalPage.TRACKING_PAGE_CONFIGURATION = new PortalPage("Tracking Page Configuration", "", "", "Post-Purchase Experience->Tracking Page->Configuration");
PortalPage.TRACKING_PAGE_PREVIEW = new PortalPage("Tracking Page Preview", "", "", "Post-Purchase Experience->Tracking Page->Preview");
PortalPage.TRACKING_PAGE_V1 = new PortalPage("Tracking Page", "POST_PURCHASE_EXPERIENCE", "TRACKING_PAGE", "Tracking Experience");
PortalPage.CUSTOMER_RATINGS = new PortalPage("Customer Ratings", "POST_PURCHASE_EXPERIENCE", "CUSTOMER_RATINGS", "Post-Purchase Experience->Customer Ratings");
PortalPage.POST_PURCHASE_REPORTS_ANALYSIS = new PortalPage("Reports & Analysis", "POST_PURCHASE_EXPERIENCE", "POST_PURCHASE_REPORTS_ANALYSIS_ROOT", "Post-Purchase Experience->Reports & Analysis");
PortalPage.RETURNS_REPORTS_ANALYSIS = new PortalPage("Reports & Analysis", "RETURN_EXPERIENCE", "RETURNS_REPORTS_ANALYSIS_ROOT", "Returns Experience->Reports & Analysis");
PortalPage.CHECKOUT_REPORTS_ANALYSIS = new PortalPage("Reports & Analysis", "", "", "Checkout Experience->Reports & Analysis");
PortalPage.LOGISTICS_REPORTS_ANALYSIS = new PortalPage("Reports & Analysis", "", "", "Logistics Experience->Reports & Analysis");
PortalPage.RETURNS_OVERVIEW = new PortalPage("Returns Overview", "RETURN_EXPERIENCE", "RETURNS_OVERVIEW", "Returns Experience->Returns Overview");
PortalPage.BUSINESS_INTELLIGENCE = new PortalPage("Business Intelligence", "CO_PILOT", "BUSINESS_INTELLIGENCE", "Co-Pilot->Business Intelligence");
PortalPage.ALERTS_OVERVIEW = new PortalPage("Alerts Overview", "CO_PILOT", "ALERTS_OVERVIEW", "Co-Pilot->Alerts Overview");
PortalPage.COMPANY_PROFILE = new PortalPage("Company Profile", "SETTINGS", "COMPANY_PROFILE", "Settings->Company Profile");
PortalPage.USERS = new PortalPage("Users", "SETTINGS", "USERS", "Settings->Users");
PortalPage.CARRIERS = new PortalPage("Carriers", "SETTINGS", "CARRIERS", "Settings->Carriers");
PortalPage.INTEGRATIONS = new PortalPage("Integrations", "SETTINGS", "INTEGRATIONS_V2", "Settings->Integrations");
PortalPage.API = new PortalPage("API", "", "", "Settings->Integrations->API");
PortalPage.BOOKING_OVERVIEW = new PortalPage("Booking Overview", "LOGISTICS", "BOOKING", "Logistics Experience->Booking");

module.exports = PortalPage; 