const fs = require('node:fs');
const path = require('node:path');

// Read the Users.json file
const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../resources/data/Users.json'), 'utf8'));

// Create a map of user data
const users = usersData.data.reduce((acc, user) => {
    acc[user.user_id] = {
        email: user.email,
        password: user.password,
        gmailClientId: user.gmail_client_id,
        gmailClientSecret: user.gmail_client_secret,
        gmailRefreshToken: user.gmail_refresh_token,
        gmailSecurityKey: user.gmail_security_key
    };
    return acc;
}, {});

/**
 * Get user data for a specific account type
 * @param {string} accountType - The account type (e.g., 'PP_ACCOUNT', 'NON_PP_ACCOUNT1')
 * @returns {Object} User data object containing email, password, and other credentials
 */
function getUser(accountType) {
    if (!users[accountType]) {
        throw new Error(`Account type ${accountType} not found`);
    }
    return users[accountType];
}

// Export account types as constants
const Account = {
    PP_ACCOUNT: getUser('PP_ACCOUNT'),
    NON_PP_ACCOUNT1: getUser('NON_PP_ACCOUNT1'),
    NON_PP_ACCOUNT2: getUser('NON_PP_ACCOUNT2'),
    NON_PP_ACCOUNT3: getUser('NON_PP_ACCOUNT3'),
    NON_PP_ACCOUNT4: getUser('NON_PP_ACCOUNT4'),
    NON_PP_ACCOUNT5: getUser('NON_PP_ACCOUNT5'),
    NON_PP_ACCOUNT6: getUser('NON_PP_ACCOUNT6'),
    NON_PP_ACCOUNT7: getUser('NON_PP_ACCOUNT7'),
    NON_PP_ACCOUNT8: getUser('NON_PP_ACCOUNT8'),
    NON_PP_ACCOUNT9: getUser('NON_PP_ACCOUNT9'),
    NON_PP_ACCOUNT10: getUser('NON_PP_ACCOUNT10'),
    NON_PP_ACCOUNT11: getUser('NON_PP_ACCOUNT11'),
    LOGIN_USERNAME_1: getUser('LOGIN_USERNAME_1'),
    LOGIN_USERNAME_2: getUser('LOGIN_USERNAME_2'),
    LOGIN_USERNAME_3: getUser('LOGIN_USERNAME_3')
};

module.exports = Account; 