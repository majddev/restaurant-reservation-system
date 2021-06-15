import React, { Fragment, useEffect, useState } from "react";
import PageHeader from "../common/PageHeader";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "../reservations/Reservations";
import formatPhone from "../common/formatPhone";
import { listReservations } from "../utils/api";
import axios from "axios";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(0);
  
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadReservations, [reload]);

  /* Fetch reservations by phone number */
  function loadReservations() {
    setReservationsError(null);
    let source = axios.CancelToken.source();

    if (reload > 0)
      listReservations(search, source)
        .then(setReservations)
        .catch(setReservationsError);

    return () => source.cancel();
  }

  /* Search data updater */
  function handleChange({ target }) {
    setSearch(target.value);
  }

  /**
   * Validates phone number 
   * input and fetches
   * all matching reservations
   * by mobile_number
   */
  function handleSubmit(event) {
    event.preventDefault();
    setReservations([]);
    setReservationsError(null);

    let formattedNumber;

    try {
      if (!search) throw new Error("Search is empty!");

      /**
       * Extracts digits from input
       * If correct length (10 digits for a phone number)
       * returns formatted phone as:
       * DDD-DDD-DDDD
       * else returns false
       */
      formattedNumber = formatPhone(search);

      if (formattedNumber === false)
        throw new Error(
          "Please enter a valid phone number 10 digits in length."
        );
      else {
        setSearch(formattedNumber);
        setReload(reload + 1)
      }
    } catch (err) {
      setReservationsError(err);
    }
  }

  /* Render */
  return (
    <Fragment>
      <PageHeader title={"Search Reservations"} />
      <main className="p-4">
        <form>
          <label htmlFor="search" className="form-label">
            Search by Phone Number:
          </label>
          <div className="input-group">
            <input
              type="search"
              name="mobile_number"
              className="form-control col-md-3 mr-3"
              placeholder="Enter a customer's phone number"
              aria-label="Search"
              value={search}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="btn btn-secondary px-4"
              onClick={handleSubmit}
            >
              Find
            </button>
          </div>
        </form>
        {reload > 0 ? <Reservations reservations={reservations}/> : null }
        <ErrorAlert error={reservationsError} />
      </main>
    </Fragment>
  );
}

export default SearchBar;
