import React from 'react'
import Image from 'next/image'

import styles from "./tripCard.module.css"
import Link from 'next/link'

const TripCard = ({location, imgSrc }) => {
  return (
    <Link href={`/trip?destination=${location}&duration=2&preferences=Food`}>
      <div className={styles.card} 
        style={{
          background: `linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.40) 71.60%), url(${imgSrc}), lightgray 50% / cover no-repeat`,
          backgroundPositionY: 'center',
          backgroundSize: 'cover',
        }}>
      {/* background: linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.40) 71.60%), url(<path-to-image>), lightgray 50% / cover no-repeat; */}


        <h3 className={styles.location}>{location}</h3>
      </div>
    </Link>
  )
}

export default TripCard