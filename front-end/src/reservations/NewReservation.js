import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import PageHeader from "../common/PageHeader";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation } from "../utils/api";
import { formatAsDate, formatAsTime, today } from "../utils/date-time";
import NewResForm from "./NewResForm";

/**
 * Holds form state
 * to send as POST request
 * to API --
 * add column to Table "reservations"
 * @returns {JSX.Element}
 */
function NewReservation() {
  const { reservation_id } = useParams();
  
  const [formError, setFormError] = useState(null);
  const [dateError, setDateError] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  /* Determine title for page header component */
  const title = reservation_id
    ? `Edit Reservation #${reservation_id}`
    : "New Reservation";

  useEffect(getReservation, [reservation_id]);

  /* Fetch reservation by ID */
  function getReservation() {
    let source = axios.CancelToken.source();

    if (reservation_id)
      readReservation(reservation_id, source)
        .then((res) => {
          const { reservation_date, reservation_time } = res;
          res.reservation_date = formatAsDate(reservation_date);
          res.reservation_time = formatAsTime(reservation_time);

          delete res.created_at;
          delete res.updated_at;

          return setFormData(res);
        })
        .catch();

    return () => source.cancel();
  }

  /* Render */
  return (
    <Fragment>
      <PageHeader title={title} />
      <NewResForm
        formData={formData}
        setFormData={setFormData}
        setFormError={setFormError}
        setDateError={setDateError}
        today={today()}
      />
      <ErrorAlert error={formError} />
      <ErrorAlert error={dateError} />
    </Fragment>
  );
}

export default NewReservation;
