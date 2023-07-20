import React, { useState } from 'react';

import styles from "./checkbox.module.css"

const Checkbox = ({label, checked, onChange}) => {
 
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" checked={checked} onChange={onChange} id={label}/>
      {label}
    </label>
  );
};

export default Checkbox;
