"use client";

import { useState } from "react";

import Button from "@/components/button";
import Input from "@/components/input";
import ThankYou from "./thank-you";

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleFullNameChange(e) {
    setFullName(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("submitting");
    if (!email || !fullName) {
      return;
    }

    try {
      const response = await fetch("https://formcarry.com/s/w4Ieb354Sc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ fullName: fullName, email: email }),
      });

      const res = await response.json();

      if (res.code === 200) {
        setSubmitted(true);
        console.log("submitted");
      }
    } catch (error) {
      console.log("error:", error.message);
      setError(error.message);
    }
  }

  return (
    <>
      {submitted ? (
        <ThankYou
          email={email}
          fullName={fullName}
          setSubmitted={setSubmitted}
        />
      ) : (
        <div className="flex w-full flex-col items-start gap-4">
          <h1 className="text-4xl md:text-5xl">
            Create an account and join our wait list
          </h1>
          <p className="text-gray-800">
            Sign up now to get access to your full itinerary and plan your next
            great adventure in seconds
          </p>
          <form
            id="signUpForm"
            className="flex w-full flex-col items-stretch gap-8"
            onSubmit={handleSubmit}
          >
            <div className="flex w-full flex-col items-start gap-4">
              <Input
                type="text"
                inputMode="text"
                value={fullName}
                onChange={handleFullNameChange}
                placeholder="Enter your full name"
                label="Full name"
                showLabel
                required
              />
              <Input
                type="email"
                inputMode="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                label="Email"
                showLabel
                required
              />
            </div>
            {error && <p className="text-red-300">{error}</p>}
            <Button type="submit">Sign up</Button>
          </form>
        </div>
      )}
    </>
  );
}
