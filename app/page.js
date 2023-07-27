'use client'

import React, { useState }  from 'react'

import Section from '@/components/section/section'
import Input from '@/components/input/input'
import Button from '@/components/button/button'
import SearchModal from '@/components/searchModal/searchModal'
import styles from './page.module.css'
import TextAndImage from '@/components/textAndImage/textAndImage'
import SignUpCard from '@/components/signUpCard/signUpCard'
import TripCard from '@/components/tripCard/tripCard'

const Home = () => {
  const [destination, setDestination] = useState(typeof window !== "undefined" ? localStorage.getItem('destination') ? localStorage.getItem('destination') : '' : '');
  const [duration, setDuration] = useState(typeof window !== "undefined" ? localStorage.getItem('duration') ? localStorage.getItem('duration') : '' : '');
  const [preferences, setPreferences] = useState(typeof window !== "undefined" ? localStorage.getItem('preferences') ? JSON.parse(localStorage.getItem('preferences')) : [] : []);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  console.log("preferences:", preferences)
  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };
  
  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleSubmit = (e) => {
    if (destination && duration) {
      e.preventDefault();
      setIsSearchModalOpen(true);
    }
  };

  return (
    <main className={styles.main}>
      <Section hero>
        <div className={styles.heroContainer} >
          <div className={styles.heroText}>
            <h1 className={styles.title}>Love travel, hate planning?</h1>
            <p>Plan your next adventure in seconds through the power of AI </p>
          </div>
          <div className={styles.card}>
            <h4 className={styles.cardTitle}>Plan your trip</h4>
            <form id="cardForm" className={styles.form} onSubmit={handleSubmit} >
              <div className={styles.inputGroup}>
                <Input
                  type="text"
                  value={destination}
                  inputMode="text"
                  onChange={handleDestinationChange}
                  placeholder="Enter your destination"
                  label="Where do you want to go?"
                  required
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  value={duration}
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
        <div className={styles.howItWorksText}>
          <h5 className={styles.howItWorksSubtitle}>How it works</h5>
          <h2 className={styles.howItWorksTitle}>Adventure awaits</h2>
        </div>
        <div className={styles.howItWorksContent}>
          <TextAndImage
            title="Enter your destination and get an itinerary in seconds"
            description="Simply fill in the details of where you looking to go, how long for and your personal preferences and WanderAI will generate a full itinerary for your trip in seconds"
            imgSrc="/howItWorks1.svg"
            imgAlt="Card showing the destination and duration input fields"
          />
          <TextAndImage
            title="Read your itinerary and refine your trip"
            description="Read through your planned itinerary, suggest changes and our AI powered trip planner will instantly create amendments so you can be sure to have a trip that suits your interests"
            imgSrc="/howItWorks2.svg"
            imgAlt="Card showing itinerary to for a morning in New York"
            reverse
          />
        </div>
      </Section>
      <Section>
        <div className={styles.howItWorksText}>
          <h5 className={styles.howItWorksSubtitle}>Example trips</h5>
          <h2 className={styles.howItWorksTitle}>Get inspired</h2>
        </div>
        <div className={styles.tripContainer}>
          <TripCard location="New York" imgSrc="/newYork.png"/>
          <TripCard location="London" imgSrc="/london.png"/>
          <TripCard location="Dubai" imgSrc="/dubai.png"/>
          <TripCard location="Santorini" imgSrc="/santorini.png"/>
        </div>
      </Section>
      <Section>
        <SignUpCard />
      </Section>
      {isSearchModalOpen ?
      <SearchModal 
        isSearchModalOpen={isSearchModalOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
        destination={destination}
        setDestination={setDestination}
        duration={duration}
        setDuration={setDuration}
        preferences={preferences}
        setPreferences={setPreferences}
      /> : null}
    </main>
  )
}

export default Home
