import React from 'react';
import { Link } from 'react-router-dom';
import "../../App.css"



function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Register</Link></li>
        <li><Link to="/record">Record</Link></li>
        <li><Link to="/trace">Trace</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
