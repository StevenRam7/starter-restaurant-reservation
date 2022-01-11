import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function CreateTable() {
  const [tableError, setTableError] = useState(null);
  const [table, setTable] = useState({
    table_name: "",
    capacity: "",
  });

  const history = useHistory();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    createTable(table)
      .then(() => history.push(`/dashboard`))
      .catch(setTableError);
  };

  const handleChange = ({ target: { name, value } }) => {
    if (name === "capacity") {
      value = Number(value);
    }
    setTable((previousTable) => ({
      ...previousTable,
      [name]: value,
    }));
  };

  return (
    <div className="main">
      <div className="header">
        <h1>Create A New Table</h1>
      </div>
      <form className="table-form mt-3" onSubmit={handleSubmit}>
        <ErrorAlert error={tableError} />
        <fieldset>
          <legend>Table Information:</legend>
          <label className="table-name">
            Table Name:
            <input
              name="table_name"
              type="text"
              minLength="2"
              required
              value={table.table_name}
              ref={inputRef}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Capacity:
            <input
              name="capacity"
              type="number"
              min="1"
              required
              value={table.capacity}
              onChange={handleChange}
            />
          </label>
          <br />
          <button type="submit" className="btn btn-primary btn-outline-dark">
            Submit
          </button>
          <button
            className="btn btn-danger btn-outline-dark"
            onClick={history.goBack}
          >
            Cancel
          </button>
        </fieldset>
      </form>
    </div>
  );
}

export default CreateTable;
