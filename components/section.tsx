interface SectionProps {
  children: React.ReactNode;
  isHero?: boolean;
}

const Section = ({ children, isHero }: SectionProps) => {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-12 sm:p-12 md:p-16 lg:p-24">
      <div
        className={`flex w-full flex-col items-center justify-center gap-8 ${
          isHero ? "pt-18" : "max-w-screen-lg"
        }`}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
