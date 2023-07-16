import NavBar from "../components/navBar/navBar"
import Section from '../components/section/section'
import Hero from '../content/hero/hero'

import styles from './page.module.css'

const hideButton = false

const Home = () => {
  return (
    <body>
      <NavBar hideButton={hideButton}/>
      <main className={styles.main}>
        <Section>
          <Hero/>
        </Section>
      </main>

    </body>
  )
}

export default Home
