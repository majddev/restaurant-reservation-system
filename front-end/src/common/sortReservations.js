/**
 * Takes in reservations state
 * sorted by reservation_time
 * @param {Array} reservations 
 * @returns {Sorted Array}
 */
 function sortReservations(reservations = []) {
    if (!reservations.length) return [];

    return reservations.sort(compare);
}

function compare(firstEl, secEl) {
    if (firstEl.reservation_time > secEl.reservation_time) return 1;
    else if (firstEl.reservation_time < secEl.reservation_time) return -1;
    else return 0;
}

export default sortReservations;