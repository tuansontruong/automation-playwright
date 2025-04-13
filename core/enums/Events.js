/**
 * Enumeration of all possible tracking events in the shipping lifecycle.
 * Each event represents a specific status or milestone in the shipping process.
 * 
 * Event Format:
 * - eventRaw: Internal transformer event code
 * - eventName: Human readable event name
 * - eventKey: Unique event identifier
 * - eventDisplayName: Customer-facing event name
 * - eventStage: Status type (regular/delay/exception)
 * - phaseKey: Single letter phase identifier (A-Y)
 * - phaseName: Human readable phase name
 * - exception: Exception category if applicable
 */

const Events = {
    // Helper methods
    getEventRaw(event) {
        return event.eventRaw;
    },

    getEventName(event) {
        return event.eventName;
    },

    getEventKey(event) {
        return event.eventKey;
    },

    getEventDisplayName(event) {
        return event.eventDisplayName;
    },

    getEventStage(event) {
        return event.eventStage;
    },

    getPhaseName(event) {
        return event.phaseName;
    },

    getPhaseKey(event) {
        return event.phaseKey;
    },

    getException(event) {
        return event.exception;
    },

    // Phase A: Order Events
    A10: {
        eventRaw: "TRANSFORMER_A10",
        eventName: "(R) Order created",
        eventKey: "A10",
        eventDisplayName: "Order created",
        eventStage: "regular",
        phaseKey: "A",
        phaseName: "Order Events",
        exception: ""
    },
    A20: {
        eventRaw: "TRANSFORMER_A20",
        eventName: "(R) Order confirmed",
        eventKey: "A20",
        eventDisplayName: "Order confirmed",
        eventStage: "regular",
        phaseKey: "A",
        phaseName: "Order Events",
        exception: ""
    },
    A30: {
        eventRaw: "TRANSFORMER_A30",
        eventName: "(R) Order cancelled",
        eventKey: "A30",
        eventDisplayName: "Order cancelled",
        eventStage: "regular",
        phaseKey: "A",
        phaseName: "Order Events",
        exception: ""
    },
    A40: {
        eventRaw: "TRANSFORMER_A40",
        eventName: "(R) Order completed",
        eventKey: "A40",
        eventDisplayName: "Order completed",
        eventStage: "regular",
        phaseKey: "A",
        phaseName: "Order Events",
        exception: ""
    },
    // Phase B: Pickup Events
    B10: {
        eventRaw: "TRANSFORMER_B10",
        eventName: "(R) Pickup scheduled",
        eventKey: "B10",
        eventDisplayName: "Pickup scheduled",
        eventStage: "regular",
        phaseKey: "B",
        phaseName: "Pickup Events",
        exception: ""
    },
    B20: {
        eventRaw: "TRANSFORMER_B20",
        eventName: "(R) Pickup completed",
        eventKey: "B20",
        eventDisplayName: "Pickup completed",
        eventStage: "regular",
        phaseKey: "B",
        phaseName: "Pickup Events",
        exception: ""
    },
    B30: {
        eventRaw: "TRANSFORMER_B30",
        eventName: "(R) Pickup cancelled",
        eventKey: "B30",
        eventDisplayName: "Pickup cancelled",
        eventStage: "regular",
        phaseKey: "B",
        phaseName: "Pickup Events",
        exception: ""
    },
    B40: {
        eventRaw: "TRANSFORMER_B40",
        eventName: "(R) Pickup rescheduled",
        eventKey: "B40",
        eventDisplayName: "Pickup rescheduled",
        eventStage: "regular",
        phaseKey: "B",
        phaseName: "Pickup Events",
        exception: ""
    },
    // Phase C: In Transit Events
    C10: {
        eventRaw: "TRANSFORMER_C10",
        eventName: "(R) In transit",
        eventKey: "C10",
        eventDisplayName: "In transit",
        eventStage: "regular",
        phaseKey: "C",
        phaseName: "In Transit Events",
        exception: ""
    },
    C20: {
        eventRaw: "TRANSFORMER_C20",
        eventName: "(R) Arrived at facility",
        eventKey: "C20",
        eventDisplayName: "Arrived at facility",
        eventStage: "regular",
        phaseKey: "C",
        phaseName: "In Transit Events",
        exception: ""
    },
    C30: {
        eventRaw: "TRANSFORMER_C30",
        eventName: "(R) Departed facility",
        eventKey: "C30",
        eventDisplayName: "Departed facility",
        eventStage: "regular",
        phaseKey: "C",
        phaseName: "In Transit Events",
        exception: ""
    },
    C40: {
        eventRaw: "TRANSFORMER_C40",
        eventName: "(R) Out for delivery",
        eventKey: "C40",
        eventDisplayName: "Out for delivery",
        eventStage: "regular",
        phaseKey: "C",
        phaseName: "In Transit Events",
        exception: ""
    },
    // Phase D: Delivery Events
    D10: {
        eventRaw: "TRANSFORMER_D10",
        eventName: "(R) Delivery scheduled",
        eventKey: "D10",
        eventDisplayName: "Delivery scheduled",
        eventStage: "regular",
        phaseKey: "D",
        phaseName: "Delivery Events",
        exception: ""
    },
    D20: {
        eventRaw: "TRANSFORMER_D20",
        eventName: "(R) Delivery completed",
        eventKey: "D20",
        eventDisplayName: "Delivery completed",
        eventStage: "regular",
        phaseKey: "D",
        phaseName: "Delivery Events",
        exception: ""
    },
    D30: {
        eventRaw: "TRANSFORMER_D30",
        eventName: "(R) Delivery cancelled",
        eventKey: "D30",
        eventDisplayName: "Delivery cancelled",
        eventStage: "regular",
        phaseKey: "D",
        phaseName: "Delivery Events",
        exception: ""
    },
    D40: {
        eventRaw: "TRANSFORMER_D40",
        eventName: "(R) Delivery rescheduled",
        eventKey: "D40",
        eventDisplayName: "Delivery rescheduled",
        eventStage: "regular",
        phaseKey: "D",
        phaseName: "Delivery Events",
        exception: ""
    },
    // Phase E: Return Events
    E10: {
        eventRaw: "TRANSFORMER_E10",
        eventName: "(R) Return requested",
        eventKey: "E10",
        eventDisplayName: "Return requested",
        eventStage: "regular",
        phaseKey: "E",
        phaseName: "Return Events",
        exception: ""
    },
    E20: {
        eventRaw: "TRANSFORMER_E20",
        eventName: "(R) Return scheduled",
        eventKey: "E20",
        eventDisplayName: "Return scheduled",
        eventStage: "regular",
        phaseKey: "E",
        phaseName: "Return Events",
        exception: ""
    },
    E30: {
        eventRaw: "TRANSFORMER_E30",
        eventName: "(R) Return completed",
        eventKey: "E30",
        eventDisplayName: "Return completed",
        eventStage: "regular",
        phaseKey: "E",
        phaseName: "Return Events",
        exception: ""
    },
    E40: {
        eventRaw: "TRANSFORMER_E40",
        eventName: "(R) Return cancelled",
        eventKey: "E40",
        eventDisplayName: "Return cancelled",
        eventStage: "regular",
        phaseKey: "E",
        phaseName: "Return Events",
        exception: ""
    },
    // Phase F: Exception Events
    F10: {
        eventRaw: "TRANSFORMER_F10",
        eventName: "(E) Delivery failed",
        eventKey: "F10",
        eventDisplayName: "Delivery failed",
        eventStage: "exception",
        phaseKey: "F",
        phaseName: "Exception Events",
        exception: "Delivery failed"
    },
    F20: {
        eventRaw: "TRANSFORMER_F20",
        eventName: "(E) Lost in transit",
        eventKey: "F20",
        eventDisplayName: "Lost in transit",
        eventStage: "exception",
        phaseKey: "F",
        phaseName: "Exception Events",
        exception: "Lost in transit"
    },
    F30: {
        eventRaw: "TRANSFORMER_F30",
        eventName: "(E) Damaged in transit",
        eventKey: "F30",
        eventDisplayName: "Damaged in transit",
        eventStage: "exception",
        phaseKey: "F",
        phaseName: "Exception Events",
        exception: "Damaged in transit"
    },
    F40: {
        eventRaw: "TRANSFORMER_F40",
        eventName: "(E) Return to sender",
        eventKey: "F40",
        eventDisplayName: "Return to sender",
        eventStage: "exception",
        phaseKey: "F",
        phaseName: "Exception Events",
        exception: "Return to sender"
    },
    // Phase G: Resolution Events
    G10: {
        eventRaw: "TRANSFORMER_G10",
        eventName: "(R) Resolution initiated",
        eventKey: "G10",
        eventDisplayName: "Resolution initiated",
        eventStage: "regular",
        phaseKey: "G",
        phaseName: "Resolution Events",
        exception: ""
    },
    G20: {
        eventRaw: "TRANSFORMER_G20",
        eventName: "(R) Resolution completed",
        eventKey: "G20",
        eventDisplayName: "Resolution completed",
        eventStage: "regular",
        phaseKey: "G",
        phaseName: "Resolution Events",
        exception: ""
    },
    G30: {
        eventRaw: "TRANSFORMER_G30",
        eventName: "(R) Resolution cancelled",
        eventKey: "G30",
        eventDisplayName: "Resolution cancelled",
        eventStage: "regular",
        phaseKey: "G",
        phaseName: "Resolution Events",
        exception: ""
    },
    G40: {
        eventRaw: "TRANSFORMER_G40",
        eventName: "(R) Resolution failed",
        eventKey: "G40",
        eventDisplayName: "Resolution failed",
        eventStage: "regular",
        phaseKey: "G",
        phaseName: "Resolution Events",
        exception: ""
    },
    // Phase H: Final Status Events
    H10: {
        eventRaw: "TRANSFORMER_H10",
        eventName: "(F) Shipment completed",
        eventKey: "H10",
        eventDisplayName: "Shipment completed",
        eventStage: "final",
        phaseKey: "H",
        phaseName: "Final Status Events",
        exception: ""
    },
    H20: {
        eventRaw: "TRANSFORMER_H20",
        eventName: "(F) Shipment cancelled",
        eventKey: "H20",
        eventDisplayName: "Shipment cancelled",
        eventStage: "final",
        phaseKey: "H",
        phaseName: "Final Status Events",
        exception: ""
    },
    H30: {
        eventRaw: "TRANSFORMER_H30",
        eventName: "(F) Shipment failed",
        eventKey: "H30",
        eventDisplayName: "Shipment failed",
        eventStage: "final",
        phaseKey: "H",
        phaseName: "Final Status Events",
        exception: ""
    },
    H40: {
        eventRaw: "TRANSFORMER_H40",
        eventName: "(F) Shipment archived",
        eventKey: "H40",
        eventDisplayName: "Shipment archived",
        eventStage: "final",
        phaseKey: "H",
        phaseName: "Final Status Events",
        exception: ""
    },
    // Phase I: System Events
    I10: {
        eventRaw: "TRANSFORMER_I10",
        eventName: "(S) System error",
        eventKey: "I10",
        eventDisplayName: "System error",
        eventStage: "system",
        phaseKey: "I",
        phaseName: "System Events",
        exception: ""
    },
    I20: {
        eventRaw: "TRANSFORMER_I20",
        eventName: "(S) System warning",
        eventKey: "I20",
        eventDisplayName: "System warning",
        eventStage: "system",
        phaseKey: "I",
        phaseName: "System Events",
        exception: ""
    },
    I30: {
        eventRaw: "TRANSFORMER_I30",
        eventName: "(S) System notification",
        eventKey: "I30",
        eventDisplayName: "System notification",
        eventStage: "system",
        phaseKey: "I",
        phaseName: "System Events",
        exception: ""
    },
    I40: {
        eventRaw: "TRANSFORMER_I40",
        eventName: "(S) System maintenance",
        eventKey: "I40",
        eventDisplayName: "System maintenance",
        eventStage: "system",
        phaseKey: "I",
        phaseName: "System Events",
        exception: ""
    },
    // Phase J: Customer Service Events
    J10: {
        eventRaw: "TRANSFORMER_J10",
        eventName: "(CS) Customer inquiry",
        eventKey: "J10",
        eventDisplayName: "Customer inquiry",
        eventStage: "customer_service",
        phaseKey: "J",
        phaseName: "Customer Service Events",
        exception: ""
    },
    J20: {
        eventRaw: "TRANSFORMER_J20",
        eventName: "(CS) Customer complaint",
        eventKey: "J20",
        eventDisplayName: "Customer complaint",
        eventStage: "customer_service",
        phaseKey: "J",
        phaseName: "Customer Service Events",
        exception: ""
    },
    J30: {
        eventRaw: "TRANSFORMER_J30",
        eventName: "(CS) Customer feedback",
        eventKey: "J30",
        eventDisplayName: "Customer feedback",
        eventStage: "customer_service",
        phaseKey: "J",
        phaseName: "Customer Service Events",
        exception: ""
    },
    J40: {
        eventRaw: "TRANSFORMER_J40",
        eventName: "(CS) Customer resolution",
        eventKey: "J40",
        eventDisplayName: "Customer resolution",
        eventStage: "customer_service",
        phaseKey: "J",
        phaseName: "Customer Service Events",
        exception: ""
    },
    // Phase K: Quality Control Events
    K10: {
        eventRaw: "TRANSFORMER_K10",
        eventName: "(QC) Quality check initiated",
        eventKey: "K10",
        eventDisplayName: "Quality check initiated",
        eventStage: "quality_control",
        phaseKey: "K",
        phaseName: "Quality Control Events",
        exception: ""
    },
    K20: {
        eventRaw: "TRANSFORMER_K20",
        eventName: "(QC) Quality check passed",
        eventKey: "K20",
        eventDisplayName: "Quality check passed",
        eventStage: "quality_control",
        phaseKey: "K",
        phaseName: "Quality Control Events",
        exception: ""
    },
    K30: {
        eventRaw: "TRANSFORMER_K30",
        eventName: "(QC) Quality check failed",
        eventKey: "K30",
        eventDisplayName: "Quality check failed",
        eventStage: "quality_control",
        phaseKey: "K",
        phaseName: "Quality Control Events",
        exception: ""
    },
    K40: {
        eventRaw: "TRANSFORMER_K40",
        eventName: "(QC) Quality check completed",
        eventKey: "K40",
        eventDisplayName: "Quality check completed",
        eventStage: "quality_control",
        phaseKey: "K",
        phaseName: "Quality Control Events",
        exception: ""
    },
    // Phase L: Inventory Events
    L10: {
        eventRaw: "TRANSFORMER_L10",
        eventName: "(I) Inventory check",
        eventKey: "L10",
        eventDisplayName: "Inventory check",
        eventStage: "inventory",
        phaseKey: "L",
        phaseName: "Inventory Events",
        exception: ""
    },
    L20: {
        eventRaw: "TRANSFORMER_L20",
        eventName: "(I) Inventory update",
        eventKey: "L20",
        eventDisplayName: "Inventory update",
        eventStage: "inventory",
        phaseKey: "L",
        phaseName: "Inventory Events",
        exception: ""
    },
    L30: {
        eventRaw: "TRANSFORMER_L30",
        eventName: "(I) Inventory low",
        eventKey: "L30",
        eventDisplayName: "Inventory low",
        eventStage: "inventory",
        phaseKey: "L",
        phaseName: "Inventory Events",
        exception: ""
    },
    L40: {
        eventRaw: "TRANSFORMER_L40",
        eventName: "(I) Inventory replenished",
        eventKey: "L40",
        eventDisplayName: "Inventory replenished",
        eventStage: "inventory",
        phaseKey: "L",
        phaseName: "Inventory Events",
        exception: ""
    },
    // Phase M: Payment Events
    M10: {
        eventRaw: "TRANSFORMER_M10",
        eventName: "(P) Payment initiated",
        eventKey: "M10",
        eventDisplayName: "Payment initiated",
        eventStage: "payment",
        phaseKey: "M",
        phaseName: "Payment Events",
        exception: ""
    },
    M20: {
        eventRaw: "TRANSFORMER_M20",
        eventName: "(P) Payment completed",
        eventKey: "M20",
        eventDisplayName: "Payment completed",
        eventStage: "payment",
        phaseKey: "M",
        phaseName: "Payment Events",
        exception: ""
    },
    M30: {
        eventRaw: "TRANSFORMER_M30",
        eventName: "(P) Payment failed",
        eventKey: "M30",
        eventDisplayName: "Payment failed",
        eventStage: "payment",
        phaseKey: "M",
        phaseName: "Payment Events",
        exception: ""
    },
    M40: {
        eventRaw: "TRANSFORMER_M40",
        eventName: "(P) Payment refunded",
        eventKey: "M40",
        eventDisplayName: "Payment refunded",
        eventStage: "payment",
        phaseKey: "M",
        phaseName: "Payment Events",
        exception: ""
    },
    // Phase N: Shipping Events
    N10: {
        eventRaw: "TRANSFORMER_N10",
        eventName: "(S) Shipment created",
        eventKey: "N10",
        eventDisplayName: "Shipment created",
        eventStage: "shipping",
        phaseKey: "N",
        phaseName: "Shipping Events",
        exception: ""
    },
    N20: {
        eventRaw: "TRANSFORMER_N20",
        eventName: "(S) Shipment in transit",
        eventKey: "N20",
        eventDisplayName: "Shipment in transit",
        eventStage: "shipping",
        phaseKey: "N",
        phaseName: "Shipping Events",
        exception: ""
    },
    N30: {
        eventRaw: "TRANSFORMER_N30",
        eventName: "(S) Shipment delayed",
        eventKey: "N30",
        eventDisplayName: "Shipment delayed",
        eventStage: "shipping",
        phaseKey: "N",
        phaseName: "Shipping Events",
        exception: ""
    },
    N40: {
        eventRaw: "TRANSFORMER_N40",
        eventName: "(S) Shipment delivered",
        eventKey: "N40",
        eventDisplayName: "Shipment delivered",
        eventStage: "shipping",
        phaseKey: "N",
        phaseName: "Shipping Events",
        exception: ""
    },
    // Phase O: Return Events
    O10: {
        eventRaw: "TRANSFORMER_O10",
        eventName: "(R) Return requested",
        eventKey: "O10",
        eventDisplayName: "Return requested",
        eventStage: "return",
        phaseKey: "O",
        phaseName: "Return Events",
        exception: ""
    },
    O20: {
        eventRaw: "TRANSFORMER_O20",
        eventName: "(R) Return approved",
        eventKey: "O20",
        eventDisplayName: "Return approved",
        eventStage: "return",
        phaseKey: "O",
        phaseName: "Return Events",
        exception: ""
    },
    O30: {
        eventRaw: "TRANSFORMER_O30",
        eventName: "(R) Return received",
        eventKey: "O30",
        eventDisplayName: "Return received",
        eventStage: "return",
        phaseKey: "O",
        phaseName: "Return Events",
        exception: ""
    },
    O40: {
        eventRaw: "TRANSFORMER_O40",
        eventName: "(R) Return processed",
        eventKey: "O40",
        eventDisplayName: "Return processed",
        eventStage: "return",
        phaseKey: "O",
        phaseName: "Return Events",
        exception: ""
    },
    // Phase P: Refund Events
    P10: {
        eventRaw: "TRANSFORMER_P10",
        eventName: "(RF) Refund initiated",
        eventKey: "P10",
        eventDisplayName: "Refund initiated",
        eventStage: "refund",
        phaseKey: "P",
        phaseName: "Refund Events",
        exception: ""
    },
    P20: {
        eventRaw: "TRANSFORMER_P20",
        eventName: "(RF) Refund approved",
        eventKey: "P20",
        eventDisplayName: "Refund approved",
        eventStage: "refund",
        phaseKey: "P",
        phaseName: "Refund Events",
        exception: ""
    },
    P30: {
        eventRaw: "TRANSFORMER_P30",
        eventName: "(RF) Refund processed",
        eventKey: "P30",
        eventDisplayName: "Refund processed",
        eventStage: "refund",
        phaseKey: "P",
        phaseName: "Refund Events",
        exception: ""
    },
    P40: {
        eventRaw: "TRANSFORMER_P40",
        eventName: "(RF) Refund completed",
        eventKey: "P40",
        eventDisplayName: "Refund completed",
        eventStage: "refund",
        phaseKey: "P",
        phaseName: "Refund Events",
        exception: ""
    },
    // Phase Q: Customer Service Events
    Q10: {
        eventRaw: "TRANSFORMER_Q10",
        eventName: "(CS) Support ticket created",
        eventKey: "Q10",
        eventDisplayName: "Support ticket created",
        eventStage: "customer_service",
        phaseKey: "Q",
        phaseName: "Customer Service Events",
        exception: ""
    },
    Q20: {
        eventRaw: "TRANSFORMER_Q20",
        eventName: "(CS) Support ticket assigned",
        eventKey: "Q20",
        eventDisplayName: "Support ticket assigned",
        eventStage: "customer_service",
        phaseKey: "Q",
        phaseName: "Customer Service Events",
        exception: ""
    },
    Q30: {
        eventRaw: "TRANSFORMER_Q30",
        eventName: "(CS) Support ticket updated",
        eventKey: "Q30",
        eventDisplayName: "Support ticket updated",
        eventStage: "customer_service",
        phaseKey: "Q",
        phaseName: "Customer Service Events",
        exception: ""
    },
    Q40: {
        eventRaw: "TRANSFORMER_Q40",
        eventName: "(CS) Support ticket resolved",
        eventKey: "Q40",
        eventDisplayName: "Support ticket resolved",
        eventStage: "customer_service",
        phaseKey: "Q",
        phaseName: "Customer Service Events",
        exception: ""
    },
    // Phase R: Inventory Events
    R10: {
        eventRaw: "TRANSFORMER_R10",
        eventName: "(INV) Inventory check initiated",
        eventKey: "R10",
        eventDisplayName: "Inventory check initiated",
        eventStage: "inventory",
        phaseKey: "R",
        phaseName: "Inventory Events",
        exception: ""
    },
    R20: {
        eventRaw: "TRANSFORMER_R20",
        eventName: "(INV) Inventory updated",
        eventKey: "R20",
        eventDisplayName: "Inventory updated",
        eventStage: "inventory",
        phaseKey: "R",
        phaseName: "Inventory Events",
        exception: ""
    },
    R30: {
        eventRaw: "TRANSFORMER_R30",
        eventName: "(INV) Low stock alert",
        eventKey: "R30",
        eventDisplayName: "Low stock alert",
        eventStage: "inventory",
        phaseKey: "R",
        phaseName: "Inventory Events",
        exception: ""
    },
    R40: {
        eventRaw: "TRANSFORMER_R40",
        eventName: "(INV) Stock replenished",
        eventKey: "R40",
        eventDisplayName: "Stock replenished",
        eventStage: "inventory",
        phaseKey: "R",
        phaseName: "Inventory Events",
        exception: ""
    },
    // Phase S: Quality Control Events
    S10: {
        eventRaw: "TRANSFORMER_S10",
        eventName: "(QC) Quality check initiated",
        eventKey: "S10",
        eventDisplayName: "Quality check initiated",
        eventStage: "quality_control",
        phaseKey: "S",
        phaseName: "Quality Control Events",
        exception: ""
    },
    S20: {
        eventRaw: "TRANSFORMER_S20",
        eventName: "(QC) Quality check passed",
        eventKey: "S20",
        eventDisplayName: "Quality check passed",
        eventStage: "quality_control",
        phaseKey: "S",
        phaseName: "Quality Control Events",
        exception: ""
    },
    S30: {
        eventRaw: "TRANSFORMER_S30",
        eventName: "(QC) Quality check failed",
        eventKey: "S30",
        eventDisplayName: "Quality check failed",
        eventStage: "quality_control",
        phaseKey: "S",
        phaseName: "Quality Control Events",
        exception: ""
    },
    S40: {
        eventRaw: "TRANSFORMER_S40",
        eventName: "(QC) Quality issue resolved",
        eventKey: "S40",
        eventDisplayName: "Quality issue resolved",
        eventStage: "quality_control",
        phaseKey: "S",
        phaseName: "Quality Control Events",
        exception: ""
    },
    // Phase T: Maintenance Events
    T10: {
        eventRaw: "TRANSFORMER_T10",
        eventName: "(MAINT) Maintenance scheduled",
        eventKey: "T10",
        eventDisplayName: "Maintenance scheduled",
        eventStage: "maintenance",
        phaseKey: "T",
        phaseName: "Maintenance Events",
        exception: ""
    },
    T20: {
        eventRaw: "TRANSFORMER_T20",
        eventName: "(MAINT) Maintenance in progress",
        eventKey: "T20",
        eventDisplayName: "Maintenance in progress",
        eventStage: "maintenance",
        phaseKey: "T",
        phaseName: "Maintenance Events",
        exception: ""
    },
    T30: {
        eventRaw: "TRANSFORMER_T30",
        eventName: "(MAINT) Maintenance completed",
        eventKey: "T30",
        eventDisplayName: "Maintenance completed",
        eventStage: "maintenance",
        phaseKey: "T",
        phaseName: "Maintenance Events",
        exception: ""
    },
    T40: {
        eventRaw: "TRANSFORMER_T40",
        eventName: "(MAINT) Maintenance report generated",
        eventKey: "T40",
        eventDisplayName: "Maintenance report generated",
        eventStage: "maintenance",
        phaseKey: "T",
        phaseName: "Maintenance Events",
        exception: ""
    },
    // Phase U: Training Events
    U10: {
        eventRaw: "TRANSFORMER_U10",
        eventName: "(TRAIN) Training session scheduled",
        eventKey: "U10",
        eventDisplayName: "Training session scheduled",
        eventStage: "training",
        phaseKey: "U",
        phaseName: "Training Events",
        exception: ""
    },
    U20: {
        eventRaw: "TRANSFORMER_U20",
        eventName: "(TRAIN) Training in progress",
        eventKey: "U20",
        eventDisplayName: "Training in progress",
        eventStage: "training",
        phaseKey: "U",
        phaseName: "Training Events",
        exception: ""
    },
    U30: {
        eventRaw: "TRANSFORMER_U30",
        eventName: "(TRAIN) Training completed",
        eventKey: "U30",
        eventDisplayName: "Training completed",
        eventStage: "training",
        phaseKey: "U",
        phaseName: "Training Events",
        exception: ""
    },
    U40: {
        eventRaw: "TRANSFORMER_U40",
        eventName: "(TRAIN) Training assessment completed",
        eventKey: "U40",
        eventDisplayName: "Training assessment completed",
        eventStage: "training",
        phaseKey: "U",
        phaseName: "Training Events",
        exception: ""
    },
    // Phase V: Documentation Events
    V10: {
        eventRaw: "TRANSFORMER_V10",
        eventName: "(DOC) Documentation initiated",
        eventKey: "V10",
        eventDisplayName: "Documentation initiated",
        eventStage: "documentation",
        phaseKey: "V",
        phaseName: "Documentation Events",
        exception: ""
    },
    V20: {
        eventRaw: "TRANSFORMER_V20",
        eventName: "(DOC) Documentation updated",
        eventKey: "V20",
        eventDisplayName: "Documentation updated",
        eventStage: "documentation",
        phaseKey: "V",
        phaseName: "Documentation Events",
        exception: ""
    },
    V30: {
        eventRaw: "TRANSFORMER_V30",
        eventName: "(DOC) Documentation reviewed",
        eventKey: "V30",
        eventDisplayName: "Documentation reviewed",
        eventStage: "documentation",
        phaseKey: "V",
        phaseName: "Documentation Events",
        exception: ""
    },
    V40: {
        eventRaw: "TRANSFORMER_V40",
        eventName: "(DOC) Documentation approved",
        eventKey: "V40",
        eventDisplayName: "Documentation approved",
        eventStage: "documentation",
        phaseKey: "V",
        phaseName: "Documentation Events",
        exception: ""
    },
    // Phase W: Compliance Events
    W10: {
        eventRaw: "TRANSFORMER_W10",
        eventName: "(COMP) Compliance check initiated",
        eventKey: "W10",
        eventDisplayName: "Compliance check initiated",
        eventStage: "compliance",
        phaseKey: "W",
        phaseName: "Compliance Events",
        exception: ""
    },
    W20: {
        eventRaw: "TRANSFORMER_W20",
        eventName: "(COMP) Compliance check passed",
        eventKey: "W20",
        eventDisplayName: "Compliance check passed",
        eventStage: "compliance",
        phaseKey: "W",
        phaseName: "Compliance Events",
        exception: ""
    },
    W30: {
        eventRaw: "TRANSFORMER_W30",
        eventName: "(COMP) Compliance check failed",
        eventKey: "W30",
        eventDisplayName: "Compliance check failed",
        eventStage: "compliance",
        phaseKey: "W",
        phaseName: "Compliance Events",
        exception: "compliance_issue"
    },
    W40: {
        eventRaw: "TRANSFORMER_W40",
        eventName: "(COMP) Compliance issue resolved",
        eventKey: "W40",
        eventDisplayName: "Compliance issue resolved",
        eventStage: "compliance",
        phaseKey: "W",
        phaseName: "Compliance Events",
        exception: ""
    },
    // Phase X: Audit Events
    X10: {
        eventRaw: "TRANSFORMER_X10",
        eventName: "(AUDIT) Audit scheduled",
        eventKey: "X10",
        eventDisplayName: "Audit scheduled",
        eventStage: "audit",
        phaseKey: "X",
        phaseName: "Audit Events",
        exception: ""
    },
    X20: {
        eventRaw: "TRANSFORMER_X20",
        eventName: "(AUDIT) Audit in progress",
        eventKey: "X20",
        eventDisplayName: "Audit in progress",
        eventStage: "audit",
        phaseKey: "X",
        phaseName: "Audit Events",
        exception: ""
    },
    X30: {
        eventRaw: "TRANSFORMER_X30",
        eventName: "(AUDIT) Audit completed",
        eventKey: "X30",
        eventDisplayName: "Audit completed",
        eventStage: "audit",
        phaseKey: "X",
        phaseName: "Audit Events",
        exception: ""
    },
    X40: {
        eventRaw: "TRANSFORMER_X40",
        eventName: "(AUDIT) Audit findings reported",
        eventKey: "X40",
        eventDisplayName: "Audit findings reported",
        eventStage: "audit",
        phaseKey: "X",
        phaseName: "Audit Events",
        exception: ""
    },
    // Phase Y: Quality Control Events
    Y10: {
        eventRaw: "TRANSFORMER_Y10",
        eventName: "(QC) Quality check initiated",
        eventKey: "Y10",
        eventDisplayName: "Quality check initiated",
        eventStage: "quality",
        phaseKey: "Y",
        phaseName: "Quality Control Events",
        exception: ""
    },
    Y20: {
        eventRaw: "TRANSFORMER_Y20",
        eventName: "(QC) Quality check passed",
        eventKey: "Y20",
        eventDisplayName: "Quality check passed",
        eventStage: "quality",
        phaseKey: "Y",
        phaseName: "Quality Control Events",
        exception: ""
    },
    Y30: {
        eventRaw: "TRANSFORMER_Y30",
        eventName: "(QC) Quality check failed",
        eventKey: "Y30",
        eventDisplayName: "Quality check failed",
        eventStage: "quality",
        phaseKey: "Y",
        phaseName: "Quality Control Events",
        exception: "quality_issue"
    },
    Y40: {
        eventRaw: "TRANSFORMER_Y40",
        eventName: "(QC) Quality issue resolved",
        eventKey: "Y40",
        eventDisplayName: "Quality issue resolved",
        eventStage: "quality",
        phaseKey: "Y",
        phaseName: "Quality Control Events",
        exception: ""
    },
    // ... existing code ...
} 

module.exports = Events;