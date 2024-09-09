import Button from "@/components/button";
import Section from "@/components/section";

export default function NotFound() {
  return (
    <Section isHero>
      <div className="flex h-[calc(100svh-72px)] flex-col items-center justify-center gap-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl">Not Found</h2>
          <p>Could not find requested resource</p>
        </div>
        <Button href="/">Return Home</Button>
      </div>
    </Section>
  );
}
