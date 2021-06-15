import React, { Fragment, useState } from "react";
import PageHeader from "../common/PageHeader";
import ErrorAlert from "../layout/ErrorAlert";
import NewTableForm from "./NewTableForm";

/**
 * Handles creation
 * of new table
 * =========
 * Primary render controller/
 * state holder for
 * form and error
 * components
 * @returns {JSX.Element}
 */
function NewTable() {
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: "",
  });

  /* Render */
  return (
    <Fragment>
      <PageHeader title={"New Table"} />
      <NewTableForm
        formData={formData}
        setFormData={setFormData}
        setFormError={setFormError}
      />
      <ErrorAlert error={formError} />
    </Fragment>
  );
}

export default NewTable;
