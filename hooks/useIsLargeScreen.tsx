import { useState, useEffect } from "react";

export default function useIsLargeScreen(minWidth: number) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsLargeScreen(window.innerWidth >= minWidth);
    }

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [minWidth]);

  return isLargeScreen;
}
