const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.describe('Critical Path Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL);
  });

  test('should load homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Home/);
    await expect(page.locator('.main-content')).toBeVisible();
  });

  test('should access main navigation', async ({ page }) => {
    await page.click('.nav-menu');
    await expect(page.locator('.nav-items')).toBeVisible();
  });
}); 