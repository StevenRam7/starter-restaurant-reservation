import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { createReservation } from '../utils/api';
import ReservationForm from './ReservationForm';
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
      <ReservationForm reservation={reservation} reservationsError={reservationsError} inputRef={inputRef} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  );
}

export default CreateReservation;