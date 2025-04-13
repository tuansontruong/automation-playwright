const Encryption = require('../helper/Encryption');
const Endpoints = require('../constants/Endpoints');
/**
 * Authentication object handles OAuth token generation for public API access
 * Provides functionality to generate access tokens using client credentials
 */
const Authentication = {
    /**
     * Generates an OAuth access token for public API authentication
     * Uses client credentials grant type flow
     *
     * @param {Object} org - Organization object containing clientID and clientSecret
     * @param {string} org.clientID - The client ID for API authentication
     * @param {string} org.clientSecret - The client secret for API authentication
     * @returns {Promise<string>} Combined token type and access token (e.g. "Bearer xyz123...")
     * @throws {Error} If client credentials are invalid or API request fails
     */
    async getPublicAPIAccessToken(org) {
        if (!org.clientID || !org.clientSecret) {
            throw new Error('Error: clientID or clientSecret are not valid for Organization.\n' +
                'Please double check:\n' +
                '- If having Public API Credential requested [PP Portal -> Settings -> Integrations -> API]\n' +
                '- Else if any issue when getting org info. [Already request Public API Credential but getting org details api does not return.]');
        }

        const url = Endpoints.PUBLIC_API_AUTH_TOKEN_URL;


        const authHeader = `Basic ${Encryption.encode(`${org.clientID}:${org.clientSecret}`)}`;

        
        const formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': authHeader
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            throw new Error(`Failed to get access token: ${error.message}`);
        }
    }
};

module.exports = Authentication; 