const { test, expect } = require('@playwright/test');

test.describe('TC_Intentional_Failed', () => {
    test('TC_Intentional_Failed', async ({ page }) => {
        // This test is intentionally failing to demonstrate:

        // Intentionally fail the test with a clear message
        expect(false).toBe(true, 'This test is intentionally failing to demonstrate failure handling in the test suite');
    });
});
