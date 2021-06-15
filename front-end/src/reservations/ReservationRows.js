import React from "react";
import { Link, useHistory } from "react-router-dom";
import { cancelReservation } from "../utils/api";

function ReservationRows({ sortedReservations }) {
  const history = useHistory();

  /**
   * PUT request to set reservation
   * status to "cancelled" if
   * dialog box confirmed
   */
  async function cancelHandler({ target }) {
    const cancelMessage =
      "Do you want to cancel this reservation? This cannot be undone.";

    const reservation_id = target.getAttribute("data-reservation-id-cancel");

    if (await window.confirm(cancelMessage)) {
      await cancelReservation(reservation_id).then(() => {
        history.go(0);
      });
    } else return;
  }

  /* Format reservations as table rows */
  const mapReservations = [];
  /**
   * Format and map reservations
   * into table rows
   * ===============
   * Conditional button rendering
   * depending on status of reservation
   */
  sortedReservations.forEach((res, index) => {
    const { reservation_id, status } = res;
    const capitalStatus = status.charAt(0).toUpperCase() + status.slice(1);

    mapReservations.push(
      <tr key={reservation_id} className="res-text table-row">
        <td className="text-center">{`${res.first_name} ${res.last_name}`}</td>
        <td className="text-center">{res.mobile_number}</td>
        <td className="text-center">{res.reservation_date}</td>
        <td className="text-center">{res.reservation_time}</td>
        <td className="text-center" data-reservation-id-status={reservation_id}>
          {capitalStatus}
        </td>
        {status === "booked" ? (
          <td className="text-center">
            <Link
              className="btn btn-secondary"
              to={`/reservations/${reservation_id}/seat`}
            >
              Seat
            </Link>
            <Link
              className="btn btn-secondary mx-2"
              to={`/reservations/${reservation_id}/edit`}
            >
              Edit
            </Link>
            <button
              className="btn btn-danger"
              type="button"
              onClick={cancelHandler}
              data-reservation-id-cancel={reservation_id}
            >
              Cancel
            </button>
          </td>
        ) : null}
      </tr>
    );
  });

  /* Render when ready */
  if (mapReservations.length)
    return <tbody className="res-text">{mapReservations}</tbody>;

  /* Default render */
  return (
    <tbody>
      <tr>
        <td className="text-center mt-5 fs-1">No reservations found.</td>
      </tr>
    </tbody>
  );
}

export default ReservationRows;
