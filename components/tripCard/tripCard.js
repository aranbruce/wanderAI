import React from 'react'
import Image from 'next/image'

import styles from "./tripCard.module.css"
import Link from 'next/link'

const TripCard = ({location, imgSrc, imgAlt }) => {
  return (
    <Link href={`/trip?destination=${location}&duration=2&preferences=Food`}>
      <div className={styles.card}>
        <Image className={styles.img} src={imgSrc} alt={imgAlt} fill="true"/>
        <h3 className={styles.location}>{location}</h3>
      </div>
    </Link>
  )
}

export default TripCard