import React from 'react';
import "../App.css";
import { useState } from 'react'
import Loader from '../components/custom/loader/loader';

function Trace() {
  const [productData, setProductData] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState("Trace another product")
  const [fetchText, setfetchText] = useState("")


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true)
    setLoading(true);

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    const animalId = data.animalId;
    try {
      const response = await fetch(`http://localhost:3000/api/nft/events/${animalId}`)
    if (response.ok) {
      const responseData = await response.json();
      setProductData(responseData);
    } else {
      throw new Error(`Failed to trace Product (id: ${animalId})`);
    }
  } catch (error) {
    setProductData(null)
    setfetchText(error.message);
    setButtonText("Try Again");
  } finally {
    setLoading(false);
  }
  }

  function convertTimestamp(unix_timestamp) {
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
    <>
    {
      !isSubmitted &&
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
    }
    {loading && 
     <>
        <h2>Connecting to the Blockchain...</h2>
       <Loader></Loader>
     </>
    }
     {isSubmitted && !loading &&
     <>
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
     <h2>{fetchText}</h2>
     <br/>
     <button onClick={() => setIsSubmitted(false)}>{buttonText}</button>
      </>
     }
    </>
  );
}

export default Trace;

