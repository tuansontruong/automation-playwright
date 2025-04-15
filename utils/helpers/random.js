/**
 * Generates a random alphanumeric string of specified length
 * @param {number} length - Length of the string to generate
 * @returns {string} Random alphanumeric string
 */
function generateRandomAlphaNumberString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    
    return result;
}

module.exports = {
    generateRandomAlphaNumberString
}; 