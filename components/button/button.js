import React from 'react'
import Image from 'next/image'

import styles from "./button.module.css"

const Button = ({type, variant, imageSrc, label, onClick}) => {
  return (
    <button onClick={onClick} type={type}
    className={variant==="secondary" ? styles.buttonSecondary : styles.button}>
      {imageSrc && <Image src={imageSrc} alt="Icon" width={24} height={24} />}
      {label && <span className={styles.text}>{label}</span>}
    </button>
  )
}

export default Button