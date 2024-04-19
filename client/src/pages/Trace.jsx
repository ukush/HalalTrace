import React from 'react';
import "../App.css";
import { useState } from 'react'

function Trace() {
  const [productData, setProductData] = useState(null)

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
      const response = await fetch(`http://localhost:3000/api/nft/events/${animalId}`)
      if (response.ok) {
        //setfetchSuccessful(true)
        //setFormSubmissionText("Product Details...")
        response.json().then(data => {
          setProductData(data)
        })
      } else {
        //setFormSubmissionText("Could not find details")
        console.error('Failed to submit form data');
      }
    } catch (error) {
      //setFormSubmissionText("Could not submit form")
      console.error('Error:', error);
    }
  }

  function convertTimestamp(unix_timestamp) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds
    var date = new Date(unix_timestamp * 1000);

    // Extract the date components
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns zero-based month
    var day = ("0" + date.getDate()).slice(-2);

    // Extract the time components
    var hours = date.getHours();
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    // Format the date and time
    var formattedDate = day + '/' + month + '/' + year;
    var formattedTime = hours + ':' + minutes + ':' + seconds;

    // Return the combined date and time
    return formattedDate + ' ' + formattedTime;
}


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
    {productData && (
      <div>
        <h3>Product Data</h3>
        <p>Type: {productData.type}</p>
        <p>Breed: {productData.breed}</p>
        <p>Herd Number: {productData.herdNumber}</p>
        <div className='trace-list'> 
          <h3>Trace</h3>
          <ul className="trace-list">
            {productData.trace.map((item, index) => (
            <li key={index} className="trace-item">
            <strong>Event {index+1}: </strong> <br />
            <strong>Address of Actor:</strong> {item.address}<br />
            <strong>Timestamp:</strong> {convertTimestamp(item.timeStamp)}<br />
            <strong>Event Details:</strong>
            <ul>
            {Object.entries(JSON.parse(item.event)).map(([key, value]) => (
            <li key={key}>
            <strong>{key}:</strong> {value}
            </li>
          ))}
          </ul>
          </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
  );
}

export default Trace;

