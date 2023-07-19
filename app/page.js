'use client'

import React, { useState }  from 'react'
import Section from '../components/section/section'
import Hero from '../content/hero/hero'

import styles from './page.module.css'


const Home = () => {
  const [destinationValue, setDestinationValue] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const renderLocations = () => {
    if (response) {
      console.log(response);
      const responseObject = JSON.parse(response);
      console.log(responseObject);
      const days = Object.keys(responseObject);
      return days.map((day) => {
        const dayDetails = responseObject[day];
        return (
          <div key={day}>
            <h3>{day}</h3>
            {dayDetails && (
              <>
                <div>
                  <h4>Morning: {dayDetails.morning.location}</h4>
                  <p>{dayDetails.morning.description}</p>
                </div>
                <div>
                  <h4>Afternoon: {dayDetails.afternoon.location}</h4>
                  <p>{dayDetails.afternoon.description}</p>
                </div>
                <div>
                  <h4>Evening: {dayDetails.evening.location}</h4>
                  <p>{dayDetails.evening.description}</p>
                </div>
              </>
            )}
          </div>
        );
      });
    }
    return null;
  };

  return (
    <body>
      <main className={styles.main}>
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
          <div>
            {isLoading ? (
              <p>Loading</p>
            ) : (
              <>
                <h2>Preview of the first 2 days</h2>
                {renderLocations()}
              </>
            )}
          </div>
        </Section>
      </main>
    </body>
  )
}

export default Home
