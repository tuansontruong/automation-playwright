/**
 * Enum representing different versions of the public API.
 * This enum defines the supported API versions and provides a mapping
 * between version identifiers and their string representations.
 */
const PublicAPIVersion = {
    /**
     * Represents version 5.0.0 of the public API.
     */
    V_5_0_0: {
        getVersion: () => 'v5'
    },

    /**
     * Represents version 5.2.1 of the public API.
     */
    V_5_2_1: {
        getVersion: () => 'v5-2-1'
    },

    /**
     * Represents version 5.2.0 of the public API.
     */
    V_5_2_0: {
        getVersion: () => 'v5-2-0'
    }
};

module.exports = PublicAPIVersion;