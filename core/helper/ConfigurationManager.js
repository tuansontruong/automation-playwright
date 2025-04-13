require('dotenv').config();

// Configuration object with static methods
const ConfigurationManager = {
    getProperty(key) {
        // Try to get from environment variables (process.env includes both
        // GitHub Actions env vars and .env file vars after dotenv.config())
        const envValue = process.env[key];
        if (envValue !== undefined && envValue !== '') {
            return envValue;
        }

        // Default values
        const defaults = {
            'BROWSER': 'chromium',
            'HEADLESS': 'true',
            'BASE_URL': 'https://www.apollo.parcelperform.com/login',
            'ENVIRONMENT': 'apollo',
        };

        return defaults[key] || '';
    },

    getBooleanProperty(key) {
        const value = this.getProperty(key).toLowerCase();
        return value === 'true' || value === '1';
    },

    getNumberProperty(key) {
        const value = this.getProperty(key);
        return Number.parseInt(value, 10) || 0;
    }
};

module.exports = ConfigurationManager; 