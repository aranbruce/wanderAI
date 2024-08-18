import { InputHTMLAttributes } from "react";
import styles from "./input.module.css";

interface InputProps {
  type: string;
  inputMode: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  required?: boolean;
}

const Input = ({
  type,
  inputMode,
  value,
  onChange,
  placeholder,
  label,
  required,
}: InputProps) => {
  return (
    <div className={styles.inputContainer}>
      {label && (
        <label className={styles.label} htmlFor={label}>
          {label}
        </label>
      )}
      <input
        className={styles.input}
        id={label}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={label}
        {...(required && { required })}
      />
    </div>
  );
};

export default Input;
