import Link from "next/link";

export default function ExampleTripCard({
  location,
  locationId,
  imgSrc,
  imgAlt,
}) {
  return (
    <Link href={`/trip?destination=${locationId}&duration=2&preferences=Food`}>
      <div className="relative flex h-72 w-full items-end justify-start overflow-hidden rounded-lg bg-gray-300 p-6 shadow-light">
        <img
          className="absolute inset-0 z-0 h-full w-full bg-cover bg-bottom object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          src={imgSrc}
          alt={imgAlt}
        />
        <h3 className="relative z-10 text-2xl font-semibold leading-tight text-white">
          {location}
        </h3>
      </div>
    </Link>
  );
}
