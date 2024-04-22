import React, { useState } from 'react';

function ProcessingForm({ onSubmit }) {

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
    <h2>Processing Form</h2>
      {isSubmitted ? (
        <p>Form has been submitted</p>
      ) : (
        <form onSubmit={(event) => handleSubmit(event, "processing")}>
          <div>
          <label htmlFor="ProductId">Product/AnimalId:</label>
          <input type="text" id="batchNumber" name="Product/AnimalId" required />
        </div>
          <div>
          <label htmlFor="batchNumber">Batch Number:</label>
          <input type="text" id="batchNumber" name="batchNumber" />
        </div>
          <div>
            <label htmlFor="productType">Type of Product to be Made:</label>
            <select id="productType" name="productType">
              <option value="frozenMeatProducts">Frozen Meat Products</option>
              <option value="freshMeatProducts">Fresh Meat Products</option>
            </select>
          </div>
          <button onClick={() => setIsSubmitted(false)}>Submit</button>
        </form>
  )}
    </div>
)}

export default ProcessingForm;
