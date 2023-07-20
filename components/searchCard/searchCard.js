'use client'

import React, { useState }  from 'react'
// import { useRouter } from 'next/router';
import Input from '../input/input';
import Button from '../button/button';
import SearchModal from '../searchModal/searchModal';

import styles from "./searchCard.module.css";

const SearchCard = ({ setDestinationValue, setDurationValue, destinationValue, durationValue, setSelectedPreferences, selectedPreferences, setResponse, response, setIsLoading, isLoading }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
    
  const handleDestinationChange = (e) => {
    setDestinationValue(e.target.value);
  };
  
  const handleDurationChange = (e) => {
    setDurationValue(e.target.value);
  };

  const checkFormValues = () => {
    if (destinationValue && durationValue) {
      setOpenModal(true);
    }
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
            required
          />
          <Input
            type="text"
            value={durationValue}
            onChange={handleDurationChange}
            placeholder="Enter your trip duration"
            label="How many days is your trip?"
            required
          />
        </div>
        <Button label="Start planning" onClick={checkFormValues} type="submit"/>
      </form>
      {openModal ? 
        <SearchModal
          setDestinationValue={setDestinationValue}
          destinationValue={destinationValue}
          setDurationValue={setDurationValue}
          durationValue={durationValue}
          setSelectedPreferences={setSelectedPreferences}
          selectedPreferences={selectedPreferences}
          setOpenModal={setOpenModal}
          setResponse={setResponse}
          response={response}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        /> 
      : ""}
    </div>
  );
};

export default SearchCard;
