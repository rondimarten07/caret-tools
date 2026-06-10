import { useCallback, useEffect, useState } from "react";

/**
 * Sync a piece of state to the URL hash so a tool's input can be
 * shared via copy-paste link. The state is stored compressed-ish
 * as Base64-encoded JSON in `location.hash` under a single key.
 *
 * Usage:
 *   const [text, setText] = useUrlState("text", "");
 *
 * Limitations:
 * - Only one hook per page (per key) — they share the hash.
 * - Don't use for huge payloads — URLs cap around 2-8KB.
 */
function readHash<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const h = window.location.hash.replace(/^#/, "");
  if (!h) return fallback;
  try {
    const params = new URLSearchParams(h);
    const raw = params.get(key);
    if (!raw) return fallback;
    return JSON.parse(decodeURIComponent(atob(raw))) as T;
  } catch {
    return fallback;
  }
}

function writeHash<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  try {
    params.set(key, btoa(encodeURIComponent(JSON.stringify(value))));
  } catch {
    return;
  }
  const next = `#${params.toString()}`;
  if (next !== window.location.hash) {
    history.replaceState(null, "", next);
  }
}

export function useUrlState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readHash(key, initial));

  useEffect(() => {
    writeHash(key, value);
  }, [key, value]);

  const shareUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  return [value, setValue, shareUrl] as const;
}
