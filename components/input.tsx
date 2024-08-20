import { InputHTMLAttributes } from "react";

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
    <div className="flex w-full flex-col items-start gap-2">
      {label && (
        <label className="text-sm font-medium leading-5" htmlFor={label}>
          {label}
        </label>
      )}
      <input
        className="flex w-full items-center justify-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-3 font-normal outline-none transition focus-visible:border-gray-300 focus-visible:ring-[3px] focus-visible:ring-green-400/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
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
