package com.parcelperform.automation.framework.api.internal;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.microsoft.playwright.APIResponse;
import com.parcelperform.automation.core.api.APIs;
import com.parcelperform.automation.framework.constants.DataLocations;
import com.parcelperform.automation.framework.constants.Endpoints;
import com.parcelperform.automation.framework.constants.PPCredential;
import com.parcelperform.automation.framework.data.ObjOrg;
import com.parcelperform.automation.framework.data.ObjUser;
import com.parcelperform.automation.framework.enums.FeatureToggle;
import com.parcelperform.automation.framework.enums.FeatureToggleLIVersion;
import com.parcelperform.automation.framework.enums.UserRole;
import com.parcelperform.automation.utils.helpers.Encryption;
import com.parcelperform.automation.utils.helpers.Environment;
import com.parcelperform.automation.utils.helpers.Json;
import com.parcelperform.automation.utils.helpers.Tokens;
import com.parcelperform.automation.utils.reports.Reports;

import java.util.List;

/**
 * Authenticator class handles all authentication and organization management operations
 * including user authentication, organization creation/management, and feature toggle controls.
 * This class extends the APIs base class for common API functionality.
 */
public class Authenticator extends APIs {
    // ThreadLocal storage for organization info to maintain thread safety
    private static final ThreadLocal<ObjOrg> tlOrgInfo = new ThreadLocal<>();


    /**
     * Gets organization info from ThreadLocal storage
     *
     * @return ObjOrg containing organization information
     */
    private static ObjOrg getOrgInfo() {
        return tlOrgInfo.get();
    }

    /**
     * Sets organization info in ThreadLocal storage
     *
     * @param tlOrgInfo Organization object to store
     */
    private static void setOrgInfo(ObjOrg tlOrgInfo) {
        Authenticator.tlOrgInfo.set(tlOrgInfo);
    }

    /**
     * Authenticates a user with username and password
     * Uses the client credentials to authenticate against the authentication endpoint
     *
     * @param user ObjUser containing email and password
     * @return APIResponse containing authentication result and tokens
     */
    private static APIResponse authenticateWithUsnPwd(ObjUser user) {
        // Create authentication request body
        JsonObject body = new JsonObject();
        body.addProperty("username", user.getEmail());
        body.addProperty("password", Encryption.decode(user.getPassword())); // Decode stored encrypted password
        body.addProperty("client_id", Encryption.decode(PPCredential.PP_CLIENT_ID));
        body.addProperty("client_secret", Encryption.decode(PPCredential.PP_CLIENT_SECRET));

        setUrl(Endpoints.PORTAL_URL + "pp-portal-api/v1/authentication/authenticate-with-usn-pwd/");
        setHeaders("application/json", "<ignore>");
        setApiResponse(sendPostRequestWithBody(getUrl(), getHeaders(), body.toString()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Gets access token for non-PP user
     * Implements token caching strategy - reads from cache file if valid, otherwise generates new token
     *
     * @param nonPPUser User object containing credentials
     * @return String access token with token type prefix (e.g. "Bearer xyz123")
     */
    public static String getNonPPAccessToken(ObjUser nonPPUser) {
        Reports.logKeywordName();
        String fileName = DataLocations.DATA_OUTPUT_FOLDER + Environment.getEnv() + "." + nonPPUser.getUserId() + ".token.json";

        System.out.println(fileName);
        String nonPPToken;
        if (!Tokens.isAccessTokenValid(fileName)) {
            setApiResponse(authenticateWithUsnPwd(nonPPUser));
            nonPPToken = Json.getFromAPIResponse(getApiResponse(), "data.token_type") + " " + Json.getFromAPIResponse(getApiResponse(), "data.access_token");
            Tokens.saveAccessToken(fileName, nonPPToken, 11 * 3600);
        } else nonPPToken = Tokens.readPPToken(nonPPUser);
        return nonPPToken;
    }

    /**
     * Searches for an organization by name
     *
     * @param privateToken Authentication token
     * @param orgName      Name of organization to search for
     * @return APIResponse containing matching organizations
     */
    private static APIResponse searchOrganization(String privateToken, String orgName) {
        setUrl(Endpoints.AUTHENTICATOR_URL + "api/organization/?search_string=" + Encryption.encodeUrl(orgName));
        setHeaders(privateToken);
        setApiResponse(sendGetRequest(getUrl(), getHeaders()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Gets organization slug by organization name
     *
     * @param privateToken Authentication token
     * @param orgName      Name of organization
     * @return String organization slug or null if not found
     */
    public static String getOrgSlug(String privateToken, String orgName) {
        setApiResponse(searchOrganization(privateToken, orgName));
        for (int i = 0; i < Integer.parseInt(Json.getFromAPIResponse(getApiResponse(), "count")); i++)
            if (Json.getFromAPIResponse(getApiResponse(), "data.[" + i + "].name").equals(orgName))
                return Json.getFromAPIResponse(getApiResponse(), "data.[" + i + "].pp_slug");
        return null;
    }

    /**
     * Gets detailed organization information by slug
     *
     * @param privateToken Authentication token
     * @param orgSlug      Organization slug identifier
     * @return APIResponse containing organization details
     */
    private static APIResponse getOrganization(String privateToken, String orgSlug) {
        setUrl(Endpoints.AUTHENTICATOR_URL + "api/organization/" + orgSlug + "/");
        setHeaders(privateToken);
        setApiResponse(sendGetRequest(getUrl(), getHeaders()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Gets complete organization information including credentials
     *
     * @param privateToken Authentication token
     * @param orgName      Organization name
     * @return ObjOrg containing organization details
     */
    public static ObjOrg getOrgInfo(String privateToken, String orgName) {
        Reports.logKeywordName();
        setApiResponse(getOrganization(privateToken, getOrgSlug(privateToken, orgName)));

        ObjOrg orgInfo = new ObjOrg();
        orgInfo.setName(Json.getFromAPIResponse(getApiResponse(), "data.name"));
        orgInfo.setId(Integer.parseInt(Json.getFromAPIResponse(getApiResponse(), "data.id")));
        orgInfo.setSlug(Json.getFromAPIResponse(getApiResponse(), "data.pp_slug"));
        if (Json.getSizeFromAPIResponse(getApiResponse(), "data.credentials") > 0) {
            orgInfo.setClientID(Json.getFromAPIResponse(getApiResponse(), "data.credentials.[0].api_client_id"));
            orgInfo.setClientSecret(Json.getFromAPIResponse(getApiResponse(), "data.credentials.[0].api_client_secret"));
        }
        setOrgInfo(orgInfo);
        return getOrgInfo();
    }

    /**
     * Creates a new organization
     *
     * @param mppToken   MPP authentication token
     * @param newOrgName Name for the new organization
     * @return ObjOrg containing created organization details
     */
    public static ObjOrg createOrg(String mppToken, String newOrgName) {
        Reports.logKeywordName();
        ObjOrg orgInfo = new ObjOrg();

        JsonObject body = new JsonObject();
        body.addProperty("name", newOrgName);
        body.addProperty("is_demo_account", false);

        setUrl(Endpoints.AUTHENTICATOR_URL + "api/organization/");
        setHeaders(mppToken);
        setApiResponse(sendPostRequestWithBody(getUrl(), getHeaders(), body.toString()));

        orgInfo.setName(Json.getFromAPIResponse(getApiResponse(), "data.name"));
        orgInfo.setId(Integer.parseInt(Json.getFromAPIResponse(getApiResponse(), "data.id")));
        orgInfo.setSlug(Json.getFromAPIResponse(getApiResponse(), "data.pp_slug"));

        setOrgInfo(orgInfo);
        return getOrgInfo();
    }

    /**
     * Sets or unsets organization as internal test account
     *
     * @param mppToken MPP authentication token
     * @param orgSlug  Organization slug
     * @param stage    Boolean flag to enable/disable test status
     * @return APIResponse containing operation result
     */
    private static APIResponse setInternalTestOrg(String mppToken, String orgSlug, boolean stage) {
        JsonObject body = new JsonObject();
        body.addProperty("enabled", stage);

        setUrl(Endpoints.AUTHENTICATOR_URL + "api/organization/toggle-internal-test-account/" + orgSlug + "/");
        setHeaders(mppToken);
        setApiResponse(sendPostRequestWithBody(getUrl(), getHeaders(), body.toString()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Enables internal test mode for an organization
     *
     * @param mppToken MPP authentication token
     * @param orgSlug  Organization slug
     * @return APIResponse containing operation result
     */
    public static APIResponse setInternalTestOrg(String mppToken, String orgSlug) {
        Reports.logKeywordName();
        return setInternalTestOrg(mppToken, orgSlug, true);
    }

    /**
     * Gets credential details for an organization
     *
     * @param mppToken MPP authentication token
     * @param orgSlug  Organization slug
     * @return APIResponse containing organization credentials
     */
    public static APIResponse getOrganizationCredentialDetails(String mppToken, String orgSlug) {
        setUrl(Endpoints.AUTHENTICATOR_URL + "api/organization/credential/" + orgSlug + "/");
        setHeaders(mppToken);
        setApiResponse(sendGetRequest(getUrl(), getHeaders()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Gets encrypted credentials for an organization
     *
     * @param mppToken MPP authentication token
     * @param orgSlug  Organization slug
     * @return String containing encrypted credentials
     */
    public static String getEncryptedCredential(String mppToken, String orgSlug) {
        Reports.logKeywordName();
        return Json.getFromAPIResponse(getOrganizationCredentialDetails(mppToken, orgSlug), "data.encrypted_credential");
    }

    /**
     * Gets organization feature toggle settings
     *
     * @param mppToken MPP authentication token
     * @param orgSlug  Organization slug
     * @return APIResponse containing feature toggle settings
     */
    private static APIResponse getOrgFeatureToggle(String mppToken, String orgSlug) {
        setUrl(Endpoints.AUTHENTICATOR_URL + "api/v1/feature-toggle/" + orgSlug + "/");
        setHeaders(mppToken);
        setApiResponse(sendGetRequest(getUrl(), getHeaders()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Gets a specific feature toggle property for an organization
     *
     * @param mppToken MPP authentication token
     * @param orgSlug  Organization slug
     * @param jsonPath JSON path to the desired property
     * @return Generic type T containing the property value
     */
    private static <T> T getOrgFeatureToggleProperty(String mppToken, String orgSlug, String jsonPath) {
        return Json.getAPIResponseProperty(getOrgFeatureToggle(mppToken, orgSlug), jsonPath);
    }

    /**
     * Checks if tracking widgets feature is enabled for an organization
     *
     * @param mppToken MPP authentication token
     * @param objOrg   Organization object
     * @return boolean indicating if tracking widgets are enabled
     */
    public static boolean isTrackingWidgets(String mppToken, ObjOrg objOrg) {
        return Boolean.parseBoolean(getOrgFeatureToggleProperty(mppToken, objOrg.getSlug(), "data.te_version.te_v2").toString());
    }

    /**
     * Gets list of feature toggles for an organization
     *
     * @param mppToken MPP authentication token
     * @param orgSlug  Organization slug
     * @return APIResponse containing list of feature toggles
     */
    private static APIResponse getListFeatureToggle(String mppToken, String orgSlug) {
        setUrl(Endpoints.AUTHENTICATOR_URL + "api/feature-toggle/" + orgSlug + "/");
        setHeaders(mppToken);
        setApiResponse(sendGetRequest(getUrl(), getHeaders()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Gets ID of a specific feature toggle
     *
     * @param mppToken          MPP authentication token
     * @param orgSlug           Organization slug
     * @param featureToggleName Feature toggle to look up
     * @return int ID of feature toggle or -1 if not found
     */
    private static int getFeatureToggleId(String mppToken, String orgSlug, FeatureToggle featureToggleName) {
        setApiResponse(getListFeatureToggle(mppToken, orgSlug));
        for (int i = 0; i < Json.getListFromAPIResponse(getApiResponse(), "data").size(); i++)
            if (Json.getFromAPIResponse(getApiResponse(), "data.[" + i + "].key").equals(featureToggleName.getKey()))
                return Json.getAPIResponseProperty(getApiResponse(), "data.[" + i + "].id");
        return -1;
    }

    /**
     * Checks if a feature toggle exists for an organization
     *
     * @param mppToken      MPP authentication token
     * @param orgSlug       Organization slug
     * @param featureToggle Feature toggle to check
     * @return boolean indicating if toggle exists
     */
    private static boolean doesFeatureToggleExist(String mppToken, String orgSlug, FeatureToggle featureToggle) {
        return getFeatureToggleId(mppToken, orgSlug, featureToggle) > 0;
    }

    /**
     * Adds a new feature toggle by key
     *
     * @param mppToken          MPP authentication token
     * @param orgSlug           Organization slug
     * @param featureToggleName Feature toggle to add
     * @return APIResponse containing created feature toggle
     */
    private static APIResponse addFeatureToggleByKey(String mppToken, String orgSlug, FeatureToggle featureToggleName) {
        JsonObject body = new JsonObject();
        body.addProperty("key", featureToggleName.getKey());

        setUrl(Endpoints.AUTHENTICATOR_URL + "api/feature-toggle/" + orgSlug + "/");
        setHeaders(mppToken);
        setApiResponse(sendPostRequestWithBody(getUrl(), getHeaders(), body.toString()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Adds or updates Logistic Intelligence version feature toggle
     *
     * @param mppToken MPP authentication token
     * @param orgSlug  Organization slug
     * @param version  Version to set
     * @return APIResponse containing operation result
     */
    public static APIResponse addFeatureToggleLIVersion(String mppToken, String orgSlug, FeatureToggleLIVersion version) {
        Reports.logKeywordName();
        JsonObject value = new JsonObject();
        value.addProperty("version", version.getVersion());

        JsonObject body = new JsonObject();
        body.add("value", value);

        FeatureToggle featureToggle = FeatureToggle.LOGISTIC_INTELLIGENCE_UI_UX_VERSION;
        int toggleId = doesFeatureToggleExist(mppToken, orgSlug, featureToggle) ? getFeatureToggleId(mppToken, orgSlug, featureToggle) : Json.getAPIResponseProperty(addFeatureToggleByKey(mppToken, orgSlug, featureToggle), "data.id");

        setUrl(Endpoints.AUTHENTICATOR_URL + "api/feature-toggle/" + orgSlug + "/" + toggleId + "/");
        setHeaders(mppToken);
        setApiResponse(sendPatchRequest(getUrl(), getHeaders(), body.toString()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Creates a new user account
     *
     * @param privateToken Authentication token
     * @param user         ObjUser containing user details
     * @return ObjUser with updated user ID
     */
    public static ObjUser createAccount(String privateToken, ObjUser user) {
        JsonObject account = new JsonObject();
        account.addProperty("email", user.getEmail());
        account.addProperty("first_name", "");
        account.addProperty("last_name", "");
        account.addProperty("password", Encryption.decode(user.getPassword()));
        account.addProperty("confirm_password", Encryption.decode(user.getPassword()));

        setUrl(Endpoints.AUTHENTICATOR_URL + "api/account/");
        setHeaders(privateToken);
        setApiResponse(sendPostRequestWithBody(getUrl(), getHeaders(), account.toString()));
        markErrorWhenNotSuccess(getApiResponse());

        user.setUserId(Json.getFromAPIResponse(getApiResponse(), "data.id"));
        return user;
    }

    /**
     * Gets user information by email
     *
     * @param mppToken  MPP authentication token
     * @param orgId     Organization ID
     * @param userEmail User's email address
     * @return APIResponse containing user information
     */
    public static APIResponse getUserInfo(String mppToken, int orgId, String userEmail) {
        JsonObject body = new JsonObject();
        body.addProperty("email_invite", userEmail);

        setUrl(Endpoints.AUTHENTICATOR_URL + "api/organization/account/check-email/" + orgId + "/");
        setHeaders(mppToken);
        setApiResponse(sendPostRequestWithBody(getUrl(), getHeaders(), body.toString()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Gets user ID from email address
     *
     * @param token     Authentication token
     * @param orgId     Organization ID
     * @param userEmail User's email address
     * @return int User ID
     */
    public static int getUserId(String token, int orgId, String userEmail) {
        Reports.logKeywordName();
        setApiResponse(getUserInfo(token, orgId, userEmail));
        if (Json.getFromAPIResponse(getApiResponse(), "status_pp_user").equals("existed"))
            return Integer.parseInt(Json.getFromAPIResponse(getApiResponse(), "data.id"));
        else
            return Integer.parseInt(Json.getFromAPIResponse(getApiResponse(), "data.user.id"));
    }

    /**
     * Creates new user account and adds them to organization
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param user         User object containing new user details
     * @param roles        List of roles to assign
     * @return APIResponse containing operation result
     */
    public static APIResponse addNewUserIntoOrg(String privateToken, ObjOrg objOrg, ObjUser user, List<UserRole> roles) {
        Reports.logKeywordName();
        createAccount(privateToken, user);
        return addExistingUserIntoOrg(privateToken, objOrg, user.getEmail(), roles);
    }

    /**
     * Adds existing user to an organization with specified roles
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param userEmail    User's email address
     * @param roles        List of roles to assign
     * @return APIResponse containing operation result
     */
    public static APIResponse addExistingUserIntoOrg(String privateToken, ObjOrg objOrg, String userEmail, List<UserRole> roles) {
        Reports.logKeywordName();
        int userId = getUserId(privateToken, objOrg.getId(), userEmail);

        JsonArray jsonRoles = new JsonArray();
        for (UserRole role : roles)
            jsonRoles.add(role.getRolePk());

        JsonObject body = new JsonObject();
        body.addProperty("user_pk", userId);
        body.add("rights", new JsonObject());
        body.add("role_pk_list", jsonRoles);

        setUrl(Endpoints.AUTHENTICATOR_URL + "api/organization/account/add/" + objOrg.getId() + "/");
        setHeaders(privateToken);
        setApiResponse(sendPostRequestWithBody(getUrl(), getHeaders(), body.toString()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Removes user from organization
     *
     * @param privateToken Authentication token
     * @param objOrg       Organization object
     * @param userEmail    Email of user to remove
     * @return APIResponse containing operation result
     */
    public static APIResponse removeUser(String privateToken, ObjOrg objOrg, String userEmail) {
        Reports.logKeywordName();
        int userId = getUserId(privateToken, objOrg.getId(), userEmail);

        JsonObject body = new JsonObject();
        body.addProperty("user_pk", userId);

        setUrl(Endpoints.AUTHENTICATOR_URL + "api/organization/account/delete/" + objOrg.getSlug() + "/");
        setHeaders(privateToken);
        setApiResponse(sendPostRequestWithBody(getUrl(), getHeaders(), body.toString(), false, false));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }

    /**
     * Deletes test merchant organizations (those with AUTOTEST_ prefix)
     * WARNING: Should only be used in test environment
     *
     * @param mppToken MPP authentication token
     * @return APIResponse containing operation result
     */
    public static APIResponse deleteTestMerchants(String mppToken) {
        Reports.logKeywordName();
        setUrl(Endpoints.AUTHENTICATOR_URL + "api/organization/account/internal-delete-orgs/");
        setHeaders(mppToken);
        setApiResponse(sendPostRequest(getUrl(), getHeaders()));
        markErrorWhenNotSuccess(getApiResponse());
        return getApiResponse();
    }
}

