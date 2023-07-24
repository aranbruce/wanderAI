'use client'

import React, { useState }  from 'react'
import Section from '@/components/section/section'
import Input from '@/components/input/input'
import Button from '@/components/button/button'
import SearchModal from '@/components/searchModal/searchModal'
import Loading from '@/components/loading/loading'
import Image from 'next/image'

import styles from './page.module.css'
import Itinerary from '@/components/itinerary/itinerary'
import SignUpModal from '@/components/signUpModal/signUpModal'
import Link from 'next/link'


// import Map from '@/components/map/map'


const Home = () => {
  const [destinationValue, setDestinationValue] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
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
      <main className={styles.main}>
          {
          isLoading? <Loading /> : 
          response ?  
          <Itinerary 
            response={response} 
            setResponse={setResponse} 
            isSignUpModalOpen={isSignUpModalOpen}
            setIsSignUpModalOpen={setIsSignUpModalOpen}
          /> :
          <>
            <Section>
              <div className={styles.heroContainer} >
                <div className={styles.introText}>
                  <h1 className={styles.title}>Love travel, hate planning?</h1>
                  <p>Plan your next adventure in seconds through the power of AI </p>
                </div>
                <div className={styles.card}>
                  <h4 className={styles.cardTitle}>Plan your trip</h4>
                  <form id="cardForm" className={styles.form} onSubmit={handleSubmit} >
                    <div className={styles.inputGroup}>
                      <Input
                        type="text"
                        value={destinationValue}
                        inputmode="text"
                        onChange={handleDestinationChange}
                        placeholder="Enter your destination"
                        label="Where do you want to go?"
                        required
                      />
                      <Input
                        type="number"
                        inputmode="numeric"
                        value={durationValue}
                        onChange={handleDurationChange}
                        placeholder="Enter your trip duration"
                        label="How many days is your trip?"
                        required
                      />
                      </div>
                    <Button label="Start planning" type="submit"/>
                    </form>
                </div>
              </div> 
            </Section>
            <Section>
              <div className={styles.howItWorksSectionContent}>
                <div className={styles.howItWorksTitles}>
                  <h5>How it works</h5>
                  <h2>Adventure awaits</h2>
                </div>
                <div className={styles.howItWorksStep}>
                  <div className={styles.howItWorksImage}>
                    <Image src="/howItWorks1.svg" alt="Hero image" fill={true}/>
                  </div>
                  <div className={styles.howItWorksText}>
                    <h3>Enter your destination and get an itinerary in seconds</h3>
                    <p>Simply fill in the details of where you looking to go, how long for and your personal preferences and WanderAI will generate a full itinerary for your trip in seconds</p>
                  </div>
                </div>
                <div className={styles.howItWorksStepReverse}>
                  <div className={styles.howItWorksImage}>
                    <Image src="/howItWorks2.svg" alt="Hero image" fill={true}/>
                  </div>
                  <div className={styles.howItWorksText}>
                    <h3>Read and refine</h3>
                    <p>Read through your planned itinerary, suggest changes and our AI powered trip planner will instantly create amendments so you can be sure to have a trip that suits your interests</p>
                  </div>
                </div>
              </div>
            </Section>
            <Section>
              <div className={styles.signUpCard}>
                <div className={styles.signUpCardText}>
                  <h2>Sign up and start planning your next adventure</h2>
                  <p>Start using WanderAI today and take the pain out of holiday planning</p>
              </div>
              <Link href="/sign-up">
                  <Button variant="secondary" label="Sign up" />
              </Link>
            </div>
            </Section>
          </>
          }
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
      : isSignUpModalOpen && !isLoading ? 
      <SignUpModal 
      isSignUpModalOpen={isSignUpModalOpen}
      setIsSignUpModalOpen={setIsSignUpModalOpen}
      /> 
      : null}
    </main>
  )
}

export default Home
