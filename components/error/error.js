import React from 'react'

import Section from '@/components/section/section'
import Button from '@/components/button/button'

import styles from './error.module.css'

const resetResponse = () => {
  localStorage.removeItem('response');
}

const Error = () => {
  return (
    <Section>
      <div className={styles.container}>
          <h1>Oops! Something went wrong.</h1>
          <Button onClick={resetResponse} href="/" label="Back to Homepage"/>
      </div>
      </Section>
  );
}

export default Error