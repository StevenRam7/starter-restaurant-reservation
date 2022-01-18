import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { createReservation } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import "./Reservation.css";

function CreateReservation() {
  const [reservationsError, setReservationsError] = useState(null);
  const [reservation, setReservation] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: '',
    status: 'booked',
  });

  const history = useHistory();
  const inputRef = useRef();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
        await createReservation(reservation);
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      } catch (error) {
      setReservationsError(error);
    }
  }

  function handleChange({ target: { name, value } }) {
    if (name === 'people') {
      value = Number(value);
    }
    setReservation((previousReservation) => ({
      ...previousReservation,
      [name]: value,
    }));
  }

  return (
    <div className="main">
      <div className="header">
        <h1>{"Create A New Reservation"}</h1>
      </div>
      <form className="reservation-form mt-2" onSubmit={handleSubmit}>
        <ErrorAlert error={reservationsError} />
        <fieldset>
          <legend>Customer Information:</legend>
          <label>
            First Name:
            <input
              name="first_name"
              type="text"
              required
              value = {null}
              ref={inputRef}
              onChange={handleChange}
            />
          </label>
          <label>
            Last Name:
            <input
              name="last_name"
              type="text"
              required
              value={null}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Mobile Number:
            <input
              name="mobile_number"
              type="tel"
              required
              value={null}
              onChange={handleChange}
            />
          </label>
        </fieldset>
        <br />
        <fieldset>
          <legend>Reservation Information:</legend>
          <label>
            Date of Reservation:
            <input
              name="reservation_date"
              type="date"
              required
              value={null}
              onChange={handleChange}
            />
          </label>
          <label>
            Time of Reservation:
            <input
              name="reservation_time"
              type="time"
              required
              value={null}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Number of people in Party:
            <input
              name="people"
              type="number"
              min="1"
              required
              value={null}
              onChange={handleChange}
            />
          </label>
        </fieldset>
        <br />
        <div className="buttons">
          <button type="submit" className="btn btn-primary btn-outline-dark">
            Submit
          </button>
          <button className="btn btn-danger btn-outline-dark" onClick={(event) => history.push("/")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateReservation;