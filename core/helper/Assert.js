const { expect } = require('@playwright/test');

/**
 * Asserts that a condition is true
 * @param {boolean} condition - The condition to check
 * @param {string} message - Optional message to display if assertion fails
 */
async function assertTrue(condition, message = 'Expected condition to be true') {
    await expect(condition).toBe(true, message);
}

/**
 * Asserts that a condition is false
 * @param {boolean} condition - The condition to check
 * @param {string} message - Optional message to display if assertion fails
 */
async function assertFalse(condition, message = 'Expected condition to be false') {
    await expect(condition).toBe(false, message);
}

/**
 * Asserts that two values are equal
 * @param {*} actual - The actual value
 * @param {*} expected - The expected value
 * @param {string} message - Optional message to display if assertion fails
 */
async function assertEquals(actual, expected, message = `Expected ${expected} but got ${actual}`) {
    await expect(actual).toBe(expected, message);
}

/**
 * Asserts that an element is visible
 * @param {Page} page - The Playwright page object
 * @param {string} selector - The selector for the element
 * @param {string} message - Optional message to display if assertion fails
 */
async function assertElementVisible(page, selector, message = `Element ${selector} is not visible`) {
    await expect(page.locator(selector)).toBeVisible({ message });
}

/**
 * Asserts that an element is not visible
 * @param {Page} page - The Playwright page object
 * @param {string} selector - The selector for the element
 * @param {string} message - Optional message to display if assertion fails
 */
async function assertElementNotVisible(page, selector, message = `Element ${selector} is visible when it should not be`) {
    await expect(page.locator(selector)).toBeHidden({ message });
}

/**
 * Asserts that an element has specific text
 * @param {Page} page - The Playwright page object
 * @param {string} selector - The selector for the element
 * @param {string} expectedText - The expected text
 * @param {string} message - Optional message to display if assertion fails
 */
async function assertElementText(page, selector, expectedText, message = `Element ${selector} does not have text ${expectedText}`) {
    await expect(page.locator(selector)).toHaveText(expectedText, { message });
}

/**
 * Asserts that an element contains specific text
 * @param {Page} page - The Playwright page object
 * @param {string} selector - The selector for the element
 * @param {string} expectedText - The expected text
 * @param {string} message - Optional message to display if assertion fails
 */
async function assertElementContainsText(page, selector, expectedText, message = `Element ${selector} does not contain text ${expectedText}`) {
    await expect(page.locator(selector)).toContainText(expectedText, { message });
}

/**
 * Asserts that an element exists
 * @param {Page} page - The Playwright page object
 * @param {string} selector - The selector for the element
 * @param {string} message - Optional message to display if assertion fails
 */
async function assertElementExists(page, selector, message = `Element ${selector} does not exist`) {
    await expect(page.locator(selector)).toBeAttached({ message });
}

/**
 * Asserts that an element does not exist
 * @param {Page} page - The Playwright page object
 * @param {string} selector - The selector for the element
 * @param {string} message - Optional message to display if assertion fails
 */
async function assertElementNotExists(page, selector, message = `Element ${selector} exists when it should not`) {
    await expect(page.locator(selector)).not.toBeAttached({ message });
}

/**
 * Asserts that an array contains all expected elements
 * @param {Array} actual - The actual array
 * @param {Array} expected - The expected elements
 * @param {string} message - Optional message to display if assertion fails
 */
async function assertArrayContainsAll(actual, expected, message = 'Array does not contain all expected elements') {
    await expect(actual).toEqual(expect.arrayContaining(expected), message);
}

module.exports = {
    assertTrue,
    assertFalse,
    assertEquals,
    assertElementVisible,
    assertElementNotVisible,
    assertElementText,
    assertElementContainsText,
    assertElementExists,
    assertElementNotExists,
    assertArrayContainsAll
}; 