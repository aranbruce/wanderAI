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
        <label className="text-sm font-medium leading-5" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="relative flex w-full flex-col gap-1">
        <input
          className={`${error ? "border-red-300" : "border-gray-200"} text-md flex w-full items-center justify-center gap-1 rounded-full border bg-white px-4 py-3 font-medium outline-none transition placeholder:font-normal autofill:bg-white focus-visible:ring-[3px] focus-visible:ring-green-400/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white`}
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
            className="absolute left-2 top-full mt-1 text-xs text-red-300 transition"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
