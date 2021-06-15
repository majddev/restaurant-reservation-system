/**
 * Takes in a string and extracts numbers
 * If correct length for a phone number,
 * returns properly formatted phone.
 * Otherwise, returns false;
 * @param {String} phone 
 * @returns {Formatted String}
 */

 export default function formatPhone(phone) {
    if (!(phone.match(/\d/g))) return false;
  
    const numbers = phone.match(/\d/g).map(Number);
  
    if (numbers.length === 10) {
      numbers.splice(3, 0, '-');
      numbers.splice(7, 0, '-');
  
      return numbers.join("");
    } else return false;
  }
  