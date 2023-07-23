'use client'

import React, { useState, useEffect }  from 'react'
import Section from '@/components/section/section'
import Input from '@/components/input/input'
import Button from '@/components/button/button'
import SearchModal from '@/components/searchModal/searchModal'
import Loading from '@/components/loading/loading'

import styles from './page.module.css'
import Itinerary from '@/components/itinerary/itinerary'


// import Map from '@/components/map/map'


const Home = () => {
  const [destinationValue, setDestinationValue] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log("response:", JSON.stringify(response));
  console.log("selectedPreferences:", selectedPreferences);
  console.log("destinationValue:", destinationValue);
  console.log("durationValue:", durationValue);
  console.log("isSearchModalOpen:", isSearchModalOpen);
  console.log("isLoading:", isLoading);
    
  const handleDestinationChange = (e) => {
    setDestinationValue(e.target.value);
  };
  
  const handleDurationChange = (e) => {
    setDurationValue(e.target.value);
  };

  const handleSubmit = (e) => {
    if (destinationValue && durationValue) {
      e.preventDefault();
      setIsSearchModalOpen(true);
      console.log("card form submitted")
    }
  };

  const makeApiCall = async () => {
    console.log('Destination:', destinationValue);
    console.log('Duration:', durationValue);
    console.log(selectedPreferences.length > 0 ? `Preferences: ${selectedPreferences.join(', ')}` : 'No preferences selected');
    if (destinationValue && durationValue) {
      setResponse("");
      console.log("Getting response from OpenAI...");
      setIsLoading(true);
      const response = await fetch("/api/openapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: `Plan me a trip to ${destinationValue} for ${durationValue} days. 
          Include activities that match the following preferences: ${selectedPreferences.join(', ')}`
        }),
      });
      const data = await response.json();
      setIsLoading(false);
      setResponse(data);
      console.log("Response from OpenAI:", data);
    } else { console.log("No itinerary details provided") }
  };

  return (
    <body>
      <main className={styles.main}>
          {
          isLoading? <Loading /> : 
          response ?  <Itinerary response={response} setResponse={setResponse}/> :
          <Section>
            <div className={styles.heroContainer} >
              <div className={styles.introText}>
                <h1 className={styles.title}>Love travel, hate planning?</h1>
                <p>Plan your next adventure in seconds through the power of AI </p>
              </div>
              <div className={styles.card}>
                <h4 className={styles.cardTitle}>Plan your trip</h4>
                <form id="cardForm"className={styles.form} onSubmit={handleSubmit} >
                  <div className={styles.inputGroup}>
                    <Input
                      type="text"
                      value={destinationValue}
                      onChange={handleDestinationChange}
                      placeholder="Enter your destination"
                      label="Where do you want to go?"
                      required
                    />
                    <Input
                      type="number"
                      value={durationValue}
                      onChange={handleDurationChange}
                      placeholder="Enter your trip duration"
                      label="How many days is your trip?"
                      required
                    />
                    </div>
                  <Button label="Start planning" onClick={handleSubmit} type="submit"/>
                  </form>
              </div>
            </div> 
          </Section>
          }
      </main>
      {isSearchModalOpen && !isLoading ?
      <SearchModal 
        isSearchModalOpen={isSearchModalOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
        destinationValue={destinationValue}
        setDestinationValue={setDestinationValue}
        durationValue={durationValue}
        setDurationValue={setDurationValue}
        selectedPreferences={selectedPreferences}
        setSelectedPreferences={setSelectedPreferences}
        makeApiCall={makeApiCall}
      />
      : null}
    </body>
  )
}

export default Home
