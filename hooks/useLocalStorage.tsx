import { useState, useEffect } from "react";

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item
        ? key === "preferences"
          ? JSON.parse(item)
          : item
        : defaultValue;
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        key,
        key === "preferences" ? JSON.stringify(value) : value,
      );
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
