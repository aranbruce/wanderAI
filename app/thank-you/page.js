import Section from "../../components/section/section";
import Image from 'next/image'
import Button from '@/components/button/button';
import Link from 'next/link'

import styles from "./page.module.css"


const ThankYou = () => {
  return (
    <Section hero>
      <div className={styles.container}>
      <Image
          src="/assets/brandmark.svg"
          alt="WanderAI Logo"
          width={96}
          height={96}
          priority
        />
        <div className={styles.text}>
          <h1 className={styles.title}>You&apos;re on the waitlistz</h1>
          <p className={styles.description}>Not long now! We&apos;ll send an email as soon as you have access to a WanderAI account</p>
        </div>
        <Link href="/"><Button label="Back to home"/></Link>
      </div>
    </Section>
  )
}

export default ThankYou