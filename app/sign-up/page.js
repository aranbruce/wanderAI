'use client'

import React, { useState }  from 'react'
import { useForm } from '@formcarry/react';
import {useRouter} from 'next/navigation';

import va from '@vercel/analytics';
import Section from "../../components/section/section";
import Input from "../../components/input/input";
import Button from '@/components/button/button';

import styles from './page.module.css'

const SignUp = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true); // add state variable for email validity
  const {state, submit} = useForm({
    id: 'w4Ieb354Sc'
  });

  const router = useRouter();

  // Success message
  if (state.submitted) {
    router.push("/thank-you");
  }
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFullNameChange = (e) => {
    setFullname(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setEmailValid(false); // set email validity to false if email is empty
      return;
    }
    submit({email});
  }

  return (
    <Section hero>
      <div className={styles.container}>
        <div className={styles.text}>
          <h1 className={styles.title}>Create an account and join our waitlist</h1>
          <p className={styles.description}>Sign up now to get access to your full itinerary and plan your next great adventure in seconds</p>
        </div>
        <form id="signUpForm" className={styles.form} onSubmit={handleSubmit}>
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
            </div>
          <Button label="Sign Up" type="submit" onClick={() => {va.track('Signup')}}/>
        </form>
      </div>
    </Section>
  )
}

export default SignUp