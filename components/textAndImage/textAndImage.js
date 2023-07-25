import React from 'react'

import Image from 'next/image'

import styles from "./textAndImage.module.css"

const TextAndImage = ({title, description, imgSrc, imgAlt, reverse}) => {
  return (
    <div className={!reverse ? styles.content : styles.contentReverse}>
      <div className={styles.image}>
        <Image src={imgSrc} alt={imgAlt} fill={true}/>
      </div>
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}

export default TextAndImage