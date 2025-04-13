/**
 * Enum representing different shipment statuses
 */
export const ShipmentStatus = {
    CREATED: { getPPStatus: () => 'CREATED' },
    PENDING: { getPPStatus: () => 'PENDING' },
    IN_TRANSIT: { getPPStatus: () => 'IN_TRANSIT' },
    DELIVERED: { getPPStatus: () => 'DELIVERED' },
    CANCELLED: { getPPStatus: () => 'CANCELLED' },
    FAILED: { getPPStatus: () => 'FAILED' },
    ACTIVE: { getPPStatus: () => 'ACTIVE' },
}; 