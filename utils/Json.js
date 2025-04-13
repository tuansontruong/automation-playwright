/**
 * Utility functions for handling JSON data and API responses
 */

/**
 * Gets value from API response using JSON path
 * @param {Object} response - API response object
 * @param {string} jsonPath - Path to the property in JSON response
 * @returns {any} Value at the specified path
 */
export function getFromAPIResponse(response, jsonPath) {
    const path = jsonPath.split('.');
    let result = response;
    for (const key of path) {
        if (result === undefined || result === null) return undefined;
        result = result[key];
    }
    return result;
}

/**
 * Gets size of array from API response using JSON path
 * @param {Object} response - API response object
 * @param {string} jsonPath - Path to the array in JSON response
 * @returns {number} Size of the array
 */
export function getSizeFromAPIResponse(response, jsonPath) {
    const result = getFromAPIResponse(response, jsonPath);
    return Array.isArray(result) ? result.length : 0;
} 