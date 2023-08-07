import React from 'react'

import { motion } from "framer-motion"

import styles from "./backdrop.module.css"

const Backdrop = ({children, onClick}) => {
  return (
    <motion.div
      className={styles.backdrop}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop