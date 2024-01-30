"use client"

import React, {useState, useEffect} from 'react'

import styles from './loading.module.css'

const Loading = () => {
  const [text, setText] = useState('Searching the internet for locations...')

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prevText) => {
        if (prevText === 'Searching the internet for locations...') {
          return 'Checking them for suitability'
        } else if (prevText === 'Checking them for suitability') {
          return 'Creating your trip itinerary'
        } else {
          return 'Searching the internet for locations...'
        }
      })
    }, 3500)

    return () => clearInterval(interval)
  }, [])


  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.pin_container}>
          <div className={styles.pin}></div>
          <div className={styles.pulse}></div>
        </div>
        <h4 className={styles.text}>{text}</h4>
      </div>
    </div>
  )
}

export default Loading