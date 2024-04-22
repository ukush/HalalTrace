import React, { useState } from 'react';

function SlaughteringForm({ onSubmit }) {

  const initialFormData = {
    slaughterMethod: '',
    stunningMethod: '',
    slaughtermanId: '',
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
    <h2>Slaughtering Form</h2>
    {isSubmitted ? (
        <p>Form has been submitted</p>
      ) : (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="animalId">Animal ID:</label>
        <input type="text" id="animalId" name="animalId" required />
      </div>
      <div>
        <label htmlFor="slaughterMethod">Slaughter Method:</label>
        <select id="slaughterMethod" name="slaughterMethod" required>
          <option value="mechanical">Mechanical</option>
          <option value="hand">Hand</option>
        </select>
      </div>
      <div>
        <label htmlFor="stunningMethod">Stunning Method:</label>
        <select id="stunningMethod" name="stunningMethod" required>
          <option value="gunStunned">Gun-stunned</option>
          <option value="gasStunned">Gas-stunned</option>
          <option value="notStunned">Not stunned</option>
        </select>
      </div>
      <div>
        <label htmlFor="slaughtermanId">Slaughterman ID:</label>
        <input type="text" id="slaughtermanId" name="slaughtermanId" required/>
      </div>
      <div>
          <label htmlFor="numberOfParts">Number of Parts to be Cut Into:</label>
          <input type="number" id="numberOfParts" name="numberOfParts" />
          </div>
      <button onClick={() => setIsSubmitted(false)}>Submit</button>
    </form>
      )}
  </div>
  );
}

export default SlaughteringForm;
