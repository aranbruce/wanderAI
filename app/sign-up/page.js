'use client'

import React, { useState }  from 'react'
import va from '@vercel/analytics';
import Section from "../../components/section/section";
import Input from "../../components/input/input";
import Button from '@/components/button/button';

import styles from './page.module.css'

const SignUp = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  console.log("fullname:", fullname);
  console.log("email:", email);

  const handleFullNameChange = (e) => {
    setFullname(e.target.value);
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <Section hero>
      <div className={styles.container}>
        <div className={styles.text}>
          <h1 className={styles.title}>Create an account and join our waitlist</h1>
          <p className={styles.description}>Sign up now to get access to your full itinerary and plan your next great adventure in seconds</p>
        </div>
        {/* <form id="signUpForm" className={styles.form} onSubmit={handleSubmit}> */}
        <form id="signUpForm" className={styles.form} action="https://formsubmit.co/34c673adc32695cc897b037f1e8e02e6" method="POST">
          <div className={styles.inputGroup}>
          <Input
            type="text"
            inputMode="text"
            value={fullname}
            onChange={handleFullNameChange}
            placeholder="Enter your full name"
            label="Full name"
            required
          />
          <Input
            type="email"
            inputmode="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            label="Email"
            required
          />
          <input type="hidden" name="_captcha" value="false"/>
          <input type="hidden" name="_next" value="https://wanderai.co.uk/thank-you"/>
          </div>
          <Button label="Sign Up" type="submit" onClick={() => {va.track('Signup')}}/>
        </form>
      </div>
    </Section>
  )
}

export default SignUp