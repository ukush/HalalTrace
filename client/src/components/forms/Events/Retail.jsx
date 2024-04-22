import React, { useState } from 'react';

function RetailForm({ onSubmit }) {

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

  return (
    <div>
      <h2>Retail Form</h2>
      {isSubmitted ? (
        <p>Form has been submitted</p>
      ) : (
        <form onSubmit={(event) => handleSubmit(event, "retail")}>
        <div>
        <label htmlFor="ProductId">Product/AnimalId:</label>
        <input type="text" id="batchNumber" name="Product/AnimalId" required />
        </div>
        <div>
          <label htmlFor="bestBefore">Best Before:</label>
          <input type="date" id="bestBefore" name="bestBefore" />
        </div>
        <button onClick={() => setIsSubmitted(false)}>Submit</button>
      </form>
      )}
    </div>
  );
}

export default RetailForm;
