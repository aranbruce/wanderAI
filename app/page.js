'use client'

import React, { useState }  from 'react'

import Section from '@/components/section/section'
import Input from '@/components/input/input'
import Button from '@/components/button/button'
import SearchModal from '@/components/searchModal/searchModal'
import styles from './page.module.css'
import TextAndImage from '@/components/textAndImage/textAndImage'
import SignUpCard from '@/components/signUpCard/signUpCard'

const Home = () => {
  const [destinationValue, setDestinationValue] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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
                  value={destinationValue}
                  inputMode="text"
                  onChange={handleDestinationChange}
                  placeholder="Enter your destination"
                  label="Where do you want to go?"
                  required
                />
                <Input
                  type="number"
                  inputMode="numeric"
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
        <SignUpCard />
      </Section>
      {isSearchModalOpen ?
      <SearchModal 
        isSearchModalOpen={isSearchModalOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
        destinationValue={destinationValue}
        setDestinationValue={setDestinationValue}
        durationValue={durationValue}
        setDurationValue={setDurationValue}
        selectedPreferences={selectedPreferences}
        setSelectedPreferences={setSelectedPreferences}
      /> : null}
    </main>
  )
}

export default Home
