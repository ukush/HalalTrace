import React, { useState } from 'react';

function ProcessingForm({ onSubmit }) {

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
    <h2>Processing Form</h2>
      {isSubmitted ? (
        <p>Form has been submitted</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
          <label htmlFor="ProductId">Product/AnimalId:</label>
          <input type="text" id="animalId" name="animalId" value={formData.animalId} onChange={handleInputChange} required />
          </div>

          <div>
          <label htmlFor="batchNumber">Batch Number:</label>
          <input type="text" id="batchNumber" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} required/>
        </div>

        <div>
            <label htmlFor="productType">Type of Product to be Made:</label>
            <select id="productType" name="productType">
              <option value="frozenMeatProducts">Frozen Meat Products</option>
              <option value="freshMeatProducts">Fresh Meat Products</option>
            </select>
          </div>
          <button type='submit'>Submit</button>
        </form>
  )}
    </div>
)}

export default ProcessingForm;
