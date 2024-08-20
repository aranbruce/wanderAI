interface SectionProps {
  children: React.ReactNode;
  isHero?: boolean;
}

export default function Section({ children, isHero }: SectionProps) {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-12 sm:px-12 sm:py-16 md:p-20 lg:p-24">
      <div
        className={`flex w-full flex-col items-center justify-center gap-8 ${
          isHero ? "pt-18" : "max-w-screen-lg"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
