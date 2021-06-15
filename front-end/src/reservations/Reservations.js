import React from "react";
import sortReservations from "../common/sortReservations";

import "../common/common.css";
import ReservationRows from "./ReservationRows";

/**
 * Takes in and formats reservations as a table
 * @param {Array} reservations
 * @param {String} date determined in parent (Dashboard.js)
 * @returns {JSX.Element}
 */
function Reservations({ reservations }) {
  /* Sort reservations by time */
  const sortedReservations = sortReservations(reservations);

  /* Moved table rows and render condition to {./ReservationRows.js} */
  return (
    <div className="table-responsive-lg">
      <table className="table">
        <thead>
          <tr className="res-text">
            <th className="text-center">Name</th>
            <th className="text-center">Contact</th>
            <th className="text-center">Date</th>
            <th className="text-center">Time</th>
            <th className="text-center">Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <ReservationRows sortedReservations={sortedReservations} />
      </table>
    </div>
  );
}

export default Reservations;
