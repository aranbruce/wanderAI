import React, { useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Image from 'next/image'
import Button from "../button/button"

import styles from './locationCard.module.css'



const LocationCard = ({ day, timeOfDay, location, description, rating, increaseTimeOfDay, decreaseTimeOfDay, photoReferences}) => {

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  console.log("apiKey: ", apiKey);

  return (
    <div className={styles.dayCard}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titles}>
            <h3 className={styles.day}>Day {day} - {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</h3>
            {location ? 
                <h2 className={styles.location}>{location}</h2>
              : 
              <Skeleton count={1} height={32} width={"60%"} containerClassName={styles.skeleton} />}
          </div>
          {rating ?
          <div className={styles.ratingContainer}>
            <p className={styles.rating}>{rating}</p>
            <Image src="/assets/star.svg" alt="Star Icon" width={24} height={24} priority/>
          </div>
          : <Skeleton count={1} height={20} width={"20%"} containerClassName={styles.skeleton}/>

        }
        </div>
        <div className={styles.main}>
        {description ?
        <p className={styles.description}>{description}</p>
        : <Skeleton count={3} height={20} width={"100%"} containerClassName={styles.skeleton}/>
        }
          <div className={styles.imagesContainer}>
            {photoReferences &&
              photoReferences.map((photoRef) => (
                <img 
                  key={photoRef}
                  src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photoRef}&maxheight=1600&key=${apiKey}`} 
                  alt="Location image"
                  className={styles.image}
                />
              ))
            }
          </div>
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