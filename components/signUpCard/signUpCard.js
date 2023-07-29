import React from 'react'

import Button from '../button/button'
import Image from 'next/image'

import styles from "./signUpCard.module.css"

const SignUpCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h2 className={styles.title}>Sign up and start planning your next adventure</h2>
          <p>Start using WanderAI today and take the pain out of holiday planning</p>
        </div>
        <Button variant="secondary" label="Sign up" href="/sign-up" />
      </div>
      <Image className={styles.img} src="/assets/signUpBackground.png" alt="background image of mountains" fill="true"/>
    </div>
  )
}

export default SignUpCard