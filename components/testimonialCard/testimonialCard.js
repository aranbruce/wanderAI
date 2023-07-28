import React from 'react'

import styles from "./testimonialCard.module.css"
import Image from 'next/image'

const TestimonialCard = ({testimonial, author, imgSrc}) => {
  return (
    <div className={styles.card}>
      <Image src={imgSrc} alt="author of testimonial" width={56} height={56}/>
      <h4 className={styles.testimonial}>{testimonial}</h4>
      <p className={styles.author}>{author}</p>
    </div>
  )
}

export default TestimonialCard