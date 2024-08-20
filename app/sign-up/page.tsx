import Section from "@/components/section";
import SignUpForm from "@/components/sign-up-form";

export default function SignUp() {
  return (
    <Section isHero>
      <div className="flex max-w-lg flex-col items-start gap-8 self-center pt-12">
        <SignUpForm />
      </div>
    </Section>
  );
}
