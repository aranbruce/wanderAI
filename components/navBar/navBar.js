'use client'

import React, { useState, useEffect } from 'react'
import Button from "../button/button"
import Image from 'next/image'
import styles from "./navBar.module.css"

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
      <Image
        src="./logo.svg"
        alt="WanderAI Logo"
        width={200}
        height={48}
        priority
      />
      {hideButton ? "" : <Button label="Sign up"/>}
    </nav>
  )
}

export default NavBar