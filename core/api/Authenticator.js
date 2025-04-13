const Endpoints = require("../constants/Endpoints");
// const Encryption = require("../utils/Encryption");
const Json = require("../../utils/Json");
// const Tokens = require("../utils/Tokens");
// const Environment = require("../utils/Environment");
// const DataLocations = require("../constants/DataLocations");
// const PPCredential = require("../constants/PPCredential");
// const UserRole = require("../enums/UserRole");
// const FeatureToggle = require("../enums/FeatureToggle");
const ConfigurationManager = require("../helper/ConfigurationManager");
const Encryption = require("../helper/Encryption");
const PPCredential = require("../constants/PPCredential");
// const FeatureToggleLIVersion = require('../enums/FeatureToggleLIVersion');

/**
 * Authenticator API wrapper for handling authentication and organization management operations.
 * Provides functionality for:
 * - User authentication
 * - Organization management
 * - Feature toggle controls
 */
const Authenticator = {
	// ThreadLocal storage for organization info
	_orgInfo: null,

	/**
	 * Gets organization info from storage
	 * @returns {Object} Organization information
	 */
	getStoredOrgInfo() {
		return this._orgInfo;
	},

	/**
	 * Sets organization info in storage
	 * @param {Object} orgInfo Organization object to store
	 */
	setOrgInfo(orgInfo) {
		this._orgInfo = orgInfo;
	},

	/**
	 * Authenticates a user with username and password
	 * @param {Object} user User object containing email and password
	 * @returns {Promise<Response>} API response containing authentication result
	 */
	async authenticateWithUsnPwd(user) {
		const body = {
			username: user.email,
			password: user.password,
			client_id: Encryption.decode(PPCredential.PP_CLIENT_ID),
			client_secret: Encryption.decode(PPCredential.PP_CLIENT_SECRET),
		};

		const url = `${Endpoints.PORTAL_URL}pp-portal-api/v1/authentication/authenticate-with-usn-pwd/`;
		const headers = {
			"Content-Type": "application/json",
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(`Failed to authenticate user: ${error.message}`);
		}
	},

	/**
	 * Gets access token for non-PP user
	 * @param {Object} nonPPUser User object containing credentials
	 * @returns {Promise<string>} Access token with token type prefix
	 */
	async getNonPPAccessToken(nonPPUser) {
		const response = await this.authenticateWithUsnPwd(nonPPUser);
		const data = await response.json();
		return data.data.access_token;
	},

	/**
	 * Searches for an organization by name
	 * @param {string} privateToken Authentication token
	 * @returns {Promise<Response>} API response containing matching organizations
	 */
	async searchOrganization(privateToken) {
		const url = `${Endpoints.AUTHENTICATOR_URL}api/account/profile/`;
		const headers = {
			Authorization: `Bearer ${privateToken}`,
		};

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: headers,
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(`Failed to search organization: ${error.message}`);
		}
	},

	/**
	 * Gets organization slug by organization name
	 * @param {string} privateToken Authentication token
	 * @param {string} orgName Name of organization
	 * @returns {Promise<string>} Organization slug or null if not found
	 */
	async getOrgSlug(privateToken, orgName) {
		const response = await this.searchOrganization(privateToken);
		const data = await response.json();

		const {organization} = data.data.organizations.find(org => org.organization.name === orgName);

		return organization.pp_slug;
	},

	/**
	 * Gets detailed organization information by slug
	 * @param {string} privateToken Authentication token
	 * @param {string} orgSlug Organization slug identifier
	 * @returns {Promise<Response>} API response containing organization details
	 */
	async getOrganization(privateToken, orgSlug) {
		const url = `${Endpoints.AUTHENTICATOR_URL}api/organization/${orgSlug}/`;
		const headers = {
			Authorization: `Bearer ${privateToken}`,
		};

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: headers,
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(`Failed to get organization: ${error.message}`);
		}
	},

	/**
	 * Gets complete organization information including credentials
	 * @param {string} privateToken Authentication token
	 * @param {string} orgName Organization name
	 * @returns {Promise<Object>} Organization details
	 */
	async getOrgInfo(privateToken, orgName) {
		const orgSlug = await this.getOrgSlug(privateToken, orgName);
		const response = await this.getOrganization(privateToken, orgSlug);
		const data = await response.json();

		const orgInfo = {
			name: data.data.name,
			id: Number.parseInt(data.data.id),
			slug: data.data.pp_slug,
		};

		orgInfo.clientID = data.data.credentials?.[0]?.api_client_id ?? ConfigurationManager.getProperty("API_CLIENT_ID");
		orgInfo.clientSecret = data.data.credentials?.[0]?.api_client_secret ?? ConfigurationManager.getProperty("API_CLIENT_SECRET");

		this.setOrgInfo(orgInfo);
		return this.getStoredOrgInfo();
	},

	/**
	 * Creates a new organization
	 * @param {string} mppToken MPP authentication token
	 * @param {string} newOrgName Name for the new organization
	 * @returns {Promise<Object>} Created organization details
	 */
	async createOrg(mppToken, newOrgName) {
		const body = {
			name: newOrgName,
			is_demo_account: false,
		};

		const url = `${Endpoints.AUTHENTICATOR_URL}api/organization/`;
		const headers = {
			Authorization: `Bearer ${mppToken}`,
			"Content-Type": "application/json",
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			const data = await response.json();
			const orgInfo = {
				name: data.data.name,
				id: Number.parseInt(data.data.id),
				slug: data.data.pp_slug,
			};

			this.setOrgInfo(orgInfo);
			return this.getOrgInfo();
		} catch (error) {
			throw new Error(`Failed to create organization: ${error.message}`);
		}
	},

	/**
	 * Sets or unsets organization as internal test account
	 * @param {string} mppToken MPP authentication token
	 * @param {string} orgSlug Organization slug
	 * @param {boolean} stage Boolean flag to enable/disable test status
	 * @returns {Promise<Response>} API response containing operation result
	 */
	async setInternalTestOrgWithStage(mppToken, orgSlug, stage) {
		const body = {
			enabled: stage,
		};

		const url = `${Endpoints.AUTHENTICATOR_URL}api/organization/toggle-internal-test-account/${orgSlug}/`;
		const headers = {
			Authorization: `Bearer ${mppToken}`,
			"Content-Type": "application/json",
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(
				`Failed to set internal test organization: ${error.message}`,
			);
		}
	},

	/**
	 * Enables internal test mode for an organization
	 * @param {string} mppToken MPP authentication token
	 * @param {string} orgSlug Organization slug
	 * @returns {Promise<Response>} API response containing operation result
	 */
	async setInternalTestOrg(mppToken, orgSlug) {
		return this.setInternalTestOrgWithStage(mppToken, orgSlug, true);
	},

	/**
	 * Gets credential details for an organization
	 * @param {string} mppToken MPP authentication token
	 * @param {string} orgSlug Organization slug
	 * @returns {Promise<Response>} API response containing organization credentials
	 */
	async getOrganizationCredentialDetails(mppToken, orgSlug) {
		const url = `${Endpoints.AUTHENTICATOR_URL}api/organization/credential/${orgSlug}/`;
		const headers = {
			Authorization: `Bearer ${mppToken}`,
		};

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: headers,
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(
				`Failed to get organization credential details: ${error.message}`,
			);
		}
	},

	/**
	 * Gets encrypted credentials for an organization
	 * @param {string} mppToken MPP authentication token
	 * @param {string} orgSlug Organization slug
	 * @returns {Promise<string>} Encrypted credentials
	 */
	async getEncryptedCredential(mppToken, orgSlug) {
		const response = await this.getOrganizationCredentialDetails(
			mppToken,
			orgSlug,
		);
		const data = await response.json();
		return data.data.encrypted_credential;
	},

	/**
	 * Gets organization feature toggle settings
	 * @param {string} mppToken MPP authentication token
	 * @param {string} orgSlug Organization slug
	 * @returns {Promise<Response>} API response containing feature toggle settings
	 */
	async getOrgFeatureToggle(mppToken, orgSlug) {
		const url = `${Endpoints.AUTHENTICATOR_URL}api/v1/feature-toggle/${orgSlug}/`;
		const headers = {
			Authorization: `Bearer ${mppToken}`,
		};

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: headers,
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(
				`Failed to get organization feature toggle: ${error.message}`,
			);
		}
	},

	/**
	 * Gets a specific feature toggle property for an organization
	 * @param {string} mppToken MPP authentication token
	 * @param {string} orgSlug Organization slug
	 * @param {string} jsonPath JSON path to the desired property
	 * @returns {Promise<*>} Property value
	 */
	async getOrgFeatureToggleProperty(mppToken, orgSlug, jsonPath) {
		const response = await this.getOrgFeatureToggle(mppToken, orgSlug);
		const data = await response.json();
		return Json.getFromObject(data, jsonPath);
	},

	/**
	 * Checks if tracking widgets feature is enabled for an organization
	 * @param {string} mppToken MPP authentication token
	 * @param {Object} objOrg Organization object
	 * @returns {Promise<boolean>} True if tracking widgets are enabled
	 */
	async isTrackingWidgets(mppToken, objOrg) {
		const value = await this.getOrgFeatureToggleProperty(
			mppToken,
			objOrg.slug,
			"data.te_version.te_v2",
		);
		return Boolean(value);
	},

	/**
	 * Gets list of feature toggles for an organization
	 * @param {string} mppToken MPP authentication token
	 * @param {string} orgSlug Organization slug
	 * @returns {Promise<Response>} API response containing list of feature toggles
	 */
	async getListFeatureToggle(mppToken, orgSlug) {
		const url = `${Endpoints.AUTHENTICATOR_URL}api/feature-toggle/${orgSlug}/`;
		const headers = {
			Authorization: `Bearer ${mppToken}`,
		};

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: headers,
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(`Failed to get list feature toggle: ${error.message}`);
		}
	},

	/**
	 * Gets ID of a specific feature toggle
	 * @param {string} mppToken MPP authentication token
	 * @param {string} orgSlug Organization slug
	 * @param {FeatureToggle} featureToggleName Feature toggle to look up
	 * @returns {Promise<number>} ID of feature toggle or -1 if not found
	 */
	async getFeatureToggleId(mppToken, orgSlug, featureToggleName) {
		const response = await this.getListFeatureToggle(mppToken, orgSlug);
		const data = await response.json();

		for (let i = 0; i < data.data.length; i++) {
			if (data.data[i].key === featureToggleName.getKey()) {
				return data.data[i].id;
			}
		}

		return -1;
	},

	/**
	 * Checks if a feature toggle exists for an organization
	 * @param {string} mppToken MPP authentication token
	 * @param {string} orgSlug Organization slug
	 * @param {FeatureToggle} featureToggle Feature toggle to check
	 * @returns {Promise<boolean>} True if toggle exists
	 */
	async doesFeatureToggleExist(mppToken, orgSlug, featureToggle) {
		const id = await this.getFeatureToggleId(mppToken, orgSlug, featureToggle);
		return id > 0;
	},

	/**
	 * Adds a new feature toggle by key
	 * @param {string} mppToken MPP authentication token
	 * @param {string} orgSlug Organization slug
	 * @param {FeatureToggle} featureToggleName Feature toggle to add
	 * @returns {Promise<Response>} API response containing created feature toggle
	 */
	async addFeatureToggleByKey(mppToken, orgSlug, featureToggleName) {
		const body = {
			key: featureToggleName.getKey(),
		};

		const url = `${Endpoints.AUTHENTICATOR_URL}api/feature-toggle/${orgSlug}/`;
		const headers = {
			Authorization: `Bearer ${mppToken}`,
			"Content-Type": "application/json",
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(`Failed to add feature toggle: ${error.message}`);
		}
	},

	// /**
	//  * Adds or updates Logistic Intelligence version feature toggle
	//  * @param {string} mppToken MPP authentication token
	//  * @param {string} orgSlug Organization slug
	//  * @param {FeatureToggleLIVersion} version Version to set
	//  * @returns {Promise<Response>} API response containing operation result
	//  */
	// async addFeatureToggleLIVersion(mppToken, orgSlug, version) {
	//     const value = {
	//         version: version.getVersion()
	//     };

	//     const body = {
	//         value: value
	//     };

	//     const featureToggle = FeatureToggle.LOGISTIC_INTELLIGENCE_UI_UX_VERSION;
	//     const toggleId = await this.doesFeatureToggleExist(mppToken, orgSlug, featureToggle)
	//         ? await this.getFeatureToggleId(mppToken, orgSlug, featureToggle)
	//         : (await this.addFeatureToggleByKey(mppToken, orgSlug, featureToggle)).data.id;

	//     const url = `${Endpoints.AUTHENTICATOR_URL}api/feature-toggle/${orgSlug}/${toggleId}/`;
	//     const headers = {
	//         'Authorization': `Bearer ${mppToken}`,
	//         'Content-Type': 'application/json'
	//     };

	//     try {
	//         const response = await fetch(url, {
	//             method: 'PATCH',
	//             headers: headers,
	//             body: JSON.stringify(body)
	//         });

	//         if (!response.ok) {
	//             throw new Error(`API request failed with status ${response.status}`);
	//         }

	//         return response;
	//     } catch (error) {
	//         throw new Error(`Failed to add feature toggle LI version: ${error.message}`);
	//     }
	// },

	/**
	 * Creates a new user account
	 * @param {string} privateToken Authentication token
	 * @param {Object} user User object containing user details
	 * @returns {Promise<Object>} User object with updated user ID
	 */
	async createAccount(privateToken, user) {
		const account = {
			email: user.email,
			first_name: "",
			last_name: "",
			password: Encryption.decode(user.password),
			confirm_password: Encryption.decode(user.password),
		};

		const url = `${Endpoints.AUTHENTICATOR_URL}api/account/`;
		const headers = {
			Authorization: `Bearer ${privateToken}`,
			"Content-Type": "application/json",
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(account),
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			const data = await response.json();
			user.userId = data.data.id;
			return user;
		} catch (error) {
			throw new Error(`Failed to create account: ${error.message}`);
		}
	},

	/**
	 * Gets user information by email
	 * @param {string} mppToken MPP authentication token
	 * @param {number} orgId Organization ID
	 * @param {string} userEmail User's email address
	 * @returns {Promise<Response>} API response containing user information
	 */
	async getUserInfo(mppToken, orgId, userEmail) {
		const body = {
			email_invite: userEmail,
		};

		const url = `${Endpoints.AUTHENTICATOR_URL}api/organization/account/check-email/${orgId}/`;
		const headers = {
			Authorization: `Bearer ${mppToken}`,
			"Content-Type": "application/json",
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(`Failed to get user info: ${error.message}`);
		}
	},

	/**
	 * Gets user ID from email address
	 * @param {string} token Authentication token
	 * @param {number} orgId Organization ID
	 * @param {string} userEmail User's email address
	 * @returns {Promise<number>} User ID
	 */
	async getUserId(token, orgId, userEmail) {
		const response = await this.getUserInfo(token, orgId, userEmail);
		const data = await response.json();

		if (data.status_pp_user === "existed") {
			return Number.parseInt(data.data.id);
		}
		return Number.parseInt(data.data.user.id);
	},

	/**
	 * Creates new user account and adds them to organization
	 * @param {string} privateToken Authentication token
	 * @param {Object} objOrg Organization object
	 * @param {Object} user User object containing new user details
	 * @param {Array<UserRole>} roles List of roles to assign
	 * @returns {Promise<Response>} API response containing operation result
	 */
	async addNewUserIntoOrg(privateToken, objOrg, user, roles) {
		await this.createAccount(privateToken, user);
		return this.addExistingUserIntoOrg(privateToken, objOrg, user.email, roles);
	},

	/**
	 * Adds existing user to an organization with specified roles
	 * @param {string} privateToken Authentication token
	 * @param {Object} objOrg Organization object
	 * @param {string} userEmail User's email address
	 * @param {Array<UserRole>} roles List of roles to assign
	 * @returns {Promise<Response>} API response containing operation result
	 */
	async addExistingUserIntoOrg(privateToken, objOrg, userEmail, roles) {
		const userId = await this.getUserId(privateToken, objOrg.id, userEmail);
		const jsonRoles = roles.map((role) => role.getRolePk());

		const body = {
			user_pk: userId,
			rights: {},
			role_pk_list: jsonRoles,
		};

		const url = `${Endpoints.AUTHENTICATOR_URL}api/organization/account/add/${objOrg.id}/`;
		const headers = {
			Authorization: `Bearer ${privateToken}`,
			"Content-Type": "application/json",
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(
				`Failed to add existing user into organization: ${error.message}`,
			);
		}
	},

	/**
	 * Removes user from organization
	 * @param {string} privateToken Authentication token
	 * @param {Object} objOrg Organization object
	 * @param {string} userEmail Email of user to remove
	 * @returns {Promise<Response>} API response containing operation result
	 */
	async removeUser(privateToken, objOrg, userEmail) {
		const userId = await this.getUserId(privateToken, objOrg.id, userEmail);

		const body = {
			user_pk: userId,
		};

		const url = `${Endpoints.AUTHENTICATOR_URL}api/organization/account/delete/${objOrg.slug}/`;
		const headers = {
			Authorization: `Bearer ${privateToken}`,
			"Content-Type": "application/json",
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(`Failed to remove user: ${error.message}`);
		}
	},

	/**
	 * Deletes test merchant organizations
	 * @param {string} mppToken MPP authentication token
	 * @returns {Promise<Response>} API response containing operation result
	 */
	async deleteTestMerchants(mppToken) {
		const url = `${Endpoints.AUTHENTICATOR_URL}api/organization/account/internal-delete-orgs/`;
		const headers = {
			Authorization: `Bearer ${mppToken}`,
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
			});

			if (!response.ok) {
				throw new Error(`API request failed with status ${response.status}`);
			}

			return response;
		} catch (error) {
			throw new Error(`Failed to delete test merchants: ${error.message}`);
		}
	},
};

module.exports = Authenticator;
