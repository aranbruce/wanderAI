import styles from "./input.module.css"

const Input = ({ type, inputmode, value, onChange, placeholder, label, required }) => {
  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.label} htmlFor={label}>{label}</label>}
      <input className={styles.input} id={label} type={type} inputmode={inputmode} value={value} onChange={onChange} placeholder={placeholder} name={label} { ...(required && { required }) }/>
    </div>
  );
};

export default Input;