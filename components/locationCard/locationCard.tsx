import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Image from "next/image";
import Button from "@/components/button";
import BackIcon from "@/images/icons/back-icon";

import styles from "./locationCard.module.css";
import { LocationProps } from "@/components/trip-content";

interface LocationCardProps {
  location: LocationProps;
  increaseTimeOfDay: () => void;
  decreaseTimeOfDay: () => void;
}

const LocationCard = ({
  location,
  increaseTimeOfDay,
  decreaseTimeOfDay,
}: LocationCardProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  return (
    <div className={styles.dayCard}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titles}>
            {location.day && (
              <h3 className={styles.day}>
                Day {location.day} -{" "}
                {location.timeOfDay &&
                  location.timeOfDay.charAt(0).toUpperCase() +
                    location.timeOfDay.slice(1)}
              </h3>
            )}
            {location.title && (
              <h2 className={styles.location}>{location.title}</h2>
            )}
          </div>
          {location.rating && (
            <div className={styles.ratingContainer}>
              <p className={styles.rating}>{location.rating}</p>
              <Image
                src="/assets/star.svg"
                alt="Star Icon"
                width={24}
                height={24}
                priority
              />
            </div>
          )}
        </div>
        <div className={styles.main}>
          {location.description && (
            <p className={styles.description}>{location.description}</p>
          )}
          {location.photoReferences ? (
            <div className={styles.imagesContainer}>
              {location.photoReferences.map((photoRef) => (
                <Image
                  width={120}
                  height={120}
                  key={photoRef}
                  src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photoRef}&maxheight=1600&key=${apiKey}`}
                  alt="Location image"
                  className={styles.image}
                  style={{ backgroundColor: "#D9D9D9" }}
                />
              ))}
            </div>
          ) : (
            <div className={styles.imagesContainer}>
              <Skeleton
                count={1}
                height={"100%"}
                containerClassName={styles.image}
              />
              <Skeleton
                count={1}
                height={"100%"}
                containerClassName={styles.image}
              />
              <Skeleton
                count={1}
                height={"100%"}
                containerClassName={styles.image}
              />
              <Skeleton
                count={1}
                height={"100%"}
                containerClassName={styles.image}
              />
            </div>
          )}
        </div>
      </div>
      <footer className={styles.footer}>
        <Button variant="secondary" onClick={decreaseTimeOfDay}>
          <BackIcon height="24" width="24" />
        </Button>
        <Button onClick={increaseTimeOfDay}>Next</Button>
      </footer>
    </div>
  );
};

export default LocationCard;
