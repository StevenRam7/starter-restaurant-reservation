import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import "./Reservation.css"

function ReservationForm({ reservation, reservationsError, handleChange, handleSubmit, inputRef }) {
    const history = useHistory();
    
    return (
    <form className="reservation-form mt-2" onSubmit={handleSubmit}>
        <ErrorAlert error={reservationsError} />
        <div className="form-boxes">
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
        </div>
        <br />
        <div className="buttons">
          <button type="submit" className="btn btn-primary btn-outline-dark">
            Submit
          </button>
          <button className="btn btn-danger btn-outline-dark" onClick={() => history.goBack()}>
            Cancel
          </button>
        </div>
      </form>
    )}

export default ReservationForm;