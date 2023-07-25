import React from 'react'

import styles from "./section.module.css"

const Section = ({children, hero}) => {
  return (
    <section className={styles.section}>
      <div className={!hero ? styles.content : styles.contentHero}>{children}</div>
    </section>
  )
}

export default Section