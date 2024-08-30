"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";

import Button from "@/components/button";
import Input from "@/components/input";
import ThankYou from "./thank-you";
import SpinnerIcon from "@/images/icons/spinner-icon";
import posthog from "posthog-js";

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [fullNameError, setFullNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  function handleEmailChange(e) {
    setEmailError(null);
    setEmail(e.target.value);
  }

  function handleFullNameChange(e) {
    setFullNameError(null);
    setFullName(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    if (!email) {
      setEmailError("Enter your email");
    }
    if (!fullName) {
      setFullNameError("Enter your full name");
    }
    if (!email || !fullName) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email }),
      });

      if (response.status === 200) {
        setSubmitted(true);
        setError(null);
        posthog.capture("user_signed_up_for_wait_list", { email, fullName });
      } else {
        throw new Error("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.log("error:", error.message);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
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
        <div className="flex w-full flex-col items-start gap-6">
          <h1 className="text-4xl md:text-5xl">
            Sign up now to join our wait list
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
            <div className="flex w-full flex-col items-start gap-6">
              <Input
                type="text"
                inputMode="text"
                value={fullName}
                onChange={handleFullNameChange}
                placeholder="Enter your full name"
                label="Full name"
                showLabel
                error={fullNameError}
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
                error={emailError}
                required
              />
            </div>
            {error && <p className="text-red-300">{error}</p>}
            <Button type="submit">
              {isSubmitting && (
                <>
                  <SpinnerIcon width="20" height="20" />
                </>
              )}
              Sign up
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
