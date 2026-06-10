import { useCallback, useEffect, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";

const MAX_ENTRIES = 8;

/**
 * Per-tool history of recent inputs.
 * Auto-records (debounced) when value changes, deduplicates,
 * caps at MAX_ENTRIES, persists in localStorage.
 *
 * Usage:
 *   const { entries, restore } = useToolHistory("json-formatter", input, setInput);
 */
export function useToolHistory<T>(
  toolSlug: string,
  value: T,
  setValue: (v: T) => void,
  debounceMs = 1200
) {
  const key = `caret:history:${toolSlug}`;
  const [entries, setEntries] = useLocalStorage<T[]>(key, []);
  const timerRef = useRef<number | null>(null);

  // Record the current value into history after debounce
  useEffect(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    if (value === undefined || value === null) return;
    if (typeof value === "string" && !value.trim()) return;
    timerRef.current = window.setTimeout(() => {
      setEntries((prev) => {
        const serialized = JSON.stringify(value);
        const filtered = prev.filter((e) => JSON.stringify(e) !== serialized);
        return [value, ...filtered].slice(0, MAX_ENTRIES);
      });
    }, debounceMs);
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [value, setEntries, debounceMs]);

  const restore = useCallback((entry: T) => setValue(entry), [setValue]);
  const clear = useCallback(() => setEntries([]), [setEntries]);

  return { entries, restore, clear };
}
