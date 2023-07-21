import React from 'react'

import styles from './loading.module.css'

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.pin}></div>
      <div class={styles.pulse}></div>
    </div>
  )
}

export default Loading