const { test, expect } = require('@playwright/test');
const { generateRandomAlphaNumberString } = require('../../utils/helpers/random');
const Shipments = require('../../core/api/Shipments');
const Merchants = require('../../core/enums/Merchants');
const Account = require('../../core/enums/Account');
const Authenticator = require('../../core/api/Authenticator');
const Authentication = require('../../core/api/Authentication');
const Events = require('../../core/enums/Events');
const ShipmentStatus = require('../../core/enums/ShipmentStatus');
const { format } = require('date-fns');
const OSReading = require('../../core/api/OSReading');

test.describe('TC_Retrieve_Shipment_04_Verify_response_when_retrieve_shipment_with_shipment_uuid', () => {
    let nonPPToken;
    let publicApiToken;
    let objOrg;
    let randomString;
    let shipmentId;
    let parcelId;
    let carrierReference;
    let eventKey;

    test.beforeAll(async () => {
        test.setTimeout(100000);
        const nonPPUser = Account.NON_PP_ACCOUNT1;
        const merchant = Merchants.SEAN_TEST_01;
        randomString = generateRandomAlphaNumberString(7);
        shipmentId = `SID_${randomString}`;
        parcelId = `PID_${randomString}`;
        carrierReference = 'ppmc';
        eventKey = Events.D20.eventKey;

        nonPPToken = await Authenticator.getNonPPAccessToken(nonPPUser);
        objOrg = await Authenticator.getOrgInfo(nonPPToken, merchant);
        publicApiToken = await Authentication.getPublicAPIAccessToken(objOrg);

        // Create initial shipment
        const eventTime = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx");
        const events = [{
            standard_key: eventKey,
            location: {
                place: 'Vietnam'
            },
            date_time: eventTime
        }];

        const shipment = {
            shipment_id: shipmentId,
            tracking_number: parcelId,
            carrier_reference: carrierReference,
            events: events
        };

        await Shipments.createShipment(publicApiToken, shipment);
        await OSReading.waitForShipment(nonPPToken, objOrg.slug, shipmentId);
        await Shipments.waitForShipmentStatus(publicApiToken, shipmentId, ShipmentStatus.ACTIVE);
    });

    test('Sending request with valid shipment_uuid', async () => {
        // Get shipment UUID
        const res1 = await Shipments.retrieveShipment(publicApiToken, '<ignore>', shipmentId);
        const retrieveShipmentResponse = await res1.json();
        const shipmentUUID = retrieveShipmentResponse.data.shipment_uuid;

        // Retrieve shipment with UUID
        const res = await Shipments.retrieveShipment(publicApiToken, shipmentUUID, '<ignore>');
        const apiResponse = await res.json();

        // Verify response
        expect(res.status).toBe(200);
        expect(apiResponse.api_response).toBe('200');
        expect(apiResponse.data.shipment_id).toBe(shipmentId);
        expect(apiResponse.data.tracking_number).toBe(parcelId.toUpperCase());
        expect(apiResponse.data.carrier_reference).toBe(carrierReference);
        expect(apiResponse.data.all_events[0].event_key).toBe(eventKey);
    });

    test('Sending request with invalid shipment_uuid', async () => {
        const res = await Shipments.retrieveShipment(publicApiToken, 'efb1b5a4-9c02-11eb-a8b3-0242ac13000d', '<ignore>');
        const apiResponse = await res.json();

        // Verify error response
        expect(res.status).toBe(404);
        expect(apiResponse.api_response).toBe('4041');
        expect(apiResponse.message).toBe('No shipment found with provided shipment_uuid or shipment_id.');
    });

    test('Sending request with wrong formatted shipment_uuid', async () => {
        const res = await Shipments.retrieveShipment(publicApiToken, 'wrong_format_uuid', '<ignore>');
        const apiResponse = await res.json();

        // Verify error response
        expect(res.status).toBe(400);
        expect(apiResponse.api_response).toBe('4030');
        expect(apiResponse.message).toBe('validation_error');
        expect(apiResponse.errors.shipment_uuid[0]).toBe('Invalid format.');
    });

    test('Sending request with null shipment_uuid', async () => {
        const res = await Shipments.retrieveShipment(publicApiToken, 'null', '<ignore>');
        const apiResponse = await res.json();

        // Verify error response
        expect(res.status).toBe(400);
        expect(apiResponse.api_response).toBe('4030');
        expect(apiResponse.message).toBe('validation_error');
        expect(apiResponse.errors.shipment_uuid[0]).toBe('Invalid format.');
    });

    test('Sending request with empty shipment_uuid', async () => {
        const res = await Shipments.retrieveShipment(publicApiToken, '', '<ignore>');
        const apiResponse = await res.json();

        // Verify error response
        expect(res.status).toBe(400);
        expect(apiResponse.api_response).toBe('4030');
        expect(apiResponse.message).toBe('validation_error');
        expect(apiResponse.errors.shipment_id[0]).toBe('Either shipment_uuid or shipment_id is required.');
        expect(apiResponse.errors.shipment_uuid[0]).toBe('Either shipment_uuid or shipment_id is required.');
    });
}); 