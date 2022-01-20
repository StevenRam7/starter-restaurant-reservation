import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { updateReservation, readReservation } from '../utils/api';
import ReservationForm from './ReservationForm';
import "./Reservation.css";

function EditReservation() {
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
          setReservation(originalReservation);
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
        await updateReservation(reservation);
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
        <h1>{"Edit Reservation"}</h1>
      </div>
      <ReservationForm reservation={reservation} reservationsError={reservationsError} inputRef={inputRef} handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
  );
}

export default EditReservation;