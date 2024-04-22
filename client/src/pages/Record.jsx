import { useState } from 'react'
import React from 'react';
import FarmingForm from '../components/forms/Events/Farming';
import SlaughteringForm from '../components/forms/Events/Slaughtering';
import ProcessingForm from '../components/forms/Events/Processing';
import DistributionForm from '../components/forms/Events/Distribution';
import RetailForm from '../components/forms/Events/Retail';
import '../App.css'
import Loader from '../components/custom/loader/loader';


function Record() {
    const [activeTab, setActiveTab] = useState('Farming');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [fetchText, setfetchText] = useState("")
    const [loading, setLoading] = useState(false);
    const [buttonText, setButtonText] = useState("Record another event")
  
  
    const handleTabClick = (tab) => {
      setActiveTab(tab);
      setIsSubmitted(false);
      setfetchText("")
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setIsSubmitted(true);
      setLoading(true);
      
      const formData = new FormData(event.target);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
  
      const animalId = data.animalId;
      console.log(animalId)
      try {
        const response = await fetch(`http://localhost:3000/api/nft/events/${animalId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
      if (response.ok) {
        setfetchText(`Event has been recorded to Product (id:${animalId}) successfully`);
      } else {
        const errorMessage = await response.text()
        throw new Error(errorMessage);
      }
    } catch (error) {
      setfetchText(error.message);
      setButtonText("Try Again");
    } finally {
      setLoading(false);
    }
  }

  const renderForm = () => {
      {
      switch (activeTab) {
        case 'Farming':
          return <FarmingForm onSubmit={(event) => handleSubmit(event)} />;
        case 'Slaughtering':
          return <SlaughteringForm onSubmit={(event) => handleSubmit(event)}/>;
        case 'Processing':
          return <ProcessingForm onSubmit={(event) => handleSubmit(event)} />
        case 'Distribution':
          return <DistributionForm onSubmit={(event) => handleSubmit(event)} />
        case 'Retail':
          return <RetailForm onSubmit={(event) => handleSubmit(event)} />
        default:
          return null;
      }
    }
  }
  
    return (
      <>
      {
        !isSubmitted &&
        <>
        <h2>Record important data for your product</h2>
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
        </>
      }
      {loading && 
      <>
        <h2>Connecting to the Blockchain...</h2>
       <Loader></Loader>
      </>
      }
      {isSubmitted && !loading &&
      <div>
      <h2>{fetchText}</h2>
      <button onClick={() => handleTabClick(activeTab)}>{buttonText}</button>
      </div>
      }
    </>
    )
}

export default Record;
