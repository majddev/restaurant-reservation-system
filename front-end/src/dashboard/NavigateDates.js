import React from "react";
import { useHistory } from "react-router";
import { next, previous } from "../utils/date-time";
import "../common/common.css";

/**
 * Controls date navigation
 * @param {String} date
 * @param {String} today
 * @returns {JSX.Element}
 */

function NavigateDates({ date, today }) {
  const history = useHistory();

  function handleToday() {
    history.push(`/dashboard?date=${today}`);
  }

  function handleNext() {
    history.push(`/dashboard?date=${next(date)}`);
  }

  function handlePrev() {
    history.push(`/dashboard?date=${previous(date)}`);
  }

  return (
    <div className="d-flex justify-content-around my-3">
      <button className="btn btn-primary" onClick={handlePrev}>
        <span className="oi oi-arrow-circle-left mr-2" />
        Previous Date
      </button>
      <button className="btn btn-primary px-4" onClick={handleToday}>
        Today
      </button>
      <button className="btn btn-primary" onClick={handleNext}>
        Next Date
        <span className="oi oi-arrow-circle-right ml-2" />
      </button>
    </div>
  );
}

export default NavigateDates;
