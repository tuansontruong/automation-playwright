const { test, expect } = require("@playwright/test");
const {
	generateRandomAlphaNumberString,
} = require("../../utils/helpers/random");
const Shipments = require("../../core/api/Shipments");
const Merchants = require("../../core/enums/Merchants");
const Account = require("../../core/enums/Account");
const Authenticator = require("../../core/api/Authenticator");
const Authentication = require("../../core/api/Authentication");
const OSReading = require("../../core/api/OSReading");
const Returns = require("../../core/api/Returns");


// Response Validation:
// 200: Success
// 400: Bad Request
// 403: Forbidden
// 422: Unprocessable Entity
// 500: Internal Server Error


test.describe("TC_Create_Return_004_Verify_response_when_create_return_with_return_id", () => {
	let nonPPToken;
	let publicAPIToken;
	let objOrg;
	let randomString;

	test.beforeAll(async () => {
		const nonPPUser = Account.NON_PP_ACCOUNT1;
		const merchant = Merchants.SEAN_TEST_01;
		randomString = generateRandomAlphaNumberString(7);
		nonPPToken = await Authenticator.getNonPPAccessToken(nonPPUser);
		objOrg = await Authenticator.getOrgInfo(nonPPToken, merchant);
		publicAPIToken = await Authentication.getPublicAPIAccessToken(objOrg);
	});

	test("Verify response when create return with valid return_id", async () => {
		const lineItem = {
			product_name: "Testing Prod Name",
		};

		const lineItems = [lineItem];

		const shipment = {
			shipment_id: `SID_1_${randomString}`,
			line_items: lineItems,
		};

		const returnTicket = {
			return_id: `RETURN_1_${randomString}`,
		};

		const returnRequestPayload = {
			shipment: shipment,
			return_ticket: returnTicket,
		};

		const res = await Returns.createReturnRequest(
			publicAPIToken,
			returnRequestPayload,
		);
		const createReturnResponse = await res.json();
		// Verify response
		expect(res.status).toBe(200);
		expect(createReturnResponse.api_response).toBe("200");

		await Returns.waitForReturnRequest(
			nonPPToken,
			objOrg,
			returnTicket.return_id,
		);
		await OSReading.waitForShipment(
			nonPPToken,
			objOrg.slug,
			shipment.shipment_id,
		);

		const res1 = await Shipments.retrieveShipment(
			publicAPIToken,
			'<ignore>',
			shipment.shipment_id,
		);
		const retrieveShipmentResponse = await res1.json();
		expect(retrieveShipmentResponse.data.status).toBe("open");
	});

	test("Verify response when create return without return_id", async () => {
		const lineItem = {
			product_name: "Testing Prod Name",
		};

		const lineItems = [lineItem];

		const shipment = {
			shipment_id: `SID_3_${randomString}`,
			line_items: lineItems,
		};

		const returnTicket = {};

		const returnPayload = {
			shipment: shipment,
			return_ticket: returnTicket,
		};

		const res = await Returns.createReturnRequest(
			publicAPIToken,
			returnPayload,
		);
		const createReturnResponse = await res.json();

		// Verify response
		expect(res.status).toBe(200);
		expect(createReturnResponse.api_response).toBe("200");
		expect(createReturnResponse.data.return_ticket.return_id).toBeNull();

		await OSReading.waitForShipment(
			nonPPToken,
			objOrg.slug,
			shipment.shipment_id,
		);

		const res1 = await Shipments.retrieveShipment(
			publicAPIToken,
			'<ignore>',
			shipment.shipment_id,
		);
		const retrieveShipmentResponse = await res1.json();
		expect(retrieveShipmentResponse.data.status).toBe("open");
	});

	test("Verify response when create return with null return_id", async () => {
		const lineItem = {
			product_name: "Testing Prod Name",
		};

		const lineItems = [lineItem];

		const shipment = {
			shipment_id: `SID_4_${randomString}`,
			line_items: lineItems,
		};

		const returnTicket = {
			return_id: null,
		};

		const returnPayload = {
			shipment: shipment,
			return_ticket: returnTicket,
		};

		const res = await Returns.createReturnRequest(
			publicAPIToken,
			returnPayload,
		);
		const createReturnResponse = await res.json();

		// Verify response
		expect(res.status).toBe(200);
		expect(createReturnResponse.api_response).toBe("200");
		expect(createReturnResponse.data.return_ticket.return_id).toBeNull();

		await OSReading.waitForShipment(
			nonPPToken,
			objOrg.slug,
			shipment.shipment_id,
		);

		const res1 = await Shipments.retrieveShipment(
			publicAPIToken,
			'<ignore>',
			shipment.shipment_id,
		);
		const retrieveShipmentResponse = await res1.json();
		expect(retrieveShipmentResponse.data.status).toBe("open");
	});

	test("Verify response when create return with empty return_id", async () => {
		const lineItem = {
			product_name: "Testing Prod Name",
		};

		const lineItems = [lineItem];

		const shipment = {
			shipment_id: `SID_5_${randomString}`,
			line_items: lineItems,
		};

		const returnTicket = {
			return_id: "",
		};

		const returnPayload = {
			shipment: shipment,
			return_ticket: returnTicket,
		};

		const res = await Returns.createReturnRequest(
			publicAPIToken,
			returnPayload,
		);
		const createReturnResponse = await res.json();

		// Verify response
		expect(res.status).toBe(400);
		expect(createReturnResponse.api_response).toBe("4030");
		expect(createReturnResponse.errors.return_ticket.non_field_errors[0]).toBe(
			"The fields return_id, organization_id must make a unique set.",
		);
	});

	test("Verify response when create return with invalid return_id", async () => {
		const lineItem = {
			product_name: "Testing Prod Name",
		};

		const lineItems = [lineItem];

		const shipment = {
			shipment_id: `SID_6_${randomString}`,
			line_items: lineItems,
		};

		const returnTicket = {
			return_id: true, // Invalid type
		};

		const returnPayload = {
			shipment: shipment,
			return_ticket: returnTicket,
		};

		const res = await Returns.createReturnRequest(
			publicAPIToken,
			returnPayload,
		);
		const createReturnResponse = await res.json();

		// Verify response
		expect(res.status).toBe(400);
		expect(createReturnResponse.api_response).toBe("4030");
		expect(createReturnResponse.errors.return_ticket.return_id[0]).toBe(
			"Not a valid string.",
		);
	});

	test("Verify response when create return with over limit character return_id", async () => {
		const lineItem = {
			product_name: "Testing Prod Name",
		};

		const lineItems = [lineItem];

		const shipment = {
			shipment_id: `SID_7_${randomString}`,
			line_items: lineItems,
		};

		const returnTicket = {
			return_id: generateRandomAlphaNumberString(51), // Over 50 characters
		};

		const returnPayload = {
			shipment: shipment,
			return_ticket: returnTicket,
		};

		const res = await Returns.createReturnRequest(
			publicAPIToken,
			returnPayload,
		);
		const createReturnResponse = await res.json();

		// Verify response
		expect(res.status).toBe(400);
		expect(createReturnResponse.api_response).toBe("4030");
		expect(createReturnResponse.errors.return_ticket.return_id[0]).toBe(
			"Ensure this field has no more than 50 characters.",
		);
	});
});
