import Image from "next/image";
import Link from "next/link";

const ExampleTripCard = ({ location, imgSrc, imgAlt }) => {
  return (
    <Link href={`/trip?destination=${location}&duration=2&preferences=Food`}>
      <div className="relative flex h-72 w-full items-end justify-start overflow-hidden rounded-lg bg-gray-300 p-6">
        <Image
          className="absolute inset-0 z-0 object-cover"
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
};

export default ExampleTripCard;
