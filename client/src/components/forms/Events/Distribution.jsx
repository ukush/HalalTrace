import React, { useState } from 'react';

function DistributionForm({ onSubmit }) {

    const initialFormData = {
        animalId: '',
        batchNumber: ''
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
      <h2>Distribution Form</h2>
      {isSubmitted ? (
        <p>Form has been submitted</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
          <label htmlFor="ProductId">Product/AnimalId:</label>
          <input type="text" id="productId" name="animalId" value={formData.productId} onChange={handleInputChange}required />
        </div>
        <div>
          <label htmlFor="batchNumber">Batch Number:</label>
          <input type="text" id="batchNumber" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange}required />
        </div>
        <button type='submit'>Submit</button>
      </form>
      )}
    </div>
  );
}

export default DistributionForm;
