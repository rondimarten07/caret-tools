import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const RECENT_KEY = "tools-hub:recent";
const MAX = 8;

export function useRecent() {
  const [list, setList] = useLocalStorage<string[]>(RECENT_KEY, []);

  const push = useCallback(
    (slug: string) => {
      setList((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX));
    },
    [setList]
  );

  const clear = useCallback(() => setList([]), [setList]);

  return { list, push, clear };
}
