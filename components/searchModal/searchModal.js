'use client'

import React, {useState} from 'react'

import styles from "./searchModal.module.css"
import Input from '../input/input'
import Checkbox from '../checkbox/checkbox'
import Button from '../button/button'

const SearchModal = ({setOpenModal, destinationValue, setDestinationValue, durationValue, setDurationValue, setSelectedPreferences, selectedPreferences, setResponse, response, setIsLoading, isLoading}) => {  
  const handleDestinationChange = (e) => {
    setDestinationValue(e.target.value);
  };
  
  const handleDurationChange = (e) => {
    setDurationValue(e.target.value);
  };

  const handleCheckboxChange = (label) => {
    if (selectedPreferences.includes(label)) {
      setSelectedPreferences((prevPreferences) =>
        prevPreferences.filter((checkbox) => checkbox !== label)
      );
    } else {
      setSelectedPreferences((prevPreferences) => [...prevPreferences, label]);
    }
  };

  const checkFormValues = () => {
    preventDefault();
    console.log('Destination:', destinationValue);
    console.log('Duration:', durationValue);
    if (destinationValue && durationValue) {
      setOpenModal(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSubmitAndGetResonseFromAPI = (e) => {
    handleSubmit(e);
    getResponseFromOpenAI();
  }

  const getResponseFromOpenAI = async () => {
    console.log('Destination:', destinationValue);
    console.log('Duration:', durationValue);
    console.log(selectedPreferences.length > 0 ? `Preferences: ${selectedPreferences.join(', ')}` : 'No preferences selected');
    if (destinationValue && durationValue) {
      setResponse("");
      setOpenModal(false);
      console.log("Getting response from OpenAI...");
      setIsLoading(true);
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: `Plan me a trip to ${destinationValue} for ${durationValue}. 
          Make sure to include activities that match the following preferences: ${selectedPreferences.join(', ')}`
        }),
      });
      const data = await response.json();
      console.log(data)
      setIsLoading(false);
      setResponse(data);
    } else { console.log("No itinerary details provided") }
  };

  return (
    <>
      <div className={styles.background} onClick={() => setOpenModal(false)}>    </div>
      <div className={styles.modal} >
        <header className={styles.header}>
          <h3>Your trip details</h3>
        </header>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.main}>
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
              <div className={styles.priorities}>
                <h4>Priorities</h4>
                <div className={styles.checkboxes}>
                  <Checkbox 
                    label="Food"
                    checked={selectedPreferences.includes('Food')}
                    onChange={() => handleCheckboxChange('Food')}
                  />
                  <Checkbox
                    label="Culture"
                    checked={selectedPreferences.includes('Culture')}
                    onChange={() => handleCheckboxChange('Culture')}
                  />
                  <Checkbox 
                    label="Outdoors"
                    checked={selectedPreferences.includes('Outdoors')}
                    onChange={() => handleCheckboxChange('Outdoors')}
                  />
                  <Checkbox 
                    label="Indoors"
                    checked={selectedPreferences.includes('Indoors')}
                    onChange={() => handleCheckboxChange('Indoors')}
                  />
                  <Checkbox 
                    label="Active"
                    checked={selectedPreferences.includes('Active')}
                    onChange={() => handleCheckboxChange('Active')}
                  />
                  <Checkbox 
                    label="Relaxation"
                    checked={selectedPreferences.includes('Relaxation')}
                    onChange={() => handleCheckboxChange('Relaxation')}
                  />
                  <Checkbox 
                    label="Pet friendly"
                    checked={selectedPreferences.includes('Pet friendly')}
                    onChange={() => handleCheckboxChange('Pet friendly')}
                  />
                  <Checkbox 
                    label="Child friendly"
                    checked={selectedPreferences.includes('Child friendly')}
                    onChange={() => handleCheckboxChange('Child friendly')}
                  />
                  <Checkbox 
                    label="Vegetarian"
                    checked={selectedPreferences.includes('Vegetarian')}
                    onChange={() => handleCheckboxChange('Vegetarian')}
                  />
                  <Checkbox 
                    label="Vegan"
                    checked={selectedPreferences.includes('Vegan')}
                    onChange={() => handleCheckboxChange('Vegan')}
                  />
                  <Checkbox 
                    label="Nightlife"
                    checked={selectedPreferences.includes('Nightlife')}
                    onChange={() => handleCheckboxChange('Nightlife')}
                  />
                </div>
              </div>
          </div>
          <div className={styles.footer}>
            <Button type="secondary" onClick={checkFormValues} imageSrc="/icons/back.svg"/>
            <Button onClick={handleSubmitAndGetResonseFromAPI} label="Plan" type="submit"/>
          </div>
        </form>
      </div>
    </>
  )
}

export default SearchModal