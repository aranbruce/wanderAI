import styles from "./checkbox.module.css";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <label className={styles.checkbox}>
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={label}
      />
      {label}
    </label>
  );
};

export default Checkbox;
