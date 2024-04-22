import React, { useState } from 'react';

function DistributionForm({ onSubmit }) {

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
      <h2>Distribution Form</h2>
      {isSubmitted ? (
        <p>Form has been submitted</p>
      ) : (
        <form onSubmit={(event) => handleSubmit(event, "distribution")}>
          <div>
          <label htmlFor="ProductId">Product/AnimalId:</label>
          <input type="text" id="productId" name="Product/AnimalId" required />
        </div>
        <div>
          <label htmlFor="batchNumber">Batch Number:</label>
          <input type="text" id="batchNumber" name="batchNumber" />
        </div>
        <button onClick={() => setIsSubmitted(false)}>Submit</button>
      </form>
      )}
    </div>
  );
}

export default DistributionForm;
