import React from 'react'
import Link from 'next/link'
import Button from '../button/button'

import styles from "./signUpModal.module.css"

const SignUpModal = ({setIsSignUpModalOpen, isSignUpModalOpen}) => {

  const handleModalClose = (e) => {
    setIsSignUpModalOpen(!isSignUpModalOpen);
  }

  return (
    <>
      <div className={styles.background} onClick={() => handleModalClose()}></div>
      <div className={styles.modal} >
        <h3 className={styles.title}>Create an account to read more and refine</h3>
        <p className={styles.description}>Sign up now to read the full itinerary or refine it further</p>
        <Link className={styles.link} href="/sign-up"><Button label="Sign up"/></Link>
      </div>
    </>
  )
}

export default SignUpModal