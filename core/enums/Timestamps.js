/**
 * Enum representing different shipment tracking timestamps in the system.
 * This enum defines the standard tracking milestones that occur during
 * the lifecycle of a shipment from information received to delivery.
 */
const Timestamps = {
    /**
     * Indicates that shipment information has been received by the carrier.
     */
    INFORMATION_RECEIVED: {
        timeStone: "Information Received",
        getTimeStone: function() {
            return this.timeStone;
        }
    },

    /**
     * Indicates that the shipment has been picked up by the carrier.
     */
    PICKED_UP: {
        timeStone: "Picked Up",
        getTimeStone: function() {
            return this.timeStone;
        }
    },

    /**
     * Indicates that the shipment is being processed at a sorting facility.
     */
    PROCESSING: {
        timeStone: "Processing",
        getTimeStone: function() {
            return this.timeStone;
        }
    },

    /**
     * Indicates that the first delivery attempt has been made.
     */
    FIRST_DELIVERY_ATTEMPT: {
        timeStone: "First Delivery Attempt",
        getTimeStone: function() {
            return this.timeStone;
        }
    },

    /**
     * Indicates that the shipment has been successfully delivered.
     */
    DELIVERED: {
        timeStone: "Delivered",
        getTimeStone: function() {
            return this.timeStone;
        }
    },

    /**
     * Gets the timestamp object by its display text
     * @param {string} timeStone - The display text to search for
     * @returns {Object|null} The matching timestamp object or null if not found
     */
    getByTimeStone: function(timeStone) {
        return Object.values(this).find(timestamp => 
            timestamp.timeStone === timeStone
        ) || null;
    },

    /**
     * Gets all timestamp display texts
     * @returns {string[]} Array of all timestamp display texts
     */
    getAllTimeStones: function() {
        return Object.values(this)
            .filter(timestamp => typeof timestamp === 'object' && timestamp.timeStone)
            .map(timestamp => timestamp.timeStone);
    },

    /**
     * Checks if a timestamp exists with the given display text
     * @param {string} timeStone - The display text to check
     * @returns {boolean} True if the timestamp exists, false otherwise
     */
    hasTimeStone: function(timeStone) {
        return this.getAllTimeStones().includes(timeStone);
    }
};

module.exports = Timestamps; 