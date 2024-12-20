import Section from "@/components/section";
import Button from "@/components/button";

function resetResponse() {
  localStorage.removeItem("response");
}

export default function Error() {
  return (
    <Section>
      <div className="flex h-[calc(100svh-72px)] flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-2xl">Oops! Something went wrong.</h1>
        <Button onClick={resetResponse} href="/">
          Back to Homepage
        </Button>
      </div>
    </Section>
  );
}
