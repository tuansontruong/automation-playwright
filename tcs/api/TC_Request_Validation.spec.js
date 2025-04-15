const { test, expect } = require('@playwright/test');
const { generateRandomAlphaNumberString } = require('../../utils/helpers/random');
const Shipments = require('../../core/api/Shipments');
const PublicAPIVersion = require('../../core/enums/PublicAPIVersion');
const Merchants = require('../../core/enums/Merchants');
const Account = require('../../core/enums/Account');
const Authenticator = require('../../core/api/Authenticator');
const Authentication = require('../../core/api/Authentication');

// Request Validation API test
// Input parameter validation
// Required vs optional fields
// Data type validation
// Parameter format validation

test.describe('TC_Get_Shipment_General_001_Verify_user_can_get_shipment_with_only_shipment_id', () => {
    let shipmentId;
    let shipmentUuid;
    let publicApiToken;
    let nonPPToken;
    let objOrg;

    test.beforeAll(async () => {
        // Generate random shipment ID
        const randomString = generateRandomAlphaNumberString(10);
        shipmentId = `SID_${randomString}`;

        // Get authentication tokens
        const nonPPUser = Account.NON_PP_ACCOUNT1;
        const merchant = Merchants.SEAN_TEST_01;

        nonPPToken = await Authenticator.getNonPPAccessToken(nonPPUser);
        objOrg = await Authenticator.getOrgInfo(nonPPToken, merchant);
        publicApiToken = await Authentication.getPublicAPIAccessToken(objOrg);

        // Create shipment
        const shipment = {
            shipment_id: shipmentId
        };
        const createShipmentResp = await Shipments.createShipment(publicApiToken, shipment);
        shipmentUuid = createShipmentResp.data.shipment_uuid;
    });

    test('Verify get shipment v5 only with shipment id', async () => {
        const res = await Shipments.getShipment(
            publicApiToken,
            PublicAPIVersion.V_5_0_0,
            `shipment_id=${shipmentId}`
        );

        const apiResponse = await res.json();

        // Verify status code
        expect(res.status).toBe(200);
        
        // Verify API response
        expect(apiResponse.api_response).toBe('200');
        expect(apiResponse.data.shipment_uuid).toBe(shipmentUuid);
        expect(apiResponse.data.shipment_id).toBe(shipmentId);
        
        // Verify null/empty fields
        expect(apiResponse.data.shipment_reference).toBeNull();
        expect(apiResponse.data.additional_reference).toBeNull();
        expect(apiResponse.data.tracking_number).toBeNull();
        expect(apiResponse.data.carrier_reference).toBeNull();
        expect(apiResponse.data.carrier.id).toBe('');
        expect(apiResponse.data.carrier.name).toBe('');
        expect(apiResponse.data.carrier.country_iso).toEqual([]);
        expect(apiResponse.data.carrier.language).toBeNull();
        expect(apiResponse.data.carrier.supported_languages).toEqual([]);
        expect(apiResponse.data.carrier.contact).toBe('');
        expect(apiResponse.data.carrier.site_link).toBe('');
        expect(apiResponse.data.source).toBe('api');
        expect(apiResponse.data.status).toBe('open');
        expect(apiResponse.data.current_phase.key).toBeNull();
        expect(apiResponse.data.current_phase.name).toBeNull();
        expect(apiResponse.data.tags).toEqual([]);
        expect(apiResponse.data.notification_email).toEqual([]);
        expect(apiResponse.data.notification_phone).toEqual([]);
        expect(apiResponse.data.tracking_page_reference).toBeNull();
        expect(apiResponse.data.order).toBeNull();
        expect(apiResponse.data.recipient_address).toBeNull();
        expect(apiResponse.data.sender_address).toBeNull();
        expect(apiResponse.data.to_address).toBeNull();
        expect(apiResponse.data.from_address).toBeNull();
        expect(apiResponse.data.return_address).toBeNull();
        expect(apiResponse.data.shipment_value).toEqual({});
        expect(apiResponse.data.total_shipping_cost).toEqual({});
        expect(apiResponse.data.shipping_costs).toEqual([]);
        expect(apiResponse.data.cod_value).toEqual({});
        expect(apiResponse.data.dimensions).toEqual({});
        expect(apiResponse.data.weight).toEqual({});
        expect(apiResponse.data.linked_shipments).toEqual([]);
        expect(apiResponse.data.expected_delivery).toEqual({});
        expect(apiResponse.data.payment_type).toBeNull();
        expect(apiResponse.data.item_count).toBeNull();
        expect(apiResponse.data.packaging_type).toBeNull();
        expect(apiResponse.data.note).toBeNull();
        expect(apiResponse.data.shipping_service).toBeNull();
        expect(apiResponse.data.description_of_goods).toBeNull();
        expect(apiResponse.data.handling_instructions).toBeNull();
        expect(apiResponse.data.sales_channel).toBeNull();
        expect(apiResponse.data.documents).toEqual([]);
        expect(apiResponse.data.additional_info).toEqual({});
        expect(apiResponse.data.all_events).toEqual([]);
    });

    test('Verify get shipment v5_2_0 - shipment only with shipment id', async () => {
        const res = await Shipments.getShipment(
            publicApiToken,
            PublicAPIVersion.V_5_2_0,
            `shipment_id=${shipmentId}`
        );

        const apiResponse = await res.json();

        // Verify status code
        expect(res.status).toBe(200);
        
        // Verify API response
        expect(apiResponse.api_response).toBe('200');
        expect(apiResponse.data.shipment_uuid).toBe(shipmentUuid);
        expect(apiResponse.data.shipment_id).toBe(shipmentId);
        
        // Verify null/empty fields
        expect(apiResponse.data.shipment_reference).toBeNull();
        expect(apiResponse.data.additional_reference).toBeNull();
        expect(apiResponse.data.tracking_number).toBeNull();
        expect(apiResponse.data.carrier_reference).toBeNull();
        expect(apiResponse.data.carrier.id).toBe('');
        expect(apiResponse.data.carrier.name).toBe('');
        expect(apiResponse.data.carrier.country_iso).toEqual([]);
        expect(apiResponse.data.carrier.language).toBeNull();
        expect(apiResponse.data.carrier.supported_languages).toEqual([]);
        expect(apiResponse.data.carrier.contact).toBe('');
        expect(apiResponse.data.carrier.site_link).toBe('');
        expect(apiResponse.data.source).toBe('api');
        expect(apiResponse.data.status).toBe('open');
        expect(apiResponse.data.current_phase.key).toBeNull();
        expect(apiResponse.data.current_phase.name).toBeNull();
        expect(apiResponse.data.tags).toEqual([]);
        expect(apiResponse.data.notification_email).toEqual([]);
        expect(apiResponse.data.notification_phone).toEqual([]);
        expect(apiResponse.data.tracking_page_reference).toBeNull();
        expect(apiResponse.data.order).toBeNull();
        expect(apiResponse.data.recipient_address).toBeNull();
        expect(apiResponse.data.sender_address).toBeNull();
        expect(apiResponse.data.to_address).toBeNull();
        expect(apiResponse.data.from_address).toBeNull();
        expect(apiResponse.data.return_address).toBeNull();
        expect(apiResponse.data.shipment_value).toEqual({});
        expect(apiResponse.data.total_shipping_cost).toEqual({});
        expect(apiResponse.data.shipping_costs).toEqual([]);
        expect(apiResponse.data.cod_value).toEqual({});
        expect(apiResponse.data.dimensions).toEqual({});
        expect(apiResponse.data.weight).toEqual({});
        expect(apiResponse.data.linked_shipments).toEqual([]);
        expect(apiResponse.data.expected_delivery).toEqual({});
        expect(apiResponse.data.payment_type).toBeNull();
        expect(apiResponse.data.item_count).toBeNull();
        expect(apiResponse.data.packaging_type).toBeNull();
        expect(apiResponse.data.note).toBeNull();
        expect(apiResponse.data.shipping_service).toBeNull();
        expect(apiResponse.data.description_of_goods).toBeNull();
        expect(apiResponse.data.handling_instructions).toBeNull();
        expect(apiResponse.data.sales_channel).toBeNull();
        expect(apiResponse.data.documents).toEqual([]);
        expect(apiResponse.data.additional_info).toEqual({});
        expect(apiResponse.data.all_events).toEqual([]);
    });

    test('Verify get shipment v5_2_1 - shipment only with shipment id', async () => {
        const res = await Shipments.getShipment(
            publicApiToken,
            PublicAPIVersion.V_5_2_1,
            `shipment_id=${shipmentId}`
        );

        const apiResponse = await res.json();

        // Verify status code
        expect(res.status).toBe(200);
        
        // Verify API response
        expect(apiResponse.api_response).toBe('200');
        expect(apiResponse.data.shipment_uuid).toBe(shipmentUuid);
        expect(apiResponse.data.shipment_id).toBe(shipmentId);
        
        // Verify null/empty fields
        expect(apiResponse.data.shipment_reference).toBeNull();
        expect(apiResponse.data.additional_reference).toBeNull();
        expect(apiResponse.data.tracking_number).toBeNull();
        expect(apiResponse.data.carrier_reference).toBeNull();
        expect(apiResponse.data.carrier.id).toBe('');
        expect(apiResponse.data.carrier.name).toBe('');
        expect(apiResponse.data.carrier.country_iso).toEqual([]);
        expect(apiResponse.data.carrier.language).toBeNull();
        expect(apiResponse.data.carrier.supported_languages).toEqual([]);
        expect(apiResponse.data.carrier.contact).toBe('');
        expect(apiResponse.data.carrier.site_link).toBe('');
        expect(apiResponse.data.source).toBe('api');
        expect(apiResponse.data.status).toBe('open');
        expect(apiResponse.data.current_phase.key).toBeNull();
        expect(apiResponse.data.current_phase.name).toBeNull();
        expect(apiResponse.data.tags).toEqual([]);
        expect(apiResponse.data.notification_email).toEqual([]);
        expect(apiResponse.data.notification_phone).toEqual([]);
        expect(apiResponse.data.tracking_page_reference).toBeNull();
        expect(apiResponse.data.order).toBeNull();
        expect(apiResponse.data.recipient_address).toBeNull();
        expect(apiResponse.data.sender_address).toBeNull();
        expect(apiResponse.data.to_address).toBeNull();
        expect(apiResponse.data.from_address).toBeNull();
        expect(apiResponse.data.return_address).toBeNull();
        expect(apiResponse.data.shipment_value).toEqual({});
        expect(apiResponse.data.total_shipping_cost).toEqual({});
        expect(apiResponse.data.shipping_costs).toEqual([]);
        expect(apiResponse.data.cod_value).toEqual({});
        expect(apiResponse.data.dimensions).toEqual({});
        expect(apiResponse.data.weight).toEqual({});
        expect(apiResponse.data.linked_shipments).toEqual([]);
        expect(apiResponse.data.expected_delivery).toEqual({});
        expect(apiResponse.data.payment_type).toBeNull();
        expect(apiResponse.data.item_count).toBeNull();
        expect(apiResponse.data.packaging_type).toBeNull();
        expect(apiResponse.data.note).toBeNull();
        expect(apiResponse.data.shipping_service).toBeNull();
        expect(apiResponse.data.description_of_goods).toBeNull();
        expect(apiResponse.data.handling_instructions).toBeNull();
        expect(apiResponse.data.sales_channel).toBeNull();
        expect(apiResponse.data.documents).toEqual([]);
        expect(apiResponse.data.additional_info).toEqual({});
        expect(apiResponse.data.all_events).toEqual([]);
    });
}); 