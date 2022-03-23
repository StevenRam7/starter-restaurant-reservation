import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { previous, next } from "../utils/date-time";
import ReservationDisplay from "../reservation/ReservationDisplay";
import TablesDisplay from "../tables/TablesDisplay";
import "./dashboard.css";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(tables => {
      setTables(tables)
    })
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const handlePrevious = () => {
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleNext = () => {
    history.push(`dashboard?date=${next(date)}`);
  };

  const handleToday = () => {
    history.push("/");
  };

  return (
    <main>
      <div className="header">
        <div className="header-text">
          <h1>Reservation Managment System</h1>
          <h4>Reservations for date: {date}</h4>
        </div>
        <div className="buttons">
          <button
            className="btn btn-secondary btn-outline-dark"
            onClick={() => handlePrevious(date)}
          >
            Previous
          </button>
          <button
            className="btn btn-secondary btn-outline-dark"
            onClick={() => handleNext(date)}
          >
            Next
          </button>
          <button
            className="btn btn-secondary btn-outline-dark"
            onClick={() => handleToday()}
          >
            Today
          </button>
        </div>
      </div>
      <div>
        <ErrorAlert error={reservationsError} />
      </div>
      <div>
        <ReservationDisplay reservations={reservations} />
      </div>
      <div>
        <ErrorAlert error={tablesError} />
      </div>
      <div>
        <TablesDisplay
          tables={tables}
          date={date}
          loadDashboard={loadDashboard}
        />
      </div>
    </main>
  );
}

export default Dashboard;
