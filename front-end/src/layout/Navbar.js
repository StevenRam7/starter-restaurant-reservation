import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav class="navbar">
      <div id="nav-options">
        <a href="/" className="active">
          <span className="oi oi-dashboard" />
          &nbsp;Dashboard
        </a>
        <a href="/search">
          <span className="oi oi-magnifying-glass" />
          &nbsp;Search
        </a>
        <a href="/reservations/new">
          <span className="oi oi-plus" />
          &nbsp;New Reservation
        </a>
        <a href="/tables/new">
          <span className="oi oi-layers" />
          &nbsp;New Table
        </a>
        </div>
    </nav>
  );
}

export default Navbar;
