import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import id from "./locales/id";

/**
 * i18n is intentionally scoped to the *shell* UI for now:
 *   header, sidebar, search, hero, common labels.
 * Per-tool strings can be migrated incrementally — each tool component
 * can `import { useTranslation } from "react-i18next"` and reference
 * `t("toolName.foo")` without changing the framework.
 */

export const SUPPORTED = [
  { id: "en", name: "English" },
  { id: "id", name: "Bahasa Indonesia" },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: SUPPORTED.map((s) => s.id),
    resources: {
      en: { translation: en },
      id: { translation: id },
    },
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "tools-hub:lang",
    },
  });

export default i18n;
