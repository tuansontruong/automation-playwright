module.exports = {
  smoke_test: {
    name: 'Smoke Test',
    tests: [
      'tests/api/Add_Parcels/All_fields/TC_Add_Parcels_001.spec.js',
      'tests/api/Create_Events/Main_Object/Events/TC_Create_Event_012.spec.js',
      'tests/api/Create_Shipments/All_Fields/TC_Create_Shipments_001.spec.js',
      'tests/ui/User_Rights_Permission/TC_PermissionControl_01.spec.js',
      'tests/api/Retrieve_Parcels/parcel_id/TC_Retrieve_Parcels_001.spec.js',
      'tests/api/Retrieve_shipment/Shipment_uuid_and_shipment_id/TC_Retrieve_Shipment_05.spec.js',
      'tests/ui/Shipment_Details/Tracking_Details/Shipment_Status/TC_Tracking_Details_05.spec.js',
      'tests/api/Update_Replace_Parcels/Active_within_90_days_import_date/Case_1_Same_PO/TC_Update_Replace_Parcels_001.spec.js',
      'tests/api/Update_Shipment/Full/TC_Update_Shipment_187.spec.js'
    ]
  },
  regression_prod: {
    name: 'Regression Test',
    tests: [
      // Add regression test paths here
      'tests/api/Add_Parcels/All_fields/TC_Add_Parcels_001.spec.js',
      'tests/api/Create_Events/Main_Object/Events/TC_Create_Event_012.spec.js',
      // ... more regression tests
    ]
  },
  regression_test: {
    name: 'Regression Test',
    tests: [
      // Add regression test paths here
    ]
  },

  // On-demand tests
  carrier_overview: {
    name: 'Carrier Module Test',
    tests: [
      'tests/on-demand/carrier-overview/TC_Carrier_Overview_001.spec.js',
      'tests/on-demand/carrier-overview/TC_Carrier_Overview_002.spec.js',
      'tests/on-demand/carrier-overview/TC_Carrier_Overview_003.spec.js',
      'tests/on-demand/carrier-overview/TC_Carrier_Overview_004.spec.js',
      'tests/on-demand/carrier-overview/TC_Carrier_Overview_005.spec.js',
      'tests/on-demand/carrier-overview/TC_Carrier_Overview_006.spec.js',
      'tests/on-demand/carrier-overview/TC_Carrier_Overview_007.spec.js',
      'tests/on-demand/carrier-overview/TC_Carrier_Overview_008.spec.js',
      // ... more carrier module tests
    ]
  },
  return_overview: {
    name: 'Return Module Test',
    tests: [
      'tests/on-demand/return-overview/TC_Return_Overview_001.spec.js',
      'tests/on-demand/return-overview/TC_Return_Overview_002.spec.js',
      'tests/on-demand/return-overview/TC_Return_Overview_003.spec.js',
    ]
  },
  shipment_overview: {
    name: 'Shipment Module Test',
    tests: [
      'tests/on-demand/shipment-overview/TC_Shipment_Overview_001.spec.js',
      'tests/on-demand/shipment-overview/TC_Shipment_Overview_002.spec.js',
    ]
  }
}; 