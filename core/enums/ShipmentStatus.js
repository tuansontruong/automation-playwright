/**
 * Enum representing different shipment statuses
 */
const ShipmentStatus = {
    CREATED: { getPPStatus: () => 'created' },
    PENDING: { getPPStatus: () => 'pending' },
    IN_TRANSIT: { getPPStatus: () => 'in_transit' },
    DELIVERED: { getPPStatus: () => 'delivered' },
    CANCELLED: { getPPStatus: () => 'cancelled' },
    FAILED: { getPPStatus: () => 'failed' },
    ACTIVE: { getPPStatus: () => 'active' },
};

module.exports = ShipmentStatus;