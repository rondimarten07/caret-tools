import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Persists which sidebar category groups are expanded.
 * Also persists the rail-collapsed state (icon-only sidebar).
 */

const EXPANDED_KEY = "caret:sidebar:expanded";
const RAIL_KEY = "caret:sidebar:rail";

export function useSidebarExpanded(initiallyOpen: string[] = []) {
  const [list, setList] = useLocalStorage<string[]>(EXPANDED_KEY, initiallyOpen);
  const isOpen = useCallback((id: string) => list.includes(id), [list]);
  const toggle = useCallback(
    (id: string) =>
      setList((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    [setList]
  );
  return { isOpen, toggle };
}

export function useRailCollapsed() {
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(RAIL_KEY, false);
  return { collapsed, setCollapsed, toggle: () => setCollapsed((v) => !v) };
}
