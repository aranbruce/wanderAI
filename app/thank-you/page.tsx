import Section from "../../components/section";
import Image from "next/image";
import Button from "@/components/button";

const ThankYou = () => {
  return (
    <Section isHero>
      <div className="flex w-full max-w-md flex-col items-center gap-8 self-center">
        <Image
          src="/assets/brandMark.svg"
          alt="WanderAI Logo"
          width={96}
          height={96}
          priority
        />
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl md:leading-snug">
            You&apos;re on the wait list
          </h1>
          <p className="text-gray-800">
            Not long now! We&apos;ll send an email as soon as you have access to
            a WanderAI account
          </p>
        </div>
        <Button href="/">Back to home</Button>
      </div>
    </Section>
  );
};

export default ThankYou;
