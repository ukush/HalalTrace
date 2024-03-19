import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function RegistrationForm() {

  const [companyName, setCompanyName] = useState('')
  const [streetAddress, setSteetAddress] = useState('')
  const [city, setCity] = useState('')
  const [county, setCounty] = useState('')
  const [postcode, setPostcode] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [industry, setIndustry] = useState('')

  const radioItems = [
    {value : 'farmer', label: 'Farmer'},
    {value: 'slaughterhouse', label: 'Slaughterhouse/Abbatoir'},
    {value: 'processor', label: 'Processing Plant/Manufacturer'},
    {value: 'distributor', label: 'Distributor/Wholesaler'},
    {value: 'retailer', label: 'Retailer'},
  ];

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = {
        companyName : companyName,
        industry : industry,
        streetAddress : streetAddress,
        city : city,
        county : county,
        postcode : postcode,
        emailAddress : emailAddress
    }

    console.log(formData)
    try {
        // construct the request and fetch the response
        const response = await fetch('http://localhost:3000/users', {
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
      <Form.Group className="mb-3" controlId="formBasicCompanyName">
        <Form.Label>Company Name</Form.Label>
        <Form.Control onChange={(e) => {setCompanyName(e.target.value)}} type="text" placeholder="Enter Company Name" />
      </Form.Group>

    <span>Select your Business Industry</span>
      <div>
        {radioItems.map(item => (
          <label key={item.value}>
            <input
              type="radio"
              value={item.value}
              checked={industry === item.value}
              onChange={e => setIndustry(e.target.value)}
            />
            {item.label}
          </label>
        ))}
      </div>

      <Form.Group className="mb-3" controlId="formBasicAddress">
        <Form.Label>Business Address</Form.Label>
        <Form.Control onChange={(e) => {setSteetAddress(e.target.value)}} type="text" placeholder="Enter Street Address" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicCity">
        <Form.Label>City</Form.Label>
        <Form.Control onChange={(e) => {setCity(e.target.value)}} type="text" placeholder="Enter City" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicCounty">
        <Form.Label>County</Form.Label>
        <Form.Control onChange={(e) => {setCounty(e.target.value)}} type="text" placeholder="Enter County" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPostCode">
        <Form.Label>Postcode</Form.Label>
        <Form.Control onChange={(e) => {setPostcode(e.target.value)}} type="text" placeholder="Enter PostCode" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control onChange={(e) => {setEmailAddress(e.target.value)}} type="text" placeholder="Email Address" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default RegistrationForm;