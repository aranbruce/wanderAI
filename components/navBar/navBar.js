import React from 'react'

import Button from "../button/button"
import Image from 'next/image'

import styles from "./navBar.module.css"

const NavBar = ({hideButton}) => {
  return (
    <nav className={styles.nav}>
      <Image
              src="./logo.svg"
              alt="WanderAI Logo"
              width={200}
              height={48}
              priority
      />
      {hideButton ? "" : <Button>Sign up</Button>}
    </nav>
  )
}

export default NavBar