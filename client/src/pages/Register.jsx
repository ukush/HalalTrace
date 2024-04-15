import React from 'react';
import AnimalForm from '../components/forms/AnimalRegistration';
import '../App.css'

function Register() {
  return (
    <div>
      <h2>Register your farm animal on the Blockchain!</h2>
      <AnimalForm />
    </div>
  );
}

export default Register;
