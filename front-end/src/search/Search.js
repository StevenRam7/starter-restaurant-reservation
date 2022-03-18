import { React, useState, useEffect, useRef } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import ReservationDisplay from "../reservation/ReservationDisplay";
import './Search.css';

function Search() {
  const [number, setNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setReservationsError(null);
    setSearched(false);
    try {
      const params = { mobile_number: number };
      const data = await listReservations(params, abortController.signal);
      setReservations(data);
      setSearched(true);
    } catch (error) {
      setReservationsError(error);
    }
    return () => abortController.abort();
  }

  return (
    <div className="main">
      <div className="header">
        <h1>Find A Reservation</h1>
      </div>
      <form className="search-form mt-3" onSubmit={handleSubmit}>
        <label>
          <input
            style={{ width: "400px" }}
            name="mobile_number"
            type="text"
            placeholder="Enter a phone number"
            required
            ref={inputRef}
            value={number}
            onChange={(event) => setNumber(event.target.value)}
          />
        </label>
        <button className="btn btn-success btn-outline-dark ml-1" type="submit">
          Find
        </button>
      </form>
      <div>
        <ErrorAlert error={reservationsError} />
      </div>
      <div className="content">
        {reservations.length !== 0 && (
          <>
            <h5 className="number-confirm">
              Reservations matching number: {Number(number)}
            </h5>
            <ReservationDisplay reservations={reservations} />
          </>
        )}

        {searched && reservations.length === 0 ? (
          <h3>No reservations found</h3>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Search;
