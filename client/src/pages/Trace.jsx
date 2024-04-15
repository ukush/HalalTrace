import React from 'react';
import "../App.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Trace() {
  return (
    <div>
    <h2>Trace Animal/Product</h2>
    <form>
      <div>
        <label htmlFor="productID">Animal/Product ID</label>
        <input type="text" id="animalId" name="animalId"></input> 
      </div>
      <button>Get Trace</button>
    </form>
  </div>
  );
}

export default Trace;

