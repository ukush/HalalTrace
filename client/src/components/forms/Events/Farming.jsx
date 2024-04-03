import React, { useState } from 'react';

function FarmingForm({ onSubmit }) {

    const initialFormData = {
        animalId: '',
        weight: '',
        age: '',
        lastHealthCheckDate: '',
        lastHealthCheckResult: '',
        feedType: ''
      };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    onSubmit(event);
    setFormData(initialFormData); // Clear form data after submission
  };

  return (
    <div>
      <h2>Farming Form</h2>
      {isSubmitted ? (
        <p>Form has been submitted</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="animalId">Animal ID:</label>
            <input type="text" id="animalId" name="animalId" required />
          </div>
          <div>
            <label htmlFor="weight">Weight:</label>
            <input type="number" id="weight" name="weight" />
          </div>
          <div>
            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" />
          </div>
          <div>
            <label htmlFor="lastHealthCheckDate">Date of Last Health Check:</label>
            <input type="date" id="lastHealthCheckDate" name="lastHealthCheckDate" />
          </div>
          <div>
            <label htmlFor="lastHealthCheckResult">Result of Last Health Check:</label>
            <input type="text" id="lastHealthCheckResult" name="lastHealthCheckResult" />
          </div>
          <div>
            <label htmlFor="feedType">Type of Feed:</label>
            <input type="text" id="feedType" name="feedType" />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default FarmingForm;
