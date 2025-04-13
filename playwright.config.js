const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
	testDir: "./tcs",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [["html"], ["list"], ["json", { outputFile: "playwright-report/test-results.json" }]],
	use: {
		baseURL: process.env.BASE_URL || "http://localhost:9081",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
		launchOptions: {
			args: ["--start-maximized"],
			slowMo: 50,
		},
		contextOptions: {
			viewport: { width: 1920, height: 1080 },
		},
	},
	projects: [
		{
			name: "on_demand_carrier_overview",
			testMatch: require("./suites/01. On-Demand/CarrierOverview.suite.js"),
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "on_demand_return_overview",
			testMatch: require("./suites/01. On-Demand/ReturnOverview.suite.js"),
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "on_demand_shipment_overview",
			testMatch: require("./suites/01. On-Demand/ShipmentOverview.suite.js"),
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "regression_prod",
			testMatch: require("./suites/02. Regression/RegressionProd.suite.js"),
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "regression_test",
			testMatch: require("./suites/02. Regression/RegressionTest.suite.js"),
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "smoke_test",
			testMatch: require("./suites/03. Smoke/SmokeTest.suite.js"),
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
