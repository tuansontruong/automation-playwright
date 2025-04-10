const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.describe('Shipment Overview UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL + '/shipments');
  });

  test('should display shipment details correctly', async ({ page }) => {
    await page.fill('#shipment-id', 'SHIP123');
    await page.click('#search-button');
    await expect(page.locator('.shipment-details')).toBeVisible();
    await expect(page.locator('.tracking-number')).toContainText('SHIP123');
  });

  test('should show shipment status updates', async ({ page }) => {
    await page.click('.status-timeline');
    await expect(page.locator('.status-updates')).toBeVisible();
    await expect(page.locator('.latest-status')).toContainText(/In Transit|Delivered/);
  });
}); 