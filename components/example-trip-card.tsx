import Image from "next/image";
import Link from "next/link";

export default function ExampleTripCard({ location, imgSrc, imgAlt }) {
  return (
    <Link href={`/trip?destination=${location}&duration=2&preferences=Food`}>
      <div className="relative flex h-72 w-full items-end justify-start overflow-hidden rounded-lg bg-gray-300 p-6 shadow-light">
        <Image
          className="absolute inset-0 z-0 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          src={imgSrc}
          alt={imgAlt}
          fill={true}
          sizes="(max-width: 768px) 100vw"
        />
        <h3 className="relative z-10 text-2xl font-semibold leading-tight text-white">
          {location}
        </h3>
      </div>
    </Link>
  );
}
