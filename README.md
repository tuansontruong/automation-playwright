# Playwright TestNG Automation Framework

This is a comprehensive automation framework for testing both UI and APIs using Playwright and TestNG.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
4. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### All Tests
```bash
npm test
```

### Test Suites
- Run all regression tests:
  ```bash
  npm run test:regression
  ```
- Run all smoke tests:
  ```bash
  npm run test:smoke
  ```
- Run all on-demand tests:
  ```bash
  npm run test:on-demand
  ```

### Module-Specific Tests
- Run shipment overview UI tests:
  ```bash
  npm run test:shipment:ui
  ```
- Run shipment overview API tests:
  ```bash
  npm run test:shipment:api
  ```
- Run carrier overview UI tests:
  ```bash
  npm run test:carrier:ui
  ```
- Run carrier overview API tests:
  ```bash
  npm run test:carrier:api
  ```
- Run return overview UI tests:
  ```bash
  npm run test:return:ui
  ```
- Run return overview API tests:
  ```bash
  npm run test:return:api
  ```

### Reports
View test report:
```bash
npm run report
```

## Project Structure

```
├── tests/
│   ├── regression/         # Regression test suite
│   │   ├── ui/            # UI regression tests
│   │   └── api/           # API regression tests
│   ├── smoke/             # Smoke test suite
│   │   ├── ui/            # UI smoke tests
│   │   └── api/           # API smoke tests
│   └── on-demand/         # On-demand test suite
│       ├── shipment-overview/  # Shipment module
│       │   ├── ui/            # UI tests for shipments
│       │   └── api/           # API tests for shipments
│       ├── carrier-overview/  # Carrier module
│       │   ├── ui/            # UI tests for carriers
│       │   └── api/           # API tests for carriers
│       └── return-overview/   # Return module
│           ├── ui/            # UI tests for returns
│           └── api/           # API tests for returns
├── pages/                 # Page object models
├── utils/                 # Utility functions
├── config/                # Configuration files
├── playwright.config.js
├── package.json
└── .env                  # Environment variables
```

## Module Organization

### Shipment Overview Module
- Shipment tracking and status
- Delivery details and updates
- Package information
- Shipping labels and documentation

### Carrier Overview Module
- Carrier performance metrics
- Service coverage areas
- Delivery time estimates
- Carrier-specific features

### Return Overview Module
- Return initiation process
- Return status tracking
- Refund processing
- Return label generation

## Writing Tests

### UI Tests
Create new UI tests in the appropriate module directory under `tests/on-demand/`. Use page objects from `pages/` directory for better maintainability.

### API Tests
Create new API tests in the appropriate module directory under `tests/on-demand/`. Use the base API client setup for making requests.

## Best Practices

1. Use page objects for UI elements
2. Keep tests independent and atomic
3. Use environment variables for configuration
4. Follow the AAA pattern (Arrange, Act, Assert)
5. Use meaningful test descriptions
6. Implement proper error handling
7. Use data-driven testing where appropriate
8. Tag tests appropriately for module organization
9. Keep module-specific tests focused on their domain
10. Maintain clear separation between modules 