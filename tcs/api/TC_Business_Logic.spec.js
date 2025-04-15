const { test, expect } = require("@playwright/test");
const {
	generateRandomAlphaNumberString,
} = require("../../utils/helpers/random");
const Shipments = require("../../core/api/Shipments");
const Merchants = require("../../core/enums/Merchants");
const Account = require("../../core/enums/Account");
const Authenticator = require("../../core/api/Authenticator");
const Authentication = require("../../core/api/Authentication");
const Events = require("../../core/enums/Events");
const ShipmentStatus = require("../../core/enums/ShipmentStatus");
const { format, addHours, parseISO } = require("date-fns");
const OSReading = require("../../core/api/OSReading");

/**
 * Converts a currency string to an object with amount and currency
 * @param {string} currencyString - The currency string in format "100 USD"
 * @returns {Object} - Object with amount and currency properties
 */
const parseCurrency = (currencyString) => {
	const [amount, currency] = currencyString.split(" ");
	return {
		amount: Number.parseFloat(amount),
		currency: currency,
	};
};

// Business Logic Testing
// End-to-end workflows

test.describe("TC_Update_Shipment_187_Verify_that_shipment_is_updated_full", () => {
	let nonPPToken;
	let publicApiToken;
	let objOrg;
	let randomString;
	let shipmentId;
	let updateShipmentPayload;

	test.beforeAll(async () => {
		const nonPPUser = Account.NON_PP_ACCOUNT1;
		const merchant = Merchants.SEAN_TEST_01;
		randomString = generateRandomAlphaNumberString(10);
		shipmentId = `SID${randomString}`;

		nonPPToken = await Authenticator.getNonPPAccessToken(nonPPUser);
		objOrg = await Authenticator.getOrgInfo(nonPPToken, merchant);
		publicApiToken = await Authentication.getPublicAPIAccessToken(objOrg);

		// Create initial shipment
		const createShipmentPayload = {
			shipment_id: shipmentId,
		};
		await Shipments.createShipment(publicApiToken, createShipmentPayload);
		await OSReading.waitForShipment(nonPPToken, objOrg.slug, shipmentId);
	});

	test("Update shipment with full fields", async () => {
		const today = new Date();
		const dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ssxxx";

		// Prepare test data
		const trackingNumber = `TE${randomString}`;
		const carrierReference = "ppmc";
		const shipmentReference = `SRF_${randomString}`;
		const additionalReference = `ADR${randomString}`;
		const eventDateTime = format(today, dateTimeFormat);
		const eventLocation = "Vietnam";
		const eventAdditionalValue = "25 Minutes Late";
		const eddStart = format(addHours(today, 1), dateTimeFormat);
		const eddEnd = format(addHours(today, 2), dateTimeFormat);

		// Prepare addresses
		const fromAddress = {
			address_name: "Parcel Perform 4",
			location_type: "Building",
			entity_reference: "Company",
			salutation: "Mr",
			first_name: "Transformer 4",
			last_name: "Squad",
			line1: "144 Ton Dat Tien",
			line2: "Tan Phong Ward",
			line3: "Dist 7",
			city: "Sai Gon",
			postal_code: "700000",
			state_or_province: "SG",
			region: "South",
			country: "Viet Nam",
			country_code: "VN",
			email: "automation@parcelperform.com",
			phone: "+84909090904",
			company: "Parcel Perform Tech Hub 4",
			tax_id: "000004",
		};

		const toAddress = {
			address_name: "Parcel Perform 3",
			location_type: "Building",
			entity_reference: "Company",
			salutation: "Mr",
			first_name: "Transformer 3",
			last_name: "Squad",
			line1: "143 Ton Dat Tien",
			line2: "Tan Phong Ward",
			line3: "Dist 7",
			city: "Sai Gon",
			postal_code: "700000",
			state_or_province: "SG",
			region: "South",
			country: "Viet Nam",
			country_code: "VN",
			email: "automation@parcelperform.com",
			phone: "+84909090903",
			company: "Parcel Perform Tech Hub 3",
			tax_id: "000003",
		};

		// Prepare order details
		const orderId = `OID${randomString}`;
		const orderReference = `OR${randomString}`;
		const orderSourceType = "OMS";
		const orderSourceName = "RetailSystemV1";

		// Prepare shipment details
		const currencyUnit = "USD";
		const shipmentValue = `100 ${currencyUnit}`;
		const totalShippingCost = `10 ${currencyUnit}`;
		const codValue = `40 ${currencyUnit}`;
		const paymentType = "COD";
		const shipmentAdditionalValue = "PO additional info";
		const tags = ["test tag"];

		// Prepare dimensions and weight
		const dimensions = {
			height: 15,
			width: 25,
			length: 25,
			unit: "cm",
		};
		const weight = "1.5 kg";

		// Prepare shipping costs
		const shippingCosts = [
			{
				name: "Pack 1",
				reference: "0001",
				unit_quantity: 2,
				unit_cost: `30 ${currencyUnit}`,
				total_cost: `30 ${currencyUnit}`,
			},
		];

		// Prepare events
		const events = [
			{
				description: Events.D20.eventRaw,
				date_time: eventDateTime,
				location: {
					place: eventLocation,
				},
				additional_info: {
					field_header: eventAdditionalValue,
				},
			},
		];

		// Prepare documents
		const documents = [
			{
				name: "User Guide",
				document_id: "DOC0001",
				type: "instruction",
				file_format: "PDF",
				link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
				created_date: "2022-01-01T03:00:00+00:00",
				additional_info: {
					field_header: "Document Additional Info",
				},
			},
		];

		// Prepare line items
		const lineItems = [
			{
				product_name: "Test Product Name",
				product_id: `PRO_${randomString}`,
				product_reference: `PRO_REF_${randomString}`,
				product_category: "Sports / Football / Boots",
				product_description: "Test Product Description",
				product_origin_country_code: "TH",
				hs_code: randomString,
				customs_description: "Test Customs Description",
				quantity: 3,
				product_image_url: "https://example.com/image.jpg",
				product_url: "https://www.sportsstore.com/?product_id=F4172",
				product_weight: 230,
				product_weight_unit: "g",
				line_item_weight: "0.69",
				line_item_weight_unit: "kg",
				currency_code: currencyUnit,
				product_cost: 99.99,
				subtotal_cost: 299.97,
				discount_amount: 30,
				tax_amount: 29.99,
				misc_cost: 15.5,
				total_price: 200,
				additional_info: {
					delivery_method: "2 day-web",
					packaging: "box bundle",
				},
			},
		];

		// Prepare update payload
		updateShipmentPayload = {
			shipment_reference: shipmentReference,
			additional_reference: additionalReference,
			tracking_number: trackingNumber,
			carrier_reference: carrierReference,
			events: events,
			expected_delivery: {
				from: eddStart,
				to: eddEnd,
			},
			from_address: fromAddress,
			to_address: toAddress,
			order: {
				order_id: orderId,
				order_reference: orderReference,
				source_type: orderSourceType,
				source_name: orderSourceName,
			},
			cod_value: codValue,
			payment_type: paymentType,
			additional_info: {
				field_header: shipmentAdditionalValue,
			},
			tags: tags,
			shipping_costs: shippingCosts,
			total_shipping_cost: totalShippingCost,
			dimensions: dimensions,
			weight: weight,
			packaging_type: "Jiffy Pack",
			shipment_value: shipmentValue,
			item_count: 20,
			description_of_goods: "Parcel description",
			sales_channel: "eCommerce",
			handling_instructions: "Parcel handling instruction",
			notification_email: ["performparcel@gmail.com.com"],
			notification_phone: ["+84909090909"],
			documents: documents,
			note: "This parcel is very fragile.",
			shipping_service: "GHTK",
			line_items: lineItems,
		};

		// Update shipment
		const res = await Shipments.updateShipment(
			publicApiToken,
			shipmentId,
			updateShipmentPayload,
		);
		const updateShipmentResponse = await res.json();

		// Verify response
		expect(res.status).toBe(200);
		expect(updateShipmentResponse.api_response).toBe("200");

		// Wait for shipment to be active
		await Shipments.waitForShipmentStatus(
			publicApiToken,
			shipmentId,
			ShipmentStatus.ACTIVE,
		);

		// Verify updated shipment details
		const resData = await Shipments.retrieveShipment(
			publicApiToken,
			'<ignore>',
			shipmentId,
		);
		const retrieveShipmentResponse = await resData.json();
		const shipmentData = retrieveShipmentResponse.data;

		// Verify basic fields
		expect(shipmentData.shipment_id).toBe(shipmentId);
		expect(shipmentData.shipment_reference).toBe(shipmentReference);
		expect(shipmentData.additional_reference).toBe(additionalReference);
		expect(shipmentData.tracking_number.toUpperCase()).toBe(
			trackingNumber.toUpperCase(),
		);
		expect(shipmentData.carrier_reference).toBe(carrierReference);
		expect(shipmentData.tags).toEqual(tags);
		expect(shipmentData.notification_email).toEqual([
			"performparcel@gmail.com.com",
		]);
		expect(shipmentData.notification_phone).toEqual(["+84909090909"]);

		// Verify addresses
		const expectedFromAddressFull =
			"Mr Transformer 4 Squad, 144 Ton Dat Tien, Tan Phong Ward, Dist 7, 700000, Sai Gon, SG, South, Viet Nam";
		expect(shipmentData.from_address).toEqual({
			...fromAddress,
			full: expectedFromAddressFull,
		});
		const expectedToAddressFull =
			"Mr Transformer 3 Squad, 143 Ton Dat Tien, Tan Phong Ward, Dist 7, 700000, Sai Gon, SG, South, Viet Nam";
		expect(shipmentData.to_address).toEqual({
			...toAddress,
			full: expectedToAddressFull,
		});

		// Verify financial details
		expect(shipmentData.shipment_value).toEqual(parseCurrency(shipmentValue));
		expect(shipmentData.total_shipping_cost).toEqual(
			parseCurrency(totalShippingCost),
		);

		// Verify dimensions and weight
		expect(shipmentData.dimensions).toEqual({});
		expect(shipmentData.weight).toEqual({ amount: 1500, unit: "g" });

		// Verify delivery details
		expect(shipmentData.expected_delivery).toEqual({});
		expect(shipmentData.payment_type).toBe(paymentType);
		expect(shipmentData.item_count).toBe(20);
		expect(shipmentData.packaging_type).toBe("Jiffy Pack");
		expect(shipmentData.note).toBe("This parcel is very fragile.");
		expect(shipmentData.shipping_service).toBe("GHTK");
		expect(shipmentData.description_of_goods).toBe("Parcel description");
		expect(shipmentData.handling_instructions).toBe(
			"Parcel handling instruction",
		);
		expect(shipmentData.sales_channel).toBe("eCommerce");

		// Verify additional info
		expect(shipmentData.additional_info).toEqual({
			field_header: shipmentAdditionalValue,
		});

		// Verify events
		expect(shipmentData.all_events[0].event).toBe("Pick-up successful");
		// expect(shipmentData.all_events[0].time).toBe(eventDateTime);
		expect(shipmentData.all_events[0].location.place).toBe(eventLocation);
		expect(shipmentData.all_events[0].additional_info.field_header).toBe(
			eventAdditionalValue,
		);
		// Verify line items
		expect(shipmentData.line_items).toEqual(undefined);
	});
});
