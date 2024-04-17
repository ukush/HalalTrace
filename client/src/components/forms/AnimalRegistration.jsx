import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function AnimalForm( {onSubmit} ) {

  const initialFormData = {
    animalId: '',
    animalType: '',
    animalBreed: '',
    herdNumber: '',
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
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicAnimalId">
        <Form.Label>Animal ID</Form.Label>
        <Form.Control
          name="animalId"
          value={formData.animalId}
          onChange={handleInputChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicAnimalType">
        <Form.Label>Animal Type</Form.Label>
        <Form.Control
          name="animalType"
          value={formData.animalType}
          onChange={handleInputChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicBreed">
        <Form.Label>Breed</Form.Label>
        <Form.Control
          name="animalBreed"
          value={formData.animalBreed}
          onChange={handleInputChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicHerdNumber">
        <Form.Label>Herd Number</Form.Label>
        <Form.Control
          name="herdNumber"
          value={formData.herdNumber}
          onChange={handleInputChange}
          type="text"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default AnimalForm;