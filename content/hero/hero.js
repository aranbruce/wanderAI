import SearchCard from "../../components/searchCard/searchCard"

import styles from "./hero.module.css"

const Hero = ({setDestinationValue, setDurationValue, destinationValue, durationValue, setSelectedPreferences, selectedPreferences, setResponse, response, setIsLoading, isLoading}) => {
  return (
    <div className={styles.heroContainer} >
      <div className={styles.introText}>
        <h1 className={styles.title}>Love travel, hate planning?</h1>
        <p>Plan your next adventure in seconds through the power of AI </p>
      </div>
      <SearchCard
        setDestinationValue={setDestinationValue} 
        destinationValue={destinationValue}
        setDurationValue={setDurationValue}
        durationValue={durationValue}
        setSelectedPreferences={setSelectedPreferences}
        selectedPreferences={selectedPreferences}
        setResponse={setResponse}
        response={response}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        />
    </div>
  );
};

export default Hero