'use client'

import React, { useEffect, useState }  from 'react'
import {useSearchParams} from 'next/navigation'
import Button from '@/components/button/button'
import Map from '@/components/map/map'
import Loading from '@/components/loading/loading'
import SignUpModal from '@/components/signUpModal/signUpModal'

import styles from './page.module.css'

const Itinerary = () => {

  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [day, setDay] = useState(0);
  console.log("response:", response);

  const searchParams = useSearchParams();
  const destinationValue = searchParams.get("duration");
  const durationValue = searchParams.get("destination");
  const selectedPreferences= searchParams.getAll("preferences");

  useEffect(() => {
    makeApiCall(destinationValue, durationValue, selectedPreferences);
  }, []);

  const makeApiCall = async () => {
    console.log('Destination:', destinationValue);
    console.log('Duration:', durationValue);
    console.log(selectedPreferences.length > 0 ? `Preferences: ${selectedPreferences.join(', ')}` : 'No preferences selected');
    if (destinationValue && durationValue) {
      setResponse("");
      console.log("Getting response from OpenAI...");
      setIsLoading(true);

      // Create an AbortController instance
      const controller = new AbortController();
      const signal = controller.signal;

      // Set a timeout of 20 seconds
      const timeoutId = setTimeout(() => {
        controller.abort();
        setIsLoading(false);
        console.log("Request timed out");
      }, 20000);

      // Add an error modal here

      try {
        const response = await fetch("/api/openapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            prompt: `Plan me a trip to ${destinationValue} for ${durationValue} days. 
            Include activities that match the following preferences: ${selectedPreferences.join(', ')}`
          }),
          signal: signal, // Pass the signal to the fetch call
        });
        const data = await response.json();
        setIsLoading(false);
        setResponse(data);
        console.log("Response from OpenAI:", data);
      } catch (error) {
        setIsLoading(false);
        console.log("Error:", error.message);
      } finally {
        clearTimeout(timeoutId);
      }
    } else { console.log("No itinerary details provided") }
  };

  const increaseTimeOfDay = () => {
    if (timeOfDay === "evening" && day === 1) {
      setIsSignUpModalOpen(!isSignUpModalOpen);
    } else if (timeOfDay === "morning") {
      setTimeOfDay("afternoon");
    } else if (timeOfDay === "afternoon") {
      setTimeOfDay("evening");
    } else if (timeOfDay === "evening") {
      setTimeOfDay("morning");
      setDay(day + 1);
    } else { console.log("Error")}
  };

  const decreaseTimeOfDay = () => {
    if (timeOfDay === "morning" && day === 0) {
      setResponse(null)
      router.push('/');
    } else if (timeOfDay === "evening") {
      setTimeOfDay("afternoon");
    } else if (timeOfDay === "afternoon") {
      setTimeOfDay("morning");
    } else if (timeOfDay === "morning" && day === 1) {
      setTimeOfDay("evening");
      setDay(day - 1);
    } else { console.log("Error")}
  };

  return (
    <div>
      {response && !isLoading ?
        <div className={styles.container}>

          <div className={styles.mapContainer}>
            <Map 
              response={response}
              day={day}
              timeOfDay={timeOfDay}
            />
          </div>
          <div className={styles.dayCard}>
            {timeOfDay === "morning" ? 
              <div className={styles.content}>
                <div className={styles.titles}>
                  <h2 className={styles.day}>Day {day + 1} - {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</h2>
                  <h3 className={styles.location}>{response[day].morning.location}</h3>
                </div>
                <p>{response[day].morning.description}</p>
              </div>
              : 
            timeOfDay === "afternoon" ? 
              <div className={styles.content}>
                <div className={styles.titles}>
                  <h2 className={styles.day}>Day {day + 1} - {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</h2>
                  <h3 className={styles.location}>{response[day].afternoon.location}</h3>
                </div>
                <p>{response[day].afternoon.description}</p>
              </div>
            :
            timeOfDay === "evening" ? 
              <div className={styles.content}>
                <div className={styles.titles}>
                  <h2 className={styles.day}>Day {day + 1} - {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</h2>
                  <h3 className={styles.location}>{response[day].evening.location}</h3>
                </div>
                <p>{response[day].evening.description}</p>
              </div> : null}
              <footer className={styles.footer}>
                <Button variant="secondary" onClick={decreaseTimeOfDay} imageSrc="/icons/back.svg"/>
                <Button onClick={increaseTimeOfDay} label="Next" type="submit"/>
              </footer>
          </div>
        </div>
      : <Loading/>}
      {isSignUpModalOpen ? <SignUpModal/> : null}
    </div>
  );
}



export default Itinerary