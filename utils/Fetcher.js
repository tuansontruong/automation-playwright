/**
 * Utility functions for making HTTP requests
 */

/**
 * Helper method to get headers with authentication
 * @param {string} token - Authentication token
 * @returns {Object} Headers object with authentication and content type
 */
function getHeaders(token) {
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

/**
 * Helper method to send GET request
 * @param {string} url - Request URL
 * @param {Object} headers - Request headers
 * @returns {Promise<Object>} Response data
 */
async function sendGetRequest(url, headers) {
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

/**
 * Helper method to send POST request
 * @param {string} url - Request URL
 * @param {Object} headers - Request headers
 * @param {Object} body - Request body
 * @returns {Promise<Object>} Response data
 */
async function sendPostRequest(url, headers, body) {
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });

    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

module.exports = {
    getHeaders,
    sendGetRequest,
    sendPostRequest
}; 