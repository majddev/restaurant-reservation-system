import React from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";

/**
 * Renders form
 * Modifies formdata state
 * Handles form submission
 * or cancel
 * ---
 * Submission adds
 * row to Table "tables"
 * @param {Object} formData state
 * @param {Function} setFormData state manipulator
 * @param {String} setFormError form error state manipulator
 * @returns {JSX.Element}
 */
function NewTableForm({ formData, setFormData, setFormError }) {
  const history = useHistory();

  /* Update form data */
  function handleChange({ target }) {
    const name = target.name;
    const value = target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  /**
   * Submission handler
   * Sends POST request
   * to DB to create
   * a new reservation
   */
  async function handleSubmit(event) {
    event.preventDefault();

    const { table_name, capacity } = formData;

    if (!table_name) setFormError({ message: "A table name is required." });
    else if (table_name.length < 2)
      setFormError({
        message: "Table name must be at least 2 characters long!",
      });
    else if (capacity < 1)
      setFormError({ message: "A table must have a minimum capacity of 1" });
    else {
      await createTable(formData)
        .then((res) => history.push(`/`))
        .catch(setFormError);
    }
  }

  /* Return to previous page on cancel */
  function handleCancel(event) {
    event.preventDefault();

    history.goBack();
  }

  return (
    <main className="mt-4 w-100">
      <form className="m-3 pl-3">
        <div className="form-row">
          <div className="col-md-4">
            <label htmlFor="table_name" className="form-label mb-0">
              Table Name
            </label>
            <input
              type="text"
              className="form-control"
              name="table_name"
              value={formData.table_name}
              onChange={handleChange}
              required={true}
              placeholder={"#1"}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="capacity" className="form-label mb-0">
              Table Capacity
            </label>
            <input
              type="number"
              className="form-control"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required={true}
              min={1}
            />
          </div>
        </div>
        <div className="form-row pt-5">
          <button
            type="submit"
            className="btn btn-primary mr-3 p-2 px-3"
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
    </main>
  );
}

export default NewTableForm;
