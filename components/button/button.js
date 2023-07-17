import React from 'react'
import Image from 'next/image'

import styles from "./button.module.css"

const Button = ({type, imageSrc, label, onClick}) => {
  return (
    <button onClick={onClick} 
    className={type==="secondary" ? styles.buttonSecondary : styles.button}>
      {imageSrc && <Image src={imageSrc} alt="Icon" width={24} height={24} />}
      {label && <span className={styles.text}>{label}</span>}
    </button>
  )
}

export default Button