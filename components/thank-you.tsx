import Button from "@/components/button";
import LogoIcon from "@/images/icons/logo-icon";

interface ThankYouProps {
  fullName: string;
  email: string;
  setSubmitted: (submitted: boolean) => void;
}
export default function ThankYou({
  fullName,
  email,
  setSubmitted,
}: ThankYouProps) {
  return (
    <div className="flex w-full flex-col items-center gap-8 self-center">
      <LogoIcon height="96" width="96" />
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h1 className="text-4xl leading-tight font-semibold md:text-5xl md:leading-snug">
          {`Thanks ${fullName}! You're on the wait list`}
        </h1>
        <p className="text-gray-800">
          Not long now! We&apos;ll send an email to <strong>{email}</strong> as soon
          as you have access to a WanderAI account
        </p>
      </div>
      <Button onClick={() => setSubmitted(false)}>Back to Sign Up</Button>
    </div>
  );
}
