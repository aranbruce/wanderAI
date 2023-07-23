'use client'

import React, { useState }  from 'react'
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

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   const data = new FormData(e.currentTarget);
  //   console.log(data);
  //   console.log(Object.fromEntries(data.entries()));
  //   // console.log(JSON.parse(data));
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('/api/contact', {
  //       method: 'post',
  //       body: new URLSearchParams(data),
  //     });
  //     if (!response.ok) {
  //       throw new Error(`Invalid response: ${response.status}`);
  //     }
  //     alert('Thanks for contacting us, we will get back to you soon!');
  //   } catch (err) {
  //     console.error(err);
  //     alert("We can't submit the form, try again later?");
  //   }
  // }


  return (
    <Section>
      <div className={styles.container}>
        <div className={styles.text}>
          <h1 className={styles.title}>Create an account and join our waitlist</h1>
          <p className={styles.description}>Sign up now and access to create a full itinerary that you can use to plan your next great adventure</p>
        </div>
        {/* <form id="signUpForm" className={styles.form} onSubmit={handleSubmit}> */}
        <form id="signUpForm" className={styles.form} action="https://formsubmit.co/34c673adc32695cc897b037f1e8e02e6" method="POST">
          <div className={styles.inputGroup}>
          <Input
            type="text"
            value={fullname}
            onChange={handleFullNameChange}
            placeholder="Enter your full name"
            label="Full name"
            required
          />
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            label="Email"
            required
          />
          <input type="hidden" name="_captcha" value="false"/>
          <input type="hidden" name="_next" value="https://wander-ai.vercel.app/thank-you"/>
          </div>
          <Button label="Sign Up" type="submit"/>
        </form>
      </div>
    </Section>
  )
}

export default SignUp