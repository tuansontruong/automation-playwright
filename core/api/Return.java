package com.parcelperform.automation.framework.api.internal;

import com.google.gson.JsonObject;
import com.microsoft.playwright.APIResponse;
import com.parcelperform.automation.core.api.APIs;
import com.parcelperform.automation.framework.constants.Endpoints;
import com.parcelperform.automation.framework.constants.Waiting;
import com.parcelperform.automation.framework.data.ObjOrg;
import com.parcelperform.automation.framework.enums.ReturnStatus;
import com.parcelperform.automation.utils.helpers.DateTime;
import com.parcelperform.automation.utils.helpers.Json;
import com.parcelperform.automation.utils.reports.Reports;

/**
 * This class handles Return-related API operations for the ParcelPerform system.
 * It provides functionality for managing return requests, including status changes,
 * searching, and retrieving return request details.
 */
public class Return extends APIs {

    /**
     * Updates the status of a return request with optional reject reason
     *
     * @param privateToken Authentication token
     * @param orgId        Organization ID
     * @param returnPk     Return request primary key
     * @param fromStatus   Current status of the return request
     * @param toStatus     Target status to update to
     * @param rejectReason Reason for rejection (optional)
     * @return API Response containing the update result
     */
    public static APIResponse changeReturnRequestStatus(String privateToken, int orgId, int returnPk, ReturnStatus fromStatus, ReturnStatus toStatus, String rejectReason) {
        Reports.logKeywordName();

        // Construct request body with status transition details
        JsonObject body = new JsonObject();
        body.addProperty("current_status", fromStatus.getStatus().toLowerCase());
        body.addProperty("new_status", toStatus.getStatus().toLowerCase());
        // Only add reject reason if it's not the ignore placeholder
        if (!rejectReason.equals("<ignore>"))
            body.addProperty("reject_reason", rejectReason);

        // Configure and send the API request
        setUrl(Endpoints.RETURN_URL + "api/update-return-ticket-status/" + orgId + "/?return_ticket_pk=" + returnPk);
        setHeaders(privateToken);
        setApiResponse(sendPostRequestWithBody(getUrl(), getHeaders(), body.toString()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Overloaded method to change return request status without a reject reason
     *
     * @param privateToken Authentication token
     * @param orgId        Organization ID
     * @param returnPk     Return request primary key
     * @param fromStatus   Current status of the return request
     * @param toStatus     Target status to update to
     * @return API Response containing the update result
     */
    public static APIResponse changeReturnRequestStatus(String privateToken, int orgId, int returnPk, ReturnStatus fromStatus, ReturnStatus toStatus) {
        return changeReturnRequestStatus(privateToken, orgId, returnPk, fromStatus, toStatus, "<ignored>");
    }

    /**
     * Searches for return requests based on search criteria
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search string to filter returns
     * @return API Response containing search results
     */
    private static APIResponse searchReturnRequest(String privateToken, ObjOrg objOrg, String searchValue) {
        // Create search request body
        JsonObject body = new JsonObject();
        body.addProperty("search_string", searchValue);

        // Send POST request to search endpoint
        setUrl(Endpoints.RETURN_URL + "api/v1/parcel-perform/return-ticket/" + objOrg.getId() + "/");
        setHeaders(privateToken);
        setApiResponse(sendPostRequestWithBody(getUrl(), getHeaders(), body.toString()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Retrieves a specific property from return request search results
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @param jsonPath     JSON path to the desired property
     * @return The value of the specified property
     */
    public static <T> T getSearchReturnRequestProperty(String privateToken, ObjOrg objOrg, String searchValue, String jsonPath) {
        setApiResponse(searchReturnRequest(privateToken, objOrg, searchValue));
        return Json.getAPIResponseProperty(getApiResponse(), jsonPath);
    }

    /**
     * Waits for a return request to be submitted and visible in the system
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria to find the return request
     * @return true if return request is found within timeout period, false otherwise
     */
    public static boolean waitForReturnRequest(String privateToken, ObjOrg objOrg, String searchValue) {
        // Poll the search endpoint until return request is found or timeout
        for (int i = 0; i <= Waiting.WAIT_FOR_RETURN_REQUEST_SUBMITTED; i += Waiting.SHORT_WAIT) {
            // Check if any results are found (count > 0)
            if ((Integer) getSearchReturnRequestProperty(privateToken, objOrg, searchValue, "count") > 0)
                return true;
            // Wait before next attempt
            DateTime.wait(Waiting.SHORT_WAIT);
        }
        return false;
    }

    /**
     * Waits for a specific property of a return request to match expected value
     *
     * @param privateToken  Authentication token
     * @param objOrg        Organization object
     * @param searchValue   Search criteria
     * @param jsonPath      Path to the property to check
     * @param expectedValue Expected value of the property
     * @param toBeMatched   Whether the value should match or not match
     * @param timeout       Maximum time to wait in milliseconds
     * @return true if condition is met within timeout, false otherwise
     */
    public static <T> boolean waitForSearchedReturnProperty(String privateToken, ObjOrg objOrg, String searchValue, String jsonPath, T expectedValue, boolean toBeMatched, int timeout) {
        int time = 0;
        // Get initial value of the property
        T currentValue = getSearchReturnRequestProperty(privateToken, objOrg, searchValue, jsonPath);

        // Continue polling until property matches expected condition or timeout
        while ((currentValue.equals(expectedValue) != toBeMatched)) {
            DateTime.wait(Waiting.MEDIUM_WAIT);
            time += Waiting.MEDIUM_WAIT;
            currentValue = getSearchReturnRequestProperty(privateToken, objOrg, searchValue, jsonPath);

            // Check if condition is met
            if ((currentValue.equals(expectedValue)) == toBeMatched) {
                // Log success with property details
                Reports.logDescription("Waiting Summary: Property: [" + jsonPath + "] -> To be matched: [" + toBeMatched + "] with Actual = [" + currentValue + "] and Expected = [" + expectedValue + "]");
                return true;
            }

            // Check for timeout
            if (time > timeout) {
                throw new RuntimeException("- Org: " + objOrg.getSlug() + "searchValue: '" + searchValue + "'\n" +
                        "- Wait For Searched Return Property => FAILED!\n" +
                        "- Details: \n" +
                        " + Property: [" + jsonPath + "] \n" +
                        " + To be matched: [" + toBeMatched + "] \n" +
                        " + Actual = [" + currentValue + "] \n" +
                        " + Expected = [" + expectedValue + "]");
            }
        }
        return true;
    }

    /**
     * Overloaded method for waiting for return property with default timeout
     *
     * @param privateToken  Authentication token
     * @param objOrg        Organization object
     * @param searchValue   Search criteria
     * @param jsonPath      Path to the property to check
     * @param expectedValue Expected value of the property
     * @param toBeMatched   Whether the value should match or not match
     * @return true if condition is met within default timeout, false otherwise
     */
    public static <T> boolean waitForSearchedReturnProperty(String privateToken, ObjOrg objOrg, String searchValue, String jsonPath, T expectedValue, boolean toBeMatched) {
        return waitForSearchedReturnProperty(privateToken, objOrg, searchValue, jsonPath, expectedValue, toBeMatched, Waiting.WAIT_FOR_RETURN_PROPERTY);
    }

    /**
     * Overloaded method for waiting for return property with default timeout and matching behavior
     *
     * @param privateToken  Authentication token
     * @param objOrg        Organization object
     * @param searchValue   Search criteria
     * @param jsonPath      Path to the property to check
     * @param expectedValue Expected value of the property
     * @return true if condition is met within default timeout, false otherwise
     */
    public static <T> boolean waitForSearchedReturnProperty(String privateToken, ObjOrg objOrg, String searchValue, String jsonPath, T expectedValue) {
        return waitForSearchedReturnProperty(privateToken, objOrg, searchValue, jsonPath, expectedValue, true, Waiting.WAIT_FOR_RETURN_PROPERTY);
    }

    /**
     * Waits for a return request to reach a specific status
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @param status       Expected return status
     * @param toBeMatched  Whether the status should match or not match
     * @param timeout      Maximum time to wait in milliseconds
     * @return true if status condition is met within timeout, false otherwise
     */
    public static boolean waitForReturnStatus(String privateToken, ObjOrg objOrg, String searchValue, ReturnStatus status, boolean toBeMatched, int timeout) {
        return waitForSearchedReturnProperty(privateToken, objOrg, searchValue, "data.[0].return_status", status.getStatus().toLowerCase(), toBeMatched, timeout);
    }

    /**
     * Overloaded method for waiting for return status with default timeout
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @param status       Expected return status
     * @param toBeMatched  Whether the status should match or not match
     * @return true if status condition is met within default timeout, false otherwise
     */
    public static boolean waitForReturnStatus(String privateToken, ObjOrg objOrg, String searchValue, ReturnStatus status, boolean toBeMatched) {
        return waitForReturnStatus(privateToken, objOrg, searchValue, status, toBeMatched, Waiting.WAIT_FOR_RETURN_PROPERTY);
    }

    /**
     * Overloaded method for waiting for return status with default timeout and matching behavior
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @param status       Expected return status
     * @return true if status matches within default timeout, false otherwise
     */
    public static boolean waitForReturnStatus(String privateToken, ObjOrg objOrg, String searchValue, ReturnStatus status) {
        return waitForReturnStatus(privateToken, objOrg, searchValue, status, true, Waiting.WAIT_FOR_RETURN_STATUS_UPDATE);
    }

    /**
     * Retrieves the primary key (ID) of a return request
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria to find the return request
     * @return The primary key of the found return request
     */
    public static int getReturnPK(String privateToken, ObjOrg objOrg, String searchValue) {
        return getSearchReturnRequestProperty(privateToken, objOrg, searchValue, "data.[0].id");
    }

    /**
     * Retrieves detailed information about a specific return request
     *
     * @param privateToken Authentication token
     * @param orgId        Organization ID
     * @param returnPk     Return request primary key
     * @return API Response containing return request details
     */
    private static APIResponse getReturnRequestDetails(String privateToken, int orgId, int returnPk) {
        setUrl(Endpoints.RETURN_URL + "api/v1/parcel-perform/return-ticket/" + orgId + "/get/?return_ticket_pk=" + returnPk);
        setHeaders(privateToken);
        setApiResponse(sendGetRequest(getUrl(), getHeaders()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Waits for a specific event to appear in the return request's shipment events
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @param eventType    Type of event to wait for
     * @param timeout      Maximum time to wait in milliseconds
     * @return true if event is found within timeout period, false otherwise
     */
    public static boolean waitForEvent(String privateToken, ObjOrg objOrg, String searchValue, String eventType, int timeout) {
        int time = 0;
        APIResponse response = Return.getReturnRequestInfo(privateToken, objOrg, searchValue);

        // JsonPath to find events of specific type
        String jsonPath = "data.shipment.shipment_events[?(@.event_type=='" + eventType + "')]";

        // Poll until event is found or timeout
        while (Json.getSizeFromAPIResponse(response, jsonPath) < 1) {
            DateTime.wait(Waiting.MEDIUM_WAIT);
            time += Waiting.MEDIUM_WAIT;
            response = Return.getReturnRequestInfo(privateToken, objOrg, searchValue);

            // Check for timeout
            if (time > timeout) {
                Reports.logDescription("Event '" + eventType + "' is not updated in " + timeout / 1000 + " seconds.");
                return false;
            }
        }
        return true;
    }

    /**
     * Overloaded method for waiting for event with default timeout
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @param eventType    Type of event to wait for
     * @return true if event is found within default timeout, false otherwise
     */
    public static boolean waitForEvent(String privateToken, ObjOrg objOrg, String searchValue, String eventType) {
        return waitForEvent(privateToken, objOrg, searchValue, eventType, Waiting.MINUTE);
    }

    /**
     * Retrieves complete information about a return request
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @return API Response containing complete return request information
     */
    public static APIResponse getReturnRequestInfo(String privateToken, ObjOrg objOrg, String searchValue) {
        int returnPk = getReturnPK(privateToken, objOrg, searchValue);
        setApiResponse(getReturnRequestDetails(privateToken, objOrg.getId(), returnPk));
        return getApiResponse();
    }

    /**
     * Retrieves a specific property from return request details
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @param jsonPath     JSON path to the desired property
     * @return The value of the specified property
     */
    public static <T> T getReturnRequestDetailsProperty(String privateToken, ObjOrg objOrg, String searchValue, String jsonPath) {
        int returnPk = getReturnPK(privateToken, objOrg, searchValue);
        setApiResponse(getReturnRequestDetails(privateToken, objOrg.getId(), returnPk));
        return Json.getAPIResponseProperty(getApiResponse(), jsonPath);
    }

    /**
     * Gets the current status of a return request
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @return Current status of the return request
     */
    public static String getReturnRequestStatus(String privateToken, ObjOrg objOrg, String searchValue) {
        return getReturnRequestDetailsProperty(privateToken, objOrg, searchValue, "data.return_status");
    }

    /**
     * Gets the UUID of the shipment associated with a return request
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @return Shipment UUID associated with the return request
     */
    public static String getReturnedShipmentUuid(String privateToken, ObjOrg objOrg, String searchValue) {
        return getReturnRequestDetailsProperty(privateToken, objOrg, searchValue, "data.shipment_uuid");
    }

    /**
     * Retrieves the QR code filename for a return request
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @return Filename of the QR code document, or null if not found
     */
    public static String getReturnQRCodeFileName(String privateToken, ObjOrg objOrg, String searchValue) {
        int returnPk = getReturnPK(privateToken, objOrg, searchValue);
        setApiResponse(getReturnRequestDetails(privateToken, objOrg.getId(), returnPk));

        // Get total number of shipment documents
        int noOfDocs = Json.getSizeFromAPIResponse(getApiResponse(), "data.shipment.shipment_documents");

        // Search through documents to find QR code
        for (int i = 0; i < noOfDocs; i++) {
            // Check if current document is a QR code
            if (Json.getFromAPIResponse(getApiResponse(), "data.shipment.shipment_documents.[" + i + "].name").equals("Shipping Label QR")) {
                // Construct filename from document ID and format
                return Json.getFromAPIResponse(getApiResponse(), "data.shipment.shipment_documents.[" + i + "].document_id") + "." +
                        Json.getFromAPIResponse(getApiResponse(), "data.shipment.shipment_documents.[" + i + "].file_format");
            }
        }
        return null;
    }

    /**
     * Gets the S3 link to the QR code file for a return request
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param searchValue  Search criteria
     * @return S3 link to the QR code file
     */
    public static String getReturnQRCodeFileSource(String privateToken, ObjOrg objOrg, String searchValue) {
        int returnPk = getReturnPK(privateToken, objOrg, searchValue);
        setApiResponse(getReturnRequestDetails(privateToken, objOrg.getId(), returnPk));
        return Json.getListFromAPIResponse(getApiResponse(), "data.shipment.shipment_documents[?(@.type=='shipping_label_qr')].s3_link").get(0);
    }
}
