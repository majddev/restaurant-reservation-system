import { compare } from "../common/sortDates";

/**
 * Takes in date from form data
 * and today's date as strings
 * Uses compare function designed
 * for date comparison to check if
 * date is in the future
 * @param {String} formDate 
 * @param {String} today 
 * @returns {Boolean}
 */
function isValidDate(formDate, today) {
    const given = new Date(formDate);

    if (given.getUTCDay() === 2) return false;
    else if (compare(formDate, today) === 1) return true;
    else return false;
}

export default isValidDate;