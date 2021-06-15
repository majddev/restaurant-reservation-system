import React from "react";
import "./common.css";

/**
 * Page header displaying title of page
 * Optional addition for Dashboard displaying date
 * @param {string} title deconstructed from prop
 * @param {date} date deconstructed from prop
 * @returns {JSX.Element}
 */

function PageHeader({ title, date = "today" }) {
  let extra = null;

  if (title === "Dashboard")
    extra = <h3 className="m-0 text-light">Reservations for date: {date}</h3>;

  return (
    <header className="d-flex justify-content-between align-items-center w-100 bg-transparent px-5 m-0">
      <h1 className="text-light">{title}</h1>
      {extra ? extra : null}
    </header>
  );
}

export default PageHeader;
