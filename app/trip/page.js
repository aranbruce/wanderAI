'use client'

import React, { useEffect, useState }  from 'react'
import Image from 'next/image'
import {useRouter, useSearchParams} from 'next/navigation'
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
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const destination = searchParams.get("destination");
    const duration = searchParams.get("duration");
    const preferences = searchParams.getAll("preferences");
    const previousDestination = typeof window !== "undefined" ? localStorage.getItem('destination') : null;
    const previousDuration = typeof window !== "undefined" ? localStorage.getItem('duration') : null;
    const previousPreferences = typeof window !== "undefined" ? JSON.parse(localStorage.getItem('preferences')): null;
    const previousResponse = typeof window !== "undefined" ? localStorage.getItem('response') : null;
    if (destination !== previousDestination || duration !== previousDuration || JSON.stringify(preferences.sort().join(',')) !== JSON.stringify(previousPreferences.sort().join(','))) {
      makeOpenAIApiCall({destination, duration, preferences});
    } else {
        setIsLoading(false);
        setResponse(JSON.parse(previousResponse));
    }
  }, []);

  const makeOpenAIApiCall = async ({destination, duration, preferences}) => {
    if (destination && duration) {
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
      }, 30000);

      // Add an error modal here

      try {
        const googlePlacesResponse = await fetch("/api/googleplaces", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            textQuery: `${preferences.join(', ')} places in ${destination}`,
          }),
        });

        const googlePlacesData = await googlePlacesResponse.json();
        const googlePlacesDataString = JSON.stringify(googlePlacesData);

        const openAIResponse = await fetch("/api/openapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            prompt: `Plan me a trip to ${destination} for ${duration} days using the following information:
            ${googlePlacesDataString}
            . 
            Include activities that match the following preferences: ${preferences.join(', ')}`
          }),
          signal: signal, // Pass the signal to the fetch call
        });
        const data = await openAIResponse.json();
        setIsLoading(false);
        setResponse(data);
        localStorage.setItem('response', JSON.stringify(data));
        localStorage.setItem('destination', destination);
        localStorage.setItem('duration', duration);
        localStorage.setItem('preferences', JSON.stringify(preferences));
        console.log("Response from OpenAI:", data);
      } catch (error) {
        setIsLoading(false);
        
        console.log("Error:", error.message);
        console.log("isLoading:", isLoading)
        // throw new Error("API call failed!");
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
                  <h3 className={styles.day}>Day {day + 1} - {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</h3>
                  <div className={styles.header}>
                    <h2 className={styles.location}>{response[day].morning.location}</h2>
                    {response[day].morning.rating ? 
                      <div className={styles.ratingContainer}>
                        <h3 className={styles.rating}>{response[day].morning.rating}</h3>
                        <Image src="/assets/star.svg" alt="Star Icon" width={24} height={24} priority/>
                      </div> : 
                    null}
                  </div>
                </div>
                <p className={styles.description}>{response[day].morning.description}</p>
              </div>
              : 
            timeOfDay === "afternoon" ? 
              <div className={styles.content}>
                <div className={styles.titles}>
                <h3 className={styles.day}>Day {day + 1} - {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</h3>
                  <div className={styles.header}>
                    <h2 className={styles.location}>{response[day].afternoon.location}</h2>
                    {response[day].afternoon.rating ? 
                      <div className={styles.ratingContainer}>
                        <h3 className={styles.rating}>{response[day].afternoon.rating}</h3>
                        <Image src="/assets/star.svg" alt="Star Icon" width={24} height={24} priority/>
                      </div> : 
                    null}
                  </div>
                </div>
                <p className={styles.description}>{response[day].afternoon.description}</p>
              </div>
            :
            timeOfDay === "evening" ? 
              <div className={styles.content}>
                <div className={styles.titles}>
                <h3 className={styles.day}>Day {day + 1} - {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</h3>
                  <div className={styles.header}>
                    <h2 className={styles.location}>{response[day].evening.location}</h2>
                    {response[day].evening.rating ? 
                      <div className={styles.ratingContainer}>
                        <h3 className={styles.rating}>{response[day].evening.rating}</h3>
                        <Image src="/assets/star.svg" alt="Star Icon" width={24} height={24} priority/>
                      </div> : 
                    null}
                  </div>
                </div>
                <p className={styles.description}>{response[day].evening.description}</p>
              </div> : null}
              <footer className={styles.footer}>
                <Button variant="secondary" onClick={decreaseTimeOfDay} imageSrc="/icons/back.svg"/>
                <Button onClick={increaseTimeOfDay} label="Next" type="submit"/>
              </footer>
          </div>
        </div>
      : <Loading/>}
      {isSignUpModalOpen ? <SignUpModal isSignUpModalOpen={isSignUpModalOpen} setIsSignUpModalOpen={setIsSignUpModalOpen}/> : null}
    </div>
  );
}



export default Itinerary