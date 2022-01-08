import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createReservation, updateReservation, readReservation } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

function ModifyReservation() {
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
  const params = useParams();
  const resId = params.reservationId;
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
    async function loadReservation() {
      const abortController = new AbortController();
      setReservationsError(null);
      try {
        if (resId) {
          const originalReservation = await readReservation(
            resId,
            abortController.signal
          );
          console.log("OGres: ", originalReservation[0])
          setReservation(originalReservation[0]);
        }
      } catch (error) {
        setReservationsError(error);
      }
      return () => abortController.abort();
    }
    loadReservation();
  }, [resId]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (resId) {
        reservation.reservation_id = resId;
        console.log("reservation: ", reservation)
        await updateReservation(reservation);
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      } else {
        await createReservation(reservation);
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      }
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
        <h1>{resId ? "Edit Reservation" : "Create A New Reservation"}</h1>
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
              value={reservation.first_name}
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
              value={reservation.last_name}
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
              value={reservation.mobile_number}
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
              value={reservation.reservation_date}
              onChange={handleChange}
            />
          </label>
          <label>
            Time of Reservation:
            <input
              name="reservation_time"
              type="time"
              required
              value={reservation.reservation_time}
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
              value={reservation.people}
              onChange={handleChange}
            />
          </label>
        </fieldset>
        <br />
        <div className="buttons">
          <button type="submit" className="btn">
            Submit
          </button>
          <button className="btn" onClick={history.goBack}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModifyReservation;