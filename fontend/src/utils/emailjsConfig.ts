// src/utils/emailjs.ts

/**
 * Utilitaire simple pour configurer et utiliser EmailJS
 */

// Configuration EmailJS
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // Ajoutez ceci
};

// Vérifie si EmailJS est chargé
const isEmailJSLoaded = (): boolean => {
  return typeof window !== "undefined" && "emailjs" in window;
};

// Initialise EmailJS - RETOURNE UNE PROMESSE
const initEmailJS = async (): Promise<boolean> => {
  if (!isEmailJSLoaded()) {
    console.warn("⚠️ EmailJS non chargé - Vérifiez le CDN dans index.html");
    return false;
  }

  if (!EMAILJS_CONFIG.publicKey) {
    console.warn("⚠️ Clé publique EmailJS non configurée");
    return false;
  }

  try {
    await (window as any).emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log("✅ EmailJS initialisé");
    return true;
  } catch (error) {
    console.error("❌ Erreur initialisation EmailJS:", error);
    return false;
  }
};

// Envoie un email avec un template spécifique
const sendEmail = async (
  templateId: string,
  templateParams: Record<string, any>
): Promise<{ success: boolean; error?: string }> => {
  // Initialiser EmailJS avant chaque envoi
  const initialized = await initEmailJS();
  if (!initialized) {
    return {
      success: false,
      error: "EmailJS non initialisé",
    };
  }

  if (!EMAILJS_CONFIG.serviceId || !templateId) {
    return {
      success: false,
      error: "Service ID ou Template ID non configuré",
    };
  }
console.log(EMAILJS_CONFIG.serviceId, templateId, templateParams);

  try {
    const result = await (window as any).emailjs.send(
      EMAILJS_CONFIG.serviceId,
      templateId,
      templateParams
    );

    console.log("✅ Email envoyé avec succès:", result);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Erreur envoi email:", error);

    // Message d'erreur plus détaillé
    let errorMessage = "Erreur lors de l'envoi de l'email";
    if (error.text) {
      errorMessage = error.text;
    } else if (error.status) {
      errorMessage = `Erreur ${error.status}: ${error.text || "Échec de l'envoi"}`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Templates prédéfinis
const TEMPLATES = {
  PASSWORD_RESET: "template_50rq1tp",
  VERIFICATION_PARRAINAGE: "template_4mjsqph", // Template pour vérification
  WELCOME: "welcome",
  NOTIFICATION: "notification",
  CONTACT: "contact",
};

// Export de l'utilitaire
export const emailjs = {
  init: initEmailJS,
  send: sendEmail,
  templates: TEMPLATES,
  isLoaded: isEmailJSLoaded,
  config: EMAILJS_CONFIG,
};

export default emailjs;
