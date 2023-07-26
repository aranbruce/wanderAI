'use client'

import {useRouter, usePathname } from 'next/navigation'

import styles from "./searchModal.module.css"
import Input from '../input/input'
import Checkbox from '../checkbox/checkbox'
import Button from '../button/button'

const SearchModal = ({ 
    setIsSearchModalOpen,
    isSearchModalOpen,
    destinationValue,
    setDestinationValue,
    durationValue,
    setDurationValue,
    selectedPreferences,
    setSelectedPreferences,
  }) => {  

  const router = useRouter()
  
  const handleDestinationChange = (e) => {
    setDestinationValue(e.target.value);
  };
  
  const handleDurationChange = (e) => {
    setDurationValue(e.target.value);
  };

  const handlePreferenceChange = (label) => {
    if (selectedPreferences.includes(label)) {
      setSelectedPreferences((prevPreferences) =>
        prevPreferences.filter((checkbox) => checkbox !== label)
      );
    } else {
      setSelectedPreferences((prevPreferences) => [...prevPreferences, label]);
    }
  };

  // could abstract as is shared across pages.js and searchModal.js
  const handleSubmit = (e) => {
    if (destinationValue && durationValue) {
      e.preventDefault();
      setIsSearchModalOpen(!isSearchModalOpen);
      console.log("modal form submitted");
      router.push(`/trip?destination=${destinationValue}&duration=${durationValue}&preferences=${selectedPreferences}`)
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
                  value={destinationValue}
                  onChange={handleDestinationChange}
                  placeholder="Enter your destination"
                  label="Where do you want to go?"
                  required
                />
                <Input
                  type="number"
                  inputMode="numeric"
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
                    onChange={() => handlePreferenceChange('Food')}
                  />
                  <Checkbox
                    label="Culture"
                    checked={selectedPreferences.includes('Culture')}
                    onChange={() => handlePreferenceChange('Culture')}
                  />
                  <Checkbox 
                    label="Outdoors"
                    checked={selectedPreferences.includes('Outdoors')}
                    onChange={() => handlePreferenceChange('Outdoors')}
                  />
                  <Checkbox 
                    label="Indoors"
                    checked={selectedPreferences.includes('Indoors')}
                    onChange={() => handlePreferenceChange('Indoors')}
                  />
                  <Checkbox 
                    label="Active"
                    checked={selectedPreferences.includes('Active')}
                    onChange={() => handlePreferenceChange('Active')}
                  />
                  <Checkbox 
                    label="Relaxation"
                    checked={selectedPreferences.includes('Relaxation')}
                    onChange={() => handlePreferenceChange('Relaxation')}
                  />
                  <Checkbox 
                    label="Pet friendly"
                    checked={selectedPreferences.includes('Pet friendly')}
                    onChange={() => handlePreferenceChange('Pet friendly')}
                  />
                  <Checkbox 
                    label="Child friendly"
                    checked={selectedPreferences.includes('Child friendly')}
                    onChange={() => handlePreferenceChange('Child friendly')}
                  />
                  <Checkbox 
                    label="Vegetarian"
                    checked={selectedPreferences.includes('Vegetarian')}
                    onChange={() => handlePreferenceChange('Vegetarian')}
                  />
                  <Checkbox 
                    label="Vegan"
                    checked={selectedPreferences.includes('Vegan')}
                    onChange={() => handlePreferenceChange('Vegan')}
                  />
                  <Checkbox 
                    label="Nightlife"
                    checked={selectedPreferences.includes('Nightlife')}
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