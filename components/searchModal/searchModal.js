'use client'

import React, {useState} from 'react'

import styles from "./searchModal.module.css"
import Input from '../input/input'
import Checkbox from '../checkbox/checkbox'
import Button from '../button/button'

const SearchModal = ({setOpenModal, destinationValue, setDestinationValue, durationValue, setDurationValue}) => {

  const handleDestinationChange = (e) => {
    setDestinationValue(e.target.value);
  };
  
  const handleDurationChange = (e) => {
    setDurationValue(e.target.value);
  };

  return (
    <>
      <div className={styles.background} onClick={() => setOpenModal(false)}>    </div>
      <div className={styles.modal} >
        <header className={styles.header}>
          <h3>Your trip details</h3>
        </header>
        <div className={styles.main}>
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
            <div className={styles.priorities}>
              <h4>Priorities</h4>
              <div className={styles.checkboxes}>
                <Checkbox label="Food"/>
                <Checkbox label="Culture"/>
                <Checkbox label="Outdoors"/>
                <Checkbox label="Indoors"/>
                <Checkbox label="Active"/>
                <Checkbox label="Pet friendly"/>
                <Checkbox label="Child friendly"/>
                <Checkbox label="Vegetarian"/>
                <Checkbox label="Vegan"/>
                <Checkbox label="Vegan"/>
              </div>
            </div>
        </div>
        <footer className={styles.footer}>
          <Button type="secondary" onClick={() => setOpenModal(false)} imageSrc="/icons/back.svg"/>
          <Button onClick={() => setOpenModal(false)} label="Plan"/>
        </footer>
      </div>
    </>
  )
}

export default SearchModal