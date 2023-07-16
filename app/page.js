'use client'

import React, { useState }  from 'react'
import Section from '../components/section/section'
import Hero from '../content/hero/hero'

import styles from './page.module.css'

const Home = () => {
  const [destinationValue, setDestinationValue] = useState('');
  const [durationValue, setDurationValue] = useState('');
  return (
    <body>
      <main className={styles.main}>
        <Section>
          <Hero
            setDestinationValue={setDestinationValue}
            destinationValue={destinationValue}
            setDurationValue={setDurationValue}
            durationValue={durationValue}/>
        </Section>
        <p>{destinationValue}</p>
        <p>{durationValue}</p>
      </main>
    </body>
  )
}

export default Home
