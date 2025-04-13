/**
 * Utility object for Base64 encoding and decoding operations.
 * Provides methods to encode and decode strings using Base64.
 */
const Encryption = {
    /**
     * Encodes a string to Base64
     * @param {string} text - The text to encode
     * @returns {string} The Base64 encoded string
     */
    encode(text) {
        if (!text) {
            throw new Error('Text to encode cannot be empty');
        }
        return Buffer.from(text).toString('base64');
    },

    /**
     * Decodes a Base64 string
     * @param {string} base64Text - The Base64 encoded string to decode
     * @returns {string} The decoded string
     */
    decode(base64Text) {
        if (!base64Text) {
            throw new Error('Base64 text to decode cannot be empty');
        }
        return Buffer.from(base64Text, 'base64').toString('utf-8');
    },

    /**
     * Checks if a string is Base64 encoded
     * @param {string} text - The text to check
     * @returns {boolean} True if the text is Base64 encoded, false otherwise
     */
    isBase64(text) {
        if (!text) {
            return false;
        }
        try {
            // Check if the string matches Base64 pattern
            const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
            if (!base64Regex.test(text)) {
                return false;
            }
            // Try to decode it to verify
            const decoded = Buffer.from(text, 'base64').toString('utf-8');
            // Try to encode it back to verify
            const encoded = Buffer.from(decoded).toString('base64');
            return encoded === text;
        } catch (error) {
            return false;
        }
    },

    /**
     * Encodes a URL string using UTF-8 encoding
     * @param {string} url - The URL string to encode
     * @returns {string} URL-encoded string
     * @throws {Error} if encoding fails
     */
    encodeUrl(url) {
        if (!url) {
            throw new Error('URL to encode cannot be empty');
        }
        try {
            return encodeURIComponent(url);
        } catch (error) {
            throw new Error(`Failed to encode URL: ${error.message}`);
        }
    }
};

module.exports = Encryption;
