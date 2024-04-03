import { useState } from 'react'
import './App.css'
import FarmingForm from './components/forms/Events/Farming';
import SlaughteringForm from './components/forms/Events/Slaughtering';
import ProcessingForm from './components/forms/Events/Processing';
import DistributionForm from './components/forms/Events/Distribution';
import RetailForm from './components/forms/Events/Retail';

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
        return <FarmingForm onSubmit={(event) => handleSubmit(event, 'farming')} />;
      case 'Slaughtering':
        return <SlaughteringForm onSubmit={(event) => handleSubmit(event, 'slaughter')}/>;
      case 'Processing':
        return <ProcessingForm onSubmit={(event) => handleSubmit(event, 'processing')} />
      case 'Distribution':
        return <DistributionForm onSubmit={(event) => handleSubmit(event, 'distribution')} />
      case 'Retail':
        return <RetailForm onSubmit={(event) => handleSubmit(event, 'retail')} />
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
