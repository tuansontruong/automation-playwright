const {
	getFromAPIResponse,
	getSizeFromAPIResponse,
} = require("../../utils/Json");
const { PUBLIC_API_URL } = require("../constants/Endpoints");
const {
	WAIT_FOR_SHIPMENT_STATUS,
	WAIT_FOR_SHIPMENT_PROPERTY,
	MEDIUM_WAIT,
} = require("../constants/Waiting");
const PublicAPIVersion = require("../enums/PublicAPIVersion");
const { ShipmentStatus } = require("../enums/ShipmentStatus");
const {
	getHeaders,
	sendGetRequest,
	sendPostRequest,
} = require("../../utils/Fetcher");

/**
 * Shipments module handles comprehensive shipment operations via public API
 * Provides functionality for creating, updating, retrieving and tracking shipments
 */

/**
 * Creates a new shipment through the API
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {Object} body - Shipment details in JSON format
 * @returns {Promise<Response>} Response containing shipment creation confirmation
 */
export async function createShipment(publicApiToken, body) {
	const url = `${PUBLIC_API_URL}v5/shipment/`;
	const headers = getHeaders(publicApiToken);
	return sendPostRequest(url, headers, body);
}

/**
 * Waits for shipment to reach specified status with custom timeout
 * Polls shipment status until it matches expected status or timeout occurs
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} shipmentId - Shipment identifier
 * @param {ShipmentStatus} status - Expected shipment status to wait for
 * @param {number} timeout - Maximum wait time in milliseconds
 */
export async function waitForShipmentStatusWithTimeout(
	publicApiToken,
	shipmentId,
	status,
	timeout,
) {
	const res = await retrieveShipment(publicApiToken, '<ignore>', shipmentId);
	const response = await res.json();
	let currentStatus = response.data.status;
	let time = 0;

	while (currentStatus !== status.getPPStatus()) {
		// await wait(MEDIUM_WAIT);
		time += MEDIUM_WAIT;
		const res = await retrieveShipment(publicApiToken, '<ignore>', shipmentId);
		const response = await res.json();
		currentStatus = response.data.status;

		if (time > timeout) {
			throw new Error(
				`Shipment status is not updated on DB after ${timeout / 1000} seconds!`,
			);
		}
	}
}

/**
 * Waits for shipment to reach specified status using default timeout
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} shipmentId - Shipment identifier
 * @param {ShipmentStatus} status - Expected shipment status to wait for
 */
export async function waitForShipmentStatus(
	publicApiToken,
	shipmentId,
	status,
) {
	await waitForShipmentStatusWithTimeout(
		publicApiToken,
		shipmentId,
		status,
		WAIT_FOR_SHIPMENT_STATUS,
	);
}

/**
 * Updates an existing shipment with version specification
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} shipmentUuid - Unique UUID of the shipment
 * @param {string} shipmentId - Shipment identifier
 * @param {Object} body - Updated shipment details in JSON format
 * @param {PublicAPIVersion} version - API version to use
 * @returns {Promise<Response>} Response containing update confirmation
 */
export async function updateShipmentWithVersion(
	publicApiToken,
	shipmentUuid,
	shipmentId,
	body,
	version,
) {
	let url = `${PUBLIC_API_URL}${version.getVersion()}/shipment/update/?`;
	if (shipmentId !== "<ignore>") {
		url += `shipment_id=${shipmentId}`;
	}
	if (shipmentId !== "<ignore>" && shipmentUuid !== "<ignore>") {
		url += "&";
	}
	if (shipmentUuid !== "<ignore>") {
		url += `shipment_uuid=${shipmentUuid}`;
	}
	const headers = getHeaders(publicApiToken);
	return await fetch(url, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(body),
	});
}

/**
 * Updates shipment using default API version (v5.0.0)
 */
export async function updateShipment(
	publicApiToken,
	shipmentId,
	body,
	shipmentUuid="<ignore>",
) {
	return updateShipmentWithVersion(
		publicApiToken,
		shipmentUuid,
		shipmentId,
		body,
		PublicAPIVersion.V_5_0_0,
	);
}

/**
 * Updates shipment using shipmentId only
 */
export async function updateShipmentById(publicApiToken, shipmentId, body) {
	return updateShipmentWithVersion(
		publicApiToken,
		"<ignore>",
		shipmentId,
		body,
		PublicAPIVersion.V_5_0_0,
	);
}

/**
 * Retrieves shipment details using UUID and/or shipment ID
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} shipmentUuid - Unique UUID of the shipment
 * @param {string} shipmentId - Shipment identifier
 * @returns {Promise<Response>} Response containing shipment details
 */
export async function retrieveShipmentWithUuid(
	publicApiToken,
	shipmentUuid,
	shipmentId,
) {
	let url = `${PUBLIC_API_URL}v5/shipment/details/?`;
	if (shipmentId !== "<ignore>") {
		url += `shipment_id=${shipmentId}`;
	}
	if (shipmentId !== "<ignore>" && shipmentUuid !== "<ignore>") {
		url += "&";
	}
	if (shipmentUuid !== "<ignore>") {
		url += `shipment_uuid=${shipmentUuid}`;
	}
	const headers = getHeaders(publicApiToken);
	return await fetch(url, {
		method: "GET",
		headers: headers,
	});
}

/**
 * Retrieves shipment details using shipment ID only
 */
export async function retrieveShipment(publicApiToken, shipmentUuid="<ignore>", shipmentId="<ignore>") {
	return retrieveShipmentWithUuid(publicApiToken, shipmentUuid, shipmentId);
}

/**
 * Gets shipment UUID using shipment ID
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} shipmentId - Shipment identifier
 * @returns {Promise<string>} UUID of the shipment
 */
export async function getShipmentUuid(publicApiToken, shipmentId) {
	const response = await retrieveShipment(publicApiToken, shipmentId);
	return getFromAPIResponse(response, "data.shipment_uuid");
}

/**
 * Retrieves list of shipments based on query parameters
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} queryString - Query parameters for filtering shipments
 * @returns {Promise<Response>} Response containing list of shipments
 */
export async function getListShipment(publicApiToken, queryString) {
	const url = `${PUBLIC_API_URL}v5/shipment/list/?${queryString}`;
	const headers = getHeaders(publicApiToken);
	return sendGetRequest(url, headers);
}

/**
 * Verifies if a shipment property matches expected value
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} shipmentId - Shipment identifier
 * @param {string} jsonPath - Path to the property in JSON response
 * @param {string} expectedValue - Value to compare against
 * @returns {Promise<boolean>} True if property matches expected value
 */
export async function isShipmentProperty(
	publicApiToken,
	shipmentId,
	jsonPath,
	expectedValue,
) {
	const response = await retrieveShipment(publicApiToken, shipmentId);
	return getFromAPIResponse(response, jsonPath) === expectedValue;
}

/**
 * Waits for shipment property to match expected value with custom timeout
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} shipmentId - Shipment identifier
 * @param {string} jsonPath - Path to the property in JSON response
 * @param {string} expectedValue - Value to wait for
 * @param {number} timeout - Maximum wait time in milliseconds
 * @returns {Promise<boolean>} True if property matches within timeout period
 */
export async function waitForShipmentPropertyWithTimeout(
	publicApiToken,
	shipmentId,
	jsonPath,
	expectedValue,
	timeout,
) {
	let time = 0;
	while (
		!(await isShipmentProperty(
			publicApiToken,
			shipmentId,
			jsonPath,
			expectedValue,
		))
	) {
		//  await wait(MEDIUM_WAIT);
		time += MEDIUM_WAIT;
		if (time > timeout) {
			return false;
		}
	}
	return true;
}

/**
 * Waits for shipment property with default timeout
 */
export async function waitForShipmentProperty(
	publicApiToken,
	shipmentId,
	jsonPath,
	expectedValue,
) {
	return waitForShipmentPropertyWithTimeout(
		publicApiToken,
		shipmentId,
		jsonPath,
		expectedValue,
		WAIT_FOR_SHIPMENT_PROPERTY,
	);
}

/**
 * Checks if specific shipment event is updated
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} shipmentId - Shipment identifier
 * @param {string} eventKey - Key identifier for the event
 * @returns {Promise<boolean>} True if event exists in shipment history
 */
export async function isShipmentEventUpdated(
	publicApiToken,
	shipmentId,
	eventKey,
) {
	const response = await retrieveShipment(publicApiToken, shipmentId);
	return (
		getSizeFromAPIResponse(
			response,
			`data.all_events[?(@.event_key=='${eventKey}')]`,
		) > 0
	);
}

/**
 * Waits for shipment event to be updated with custom timeout
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} shipmentId - Shipment identifier
 * @param {string} eventKey - Key identifier for the event
 * @param {number} timeout - Maximum wait time in milliseconds
 * @returns {Promise<boolean>} True if event is updated within timeout period
 */
export async function waitForShipmentEventUpdatedWithTimeout(
	publicApiToken,
	shipmentId,
	eventKey,
	timeout,
) {
	let time = 0;
	while (
		!(await isShipmentEventUpdated(publicApiToken, shipmentId, eventKey))
	) {
		//  await wait(MEDIUM_WAIT);
		time += MEDIUM_WAIT;
		if (time > timeout) {
			return false;
		}
	}
	return true;
}

/**
 * Waits for shipment event to be updated with default timeout
 */
export async function waitForShipmentEventUpdated(
	publicApiToken,
	shipmentId,
	eventKey,
) {
	return waitForShipmentEventUpdatedWithTimeout(
		publicApiToken,
		shipmentId,
		eventKey,
		WAIT_FOR_SHIPMENT_PROPERTY,
	);
}

/**
 * Checks if property in shipment list matches expected value
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} queryString - Query parameters for filtering
 * @param {string} jsonPath - Path to the property in JSON response
 * @param {string} expectedValue - Value to compare against
 * @returns {Promise<boolean>} True if property matches expected value
 */
export async function isListShipmentProperty(
	publicApiToken,
	queryString,
	jsonPath,
	expectedValue,
) {
	try {
		const response = await getListShipment(publicApiToken, queryString);
		return getFromAPIResponse(response, jsonPath) === expectedValue;
	} catch (error) {
		return false;
	}
}

/**
 * Waits for property in shipment list to match expected value
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {string} queryString - Query parameters for filtering
 * @param {string} jsonPath - Path to the property in JSON response
 * @param {string} expectedValue - Value to wait for
 * @param {number} timeout - Maximum wait time in milliseconds
 * @returns {Promise<boolean>} True if property matches within timeout period
 */
export async function waitForListShipmentProperty(
	publicApiToken,
	queryString,
	jsonPath,
	expectedValue,
	timeout,
) {
	let time = 0;
	while (
		!(await isListShipmentProperty(
			publicApiToken,
			queryString,
			jsonPath,
			expectedValue,
		))
	) {
		//  await wait(MEDIUM_WAIT);
		time += MEDIUM_WAIT;
		if (time > timeout) {
			return false;
		}
	}
	return true;
}

/**
 * Tracks shipment with specified API version
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {Object} body - Tracking request details in JSON format
 * @param {PublicAPIVersion} version - API version to use
 * @returns {Promise<Response>} Response containing tracking information
 */
export async function trackShipmentWithVersion(publicApiToken, body, version) {
	const url = `${PUBLIC_API_URL}${version.getVersion()}/shipment/track/`;
	const headers = getHeaders(publicApiToken);
	return await fetch(url, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(body),
	});
}

/**
 * Tracks shipment using default API version (v5.2.0)
 */
export async function trackShipment(publicApiToken, body) {
	return trackShipmentWithVersion(
		publicApiToken,
		body,
		PublicAPIVersion.V_5_2_0,
	);
}

/**
 * Gets shipment details with specific API version
 * @param {string} publicApiToken - OAuth access token for authentication
 * @param {PublicAPIVersion} publicAPIVersion - API version to use
 * @param {string} queryString - Query parameters for filtering
 * @returns {Promise<Response>} Response containing shipment details
 */
export async function getShipment(
	publicApiToken,
	publicAPIVersion,
	queryString,
) {
	const url = `${PUBLIC_API_URL}${publicAPIVersion.getVersion()}/shipment/details/?${queryString}`;
	const headers = getHeaders(publicApiToken);
	return await fetch(url, {
		method: "GET",
		headers: headers,
	});
}
