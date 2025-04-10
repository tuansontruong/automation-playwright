const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.describe('Login Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL);
  });

  test('should login with valid credentials', async ({ page }) => {
    // Test implementation
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password123');
    await page.click('#login-button');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Test implementation
    await page.fill('#username', 'invalid');
    await page.fill('#password', 'wrong');
    await page.click('#login-button');
    await expect(page.locator('.error-message')).toBeVisible();
  });
}); 