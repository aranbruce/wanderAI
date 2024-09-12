"use client";

import { useState, useEffect, useRef } from "react";

import debounce from "@/utils/debounce";

import SearchIcon from "@/images/icons/search-icon";
import CloseIcon from "@/images/icons/close-icon";

interface SearchInputProps {
  label: string;
  showLabel?: boolean;
  destinationValue: Destination | null;
  setDestinationValue: (value: Destination) => void;
  required?: boolean;
  error?: string;
}

export type Destination = {
  name: string;
  fullName: string;
  mapboxId: string;
  address: string;
};

export default function SearchInput({
  label,
  showLabel,
  destinationValue,
  setDestinationValue,
  required,
  error,
}: SearchInputProps) {
  const [selectedValue, setSelectedValue] = useState<string>(
    destinationValue?.fullName || "",
  );
  const [queryValue, setQueryValue] = useState<string>(
    destinationValue?.fullName || "",
  );
  const [suggestions, setSuggestions] = useState<Destination[]>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, setIsSuggestionSelected] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionContainerRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const inputId = `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

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
    setSelectedValue(suggestion.fullName);

    setQueryValue(suggestion.fullName);
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

  function handleClearInput() {
    setQueryValue("");
    setSelectedValue("");
    setSuggestions([]);
    setShowSuggestions(false);
    setDestinationValue(null);
    inputRef.current?.focus();
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-2" ref={containerRef}>
        {showLabel && (
          <label className="text-sm font-medium leading-5" htmlFor={inputId}>
            {label}
          </label>
        )}
        <div className="relative">
          <div className="relative">
            <div className="absolute left-3 top-[0.9rem] z-10 text-gray-800">
              <SearchIcon height="20" width="20" />
            </div>
            <div className="relative flex w-full flex-col gap-1">
              <input
                id={inputId}
                type="text"
                placeholder="Search for a destination"
                ref={inputRef}
                value={queryValue}
                onChange={(event) => handleQueryChange(event.target.value)}
                onFocus={() => handleFocus(queryValue)}
                onBlur={() => handleBlur()}
                onKeyDown={(e) => handleInputKeyDown(e)}
                autoComplete="off"
                className={`${error ? "border-red-300" : "border-gray-200"} text-md flex w-full items-center justify-center gap-1 rounded-full border bg-white py-3 pl-9 pr-10 font-medium outline-none transition placeholder:font-normal autofill:bg-white focus-visible:ring-[3px] focus-visible:ring-green-400/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white`}
                name={label}
                aria-label={label}
                required={required}
              />
              {queryValue && (
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="absolute right-2 top-3 z-10 rounded-full bg-white p-0.5 text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-400/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
                >
                  <CloseIcon height="24" width="24" />
                </button>
              )}
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
                    className="line-clamp-1 w-full cursor-pointer rounded-lg px-2 py-1 leading-8 outline-none hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:ring-2 focus-visible:ring-green-400/40"
                    onMouseDown={() => handleOptionClick(suggestion)}
                    onKeyDown={(e) =>
                      handleSuggestionsKeyDown(e, suggestion, index)
                    }
                    tabIndex={-1}
                  >
                    {suggestion.fullName}
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
