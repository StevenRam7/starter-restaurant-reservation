import React, { useState } from "react";
import { updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./ReservationDisplay.css";

function ReservationDisplay({ reservations }) {
  const [cancelReservationError, setCancelReservationError] = useState(null);

  const handleCancel = async (reservation_id) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      setCancelReservationError(null);
      await updateReservationStatus(
        reservation_id,
        { data: { status: "cancelled" } },
        abortController.signal
      )
        .then(window.location.reload())
        .catch(setCancelReservationError);
      return () => abortController.abort();
    }
  };

  const displayReservations = reservations.map((reservation, index) => {
    return (
      <tr key={reservation.reservation_id}>
        <th scope="row" style={{border:"none"}}>{reservation.reservation_id}</th>
        <td style={{border:"none"}}>{reservation.first_name}</td>
        <td style={{border:"none"}}>{reservation.last_name}</td>
        <td style={{border:"none"}}>{reservation.mobile_number}</td>
        <td style={{border:"none"}}>{reservation.reservation_date}</td>
        <td style={{border:"none"}}>{reservation.reservation_time}</td>
        <td style={{border:"none"}}>{reservation.people}</td>
        <td style={{border:"none"}}>
          <p data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </p>
        </td>
        <td style={{border:"none", paddingRight: "0em"}}>
          {reservation.status !== "booked" ? null : (
            <>
              <a
                href={`/reservations/${reservation.reservation_id}/seat`}
                className="btn btn-info btn-outline-dark mx-1"
              >
                Seat
              </a>
            </>
          )}
          {reservation.status !== "booked" ? null : (
            <>
              <a
                href={`/reservations/${reservation.reservation_id}/edit`}
                className="btn btn-info btn-outline-dark mx-1"
              >
                Edit
              </a>
            </>
          )}
          {reservation.status !== "booked" ? null : (
            <>
              <button 
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={() => handleCancel(reservation.reservation_id)}
                className="btn btn-danger btn-outline-dark mx-1 cancel"
              >
                Cancel
              </button>
            </>
          )}
        </td>
      </tr>
    );
  });

  return (
    <div className="full-table">
      <ErrorAlert error={cancelReservationError} />
      <table className="table">
        <thead>
          <tr className="header-row">
            <th scope="col" style={{border:"none"}} >ID #</th>
            <th scope="col" style={{border:"none"}}>First</th>
            <th scope="col" style={{border:"none"}}>Last</th>
            <th scope="col" style={{border:"none"}}>Mobile Number</th>
            <th scope="col" style={{border:"none"}}>Date</th>
            <th scope="col" style={{border:"none"}}>Time</th>
            <th scope="col" style={{border:"none"}}>People</th>
            <th scope="col" style={{border:"none"}}>Status</th>
            <th scope="col" style={{border:"none", paddingRight: "0em"}}></th>
          </tr>
        </thead>
        <tbody>{displayReservations}</tbody>
      </table>
    </div>
  );
}

export default ReservationDisplay;
