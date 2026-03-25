import {
  init,
  addMessages,
  getLocaleFromNavigator,
  locale,
  locales,
  _ as t,
} from "svelte-i18n";

interface LocaleDictionary {
  [key: string]: string | null | LocaleDictionary | Array<string | LocaleDictionary>;
}
type LocaleMessages = {
  en?: LocaleDictionary;
  de?: LocaleDictionary;
};

let initialized = false;

function normalizeLocale(localeCode: string | null | undefined): string {
  return (localeCode || "en").split("-")[0].toLowerCase();
}

export function initI18n(initialMessages: LocaleMessages = {}) {
  if (initialized) return;

  addMessages("en", initialMessages.en || {});
  addMessages("de", initialMessages.de || {});

  const savedLocale =
    typeof window !== "undefined" ? localStorage.getItem("aico-landing-locale") : null;
  const browserLocale = getLocaleFromNavigator();
  const initialLocale = normalizeLocale(savedLocale || browserLocale || "en");

  init({
    fallbackLocale: initialLocale === "de" ? "de" : "en",
    initialLocale: initialLocale === "de" ? "de" : "en",
  });

  initialized = true;
}

export function setLocale(localeCode: string) {
  const normalized = normalizeLocale(localeCode) === "de" ? "de" : "en";
  locale.set(normalized);
  if (typeof window !== "undefined") {
    localStorage.setItem("aico-landing-locale", normalized);
  }
}

export { locale, locales, t };
