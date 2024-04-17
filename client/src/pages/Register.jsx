import React from 'react';
import AnimalForm from '../components/forms/AnimalRegistration';
import '../App.css'
import { useState } from 'react'


function Register() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formSubmissionText, setFormSubmissionText] = useState(" ")

  const handleSubmit = async (event, animalId) => {
    event.preventDefault();
    setIsSubmitted(true);
    
    // Serialize form data
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
  
    try {
      const animalId = data.animalId;
      const response = await fetch(`http://localhost:3000/api/nft/mint/${animalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        setFormSubmissionText("Form has been submitted")
        console.log('Form data submitted successfully');
      } else {
        setFormSubmissionText("Could not submit form")
        console.error('Failed to submit form data');
      }
    } catch (error) {
      setFormSubmissionText("Could not submit form")
      console.error('Error:', error);
    }
  }
  
  return (
    <div>
      <h2>Register your farm animal on the Blockchain!</h2>
      <AnimalForm onSubmit={handleSubmit}/>
    </div>
  );
}

export default Register;
