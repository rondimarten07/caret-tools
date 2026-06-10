import { useEffect } from "react";

const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;

export function Analytics() {
  useEffect(() => {
    if (!DOMAIN) return;
    if (document.querySelector('script[data-plausible="1"]')) return;
    const s = document.createElement("script");
    s.defer = true;
    s.dataset.domain = DOMAIN;
    s.dataset.plausible = "1";
    s.src = "https://plausible.io/js/script.js";
    document.head.appendChild(s);
  }, []);
  return null;
}
