'use client'

import React, { useState }  from 'react'
import Button from '../button/button'

import styles from './itinerary.module.css'

const Itinerary = ({response, isLoading, showItinerary, setShowItinerary}) => {
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [day, setDay] = useState(0);
  console.log("showItinerary:", showItinerary)
  console.log(response)
  console.log(JSON.stringify(response))

  if (response !== null && isLoading === false) {
    setShowItinerary(true);
  } else {
    setShowItinerary(false);
  }

  const increaseTimeOfDay = () => {
    if (timeOfDay === "evening" && day === 1) {
      alert("Sign up")
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
      setShowItinerary(false);
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
    {response !== null && isLoading === false ? 
    <>
      {console.log(response)}
      <div className={styles.container}>
        <div className={styles.dayDetails}>
          <div className={styles.content}>
            <div className={styles.titles}>
              <h2>Day {day + 1} - {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</h2>
              <h3>{response ? response[day][timeOfDay].location : null}</h3>
              </div>
              <p>{response ? response[day][timeOfDay].description: null}</p>
            </div>
            <footer className={styles.footer}>
              <Button type="secondary" onClick={decreaseTimeOfDay} imageSrc="/icons/back.svg"/>
              <Button onClick={increaseTimeOfDay} label="Next" type="submit"/>
            </footer>
          </div>
      </div>
      </> : 
      null}
  </div>
  );
}



export default Itinerary