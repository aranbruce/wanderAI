import React from 'react'

import Button from '../button/button'

import styles from "./signUpCard.module.css"

const SignUpCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <h2 className={styles.title}>Sign up and start planning your next adventure</h2>
        <p>Start using WanderAI today and take the pain out of holiday planning</p>
      </div>
        <Button variant="secondary" label="Sign up" href="/sign-up" />
    </div>
  )
}

export default SignUpCard