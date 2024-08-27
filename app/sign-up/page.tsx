import Section from "@/components/section";
import SignUpForm from "@/components/sign-up-form";

export const metadata = {
  title: "WanderAI | Sign Up",
  description:
    "Sign up to WanderAI and start planning your next adventure in seconds",
  openGraph: {
    title: "WanderAI | Sign Up",
    description:
      "Sign up to WanderAI and start planning your next adventure in seconds",
  },
};

export default function SignUp() {
  return (
    <Section isHero>
      <div className="flex max-w-lg flex-col items-start gap-8 self-center pt-12">
        <SignUpForm />
      </div>
    </Section>
  );
}
