import Link from "next/link";
import Image from "next/image";

interface ExampleTripCardProps {
  location: string;
  locationId: string;
  imgSrc: string;
  imgAlt: string;
}

export default function ExampleTripCard({
  location,
  locationId,
  imgSrc,
  imgAlt,
}: ExampleTripCardProps) {
  return (
    <Link href={`/trip?destination=${locationId}&duration=2&preferences=Food`}>
      <div className="shadow-light relative flex h-72 w-full items-end justify-start overflow-hidden rounded-lg bg-gray-300 p-6">
        <Image
          className="absolute inset-0 z-0 h-full w-full bg-cover bg-bottom object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          src={imgSrc}
          alt={imgAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <h3 className="relative z-10 text-2xl leading-tight font-semibold text-white">
          {location}
        </h3>
      </div>
    </Link>
  );
}
