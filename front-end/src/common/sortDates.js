/**
 *
 * @param {Array from Set} dates
 * @returns {Sorted Array}
 */

 export function sortDates(dates) {
    return dates.sort(compare);
  }
  
  export function compare(first, sec) {
    const firstDate = first.split("-");
    const secDate = sec.split("-");
  
    for (let i = 0; i < 3; i++) {
      if (parseInt(firstDate[i]) === parseInt(secDate[i])) {
        if (i === 2) return 0;
        else continue;
      } else if (parseInt(firstDate[i]) > parseInt(secDate[i])) return 1;
      else if (parseInt(firstDate[i]) > parseInt(secDate[i])) return -1;
      else return 0;
    }
  }
  