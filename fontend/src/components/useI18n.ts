// src/composables/useI18n.ts
import { ref, computed, ComputedRef } from "vue";
import { i18n } from "../utils/language";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

interface UseI18nReturn {
  t: (key: string, params?: Record<string, any>) => string;
  currentLanguage: ComputedRef<string>;
  setLanguage: (lang: string) => void;
  availableLanguages: LanguageOption[];
}

export function useI18n(): UseI18nReturn {
  // 🔹 langue par défaut = anglais
  const currentLang = ref<string>(i18n.init() || "en");

  /**
   * Traduction avec fallback automatique
   * - si FR → traduction
   * - si EN → retourne directement le texte (key)
   */
  const t = (key: string, params: Record<string, any> = {}): string => {
    return i18n.t(key, params);
  };

  const setLanguage = (lang: string): void => {
    i18n.setLanguage(lang);
    currentLang.value = lang;
  };

  const availableLanguages: LanguageOption[] = [
    { code: "en", name: "English", flag: "🇬🇧", nativeName: "English" },
    { code: "fr", name: "Français", flag: "🇫🇷", nativeName: "Français" },
  ];

  return {
    t,
    currentLanguage: computed(() => currentLang.value),
    setLanguage,
    availableLanguages,
  };
}
