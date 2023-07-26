'use client'

import {useRouter } from 'next/navigation'

import styles from "./searchModal.module.css"
import Input from '../input/input'
import Checkbox from '../checkbox/checkbox'
import Button from '../button/button'

const SearchModal = ({ 
    setIsSearchModalOpen,
    isSearchModalOpen,
    destination,
    setDestination,
    duration,
    setDuration,
    preferences,
    setPreferences,
  }) => {  

  const router = useRouter()
  
  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };
  
  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handlePreferenceChange = (label) => {
    if (preferences.includes(label)) {
      setPreferences((prevPreferences) =>
        prevPreferences.filter((checkbox) => checkbox !== label)
      );
    } else {
      setPreferences((prevPreferences) => [...prevPreferences, label]);
    }
  };

  // could abstract as is shared across pages.js and searchModal.js
  const handleSubmit = (e) => {
    if (destination && duration) {
      e.preventDefault();
      setIsSearchModalOpen(!isSearchModalOpen);
      const preferenceString = preferences.map(preference => `preferences=${preference}`).join('&');
      const url = `/trip?destination=${destination}&duration=${duration}&${preferenceString}`;
      router.push(url)
    }
  };

  const handleModalClose = (e) => {
    setIsSearchModalOpen(!isSearchModalOpen)
    
  }
  return (
    <>
      <div className={styles.background} onClick={() => handleModalClose()}></div>
      <div className={styles.modal} >
        <header className={styles.header}>
          <h3>Your trip details</h3>
        </header>
        <form id="modalForm" className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.main}>
            <div className={styles.inputGroup}>
              <Input
                  type="text"
                  inputMode="text"
                  value={destination}
                  onChange={handleDestinationChange}
                  placeholder="Enter your destination"
                  label="Where do you want to go?"
                  required
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  value={duration}
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
                    checked={preferences.includes('Food')}
                    onChange={() => handlePreferenceChange('Food')}
                  />
                  <Checkbox
                    label="Culture"
                    checked={preferences.includes('Culture')}
                    onChange={() => handlePreferenceChange('Culture')}
                  />
                  <Checkbox 
                    label="Outdoors"
                    checked={preferences.includes('Outdoors')}
                    onChange={() => handlePreferenceChange('Outdoors')}
                  />
                  <Checkbox 
                    label="Indoors"
                    checked={preferences.includes('Indoors')}
                    onChange={() => handlePreferenceChange('Indoors')}
                  />
                  <Checkbox 
                    label="Active"
                    checked={preferences.includes('Active')}
                    onChange={() => handlePreferenceChange('Active')}
                  />
                  <Checkbox 
                    label="Relaxation"
                    checked={preferences.includes('Relaxation')}
                    onChange={() => handlePreferenceChange('Relaxation')}
                  />
                  <Checkbox 
                    label="Pet friendly"
                    checked={preferences.includes('Pet friendly')}
                    onChange={() => handlePreferenceChange('Pet friendly')}
                  />
                  <Checkbox 
                    label="Child friendly"
                    checked={preferences.includes('Child friendly')}
                    onChange={() => handlePreferenceChange('Child friendly')}
                  />
                  <Checkbox 
                    label="Vegetarian"
                    checked={preferences.includes('Vegetarian')}
                    onChange={() => handlePreferenceChange('Vegetarian')}
                  />
                  <Checkbox 
                    label="Vegan"
                    checked={preferences.includes('Vegan')}
                    onChange={() => handlePreferenceChange('Vegan')}
                  />
                  <Checkbox 
                    label="Nightlife"
                    checked={preferences.includes('Nightlife')}
                    onChange={() => handlePreferenceChange('Nightlife')}
                  />
                </div>
              </div>
          </div>
          <div className={styles.footer}>
            <Button variant="secondary" onClick={handleModalClose} imageSrc="/icons/back.svg" type="button"/>
            <Button label="Plan" type="submit"/>
          </div>
        </form>
      </div>
    </>
  )
}

export default SearchModal