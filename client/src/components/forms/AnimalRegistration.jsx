import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function AnimalForm() {

  const [animalType, setAnimalType] = useState('')
  const [animalBreed, setAnimalBreed] = useState('')
  const [herdNumber, setHerdNumber] = useState('')

  const submitForm = async (e) => {
    e.preventDefault()

    const formData = {
      animalType : animalType,
      animalBreed : animalBreed,
      herdNumber : herdNumber
    }

    try {
    // construct the request and fetch the response
    const response = await fetch('http://localhost:3000/api/nft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    console.log(response.statusText);
    
    // check the response
    if (!response.status ==200) {
      console.log('Network response was not ok')  
    }

  } catch (error) {
    console.error('There was an error sending the form data');
  }
  }



  return (
    <Form onSubmit={submitForm}>
      <Form.Group className="mb-3" controlId="formBasicAnimalType">
        <Form.Label>Animal Type</Form.Label>
        <Form.Control onChange={(e) => {setAnimalType(e.target.value)}} type="text" placeholder="Enter Animal Type" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicBreed">
        <Form.Label>Breed</Form.Label>
        <Form.Control onChange={(e) => {setAnimalBreed(e.target.value)}} type="text" placeholder="Enter Animal Breed" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicHerdNumber">
        <Form.Label>Herd Number</Form.Label>
        <Form.Control onChange={(e) => {setHerdNumber(e.target.value)}} type="text" placeholder="Enter Herd Number" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default AnimalForm;