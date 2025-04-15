const { test, expect } = require('@playwright/test');
const { generateRandomAlphaNumberString } = require('../../utils/helpers/random');
const { getFromAPIResponse } = require('../../utils/Json');
const { trackShipment } = require('../../core/api/Shipments');

// Authentication and Authorization Testing
//Testing with valid/invalid tokens
//Token expiration scenarios

test('Verify unable to track shipment without token', async () => {
    const randomString = generateRandomAlphaNumberString(7);
    const trackingNumber = `PID_${randomString}`;
    const carrierReference = 'ppmc';

    // Step 1: Track shipment without token
    const shipment = {
        tracking_number: trackingNumber,
        carrier_reference: carrierReference
    };

    const trackShipmentResp = await trackShipment('', shipment);
    // Verify error message in response
    const responseBody = await trackShipmentResp.json();
    
    // Verify status code
    expect(trackShipmentResp.status).toBe(403);
    
    // Verify API response
    expect(getFromAPIResponse(responseBody, 'api_response')).toBe(403);
    
    // Verify error message
    expect(getFromAPIResponse(responseBody, 'message')).toBe('Key not authorized');
}); 