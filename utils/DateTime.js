const DateTimeFormats = require('../core/constants/DateTimeFormats');
const { format } = require('date-fns');

/**
 * Utility module providing comprehensive date and time manipulation functionality.
 * This module offers methods for:
 * - Date/time formatting and parsing
 * - Timezone conversions
 * - Date calculations and comparisons
 * - Working days calculations
 * - Duration formatting
 */

/**
 * Gets the current date and time in the system default timezone
 * @returns {Date} Current date and time
 */
export function getCurrentDateTime() {
    return new Date();
}

/**
 * Gets the current date and time in the specified timezone
 * @param {string} timezone - The target timezone ID (e.g., "America/New_York")
 * @returns {Date} Current date and time in specified timezone
 */
export function getCurrentDateTimeInTimezone(timezone) {
    return new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
}

/**
 * Formats the current date and time using the specified format
 * @param {string} format - The format pattern to use
 * @returns {string} Formatted date/time string
 */
export function getCurrentDateTimeValue(format) {
    return formatDateTime(getCurrentDateTime(), format);
}

/**
 * Formats the current date and time using the default ISO_LOCAL_DATE_TIME format
 * @returns {string} Formatted date/time string
 */
export function getCurrentDateTimeValueDefault() {
    return getCurrentDateTimeValue(DateTimeFormats.ISO_LOCAL_DATE_TIME);
}

/**
 * Formats the current date and time using the specified format and locale
 * @param {string} format - The format pattern to use
 * @param {string} language - The locale for formatting
 * @returns {string} Formatted date/time string
 */
export function getCurrentDateTimeValueWithLocale(format, language) {
    return formatDateTime(getCurrentDateTime(), format, language);
}

/**
 * Formats the current date and time using the specified format and timezone
 * @param {string} timezone - The timezone ID
 * @param {string} format - The format pattern to use
 * @returns {string} Formatted date/time string
 */
export function getCurrentDateTimeValueInTimezone(timezone, format) {
    return formatDateTime(getCurrentDateTimeInTimezone(timezone), format);
}

/**
 * Formats a date using the specified format
 * @param {Date} dateTime - The date/time to format
 * @param {string} format - The format pattern to use
 * @returns {string} Formatted date/time string
 */
export function formatDateTime(dateTime, format) {
    if (format === DateTimeFormats.ISO_OFFSET_DATE_TIME) {
        // Get the timezone offset in minutes
        const tzOffset = dateTime.getTimezoneOffset();
        const tzHours = Math.abs(Math.floor(tzOffset / 60));
        const tzMinutes = Math.abs(tzOffset % 60);
        const tzSign = tzOffset <= 0 ? '+' : '-';
        const tzString = `${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMinutes).padStart(2, '0')}`;

        // Get the ISO string and remove the 'Z' at the end
        const isoString = dateTime.toISOString().replace('Z', '');
        
        // Return the formatted string with timezone offset
        return `${isoString}${tzString}`;
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        ...getFormatOptions(format)
    });
    return formatter.format(dateTime);
}

/**
 * Converts a date/time string from one format to another
 * @param {string} dateTime - The date/time string to convert
 * @param {string} inputFormat - The format of the input string
 * @param {string} outputFormat - The desired output format
 * @returns {string} Formatted date/time string
 */
export function convertDateTimeFormat(dateTime, inputFormat, outputFormat) {
    const parsedDate = parseStringToDateTime(dateTime, inputFormat);
    return formatDateTime(parsedDate, outputFormat);
}

/**
 * Parses a date/time string into a Date object
 * @param {string} stringDateTime - The date/time string to parse
 * @param {string} inFormat - The format of the input string
 * @returns {Date} Date object representing the parsed date/time
 */
export function parseStringToDateTime(stringDateTime, inFormat) {
    return new Date(stringDateTime);
}

/**
 * Converts a datetime to a different timezone
 * @param {Date} convertedDateTime - The datetime to convert
 * @param {string} targetTimezone - The target timezone ID
 * @returns {Date} Date in the target timezone
 */
export function convertTimeZone(convertedDateTime, targetTimezone) {
    return new Date(convertedDateTime.toLocaleString('en-US', { timeZone: targetTimezone }));
}

/**
 * Calculates the duration between two datetimes
 * @param {Date} dateTimeStart - The start datetime
 * @param {Date} dateTimeEnd - The end datetime
 * @returns {number} Duration in milliseconds
 */
export function getDiffTime(dateTimeStart, dateTimeEnd) {
    return dateTimeEnd - dateTimeStart;
}

/**
 * Formats a duration into HH:mm:ss format
 * @param {number} duration - The duration in milliseconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(duration) {
    const seconds = Math.floor(duration / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

/**
 * Pauses execution for specified milliseconds
 * @param {number} millisecond - The number of milliseconds to wait
 * @returns {Promise<void>}
 */
export function wait(millisecond) {
    return new Promise(resolve => setTimeout(resolve, millisecond));
}

/**
 * Converts month name to its numerical value (1-12)
 * @param {string} month - The month name
 * @returns {number} Month number (1-12)
 */
export function convertMonthToNumber(month) {
    const date = new Date(`${month} 1, 2000`);
    return date.getMonth() + 1;
}

/**
 * Adds a specified amount of time to a date
 * @param {string} timeUnit - The unit of time to add
 * @param {Date} dateTime - The base date/time
 * @param {number} value - The amount to add
 * @returns {Date} The adjusted date/time
 */
export function addDateTime(timeUnit, dateTime, value) {
    const newDate = new Date(dateTime);
    switch (timeUnit.toLowerCase()) {
        case 'years':
            newDate.setFullYear(newDate.getFullYear() + value);
            break;
        case 'months':
            newDate.setMonth(newDate.getMonth() + value);
            break;
        case 'weeks':
            newDate.setDate(newDate.getDate() + (value * 7));
            break;
        case 'days':
            newDate.setDate(newDate.getDate() + value);
            break;
        case 'hours':
            newDate.setHours(newDate.getHours() + value);
            break;
        case 'minutes':
            newDate.setMinutes(newDate.getMinutes() + value);
            break;
        case 'seconds':
            newDate.setSeconds(newDate.getSeconds() + value);
            break;
        default:
            throw new Error(`${timeUnit} is not supported`);
    }
    return newDate;
}

/**
 * Gets the day of week as a number (1-7, where 1 is Monday)
 * @param {Date} dateTime - The date to get the day of week for
 * @returns {number} Day of week number (1-7)
 */
export function getDayOfWeek(dateTime) {
    return dateTime.getDay() || 7; // Convert Sunday (0) to 7
}

/**
 * Calculates the number of working days between two dates
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @param {Date[]} holidays - List of holiday dates to exclude
 * @returns {number} Number of working days
 */
export function calculateWorkingDays(startDate, endDate, holidays = []) {
    let count = 0;
    const curDate = new Date(startDate);
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.some(h => h.getTime() === curDate.getTime())) {
            count++;
        }
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}

/**
 * Helper method to get format options for Intl.DateTimeFormat
 * @private
 */
function getFormatOptions(format) {
    switch (format) {
        case DateTimeFormats.BASIC_ISO_DATE:
            return { year: 'numeric', month: '2-digit', day: '2-digit' };
        case DateTimeFormats.ISO_LOCAL_DATE:
            return { year: 'numeric', month: '2-digit', day: '2-digit' };
        case DateTimeFormats.ISO_LOCAL_TIME:
            return { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        case DateTimeFormats.ISO_LOCAL_DATE_TIME:
            return { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
        case DateTimeFormats.ISO_OFFSET_DATE_TIME:
            return {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'shortOffset',
                hour12: false
            };
        default:
            return {};
    }
}

/**
 * Formats a date/time using the specified format and timezone
 * Similar to Java's ppFormatDateTime method
 * @param {Date} dateTime - The date/time to format
 * @param {string} format - The format pattern to use
 * @param {string} [timezone] - Optional timezone ID
 * @returns {string} Formatted date/time string
 */
export function ppFormatDateTime(dateTime, formatPattern, timezone) {
    // Convert format patterns to date-fns format
    const dateFnsFormat = formatPattern
        .replace('dd', 'dd')
        .replace('MMM', 'MMM')
        .replace('yyyy', 'yyyy')
        .replace('HH', 'HH')
        .replace('hh', 'hh')
        .replace('mm', 'mm')
        .replace('ss', 'ss')
        .replace('a', 'a');

    return format(dateTime, dateFnsFormat);
}

