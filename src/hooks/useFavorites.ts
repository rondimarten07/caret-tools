import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const FAV_KEY = "tools-hub:favorites";

export function useFavorites() {
  const [list, setList] = useLocalStorage<string[]>(FAV_KEY, []);

  const has = useCallback((slug: string) => list.includes(slug), [list]);

  const toggle = useCallback(
    (slug: string) => {
      setList((prev) =>
        prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      );
    },
    [setList]
  );

  return { list, has, toggle };
}
