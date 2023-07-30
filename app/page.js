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
import TestimonialCard from '@/components/testimonialCard/testimonialCard'

const Home = () => {
  const [destination, setDestination] = useState(typeof window !== "undefined" ? localStorage.getItem('destination') ? localStorage.getItem('destination') : '' : '');
  const [duration, setDuration] = useState(typeof window !== "undefined" ? localStorage.getItem('duration') ? localStorage.getItem('duration') : '' : '');
  const [preferences, setPreferences] = useState(typeof window !== "undefined" ? localStorage.getItem('preferences') ? JSON.parse(localStorage.getItem('preferences')) : [] : []);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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
        <div className={styles.sectionIntro}>
          <h5 className={styles.sectionSubtitle}>How it works</h5>
          <h2 className={styles.sectionTitle}>Adventure awaits</h2>
        </div>
        <div className={styles.howItWorksContent}>
          <TextAndImage
            title="Enter your destination and get an itinerary in seconds"
            description="Simply fill in where you are looking to go, how long for and your personal preferences. WanderAI will then generate a full itinerary for your trip in seconds"
            imgSrc="/assets/howItWorks1.svg"
            imgAlt="Card showing the destination and duration input fields"
          />
          <TextAndImage
            title="Read your itinerary and refine your trip"
            description="Read through your planned itinerary, suggest changes and our AI powered trip planner will instantly create amendments so you can be sure to have a trip that suits your interests"
            imgSrc="/assets/howItWorks2.svg"
            imgAlt="Card showing itinerary to for a morning in New York"
            reverse
          />
        </div>
      </Section>
      <Section>
        <div className={styles.sectionIntro}>
          <h5 className={styles.sectionSubtitle}>Example trips</h5>
          <h2 className={styles.sectionTitle}>Get inspired</h2>
        </div>
        <div className={styles.tripContainer}>
          <TripCard location="New York" imgSrc="/assets/newYork.png" imgAlt="New York skyscrappers"/>
          <TripCard location="London" imgSrc="/assets/london.png" imgAlt="London and the River Thames"/>
          <TripCard location="Dubai" imgSrc="/assets/dubai.png"imgAlt="Dubai"/>
          <TripCard location="Santorini" imgSrc="/assets/santorini.png" imgAlt="Cliffs of Santorini"/>
        </div>
      </Section>
      <Section>
        <div className={styles.sectionIntro}>
          <h5 className={styles.sectionSubtitle}>Reviews</h5>
          <h2 className={styles.sectionTitle}>Read what our users are saying</h2>
        </div>
        <div className={styles.testimonialContainer}>
          <TestimonialCard 
            imgSrc="/assets/testimonial1.png"
            testimonial="“Fast, seamless and effortlessly intuitive. WanderAI makes holiday inspiration a breeze”"
            author="Phil - WanderAI User"
          />
          <TestimonialCard
            imgSrc="/assets/testimonial2.png"
            testimonial="“Using WanderAI made planning my holiday a lot easier. I&apos;d never visited Naxos before, but now I&apos;ve got lots of ideas of places to go - and things to eat”"
            author="Will - WanderAI User"
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
