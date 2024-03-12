import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ethers } from "ethers";

function AnimalForm() {

  const [animalType, setAnimalType] = useState('')
  const [animalBreed, setAnimalBreed] = useState('')
  const [herdNumber, setHerdNumber] = useState('')

  const submitForm = (e) => {
    e.preventDefault()

    // communicate with the smart contract
    const contract_address = "0x6fA101bc3C631decC212D6c30FabE0e72BD3C72a"
    
  
    console.log({animalType, animalBreed, herdNumber})
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