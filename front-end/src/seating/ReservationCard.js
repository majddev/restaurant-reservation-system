import React from "react";
import { formatAsDate } from "../utils/date-time";

/**
 * Takes in reservation object
 * renders bootstrap card component
 * displaying reservation information
 * @param {Object} reservation 
 * @returns {JSX.Element}
 */
function ReservationCard({ reservation }) {
  /* Render when ready */
  if (reservation.first_name) {
    const { first_name, last_name, mobile_number, people } = reservation;
    const date = formatAsDate(reservation.reservation_date);

    return (
      <div className="card">
        <div className="card-body">
          <div className="card-header">
            <h5 className="card-title">
              Reservation for {first_name} {last_name}
            </h5>
            <h6 className="card-subtitle text-muted">
              Reservation Date: {date}
            </h6>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Contact: {mobile_number}</li>
            <li className="list-group-item">Party Size: {people}</li>
          </ul>
        </div>
      </div>
    );
  }

  /* Default render */
  return <p className="p-5">Getting reservation information...</p>;
}

export default ReservationCard;
