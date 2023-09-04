import React, { useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Image from 'next/image'
import Button from "../button/button"

import styles from './locationCard.module.css'

const LocationCard = ({ day, timeOfDay, isLoading, location, description, rating, increaseTimeOfDay, decreaseTimeOfDay}) => {

  return (
    <div className={styles.dayCard}>
      <div className={styles.content}>
        <div className={styles.titles}>
          <h3 className={styles.day}>Day {day} - {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</h3>
          {location ? 
              <h2 className={styles.location}>{location}</h2>
            : 
            <Skeleton count={1} height={32} width={"60%"} containerClassName={styles.skeleton} />}
        </div>
        <div className={styles.main}>
        {description ?
        <p className={styles.description}>{description}</p>
        : <Skeleton count={3} height={20} width={"100%"} containerClassName={styles.skeleton}/>
        }
        </div>
      </div>
      <footer className={styles.footer}>
        <Button variant="secondary" onClick={decreaseTimeOfDay} imageSrc="/icons/back.svg"/>
        <Button  label="Next" onClick={increaseTimeOfDay} type="submit"/>
      </footer>
    </div>
  )
}

export default LocationCard