import React from 'react'
import Button from '../button/button'
import Backdrop from '../backdrop/backdrop'

import { motion } from "framer-motion"

import styles from "./signUpModal.module.css"

const SignUpModal = ({setIsSignUpModalOpen, isSignUpModalOpen}) => {

  const handleModalClose = (e) => {
    setIsSignUpModalOpen(!isSignUpModalOpen);
  }

  return (
    <Backdrop onClick={handleModalClose}>
      <motion.div
          initial={{ 
            opacity: 0,
            left: "50%",
            top: "100%",
            transform: "translate(-50%, 0%)"
          }}
          animate={{ 
            opacity: 1,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          exit={{ 
            opacity: 0,
            left: "50%",
            top: "100%",
            transform: "translate(-50%, -0%)",
          }}
          
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}  // Prevent click from closing modal
          className={styles.modal} >
        <h3 className={styles.title}>Create an account to read more and refine</h3>
        <p className={styles.description}>Sign up now to read the full itinerary or refine it further</p>
        <Button className={styles.button} href="/sign-up" label="Sign up"/>
      </motion.div>
    </Backdrop>
  )
}

export default SignUpModal