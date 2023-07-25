import styles from "./input.module.css"

const Input = ({ type, inputMode, value, onChange, placeholder, label, required }) => {
  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.label} htmlFor={label}>{label}</label>}
      <input className={styles.input} id={label} type={type} inputMode={inputMode} value={value} onChange={onChange} placeholder={placeholder} name={label} { ...(required && { required }) }/>
    </div>
  );
};

export default Input;