import Button from "@/components/button";
import Image from "next/image";

const SignUpCard = () => {
  return (
    <div className="relative w-full max-w-screen-lg overflow-hidden rounded-3xl bg-gray-300 p-8 text-white shadow-lg md:p-16 lg:p-24">
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
        className="absolute inset-0 z-0 object-cover"
        src="/assets/signUpBackground.png"
        alt="background image of mountains"
        fill={true}
      />
    </div>
  );
};

export default SignUpCard;
