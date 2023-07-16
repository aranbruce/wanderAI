'use client'

import React from 'react'
import { useState } from 'react';
// import { useRouter } from 'next/router';
import Input from '../input/input';
import Button from '../button/button';

import styles from "./searchCard.module.css"

const SearchCard = () => {
  const [destinationValue, setDestinationValue] = useState('');
  const [durationValue, setDurationValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Destination:', destinationValue);
    console.log('Duration:', durationValue);
    // Perform any necessary logic or data handling here
    // Redirect to another page or perform additional actions
    // router.push('/results');
  };
    
    const handleDestinationChange = (e) => {
      setDestinationValue(e.target.value);
    };
  
    const handleDurationChange = (e) => {
      setDurationValue(e.target.value);
    };

  return (
    <div className={styles.card}>
      <h4 className={styles.title}>Plan your trip</h4>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <Input
            type="text"
            value={destinationValue}
            onChange={handleDestinationChange}
            placeholder="Enter your destination"
            label="Where do you want to go?"
          />
          <Input
            type="text"
            value={durationValue}
            onChange={handleDurationChange}
            placeholder="Enter your trip duration"
            label="How many days is your trip?"
          />
        </div>
        <Button type="submit">Start Planning</Button>
      </form>
    </div>
  );
};

export default SearchCard;