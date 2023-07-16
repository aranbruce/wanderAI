import SearchCard from "../../components/searchCard/searchCard"

import styles from "./hero.module.css"

const Hero = () => {
  return (
    <div className={styles.heroContainer} >
      <div className={styles.introText}>
        <h1 className={styles.title}>Love travel, hate planning?</h1>
        <p>Plan your next adventure in seconds through the power of AI </p>
      </div>
      <SearchCard/>

    </div>
  );
};

export default Hero