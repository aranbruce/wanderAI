// debounce.ts
export default function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number,
) {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
