import Section from "@/components/section";
import TextAndImage from "@/components/text-and-image";
import SignUpCard from "@/components/sign-up-card";
import ExampleTripCard from "@/components/example-trip-card";
import TestimonialCard from "@/components/testimonial-card";
import SearchForm from "@/components/search-form";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Section isHero>
        <SearchForm />
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-2 text-center">
          <h5 className="leading-5 text-green-400">How it works</h5>
          <h2 className="text-3xl md:text-4xl">Adventure awaits</h2>
        </div>
        <div className="flex flex-col items-center gap-16">
          <TextAndImage
            title="Enter your destination and get an itinerary in seconds"
            description="Simply fill in where you are looking to go, how long for and your personal preferences. WanderAI will then generate a full itinerary for your trip in seconds"
            imgSrc="/assets/howItWorks1.svg"
            imgAlt="Card showing the destination and duration input fields"
          />
          <TextAndImage
            title="Read your itinerary and refine your trip"
            description="Read through your planned itinerary, suggest changes and our AI powered trip planner will instantly create amendments so you can be sure to have a trip that suits your interests"
            imgSrc="/assets/howItWorks2.svg"
            imgAlt="Card showing itinerary to for a morning in New York"
            classNames="md:flex-row-reverse"
          />
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-2 text-center">
          <h5 className="text-green-400">Example trips</h5>
          <h2 className="text-3xl md:text-4xl">Get inspired</h2>
        </div>
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          <ExampleTripCard
            location="New York"
            imgSrc="/assets/newYork.png"
            imgAlt="New York skyscrapers"
          />
          <ExampleTripCard
            location="London"
            imgSrc="/assets/london.png"
            imgAlt="London and the River Thames"
          />
          <ExampleTripCard
            location="Dubai"
            imgSrc="/assets/dubai.png"
            imgAlt="Dubai"
          />
          <ExampleTripCard
            location="Santorini"
            imgSrc="/assets/santorini.png"
            imgAlt="Cliffs of Santorini"
          />
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-2 text-center">
          <h5 className="text-green-400">Reviews</h5>
          <h2 className="text-3xl md:text-4xl">
            Read what our users are saying
          </h2>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2">
          <TestimonialCard
            imgSrc="/assets/testimonial1.png"
            testimonial="“Fast, seamless and effortlessly intuitive. WanderAI makes holiday inspiration a breeze”"
            author="Phil - WanderAI User"
          />
          <TestimonialCard
            imgSrc="/assets/testimonial2.png"
            testimonial="“Using WanderAI made planning my holiday a lot easier. I'd never visited Naxos before, but now I've got lots of ideas of places to go - and things to eat”"
            author="Will - WanderAI User"
          />
        </div>
      </Section>
      <Section>
        <SignUpCard />
      </Section>
    </main>
  );
}
