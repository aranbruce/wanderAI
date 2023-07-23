'use client'

import React, { useState, useEffect }  from 'react'
import Button from '../button/button'
import Map from '../map/map'

import styles from './itinerary.module.css'

const Itinerary = ({response, setResponse}) => {
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [day, setDay] = useState(0);

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
        setResponse(null);
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
  </div>
  );
}



export default Itinerary