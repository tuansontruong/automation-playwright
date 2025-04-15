const { test, expect } = require('@playwright/test');
const { generateRandomAlphaNumberString } = require('../../utils/helpers/random');
const Shipments = require('../../core/api/Shipments');
const Merchants = require('../../core/enums/Merchants');
const Account = require('../../core/enums/Account');
const Authenticator = require('../../core/api/Authenticator');
const Authentication = require('../../core/api/Authentication');

// CRUD operations
// Data persistence
// Data consistency across operations

test.describe('TC_Update_Shipment_168_Verify_order_general_logic', () => {
    let nonPPToken;
    let publicApiToken;
    let objOrg;
    let randomString;
    let shipmentId;
    let shipmentOrderId;
    let shipmentOrderUuid;
    let shipmentOrderReference;
    let shipmentOrderSourceName;
    let shipmentOrderSourceType;
    let newOrderId;
    let newOrderUuid;
    let newOrderReference;
    let newOrderSourceName;
    let newOrderSourceType;
    let errMessage;

    test.beforeAll(async () => {
        const nonPPUser = Account.NON_PP_ACCOUNT1;
        const merchant = Merchants.SEAN_TEST_01;

        nonPPToken = await Authenticator.getNonPPAccessToken(nonPPUser);
        objOrg = await Authenticator.getOrgInfo(nonPPToken, merchant);
        publicApiToken = await Authentication.getPublicAPIAccessToken(objOrg);

        await setUpShipmentWithOrder();
    });

    async function setUpShipmentWithOrder() {
        randomString = generateRandomAlphaNumberString(10);
        shipmentId = `SID${randomString}`;
        shipmentOrderId = `OID_${randomString}`;
        shipmentOrderReference = `ORF_${randomString}`;
        shipmentOrderSourceName = `OSN_${randomString}`;
        shipmentOrderSourceType = `OST_${randomString}`;

        const createShipmentPayload = {
            shipment_id: shipmentId,
            order_id: shipmentOrderId,
            order_reference: shipmentOrderReference,
            order_source_name: shipmentOrderSourceName,
            order_source_type: shipmentOrderSourceType
        };

        const createShipmentResponse = await Shipments.createShipment(publicApiToken, createShipmentPayload);
        shipmentOrderUuid = createShipmentResponse.data.order_uuid;
    }

    test('Verify when updating shipment that contains order with new order_id', async () => {        

        newOrderId = `NEW_OID${randomString}`;

        const updateShipmentPayload = {
            order_id: newOrderId
        };

        const updateShipmentResponse = await Shipments.updateShipment(publicApiToken, shipmentId, updateShipmentPayload);
        const updateShipmentData = await updateShipmentResponse.json();
        newOrderUuid = updateShipmentData.data.order_uuid;

        // Verify response
        expect(updateShipmentResponse.status).toBe(200);
        expect(updateShipmentData.api_response).toBe('200');
        expect(newOrderUuid).not.toBe(shipmentOrderUuid);

        // Verify shipment details
        const res = await Shipments.retrieveShipment(publicApiToken, '<ignore>', shipmentId);
        const retrieveShipmentData = await res.json();

        expect(retrieveShipmentData.data.shipment_id).toBe(shipmentId);
        expect(retrieveShipmentData.data.order.order_uuid).toBe(newOrderUuid);
        expect(retrieveShipmentData.data.order.order_id).toBe(newOrderId);
        expect(retrieveShipmentData.data.order.order_reference).toBeNull();
        expect(retrieveShipmentData.data.order.source_type).toBeNull();
        expect(retrieveShipmentData.data.order.source_name).toBeNull();
    });

    test('Verify when updating shipment that contains order with new order_uuid', async () => {
        errMessage = 'Invalid format.';
        newOrderUuid = generateRandomAlphaNumberString(36); // Simulating UUID

        const updateShipmentPayload = {
            order_uuid: newOrderUuid
        };

        const updateShipmentResponse = await Shipments.updateShipment(publicApiToken, shipmentId, updateShipmentPayload);
        const updateShipmentData = await updateShipmentResponse.json();

        // Verify error response
        expect(updateShipmentResponse.status).toBe(400);
        expect(updateShipmentData.api_response).toBe('4030');
        expect(updateShipmentData.message).toBe('validation_error');
        expect(updateShipmentData.errors.order_uuid[0]).toBe(errMessage);
    });

    test('Verify when updating shipment that contains order with new order_reference', async () => {
        errMessage = 'Must provide order_id if order_reference is provided.';
        newOrderReference = `NEW_ORF${randomString}`;

        const updateShipmentPayload = {
            order_reference: newOrderReference
        };

        const updateShipmentResponse = await Shipments.updateShipment(publicApiToken, shipmentId, updateShipmentPayload);
        const updateShipmentData = await updateShipmentResponse.json();

        // Verify error response
        expect(updateShipmentResponse.status).toBe(400);
        expect(updateShipmentData.api_response).toBe('4030');
        expect(updateShipmentData.message).toBe('validation_error');
        expect(updateShipmentData.errors.order_reference[0]).toBe(errMessage);
    });

    test('Verify when updating shipment that contains order with new order_source_name', async () => {
        newOrderSourceName = `NEW_OSN${randomString}`;

        const updateShipmentPayload = {
            order_source_name: newOrderSourceName
        };

        const updateShipmentResponse = await Shipments.updateShipment(publicApiToken, shipmentId, updateShipmentPayload);
        const updateShipmentData = await updateShipmentResponse.json();

        // Verify response
        expect(updateShipmentResponse.status).toBe(200);
        expect(updateShipmentData.api_response).toBe('200');
        expect(updateShipmentData.data.order_uuid).toBe(shipmentOrderUuid);

        // Verify shipment details
        const res = await Shipments.retrieveShipment(publicApiToken, '<ignore>', shipmentId);
        const retrieveShipmentData = await res.json();

        expect(retrieveShipmentData.data.shipment_id).toBe(shipmentId);
        expect(retrieveShipmentData.data.order.order_uuid).toBe(shipmentOrderUuid);
        expect(retrieveShipmentData.data.order.order_id).toBe(shipmentOrderId);
        expect(retrieveShipmentData.data.order.order_reference).toBe(shipmentOrderReference);
        expect(retrieveShipmentData.data.order.source_type).toBe(shipmentOrderSourceType);
        expect(retrieveShipmentData.data.order.source_name).toBe(newOrderSourceName);
    });

    test('Verify when updating shipment that contains order with new order_source_type', async () => {
        newOrderSourceType = `NEW_OST${randomString}`;

        const updateShipmentPayload = {
            order_source_type: newOrderSourceType
        };

        const updateShipmentResponse = await Shipments.updateShipment(publicApiToken, shipmentId, updateShipmentPayload);
        const updateShipmentData = await updateShipmentResponse.json();

        // Verify response
        expect(updateShipmentResponse.status).toBe(200);
        expect(updateShipmentData.api_response).toBe('200');
        expect(updateShipmentData.data.order_uuid).toBe(shipmentOrderUuid);

        // Verify shipment details
        const res = await Shipments.retrieveShipment(publicApiToken, '<ignore>', shipmentId);
        const retrieveShipmentData = await res.json();

        expect(retrieveShipmentData.data.shipment_id).toBe(shipmentId);
        expect(retrieveShipmentData.data.order.order_uuid).toBe(shipmentOrderUuid);
        expect(retrieveShipmentData.data.order.order_id).toBe(shipmentOrderId);
        expect(retrieveShipmentData.data.order.order_reference).toBe(shipmentOrderReference);
        expect(retrieveShipmentData.data.order.source_type).toBe(newOrderSourceType);
        expect(retrieveShipmentData.data.order.source_name).toBe(shipmentOrderSourceName);
    });

    test('Verify when updating shipment that contains order with new order object', async () => {
        newOrderId = `NEW_OID${randomString}`;
        newOrderReference = `NEW_ORF${randomString}`;
        newOrderSourceType = `NEW_OST${randomString}`;
        newOrderSourceName = `NEW_OSN${randomString}`;

        const updateShipmentPayload = {
            order_id: newOrderId,
            order_reference: newOrderReference,
            order_source_type: newOrderSourceType,
            order_source_name: newOrderSourceName
        };

        const updateShipmentResponse = await Shipments.updateShipment(publicApiToken, shipmentId, updateShipmentPayload);
        const updateShipmentData = await updateShipmentResponse.json();
        newOrderUuid = updateShipmentData.data.order_uuid;

        // Verify response
        expect(updateShipmentResponse.status).toBe(200);
        expect(updateShipmentData.api_response).toBe('200');
        expect(newOrderUuid).not.toBe(shipmentOrderUuid);

        // Verify shipment details
        const res = await Shipments.retrieveShipment(publicApiToken, '<ignore>', shipmentId);
        const retrieveShipmentData = await res.json();
        const data = retrieveShipmentData.data;

        expect(data.shipment_id).toBe(shipmentId);
        expect(data.order.order_uuid).toBe(newOrderUuid);
        expect(data.order.order_id).toBe(newOrderId);
        expect(data.order.order_reference).toBe(newOrderReference);
        expect(data.order.source_type).toBe(newOrderSourceType);
        expect(data.order.source_name).toBe(newOrderSourceName);
    });
}); 