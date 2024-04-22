import React from 'react';
import AnimalForm from '../components/forms/AnimalRegistration';
import '../App.css'
import { useState } from 'react'
import Loader from '../components/custom/loader/loader';

function Register() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchText, setFetchText] = useState("");
  const [buttonText, setButtonText] = useState("Register another animal")

  const handleSubmit = async (event, animalId) => {
    event.preventDefault();
    setIsSubmitted(true);
    setLoading(true);
    
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
      setFetchText(`Animal (id:${animalId}) has been registered on the blockchain successfully`);
    } else {
      throw new Error(`Failed to register animal (id: ${animalId}) on the blockchain`);
    }
  } catch (error) {
    setFetchText(error.message);
    setButtonText("Try Again");
  } finally {
    setLoading(false);
  }
  }
  
  return (
  <div>
     {
      !isSubmitted && !loading && 
      <>
      <h2>Register your farm animal on the Blockchain!</h2>
      <AnimalForm onSubmit={handleSubmit}/>
      </>
      }
     {loading && 
     <>
        <h2>Connecting to the Blockchain...</h2>
       <Loader></Loader>
     </>
    }
     {isSubmitted && !loading &&
     <>
     <h2>{fetchText}</h2>
     <br/>
     <button onClick={() => setIsSubmitted(false)}>{buttonText}</button>
      </>
     }
  </div>
  );
}

export default Register;
