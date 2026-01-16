// src/utils/i18n/index.ts
import { ref } from "vue";
import { core } from "./core";
import { navigation } from "./navigation";
import { auth } from "./auth";
import { products } from "./products";
import { tokens } from "./tokens";
import { reventes } from "./reventes";
import { merchants } from "./merchants";
import { profile } from "./profile";
import { wallet } from "./wallet";
import { premium } from "./premium";
import { settings } from "./settings";
import { seo } from "./seo";
import { errors } from "./errors";
import { documentation } from "./documentation";
import { politiqueUse } from "./politique_utilisation";
import { confidentialite } from "./confidentialite";
import { market } from "./market";
import { parrainage } from "./parrainage";
import { infoparrainage } from "./infoparrainage";
import { jetonhistory } from "./jetonhistory";
import { messaging } from "./messaging";
import { resetPAssword } from "./resetPassword";
import { mesServices } from "./mesServices";

// Correction de l'interface pour autoriser les objets imbriqués
interface Translations {
  [key: string]: {
    [key: string]: string | Record<string, string>;
  };
}

const translations: Translations = {
  fr: {
    ...jetonhistory.fr,
    ...messaging.fr,
    ...core.fr,
    ...navigation.fr,
    ...documentation.fr,
    ...auth.fr,
    ...products.fr,
    ...tokens.fr,
    ...reventes.fr,
    ...merchants.fr,
    ...profile.fr,
    ...wallet.fr,
    ...premium.fr,
    ...settings.fr,
    ...seo.fr,
    ...errors.fr,
    ...politiqueUse.fr,
    ...confidentialite.fr,
    ...market.fr,
    ...parrainage.fr,
    ...infoparrainage.fr,
    ...resetPAssword.fr,
    ...mesServices.fr,

    pending_reventes: "reventes en attente",
    unread_messages: "messages non lus",
    new_parrainages: "nouveaux parrainages",
  },
  en: {
    new_parrainages: "new referrals",
    ...mesServices.en,

    ...resetPAssword.en,
    ...messaging.en,

    ...jetonhistory.en,
    ...parrainage.en,
    ...infoparrainage.en,
    ...market.en,

    ...confidentialite.en,

    ...politiqueUse.en,
    ...core.en,
    ...navigation.en,
    ...auth.en,
    ...products.en,
    ...documentation.en,
    ...tokens.en,
    ...reventes.en,
    ...merchants.en,
    ...profile.en,
    ...wallet.en,
    ...premium.en,
    ...settings.en,
    ...seo.en,
    ...errors.en,
  },
};

// src/utils/i18n/index.ts

// 🔹 langue par défaut = anglais
const currentLang  = ref<string>("en");

export const i18n = {
  setLanguage(lang: string): void {
    if (translations[lang]) {
      currentLang.value = lang;
      localStorage.setItem("preferred_language", lang);
      document.documentElement.lang = lang;
    }
  },

  t(key: string, params: Record<string, any> = {}): string {
    let translation = translations[currentLang.value]?.[key];

    if (typeof translation !== "string") {
      translation = key; // fallback anglais
    }

    Object.keys(params).forEach((param) => {
      translation = translation.replace(
        new RegExp(`{{\\s*${param}\\s*}}`, "g"),
        params[param]
      );
    });

    return translation;
  },

  get currentLanguage(): string {
    return currentLang.value;
  },

  init(): string {
    const savedLang = localStorage.getItem("preferred_language");
    const browserLang = navigator.language.split("-")[0];

    if (savedLang && translations[savedLang]) {
      currentLang.value = savedLang;
    } else if (translations[browserLang]) {
      currentLang.value = browserLang;
    } else {
      currentLang.value = "en";
    }

    document.documentElement.lang = currentLang.value;
    return currentLang.value;
  },
};

