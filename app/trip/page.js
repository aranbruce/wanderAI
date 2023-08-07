'use client'

import React, { useEffect, useState }  from 'react'
import Image from 'next/image'
import {useRouter, useSearchParams} from 'next/navigation'
import Button from '@/components/button/button'
import Map from '@/components/map/map'
import Loading from '@/components/loading/loading'
import SignUpModal from '@/components/signUpModal/signUpModal'
import Error from '@/components/error/error'

import { AnimatePresence } from "framer-motion"

import styles from './page.module.css'

const Itinerary = () => {

  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [day, setDay] = useState(0);
  
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
      setIsLoading(true);
      // Add an error modal here
      try {
        console.log("Creating trip...");
        const tripResponse = await fetch("/api/trip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            destination: destination,
            duration: duration,
            preferences: preferences,
            }),
          });
          const response = await tripResponse.json();
          setIsLoading(false);
          setResponse(response);
          setIsError(false);
          localStorage.setItem('response', JSON.stringify(response));
          localStorage.setItem('destination', destination);
          localStorage.setItem('duration', duration);
          localStorage.setItem('preferences', JSON.stringify(preferences));
        } catch (error) {
        console.log("Error:", error.message);
        console.log("isError:", isError);
        setIsLoading(false);
        setIsError(true);
      }
    } else { console.log("No itinerary details provided") }
  };

  const increaseTimeOfDay = () => {
    if (timeOfDay === "evening" && day === localStorage.getItem('duration') - 1) {
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
      {isError ? <Error/> : 
      response && !isLoading ?
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
      <AnimatePresence>
      {isSignUpModalOpen && ( 
        <SignUpModal 
          isSignUpModalOpen={isSignUpModalOpen} 
          setIsSignUpModalOpen={setIsSignUpModalOpen}
        /> 
      )}
      </AnimatePresence>
    </div>
  );
}



export default Itinerary