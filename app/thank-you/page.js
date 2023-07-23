import Section from "../../components/section/section";
import Image from 'next/image'
import Button from '@/components/button/button';
import Link from 'next/link'

import styles from "./page.module.css"


const ThankYou = () => {
  return (
    <Section>
      <div className={styles.container}>
      <Image
          src="./brandmark.svg"
          alt="WanderAI Logo"
          width={96}
          height={96}
          priority
        />
        <div className={styles.text}>
          <h1 className={styles.title}>You’re on the waitlist</h1>
          <p className={styles.description}>Not long now! We'll send an email to jane.doe@gmail.com as soon as you have access to a WanderAI account</p>
        </div>
        <Link href="/"><Button label="Back to home"/></Link>
      </div>
    </Section>
  )
}

export default ThankYou