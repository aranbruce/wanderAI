import styles from "./input.module.css"

const Input = ({ type, value, onChange, placeholder, label, required }) => {
  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.label} htmlFor={label}>{label}</label>}
      <input className={styles.input} id={label} type={type} value={value} onChange={onChange} placeholder={placeholder} { ...(required && { required }) }/>
    </div>
  );
};

export default Input;