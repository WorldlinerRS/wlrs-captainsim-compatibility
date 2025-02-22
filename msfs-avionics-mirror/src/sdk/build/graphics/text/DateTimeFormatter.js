/* eslint-disable max-len */
/**
 * A utility class for creating time formatters.
 *
 * Each time formatter is a function which generates output strings from input time values, expressed as UNIX
 * timestamps in milliseconds. The formatting behavior of a formatter is defined by its format template and options.
 *
 * Please refer to the {@link DateTimeFormatterOptions} type documentation for more information on individual
 * formatting options.
 *
 * Format templates are strings which contain zero or more fragments enclosed by curly braces (`{}`); For a given
 * format template, an output string is generated from an input duration by replacing each fragment in the template
 * with a string generated from the input. The parts of the template string that are not contained in any fragment are
 * passed to the output unchanged. Each fragment defines how its replacement string is generated. There are two types
 * of fragments:
 * * Numeric fragment. In EBNF notation, these take the form `{x}` where `x = 'M' | 'd' | 'w' | 'H' | 'h' | 'm' | 's'`.
 * Each numeric fragment is replaced with a numeric representation of the month (`M`), day of month (`d`), day of week
 * (`w`), hour-24 (`H`), hour-12 (`h`), minute (`m`), or second (`s`) part of the input time. The number of `x`
 * characters in the definition controls the number of leading zeroes with which the output will be padded.
 * * Year fragment. In EBNF notation, these take the form `'YY' | 'YYYY'`. Each year fragment is replaced with either
 * the two-digit (`YY`) or unlimited-digit (`YYYY`) year of the input time.
 * * Month fragment. In EBNF notation, these take the form `('mon', ['.']) | ('MON', ['.']) | 'month' | 'MONTH'`. Each
 * month fragment is replaced with the name of the month of the input time. The case of the definition determines the
 * case of the output. `mon` will use abbreviated names. The presence of the optional `'.'` character will add a period
 * to the end of the abbreviated names.
 * * Day-of-week fragment. In EBNF notation, these take the form `('dy', ['.']) | ('DY', ['.']) | 'day' | 'DAY'`. Each
 * day-of-week fragment is replaced with the name of the day-of-week of the input time. The case of the definition
 * determines the case of the output. `dy` will use abbreviated names. The presence of the optional `'.'` character
 * will add a period to the end of the abbreviated names.
 * * AM/PM fragment. In EBNF notation, these take the form `'am' | 'a.m.' | 'AM' | 'A.M.'`. Each AM/PM fragment is
 * replaced with an AM/PM string depending on the time of day of the input. The case of the definition determines the
 * case of the output. Use of periods in the definition will add periods to the output.
 */
export class DateTimeFormatter {
    /**
     * Creates a function which formats times, expressed as UNIX timestamps in milliseconds, to strings. The formatting
     * behavior of the function is defined by a specified format template and options. For more information on format
     * templates and their syntax, please refer to the {@link DateTimeFormatter} class documentation. For more
     * information on individual formatting options, please refer to the {@link DateTimeFormatterOptions} type
     * documentation.
     * @param format A template defining how the function formats durations.
     * @param options Options to customize the formatter. Options not explicitly defined will be set to the following
     * default values:
     * * `monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']`
     * * `monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']`
     * * `dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']`
     * * `dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']`
     * * `nanString = 'NaN'`
     * @returns A function which formats times, expressed as UNIX timestamps in milliseconds, to strings.
     */
    static create(format, options) {
        const optsToUse = Object.assign({}, DateTimeFormatter.DEFAULT_OPTIONS, options);
        const builder = DateTimeFormatter.createBuilder(format, optsToUse);
        const date = new Date();
        return (time) => {
            if (isNaN(time)) {
                return optsToUse.nanString;
            }
            date.setTime(time);
            return builder.reduce((string, part) => string + part(date), '');
        };
    }
    /**
     * Creates an output string builder from a format template and options.
     * @param format A format template.
     * @param options Formatting options.
     * @returns An output string builder which conforms to the specified format template and options.
     */
    static createBuilder(format, options) {
        const split = format.split(DateTimeFormatter.FORMAT_REGEXP);
        return split.map((string) => {
            if (string.match(DateTimeFormatter.FORMAT_REGEXP)) {
                return DateTimeFormatter.parseFragment(string.substring(1, string.length - 1), options);
            }
            else {
                return () => string;
            }
        });
    }
    /**
     * Parses a format template fragment and returns a function which generates a string from an input time according
     * to the rules defined by the fragment. If the fragment is malformed, this method returns a function which always
     * generates an empty string.
     * @param fragment A format template fragment definition.
     * @param options Formatting options.
     * @returns A function which generates a string from an input time, expressed as a UNIX timestamp in milliseconds,
     * according to the rules defined by the template fragment.
     */
    static parseFragment(fragment, options) {
        const match = fragment.match(DateTimeFormatter.FRAGMENT_REGEXP);
        if (match) {
            if (match[1]) {
                return DateTimeFormatter.parseNumFragment(match);
            }
            else if (match[4]) {
                return DateTimeFormatter.parseYearFragment(match);
            }
            else if (match[5]) {
                return DateTimeFormatter.parseMonthFragment(match, options);
            }
            else if (match[6]) {
                return DateTimeFormatter.parseDayFragment(match, options);
            }
            else if (match[7]) {
                return DateTimeFormatter.parseAMPMFragment(match);
            }
        }
        return () => '';
    }
    /**
     * Parses a numeric template fragment and returns a function which generates a string from an input time according
     * to the rules defined by the fragment.
     * @param match A numeric template fragment, as a regular expression match.
     * @returns A function which generates a string from an input time, expressed as a UNIX timestamp in milliseconds,
     * according to the rules defined by the numeric template fragment.
     */
    static parseNumFragment(match) {
        const numGetter = DateTimeFormatter.NUM_GETTERS[match[3]];
        const pad = match[2].length;
        return (date) => {
            return numGetter(date).toString().padStart(pad, '0');
        };
    }
    /**
     * Parses a year template fragment and returns a function which generates a string from an input time according
     * to the rules defined by the fragment.
     * @param match A year template fragment, as a regular expression match.
     * @returns A function which generates a string from an input time, expressed as a UNIX timestamp in milliseconds,
     * according to the rules defined by the year template fragment.
     */
    static parseYearFragment(match) {
        if (match[4].length === 2) {
            // YY
            return (date) => (date.getUTCFullYear() % 100).toString();
        }
        else {
            // YYYY
            return (date) => date.getUTCFullYear().toString();
        }
    }
    /**
     * Parses a month template fragment and returns a function which generates a string from an input time according
     * to the rules defined by the fragment.
     * @param match A month template fragment, as a regular expression match.
     * @param options Formatting options.
     * @returns A function which generates a string from an input time, expressed as a UNIX timestamp in milliseconds,
     * according to the rules defined by the month template fragment.
     */
    static parseMonthFragment(match, options) {
        const isUpperCase = match[5][0] === 'M';
        if (match[5].length === 3) {
            // mon
            const text = isUpperCase ? options.monthNamesShort.map(str => str.toUpperCase()) : options.monthNamesShort;
            return (date) => text[date.getUTCMonth()];
        }
        else if (match[5].length === 4) {
            // mon.
            const text = isUpperCase ? options.monthNamesShort.map(str => str.toUpperCase()) : options.monthNamesShort;
            return (date) => {
                const month = date.getUTCMonth();
                return `${text[month]}${options.monthNamesShort[month] === options.monthNames[month] ? '' : '.'}`;
            };
        }
        else {
            // month
            const text = isUpperCase ? options.monthNames.map(str => str.toUpperCase()) : options.monthNames;
            return (date) => text[date.getUTCMonth()];
        }
    }
    /**
     * Parses a day-of-week template fragment and returns a function which generates a string from an input time
     * according to the rules defined by the fragment.
     * @param match A day-of-week template fragment, as a regular expression match.
     * @param options Formatting options.
     * @returns A function which generates a string from an input time, expressed as a UNIX timestamp in milliseconds,
     * according to the rules defined by the day-of-week template fragment.
     */
    static parseDayFragment(match, options) {
        const isUpperCase = match[6][0] === 'D';
        if (match[6] === 'dy') {
            const text = isUpperCase ? options.dayNamesShort.map(str => str.toUpperCase()) : options.dayNamesShort;
            return (date) => text[date.getUTCDay()];
        }
        else if (match[6] === 'dy.') {
            const text = isUpperCase ? options.dayNamesShort.map(str => str.toUpperCase()) : options.dayNamesShort;
            return (date) => {
                const day = date.getUTCDay();
                return `${text[day]}${options.dayNamesShort[day] === options.dayNames[day] ? '' : '.'}`;
            };
        }
        else {
            // day
            const text = isUpperCase ? options.dayNames.map(str => str.toUpperCase()) : options.dayNames;
            return (date) => text[date.getUTCDay()];
        }
    }
    /**
     * Parses an am/pm template fragment and returns a function which generates a string from an input time according
     * to the rules defined by the fragment.
     * @param match An am/pm template fragment, as a regular expression match.
     * @returns A function which generates a string from an input time, expressed as a UNIX timestamp in milliseconds,
     * according to the rules defined by the am/pm template fragment.
     */
    static parseAMPMFragment(match) {
        const isUpperCase = match[7][0] === 'A';
        const usePeriod = match[7].length > 2;
        let text = usePeriod ? ['a.m.', 'p.m.'] : ['am', 'pm'];
        if (isUpperCase) {
            text = text.map(str => str.toUpperCase());
        }
        return (date) => text[Math.floor(date.getUTCHours() / 12)];
    }
}
DateTimeFormatter.FORMAT_REGEXP = /({[^{}]*})/;
DateTimeFormatter.FRAGMENT_REGEXP = /^(?:((([MdwHhms])+))|(YY|YYYY)|(mon\.?|month|MON\.?|MONTH)|(dy\.?|day|DY\.?|DAY)|(am|AM|a\.m\.|A\.M\.))$/;
DateTimeFormatter.NUM_GETTERS = {
    ['s']: (date) => date.getUTCSeconds(),
    ['m']: (date) => date.getUTCMinutes(),
    ['h']: (date) => date.getUTCHours() % 12,
    ['H']: (date) => date.getUTCHours(),
    ['w']: (date) => date.getUTCDay() + 1,
    ['d']: (date) => date.getUTCDate(),
    ['M']: (date) => date.getUTCMonth() + 1
};
DateTimeFormatter.DEFAULT_OPTIONS = {
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    nanString: 'NaN'
};
