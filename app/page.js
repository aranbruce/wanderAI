'use client'

import React, { useState, useEffect }  from 'react'
import Section from '../components/section/section'
import Hero from '../content/hero/hero'

import styles from './page.module.css'
import Itinerary from '@/components/itinerary/itinerary'
import Loading from '@/components/loading/loading'


const Home = () => {
  const [destinationValue, setDestinationValue] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showItinerary, setShowItinerary] = useState(true);

  console.log("showItinerary:", showItinerary)

  useEffect(() => {
    if (response) {
      setShowItinerary(true);
    }
  }, [response]);

  return (
    <body>
      <main className={styles.main}>
          {isLoading ? 
          <Loading/>
          :
            showItinerary ?
              <Itinerary response={response} showItinerary={showItinerary} setShowItinerary={setShowItinerary} isLoading={isLoading}/>
              : 
              <Section>
                <Hero
                  setDestinationValue={setDestinationValue}
                  destinationValue={destinationValue}
                  setDurationValue={setDurationValue}
                  durationValue={durationValue}
                  setSelectedPreferences={setSelectedPreferences}
                  selectedPreferences={selectedPreferences}
                  setResponse={setResponse}
                  response={response}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </Section>
          }
      </main>
    </body>
  )
}

export default Home
