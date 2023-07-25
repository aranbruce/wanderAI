'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from "../button/button"
import Image from 'next/image'
import styles from "./navigation.module.css"

const NavBar = ({hideButton}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <div className={styles.content}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="./logo.svg"
            alt="WanderAI Logo"
            width={200}
            height={48}
            priority
          />
        </Link>
        {hideButton ? "" : <Link href="/sign-up"><Button label="Sign up"/></Link>}
      </div>
    </nav>
  )
}

export default NavBar