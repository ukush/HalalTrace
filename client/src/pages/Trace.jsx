import React from 'react';
import "../App.css";
import { useState } from 'react'

// const [fetchSuccessful, setfetchSuccessful] = useState(false)
// const [formSubmissionText, setFormSubmissionText] = useState(" ")


const handleSubmit = async (event, endpoint) => {
    event.preventDefault();
    
    // Serialize form data
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const animalId = data.animalId;
      const response = await fetch(`http://localhost:3000/api/${animalId}/farming`)
      if (response.ok) {
        //setfetchSuccessful(true)
        //setFormSubmissionText("Product Details...")
        console.log('Form data submitted successfully');
      } else {
        //setFormSubmissionText("Could not find details")
        console.error('Failed to submit form data');
      }
    } catch (error) {
      //setFormSubmissionText("Could not submit form")
      console.error('Error:', error);
    }
  }



function Trace() {
  return (
    <div>
    <h2>Trace Animal/Product</h2>
    <form onSubmit={handleSubmit}>
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

