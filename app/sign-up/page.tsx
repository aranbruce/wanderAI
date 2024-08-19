"use client";

import { useState } from "react";
import { useForm } from "@formcarry/react";
import { useRouter } from "next/navigation";

import va from "@vercel/analytics";
import Section from "@/components/section";
import Input from "@/components/input";
import Button from "@/components/button";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true); // add state variable for email validity
  const { state, submit } = useForm({
    id: "w4Ieb354Sc",
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
    setFullName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setEmailValid(false); // set email validity to false if email is empty
      return;
    }
    // submit({ email });
  };

  return (
    <Section isHero>
      <div className="flex max-w-md flex-col items-start gap-8 self-center">
        <div className="flex w-full flex-col items-start gap-4">
          <h1 className="text-4xl md:text-5xl">
            Create an account and join our wait list
          </h1>
          <p className="text-gray-800">
            Sign up now to get access to your full itinerary and plan your next
            great adventure in seconds
          </p>
        </div>
        <form
          id="signUpForm"
          className="flex w-full flex-col items-start gap-8"
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
              required
            />
            <Input
              type="email"
              inputMode="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              label="Email"
              required
            />
          </div>
          <Button
            type="submit"
            onClick={() => {
              va.track("Signup");
            }}
          >
            Sign up
          </Button>
        </form>
      </div>
    </Section>
  );
};

export default SignUp;
