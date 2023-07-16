import React from 'react'

import styles from "./section.module.css"

const Section = ({children}) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  )
}

export default Section