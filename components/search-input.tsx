"use client";

import debounce from "@/utils/debounce";
import { useState, useEffect, useRef } from "react";

interface SearchInputProps {
  label: string;
  showLabel?: boolean;
  destinationValue: Destination | null;
  setDestinationValue: (value: Destination) => void;
  required?: boolean;
}

export type Destination = {
  place: string;
  placeId: string;
  text: string;
};

export default function SearchInput({
  label,
  showLabel,
  destinationValue,
  setDestinationValue,
  required,
}: SearchInputProps) {
  const [selectedValue, setSelectedValue] = useState<string>(
    destinationValue?.text || "",
  );
  const [queryValue, setQueryValue] = useState<string>(
    destinationValue?.text || "",
  );
  const [suggestions, setSuggestions] = useState<Destination[]>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, setIsSuggestionSelected] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionContainerRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setQueryValue(selectedValue || "");
  }, [selectedValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setQueryValue(selectedValue || "");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedValue]);

  async function searchForDestinations(input: string) {
    const response = await fetch(
      `/api/places-autocomplete?placeString=${input}`,
    );
    const data = await response.json();
    console.log("data: ", data);
    if (data.length === 0) {
      setSuggestions([]);
      return;
    } else {
      setSuggestions(data);
    }
  }

  const debouncedSearchForDestinations = debounce(searchForDestinations, 500);

  function handleQueryChange(value: string) {
    if (value === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      setQueryValue("");
      return;
    }
    setIsSuggestionSelected(false);
    setQueryValue(value);
    setShowSuggestions(true);
    debouncedSearchForDestinations(value);
  }

  function handleOptionClick(suggestion: Destination) {
    setDestinationValue(suggestion);
    setSelectedValue(suggestion.text);

    setQueryValue(suggestion.text);
    setIsSuggestionSelected(true);
    setShowSuggestions(false);

    if (inputRef.current) {
      inputRef.current.blur();
    }
  }

  function handleFocus(queryValue: string) {
    setQueryValue(queryValue);
    if (queryValue.length > 0) {
      setShowSuggestions(true);
      console.log("queryValue: ", queryValue);
      console.log("suggestions: ", suggestions);
      if (suggestions?.length === 0 || !suggestions) {
        console.log("searching for destinations...");
        searchForDestinations(queryValue);
      }
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (
        inputRef.current &&
        suggestionContainerRef.current &&
        (inputRef.current.contains(activeElement) ||
          suggestionContainerRef.current.contains(activeElement))
      ) {
        return;
      }
      setShowSuggestions(false);
    }, 0);
  };

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions?.length > 0) {
        suggestionRefs.current[0]?.focus();
      }
    }
  }

  function handleSuggestionsKeyDown(
    e: React.KeyboardEvent<HTMLDivElement>,
    suggestion: Destination,
    index: number,
  ) {
    if (e.key === "Enter") {
      handleOptionClick(suggestion);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) {
        inputRef.current?.focus();
      } else {
        suggestionRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (index < suggestions.length - 1) {
        suggestionRefs.current[index + 1]?.focus();
      }
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-2" ref={containerRef}>
        {showLabel && (
          <label className="text-sm font-medium leading-5" htmlFor={label}>
            {label}
          </label>
        )}
        <div className="relative">
          <div
            className={`text-md relative flex h-12 w-full flex-col gap-2 rounded-full border border-gray-200 bg-white font-medium shadow-light outline-none transition default:border-gray-200 placeholder-shown:border-gray-200 autofill:bg-white focus-within:border-gray-300 focus-within:outline-none focus-within:ring-[3px] focus-within:ring-green-400/40 focus-within:ring-offset-1 focus-within:ring-offset-white`}
          >
            <div className="absolute left-2 top-2.5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.3849 15.4457C11.7346 17.5684 7.8552 17.4013 5.39842 14.9445C2.76238 12.3085 2.76238 8.03464 5.39842 5.3986C8.03445 2.76256 12.3083 2.76256 14.9444 5.3986C17.4011 7.85538 17.5682 11.7348 15.4456 14.3851L20.6012 19.5407C20.8941 19.8336 20.8941 20.3085 20.6012 20.6014C20.3083 20.8943 19.8334 20.8943 19.5405 20.6014L14.3849 15.4457ZM6.45908 13.8839C4.40882 11.8336 4.40882 8.50951 6.45908 6.45926C8.50933 4.40901 11.8334 4.40901 13.8837 6.45926C15.9324 8.50801 15.9339 11.8287 13.8882 13.8794C13.8867 13.8809 13.8852 13.8823 13.8837 13.8839C13.8822 13.8854 13.8807 13.8869 13.8792 13.8884C11.8286 15.9341 8.50783 15.9326 6.45908 13.8839Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for a destination"
              ref={inputRef}
              value={queryValue}
              onChange={(event) => handleQueryChange(event.target.value)}
              onFocus={() => handleFocus(queryValue)}
              onBlur={() => handleBlur()}
              onKeyDown={(e) => handleInputKeyDown(e)}
              autoComplete="off"
              className="h-full w-full rounded-full bg-none py-3 pl-9 pr-4 placeholder:font-normal focus:outline-none"
              id={label}
              name={label}
              aria-label={label}
              required={required}
            />
          </div>
          {showSuggestions && (
            <div
              className="absolute z-50 mt-2 flex w-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-light"
              ref={suggestionContainerRef}
            >
              {suggestions?.length > 0 ? (
                suggestions?.map((suggestion, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      suggestionRefs.current[index] = el;
                    }}
                    className="w-full cursor-pointer rounded-lg p-2 outline-none hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-400/40"
                    onMouseDown={() => handleOptionClick(suggestion)}
                    onKeyDown={(e) =>
                      handleSuggestionsKeyDown(e, suggestion, index)
                    }
                    tabIndex={-1}
                  >
                    {suggestion.text}
                  </div>
                ))
              ) : (
                <p className="p-2 text-sm text-gray-800">
                  No suggestions found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
