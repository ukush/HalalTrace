import React, { useState } from 'react';

function RetailForm({ onSubmit }) {

    const initialFormData = {
        animalId: '',
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
      <h2>Retail Form</h2>
      {isSubmitted ? (
        <p>Form has been submitted</p>
      ) : (
        <form onSubmit={handleSubmit}>
        <div>
        <label htmlFor="ProductId">Product/AnimalId:</label>
        <input type="text" id="animalId" name="animalId" value={formData.animalId} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="bestBefore">Best Before:</label>
          <input type="date" id="bestBefore" name="bestBefore" />
        </div>
        <button typeof='submit'>Submit</button>
      </form>
      )}
    </div>
  );
}

export default RetailForm;
