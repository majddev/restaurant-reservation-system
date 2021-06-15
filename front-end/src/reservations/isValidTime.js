/**
 * Takes in time as string
 * Formatted as HH:MM
 * Checks that time is between
 * valid reservation time slots.
 * @param {String} formTime 
 * @returns {Boolean}
 */
function isValidTime(formTime) {
  const lower = toMinutes("10:30"); // 10:30 AM
  const upper = toMinutes("21:30"); // 9:30 PM
  const givenTime = toMinutes(formTime);

  if (givenTime < lower || givenTime > upper) return false;
  else return true;
}

function toMinutes(timeString) {
  const [hour, minutes] = timeString.split(":");

  return Number.parseInt(hour) * 60 + Number.parseInt(minutes);
}

export default isValidTime;
