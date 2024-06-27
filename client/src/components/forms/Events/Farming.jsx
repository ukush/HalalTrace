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
    setFormData(initialFormData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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
            <input type="text" id="animalId" name="animalId" value={formData.animalId} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="weight">Weight:</label>
            <input type="number" id="weight" name="weight" required/>
          </div>
          <div>
            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" required/>
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
            <input type="text" id="feedType" name="feedType" value={formData.feedType} onChange={handleInputChange} required/>
          </div>
          <button className='farming-submit' type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default FarmingForm;
