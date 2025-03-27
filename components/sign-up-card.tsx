import Button from "@/components/button";
import Image from "next/image";

export default function SignUpCard() {
  return (
    <div className="shadow-heavy group relative w-full max-w-(--breakpoint-lg) overflow-hidden rounded-3xl bg-gray-300 p-8 text-white md:p-16 lg:p-24">
      <div className="relative z-10 flex flex-col items-stretch gap-8 md:items-start">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-4xl">
            Sign up and start planning your next adventure
          </h2>
          <p>
            Start using WanderAI today and take the pain out of holiday planning
          </p>
        </div>
        <Button variant="secondary" href="/sign-up">
          Sign up
        </Button>
      </div>
      <Image
        className="group:hover:scale-105 absolute inset-0 z-0 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        src="/assets/signUpBackground.png"
        alt="background image of mountains"
        fill={true}
      />
    </div>
  );
}
