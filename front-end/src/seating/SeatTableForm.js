import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { sortTables } from "../common/sortTables";

import "../common/common.css";
import { seatTable } from "../utils/api";

function SeatTableForm({
  tables,
  reservation,
  selection,
  setSelection,
  setSeatError,
}) {
  const history = useHistory();
  const { reservation_id, people } = reservation;

  /* Sort tables by name */
  const sortedTables = sortTables(tables);

  /* Format tables as table rows */
  const mapTables = [];
  sortedTables.forEach((tbl, index) => {
    const { table_id } = tbl;
    mapTables.push(
      <option key={index} value={table_id}>
        {tbl.table_name} - {tbl.capacity}
      </option>
    );
  });

  function handleChange({ target }) {
    setSelection(target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    /* Verify selection */
    if (!selection) {
      await setSeatError({ message: "Please select a table" });
      return;
    } else setSeatError(null);

    /* Get table capacity */
    const table_id = parseInt(selection);
    const { capacity } = await tables.find((tbl) => tbl.table_id === table_id);

    /**
     * Validate table capacity is enough
     * If yes, PUT to API
     */
    if ((await capacity) < people)
      setSeatError({
        message:
          "Party size too big for that table! Please select a different table.",
      });
    else {
      await seatTable(table_id, reservation_id)
        .then((res) => history.push("/"))
        .catch(setSeatError);
    }
  }

  /* Return to previous page on cancel */
  function handleCancel(event) {
    event.preventDefault();

    history.goBack();
  }

  /* Render if tables available/when ready */
  if (mapTables.length) {
    return (
      <div className="col ml-3">
        <form>
          <div className="form-row mb-4">
            <div className="m-3">
              <label htmlFor="select_table" className="form-label mb-0">
                Table number:
              </label>
              <select
                className="custom-select"
                name="table_id"
                aria-label="Select a table to seat"
                value={selection}
                onChange={handleChange}
                required={true}
              >
                {mapTables}
              </select>
            </div>
          </div>
          <div className="form-row">
            <button
              type="submit"
              className="btn btn-primary mx-3 p-2 px-3"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary p-2 px-3"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* Default render */
  return (
    <div className="text-center pt-3 mr-3">
      <h3 className="mb-3">There are currently no tables available.</h3>
      <Link to="/tables/new">Add a table</Link>
    </div>
  );
}

export default SeatTableForm;
