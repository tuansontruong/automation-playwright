const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.describe('Return Overview UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/returns`);
  });

  test('should initiate return process', async ({ page }) => {
    await page.fill('#order-number', 'ORD123');
    await page.click('#initiate-return');
    await expect(page.locator('.return-label')).toBeVisible();
    await expect(page.locator('.return-instructions')).toBeVisible();
  });

  test('should track return status', async ({ page }) => {
    await page.fill('#return-id', 'RET123');
    await page.click('#track-return');
    await expect(page.locator('.return-status')).toBeVisible();
    await expect(page.locator('.estimated-refund')).toBeVisible();
  });
}); 