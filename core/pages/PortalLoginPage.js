const PPCommonPage = require('../base/PPCommonPage');
const ChooseMerchantPage = require('./ChooseMerchantPage');

/**
 * @typedef {Object} User
 * @property {string} email - The user's email address
 * @property {string} password - The user's password
 */

/**
 * @typedef {import('./ChooseMerchantPage')} ChooseMerchantPage
 */

class PortalLoginPage extends PPCommonPage {
    constructor(page) {
        super(page);
        this.selectors = {
            username: "input[name='email']",
            password: "input[name='password']",
            signInButton: "//button[text()='Log in']",
            googleSignInButton: "#pp-google-sso-btn"
        };
        this.waitForPageLoad();
        this.waitForElementExist(this.selectors.username);
        this.waitForElementExist(this.selectors.password);
        this.waitForElementExist(this.selectors.signInButton);
    }

    async isDisplayed() {
        return await this.isElementVisible(this.selectors.googleSignInButton) &&
               await this.isElementVisible(this.selectors.username) &&
               await this.isElementVisible(this.selectors.password) &&
               await this.isElementVisible(this.selectors.signInButton);
    }

    async submitUser(username, password) {
        await this.waitForPageLoad();
        await this.setText(this.selectors.username, username);
        await this.setText(this.selectors.password, password);
        await this.click(this.selectors.signInButton);
    }

    /**
     * Signs in a user with their username and password
     * @param {User} user - The user object containing email and password
     * @returns {Promise<ChooseMerchantPage>} Returns a promise that resolves to a new ChooseMerchantPage instance
     */
    async signInWithUsernameAndPassword(user) {
        await this.submitUser(user.email, user.password);
        return new ChooseMerchantPage(this.page);
    }

    async clickSignInWithGoogle() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.click(this.selectors.googleSignInButton)
        ]);
        return new SignInGoogleAccountPage(newPage);
    }

    async getMPPToken(user) {
        const fileName = `${process.env.DATA_OUTPUT_FOLDER}${process.env.ENV}.${user.userId}.token.json`;
        let mppToken;
        
        if (!await this.isAccessTokenValid(fileName)) {
            const googlePage = await this.clickSignInWithGoogle();
            await googlePage.signInWithGoogleAccount(user);
            mppToken = await this.getLocalToken();
            await this.saveAccessToken(fileName, mppToken, 11 * 3600);
        } else {
            mppToken = await this.readPPToken(user);
        }
        
        await this.closeBrowser();
        return mppToken;
    }

    async signInWithGoogle(user) {
        const googlePage = await this.clickSignInWithGoogle();
        await googlePage.signInWithGoogleAccount(user);
        const fileName = `${process.env.DATA_OUTPUT_FOLDER}${process.env.ENV}.${user.userId}.token.json`;
        await this.saveAccessToken(fileName, await this.getLocalToken(), 11 * 3600);
        return this;
    }
}

class SignInGoogleAccountPage {
    constructor(page) {
        this.page = page;
    }

    async signInWithGoogleAccount(user) {
        // Implement Google sign-in logic here
        await this.page.waitForLoadState('networkidle');
        return this;
    }
}

module.exports = PortalLoginPage; 