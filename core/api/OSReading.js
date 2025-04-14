const Endpoints = require("../constants/Endpoints");
const Waiting = require("../constants/Waiting");
const ShipmentStatus = require("../enums/ShipmentStatus");
const DateTime = require("../../utils/DateTime");
const Json = require("../../utils/Json");
// const Reports = require('../utils/Reports');

/**
 * OSReading API wrapper for handling shipment-related operations in the OS Reading system.
 * Provides functionality for:
 * - Searching shipments
 * - Retrieving shipment details
 * - Waiting for shipment status changes
 * - Monitoring shipment availability
 */
const OSReading = {
	/**
	 * Search for shipments in the OS Reading system
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipments
	 * @param {number} quantity - Number of results to return
	 * @returns {Promise<Response>} API response containing search results
	 */
	async searchShipments(privateToken, orgSlug, searchValue, quantity) {
		const body = {
			accept_pending_parcel: true,
		};

		if (searchValue !== "<ignore>") {
			body.search_string = searchValue;
		}
		if (quantity > 0) {
			body.quantity = quantity;
		}

		const url = `${Endpoints.OS_READING_URL}api/v1/parcel-overview/shipments/${orgSlug}/`;

		const headers = {
			Authorization: `Bearer ${privateToken}`,
			"Content-Type": "application/json",
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(`Failed to search shipments: ${error.message}`);
		}
	},

	/**
	 * Search for a single shipment in the OS Reading system
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @returns {Promise<Response>} API response containing search result
	 */
	async searchShipmentsSingle(privateToken, orgSlug, searchValue) {
		return this.searchShipments(privateToken, orgSlug, searchValue, 1);
	},

	/**
	 * Get the primary key (ID) of a shipment
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @returns {Promise<number>} Shipment ID
	 */
	async getShipmentPk(privateToken, orgSlug, searchValue) {
		const response = await this.searchShipmentsSingle(
			privateToken,
			orgSlug,
			searchValue,
		);
		const data = await response.json();
		return Number.parseInt(data.data[0].id);
	},

	/**
	 * Wait for a shipment property to match an expected value
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @param {string} jsonPath - JSON path to the property to check
	 * @param {*} expectedValue - Expected value of the property
	 * @param {boolean} toBeMatched - True if property should match, false if it should not match
	 * @param {number} timeout - Maximum time to wait in milliseconds
	 * @returns {Promise<boolean>} True if condition is met within timeout
	 */
	async waitForSearchedShipmentProperty(
		privateToken,
		orgSlug,
		searchValue,
		jsonPath,
		expectedValue,
		toBeMatched,
		timeout = 100000,
	) {
		let time = 0;
		let currentValue = null;

		while (true) {
			try {
				const response = await this.searchShipmentsSingle(
					privateToken,
					orgSlug,
					searchValue,
				);
				const data = await response.json();
				currentValue = data.data[0].shipment_status;

				if (currentValue === expectedValue) {
					break;
				}
			} catch (error) {
				// Reports.logMessage(error.message);
				console.error(error.message);
			}

			if (time > timeout) {
				throw new Error(
					`FAILED TO WAIT FOR SHIPMENT PROPERTY\n- Org: ${orgSlug}\n- Shipment: ${searchValue}\n- Details:\n  + Property: ${jsonPath}\n  + To be matched: ${toBeMatched}\n  + Actual: ${currentValue}\n  + Expected: ${expectedValue}\n  + Timeout: ${timeout / 1000} (seconds)`,
				);
			}

			await DateTime.wait(Waiting.MEDIUM_WAIT);
			time += Waiting.MEDIUM_WAIT;
		}
	},

	/**
	 * Wait for a shipment to become unavailable in search results
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @param {number} timeout - Maximum time to wait in milliseconds
	 * @returns {Promise<boolean>} True if shipment becomes unavailable
	 */
	async waitForShipmentUnavailable(
		privateToken,
		orgSlug,
		searchValue,
		timeout,
	) {
		// Reports.logKeywordName();
		let tempTime = 0;

		while (true) {
			const response = await this.searchShipmentsSingle(
				privateToken,
				orgSlug,
				searchValue,
			);
			const data = await response.json();
			const count = Number.parseInt(data.count);

			if (count < 1) {
				// Reports.logDescription(`Shipment with keyword '${searchValue}' is NOT found!`);
				console.log(`Shipment with keyword '${searchValue}' is NOT found!`);
				return true;
			}

			console.log(`Waiting for shipment with value [${searchValue}]...`);
			await DateTime.wait(Waiting.MEDIUM_WAIT);
			tempTime += Waiting.MEDIUM_WAIT;

			if (tempTime >= timeout) {
				throw new Error(
					`FAILED TO WAIT FOR SHIPMENT TO BE DISAPPEARED\n- Org Slug: ${orgSlug}\n- Shipment: ${searchValue}\n- Timeout: ${timeout / 1000} (seconds)`,
				);
			}
		}
	},

	/**
	 * Wait for a shipment to become available in search results
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @param {number} timeout - Maximum time to wait in milliseconds
	 * @returns {Promise<boolean>} True if shipment is found
	 */
	async waitForShipmentAvailable(privateToken, orgSlug, searchValue, timeout) {
		let elapsedTime = 0;

		for (let attempt = 0; attempt < 3; attempt++) {
			let response = await this.searchShipmentsSingle(
				privateToken,
				orgSlug,
				searchValue,
			);
			let data = await response.json();

			while (elapsedTime < timeout) {
				const count = Number.parseInt(data.count);

				if (count > 0) {
					console.log(
						`Shipment with keyword '${searchValue}' is found! <attempt: ${attempt}>`,
					);
					return true;
				}
				console.log(`Waiting for shipment with value [${searchValue}]...`);
				await new Promise((resolve) =>
					setTimeout(resolve, Waiting.MEDIUM_WAIT),
				);
				elapsedTime += Waiting.MEDIUM_WAIT;

				response = await this.searchShipmentsSingle(
					privateToken,
					orgSlug,
					searchValue,
				);
				data = await response.json();
			}

			await new Promise((resolve) => setTimeout(resolve, Waiting.MEDIUM_WAIT));
			elapsedTime += Waiting.MEDIUM_WAIT;
		}

		throw new Error(
			`FAILED TO WAIT FOR SHIPMENT TO BE DISPLAYED\n- Org Slug: ${orgSlug}\n- Shipment: ${searchValue}\n- Timeout: ${timeout / 1000} (seconds)`,
		);
	},

	/**
	 * Wait for a shipment property to match an expected value using default timeout
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @param {string} jsonPath - JSON path to the property to check
	 * @param {*} expectedValue - Expected value of the property
	 * @param {boolean} toBeMatched - True if property should match, false if it should not match
	 * @returns {Promise<boolean>} True if condition is met within default timeout
	 */
	async waitForSearchedShipmentPropertyDefault(
		privateToken,
		orgSlug,
		searchValue,
		jsonPath,
		expectedValue,
		toBeMatched,
	) {
		return this.waitForSearchedShipmentProperty(
			privateToken,
			orgSlug,
			searchValue,
			jsonPath,
			expectedValue,
			toBeMatched,
			Waiting.WAIT_FOR_SHIPMENT_PROPERTY,
		);
	},

	/**
	 * Wait for a shipment property to match an expected value (assumes toBeMatched=true)
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @param {string} jsonPath - JSON path to the property to check
	 * @param {*} expectedValue - Expected value of the property
	 * @returns {Promise<boolean>} True if property matches expected value within timeout
	 */
	async waitForSearchedShipmentPropertySimple(
		privateToken,
		orgSlug,
		searchValue,
		jsonPath,
		expectedValue,
	) {
		return this.waitForSearchedShipmentProperty(
			privateToken,
			orgSlug,
			searchValue,
			jsonPath,
			expectedValue,
			true,
			Waiting.WAIT_FOR_SHIPMENT_PROPERTY,
		);
	},

	/**
	 * Wait for a shipment to become available or unavailable
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @param {number} timeout - Maximum time to wait in milliseconds
	 * @param {boolean} available - True to wait for available, false for unavailable
	 * @returns {Promise<boolean>} True if desired condition is met
	 */
	async waitForShipment(
		privateToken,
		orgSlug,
		searchValue,
		timeout = 30000,
		available = true,
	) {
		if (available) {
			return this.waitForShipmentAvailable(
				privateToken,
				orgSlug,
				searchValue,
				timeout,
			);
		}
		return this.waitForShipmentUnavailable(
			privateToken,
			orgSlug,
			searchValue,
			timeout,
		);
	},

	/**
	 * Wait for a shipment to become available using default timeout
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @returns {Promise<boolean>} True if shipment becomes available
	 */
	async waitForShipmentDefault(privateToken, orgSlug, searchValue) {
		return this.waitForShipment(
			privateToken,
			orgSlug,
			searchValue,
			Waiting.WAIT_FOR_SHIPMENT,
			true,
		);
	},

	/**
	 * Wait for a shipment to become unavailable using default timeout
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @returns {Promise<boolean>} True if shipment becomes unavailable
	 */
	async waitForShipmentUnavailableDefault(privateToken, orgSlug, searchValue) {
		return this.waitForShipmentUnavailable(
			privateToken,
			orgSlug,
			searchValue,
			Waiting.WAIT_FOR_SHIPMENT,
		);
	},

	/**
	 * Wait for a shipment to reach a specific status
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @param {ShipmentStatus} status - Expected shipment status
	 * @param {boolean} toBeMatched - True if status should match, false if it should not match
	 * @param {number} timeout - Maximum time to wait in milliseconds
	 * @returns {Promise<boolean>} True if status condition is met within timeout
	 */
	async waitForShipmentStatus(
		privateToken,
		orgSlug,
		searchValue,
		status,
		toBeMatched,
		timeout,
	) {
		return this.waitForSearchedShipmentProperty(
			privateToken,
			orgSlug,
			searchValue,
			"data[0].shipment_status",
			status.getPPStatus().toLowerCase(),
			toBeMatched,
			timeout,
		);
	},

	/**
	 * Wait for a shipment status using default timeout
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @param {ShipmentStatus} status - Expected shipment status
	 * @param {boolean} toBeMatched - True if status should match, false if it should not match
	 * @returns {Promise<boolean>} True if status condition is met within default timeout
	 */
	async waitForShipmentStatusDefault(
		privateToken,
		orgSlug,
		searchValue,
		status,
		toBeMatched,
	) {
		return this.waitForShipmentStatus(
			privateToken,
			orgSlug,
			searchValue,
			status,
			toBeMatched,
			Waiting.WAIT_FOR_SHIPMENT_STATUS,
		);
	},

	/**
	 * Wait for a shipment to reach a specific status (assumes toBeMatched=true)
	 * @param {string} privateToken - Authentication token
	 * @param {string} orgSlug - Organization identifier
	 * @param {string} searchValue - Value to search for shipment
	 * @param {ShipmentStatus} status - Expected shipment status
	 * @returns {Promise<boolean>} True if shipment reaches expected status within timeout
	 */
	async waitForShipmentStatusSimple(
		privateToken,
		orgSlug,
		searchValue,
		status,
	) {
		return this.waitForShipmentStatus(
			privateToken,
			orgSlug,
			searchValue,
			status,
			true,
			Waiting.WAIT_FOR_SHIPMENT_STATUS,
		);
	},
};

module.exports = OSReading;
