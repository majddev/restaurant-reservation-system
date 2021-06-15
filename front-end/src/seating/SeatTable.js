import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { listTables, readReservation } from "../utils/api";
import PageHeader from "../common/PageHeader";
import ErrorAlert from "../layout/ErrorAlert";
import SeatTableForm from "./SeatTableForm";
import ReservationCard from "./ReservationCard";

/**
 * Handles seating a reservation 
 * at a table
 * =========
 * Primary render controller/
 * state holder for
 * form, card, and error
 * components
 * @returns {JSX.Element}
 */
function SeatTable() {
  const { reservation_id } = useParams();

  const [tables, setTables] = useState();
  const [reservation, setReservation] = useState({});

  const [selection, setSelection] = useState();
  const [seatError, setSeatError] = useState(null);

  useEffect(loadTables, []);
  useEffect(getReservation, [reservation_id]);

  /* Fetch all tables from DB */
  function loadTables() {
    setSeatError(null);
    let source = axios.CancelToken.source();

    listTables(source)
      .then(setTables)
      .catch(setSeatError);

    return () => source.cancel();
  }

  /* Fetch reservation by ID */
  function getReservation() {
    let source = axios.CancelToken.source();

    readReservation(reservation_id, source)
      .then(setReservation)
      .catch(setSeatError);

    return () => source.cancel();
  }

  /* Render */
  return (
    <Fragment>
      <PageHeader title={`Seat Reservation #${reservation_id}`} />
      <main>
        <ReservationCard reservation={reservation} />
        <SeatTableForm
          tables={tables}
          reservation={reservation}
          selection={selection}
          setSelection={setSelection}
          setSeatError={setSeatError}
        />
        <ErrorAlert error={seatError} />
      </main>
    </Fragment>
  );
}

export default SeatTable;
