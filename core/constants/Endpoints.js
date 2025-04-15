
const ConfigurationManager = require('../helper/ConfigurationManager');

const prefix_env = ConfigurationManager.getProperty('ENVIRONMENT') === 'apollo' ? 'apollo-' : "bruno-";

const Endpoints = {
    PUBLIC_API_URL: `https://${prefix_env}api.parcelperform.com/`,
    PUBLIC_API_AUTH_TOKEN_URL: `https://${prefix_env}api.parcelperform.com/auth/oauth/token/`,
    OS_READING_URL: `https://${prefix_env}os-reading.parcelperform.com/`,
	AUTHENTICATOR_URL: `https://${prefix_env}authenticator.parcelperform.com/`,
	PORTAL_URL: `${
		ConfigurationManager.getProperty('ENVIRONMENT') === 'apollo'
			? "https://apollo-k8s.parcelperform.com/"
			: "https://bruno.parcelperform.com/"
	}`,
    RETURN_URL: `https://${prefix_env}return.parcelperform.com/`,
};

module.exports = Endpoints;