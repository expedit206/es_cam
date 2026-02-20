import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { urlHelper } from "../utils/urlHelper"; // Adjust the path according to your project structure

// Variable d'environnement (fallback)
const VITE_API_URL = import.meta.env.VITE_API_URL || "";

// Définir le baseURL de manière dynamique en utilisant urlHelper
const getBaseUrl = () => {
  // 1) Si on est dans une application native Capacitor -> utiliser la variable d'env ou prod
  const isNative =
    typeof Capacitor !== "undefined" &&
    typeof Capacitor.getPlatform === "function" &&
    Capacitor.getPlatform() !== "web";

  if (isNative) {
    // Pour builds natifs : utiliser la config fournie (VITE_API_URL) ou l'URL de prod via urlHelper
    return  urlHelper.getBaseUrl();
  }

  // 2) Pour le web : utiliser directement urlHelper qui gère déjà la détection d'environnement
  return urlHelper.getBaseUrl();
};

// Configuration axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withXSRFToken = true;

export const apiClient = axios.create({
  withCredentials: true,
  baseURL: getBaseUrl(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Optionnel : Ajouter des intercepteurs pour le logging en dev
apiClient.interceptors.request.use(
  (config) => {
    if (urlHelper.isDev()) {
      console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    if (urlHelper.isDev()) {
      console.error("❌ API Request Error:", error);
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (urlHelper.isDev()) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (urlHelper.isDev()) {
      console.error("❌ API Response Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
