import { useState } from 'react'
import AnimalForm from './components/forms/AnimalRegistration';
import UserRegistration from './components/forms/Onboarding'

import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('Farming');
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSubmitted(false);
  };

  const handleSubmit = async (event, endpoint) => {
    event.preventDefault();
    
    // Serialize form data
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch(`localhost:3000/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true); // Set the submission status to true on successful submission
        console.log('Form data submitted successfully');
      } else {
        console.error('Failed to submit form data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const renderForm = () => {
    if (isSubmitted) {
      return (
        <div>
          <p>Form has been submitted</p>
          <button onClick={() => setIsSubmitted(false)}>Make Another Submission</button>
        </div>
      );
    } else {
    switch (activeTab) {
      case 'Farming':
        return (
          <div>
            <h2>Farming Form</h2>
            <form onSubmit={(event) => handleSubmit(event, "farming")}>
              <div>
                <label htmlFor="animalId">Animal ID:</label>
                <input type="text" id="animalId" name="animalId" required />
              </div>
              <div>
                <label htmlFor="weight">Weight:</label>
                <input type="number" id="weight" name="weight" />
              </div>
              <div>
                <label htmlFor="age">Age:</label>
                <input type="number" id="age" name="age" />
              </div>
              <div>
                <label htmlFor="lastHealthCheckDate">Date of Last Health Check:</label>
                <input type="date" id="lastHealthCheckDate" name="lastHealthCheckDate" />
              </div>
              <div>
                <label htmlFor="lastHealthCheckResult">Result of Last Health Check:</label>
                <input type="text" id="lastHealthCheckResult" name="lastHealthCheckResult" />
              </div>
              <div>
                <label htmlFor="feedType">Type of Feed:</label>
                <input type="text" id="feedType" name="feedType" />
              </div>
              <button onClick={() => setIsSubmitted(false)}>Submit</button>
            </form>
          </div>
        );
      case 'Slaughtering':
        return (
          <div>
            <h2>Slaughtering Form</h2>
            <form onSubmit={(event) => handleSubmit(event, "slaughtering")}>
              <div>
                <label htmlFor="slaughterMethod">Slaughter Method:</label>
                <select id="slaughterMethod" name="slaughterMethod">
                  <option value="mechanical">Mechanical</option>
                  <option value="hand">Hand</option>
                </select>
              </div>
              <div>
                <label htmlFor="stunningMethod">Stunning Method:</label>
                <select id="stunningMethod" name="stunningMethod">
                  <option value="gunStunned">Gun-stunned</option>
                  <option value="gasStunned">Gas-stunned</option>
                  <option value="notStunned">Not stunned</option>
                </select>
              </div>
              <div>
                <label htmlFor="slaughtermanId">Slaughterman ID:</label>
                <input type="text" id="slaughtermanId" name="slaughtermanId" />
              </div>
              <button onClick={() => setIsSubmitted(false)}>Submit</button>
            </form>
          </div>
        );
      case 'Processing':
        return (
          <div>
            <h2>Processing Form</h2>
            <form onSubmit={(event) => handleSubmit(event, "processing")}>
              <div>
                <label htmlFor="productType">Type of Product to be Made:</label>
                <select id="productType" name="productType">
                  <option value="frozenMeatProducts">Frozen Meat Products</option>
                  <option value="freshMeatProducts">Fresh Meat Products</option>
                </select>
              </div>
              <div>
                <label htmlFor="numberOfParts">Number of Parts to be Cut Into:</label>
                <input type="number" id="numberOfParts" name="numberOfParts" />
              </div>
              <button onClick={() => setIsSubmitted(false)}>Submit</button>
            </form>
          </div>
        );
      case 'Distribution':
        return (
          <div>
            <h2>Distribution Form</h2>
            <form onSubmit={(event) => handleSubmit(event, "distribution")}>
              <div>
                <label htmlFor="batchNumber">Batch Number:</label>
                <input type="text" id="batchNumber" name="batchNumber" />
              </div>
              <button onClick={() => setIsSubmitted(false)}>Submit</button>
            </form>
          </div>
        );
      case 'Retail':
        return (
          <div>
            <h2>Retail Form</h2>
            <form onSubmit={(event) => handleSubmit(event, "retail")}>
              <div>
                <label htmlFor="bestBefore">Best Before:</label>
                <input type="date" id="bestBefore" name="bestBefore" />
              </div>
              <button onClick={() => setIsSubmitted(false)}>Submit</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  }
  };


  return (
    <div>
    <nav>
      <ul>
        <li className={activeTab === 'Farming' ? 'active' : ''} onClick={() => handleTabClick('Farming')}>Farming</li>
        <li className={activeTab === 'Slaughtering' ? 'active' : ''} onClick={() => handleTabClick('Slaughtering')}>Slaughtering</li>
        <li className={activeTab === 'Processing' ? 'active' : ''} onClick={() => handleTabClick('Processing')}>Processing</li>
        <li className={activeTab === 'Distribution' ? 'active' : ''} onClick={() => handleTabClick('Distribution')}>Distribution</li>
        <li className={activeTab === 'Retail' ? 'active' : ''} onClick={() => handleTabClick('Retail')}>Retail</li>
      </ul>
    </nav>
    <div className="form-container">
      {renderForm()}
    </div>
  </div>
  )
}

export default App
