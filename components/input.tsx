import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showLabel?: boolean;
  error?: string;
}

export default function Input({
  label,
  showLabel,
  error,
  ...props
}: InputProps) {
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex w-full flex-col items-start gap-2">
      {showLabel && (
        <label className="text-sm leading-5 font-medium" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="relative flex w-full flex-col gap-1">
        <input
          className={`${error ? "border-red-300" : "border-gray-200"} text-md shadow-light flex w-full items-center justify-center gap-1 rounded-full border bg-white px-4 py-3 font-medium outline-hidden transition placeholder:font-normal autofill:bg-white focus-visible:ring-[3px] focus-visible:ring-offset-1 focus-visible:ring-offset-white`}
          id={inputId}
          name={label}
          aria-label={label}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="absolute top-full left-2 mt-1 text-xs text-red-300 transition"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
