import React, { useState } from 'react';

import styles from "./checkbox.module.css"

const Checkbox = ({label}) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <label className={styles.checkbox}>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      {label}
    </label>
  );
};

export default Checkbox;
