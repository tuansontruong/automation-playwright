const { createShipment } = require("../../../core/api/Shipments");
const Events = require("../../../core/enums/Events");
const DateTimeFormats = require("../../../core/constants/DateTimeFormats");
const Merchants = require("../../../core/enums/Merchants");
const Account = require("../../../core/enums/Account");
const { PPBrowser } = require("../../../base.test");
const Authentication = require("../../../core/api/Authentication");
const DateTime = require("../../../utils/DateTime");
const Timestamps = require("../../../core/enums/Timestamps");
const { test, expect } = require("@playwright/test");
const Authenticator = require("../../../core/api/Authenticator");
const OSReading = require("../../../core/api/OSReading");
const ShipmentStatus = require("../../../core/enums/ShipmentStatus");

/**
 * Test case to verify that Timestamps display First Delivery Attempt as a most outstanding feature
 */
test.describe("TC_Additional_Details_04_Verify_that_the_Timestamps_display_First_Delivery_Attempt_as_a_most_outstanding_feature", () => {
    test("should verify that the Timestamps display First Delivery Attempt as a most outstanding feature", async () => {
        test.setTimeout(100000);
        const today = new Date();
        const randomString = Math.random().toString(36).substring(2, 12);
        const shipmentId = `SID${randomString}`;
        const trackingNumber = `TE${randomString}`;
        const carrierReference = "ppmc";
        const eventKey = "H41";
        const displayingDateFormat = "dd MMM yyyy";
        const displayingTimeFormat = "HH:mm";
        const inputEventDateTime = DateTime.formatDateTime(
            today,
            DateTimeFormats.ISO_OFFSET_DATE_TIME
        );
        
        // Format date using ppFormatDateTime to match "dd MMM yyyy" format
        const eventDate = DateTime.ppFormatDateTime(today, displayingDateFormat);
        const eventTime = DateTime.ppFormatDateTime(today, displayingTimeFormat);
        const eventLocation = "Vietnam";

        const location = {
            place: eventLocation
        };

        const event = {
            standard_key: eventKey,
            date_time: inputEventDateTime,
            location: location
        };

        const events = [event];

        const shipmentObj = {
            shipment_id: shipmentId,
            tracking_number: trackingNumber,
            carrier_reference: carrierReference,
            events: events
        };

        const merchant = Merchants.SEAN_TEST_01;
        const nonPPUser = Account.NON_PP_ACCOUNT1;

        const portalPage = await PPBrowser.openPortal();
        const selectMerchantPage = await portalPage.signInWithUsernameAndPassword(nonPPUser);

        const nonPPToken = await Authenticator.getNonPPAccessToken(nonPPUser);
        const objOrg = await Authenticator.getOrgInfo(nonPPToken, merchant);

        const homePage = await selectMerchantPage.selectMerchant(merchant);

        const publicAPIToken = await Authentication.getPublicAPIAccessToken(objOrg);

        await createShipment(publicAPIToken, shipmentObj);

        await OSReading.waitForShipment(nonPPToken, objOrg.slug, shipmentId);
        await OSReading.waitForShipmentStatus(
            nonPPToken,
            objOrg.slug,
            shipmentId,
            ShipmentStatus.ACTIVE
        );

        const shipmentOverviewPage = await homePage.goToShipmentsOverviewPage();
        const shipmentDetailsPage = await shipmentOverviewPage.openParcelDetails(trackingNumber.toUpperCase());

        await shipmentDetailsPage.doesActiveTimeStoneExist(
            Timestamps.FIRST_DELIVERY_ATTEMPT.getTimeStone(),
            eventDate,
            eventTime,
            "(1 attempt in total)"
        );

        await shipmentDetailsPage.doesActiveTimeStoneExist(
            Timestamps.PROCESSING.getTimeStone(),
            eventDate,
            eventTime
        );

        await shipmentDetailsPage.doesAdditionalTimestampsExist(
            "Transit Time (First Attempt)",
            "0 day(s)"
        );
    });
}); 