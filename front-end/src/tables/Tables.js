import React from "react";
import { Link } from "react-router-dom";
import { sortTables } from "../common/sortTables";

import "../common/common.css";
import { finishTable } from "../utils/api";

/**
 * Takes in and formats tables as a table
 * @param {Array} reservations
 * @param {Boolean} reload for triggering useEffect
 * @param {Function} setReload for triggering useEffect
 * @returns {JSX.Element}
 */
function Tables({ tables, reload, setReload }) {
  /* Sort tables by name */
  const sortedTables = sortTables(tables);

  /**
   * Sends DELETE request
   * to server to
   * remove reservation_id
   * from related table in
   * "tables" table
   */
  async function handleFinishClick({ target }) {
    const table_id = target.id;
    const message = `Is this table ready to seat new guests? This cannot be undone.`;

    if (window.confirm(message)) {
      await finishTable(table_id)
        .then(() => setReload(!reload))
        .catch(() => setReload(!reload));
    }
  }

  /* Format tables as table rows */
  const mapTables = sortedTables.map((tbl) => {
    return (
      <tr className="table-row" key={tbl.table_id}>
        <td className="text-center">{tbl.table_name}</td>
        <td className="text-center">{tbl.capacity}</td>
        <td className="text-center" data-table-id-status={tbl.table_id}>
          {tbl.reservation_id === null ? "Free" : "Occupied"}
        </td>
        <td>
          {tbl.reservation_id === null ? null : (
            <button
              className="text-center btn btn-secondary"
              data-table-id-finish={tbl.table_id}
              id={tbl.table_id}
              onClick={handleFinishClick}
            >
              Finish
            </button>
          )}
        </td>
      </tr>
    );
  });

  /* Render when ready */
  if (mapTables.length) {
    return (
      <div className="container-fluid mr-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="text-center">Table</th>
              <th className="text-center">Capacity</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>{mapTables}</tbody>
        </table>
      </div>
    );
  }

  /* Default render */
  return (
    <div className="text-center pt-3 mr-3">
      <h3 className="mb-3">Tables</h3>
      <Link to="/tables/new">Add a table</Link>
    </div>
  );
}

export default Tables;
