"use client";

import { useRef, useEffect, useState } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  showLabel?: boolean;
  error?: string;
}

export default function Textarea({
  label,
  showLabel,
  error,
  placeholder,
  onChange,
  onKeyDown,
  required,
  ...props
}: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    console.log("value: ", value);
    if (textareaRef.current) {
      console.log(textareaRef.current.style.height);
      textareaRef.current.style.height = "auto";
      let lineHeight = parseFloat(
        getComputedStyle(textareaRef.current).lineHeight,
      );
      if (isNaN(lineHeight)) {
        // Fallback value when lineHeight is "normal"
        lineHeight =
          parseFloat(getComputedStyle(textareaRef.current).fontSize) * 1.1;
      }
      const maxHeight = lineHeight * 5;
      console.log("scrollHeight: ", textareaRef.current.scrollHeight);
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, maxHeight) + "px";
    }
  }, [value]);
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex w-full flex-col items-start gap-2">
      {showLabel && (
        <label className="text-sm font-medium leading-5" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="relative flex w-full flex-col gap-1">
        <textarea
          ref={textareaRef}
          id={inputId}
          name={label}
          className={`${error ? "border-red-300" : "border-gray-200"} flex min-h-12 w-full resize-none items-center justify-center gap-1 rounded-3xl border bg-white px-4 py-3 font-medium outline-none transition placeholder:font-normal autofill:bg-white focus-visible:ring-[3px] focus-visible:ring-green-400/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white`}
          rows={1}
          inputMode={"text"}
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyDown={onKeyDown}
          aria-label={label}
          required={required}
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
