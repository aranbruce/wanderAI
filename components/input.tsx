import { error } from "console";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showLabel?: boolean;
}

export default function Input({ label, showLabel, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      {showLabel && (
        <label className="text-sm font-medium leading-5" htmlFor={label}>
          {label}
        </label>
      )}
      <input
        className={`text-md flex w-full items-center justify-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-3 font-medium shadow-light outline-none transition placeholder:font-normal default:border-gray-200 placeholder-shown:border-gray-200 autofill:bg-white focus-visible:border-gray-300 focus-visible:ring-[3px] focus-visible:ring-green-400/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white`}
        id={label}
        name={label}
        aria-label={label}
        {...props}
      />
    </div>
  );
}
