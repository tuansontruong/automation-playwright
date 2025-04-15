const { APIResponse } = require('@playwright/test');
const Endpoints = require('../constants/Endpoints');
const Waiting = require('../constants/Waiting');

const Returns = {
    /**
     * Creates a return request with the given payload
     * @param {string} publicAPIToken - The public API token for authentication
     * @param {Object} returnRequestPayload - The payload containing return request details
     * @returns {Promise<APIResponse>} - The API response
     */
    async createReturnRequest(publicAPIToken, returnRequestPayload) {

        // Configure and send the API request
        const url = `${Endpoints.PUBLIC_API_URL}v5/return/`;
        const headers = {
            'Authorization': `Bearer ${publicAPIToken}`,
            'Content-Type': 'application/json'
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(returnRequestPayload)
        });

        return response;
    },

    /**
     * Search for a single return request
     * @param {string} privateToken - Authentication token
     * @param {Object} objOrg - Organization object
     * @param {string} searchValue - Value to search for return request
     * @returns {Promise<Response>} API response
     */
    async searchReturnRequestSingle(privateToken, objOrg, searchValue) {
        const searchUrl = `${Endpoints.RETURN_URL}api/v1/parcel-perform/return-ticket/${objOrg.id}/`;
        const headers = {
            'Authorization': `Bearer ${privateToken}`,
            'Content-Type': 'application/json'
        };

        const searchBody = {
            search_string: searchValue
        };

        const response = await fetch(searchUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(searchBody)
        });

        if (!response.ok) {
            throw new Error(`Failed to search return request: ${response.statusText}`);
        }

        return response;
    },

    /**
     * Wait for a return request to be submitted and visible in the system
     * @param {string} privateToken - Authentication token
     * @param {Object} objOrg - Organization object
     * @param {string} searchValue - Value to search for return request
     * @param {number} timeout - Maximum time to wait in milliseconds
     * @returns {Promise<boolean>} True if return request is found
     */
    async waitForReturnRequest(privateToken, objOrg, searchValue, timeout = Waiting.WAIT_FOR_RETURN_REQUEST_SUBMITTED) {
        let elapsedTime = 0;

        for (let attempt = 0; attempt < 3; attempt++) {
            let response = await this.searchReturnRequestSingle(
                privateToken,
                objOrg,
                searchValue
            );
            let data = await response.json();

            while (elapsedTime < timeout) {
                const count = Number.parseInt(data.count);

                if (count > 0) {
                    console.log(
                        `Return request with keyword '${searchValue}' is found! <attempt: ${attempt}>`
                    );
                    return true;
                }

                console.log(`Waiting for return request with value [${searchValue}]...`);
                await new Promise(resolve => setTimeout(resolve, Waiting.MEDIUM_WAIT));
                elapsedTime += Waiting.MEDIUM_WAIT;

                response = await this.searchReturnRequestSingle(
                    privateToken,
                    objOrg,
                    searchValue
                );
                data = await response.json();
            }

            await new Promise(resolve => setTimeout(resolve, Waiting.MEDIUM_WAIT));
            elapsedTime += Waiting.MEDIUM_WAIT;
        }

        throw new Error(
            `FAILED TO WAIT FOR RETURN REQUEST TO BE DISPLAYED\n- Org ID: ${objOrg.id}\n- Return Request: ${searchValue}\n- Timeout: ${timeout / 1000} (seconds)`
        );
    }
};

module.exports = Returns; 