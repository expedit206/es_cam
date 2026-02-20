// src/utils/urlHelper.ts

/**
 * Utilitaire pour gérer les URLs de l'application
 * Utilise la variable d'environnement BASE_URL ou détermine l'URL automatiquement
 */

class UrlHelper {
  private baseUrl: string;
  private isProduction: boolean;

  constructor() {
    // Priorité à la variable d'environnement, sinon détection automatique
    this.baseUrl = import.meta.env.VITE_BASE_URL || this.determineBaseUrl();
    this.isProduction = this.baseUrl.includes("api.espacecameroun.com");
  }

  /**
   * Détermine l'URL de base automatiquement selon l'environnement
   */
  private determineBaseUrl(): string {
    const host = window.location.hostname;

    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8000";
    }

   
    // Production par défaut
    return "https://api.espacecameroun.com";
  }

  /**
   * Retourne l'URL de base de l'API
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Construit une URL complète pour un endpoint spécifique
   */
  public buildUrl(endpoint: string): string {
    // Supprime les slashs doubles potentiels
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  /**
   * URLs communes de l'application
   */
  public readonly endpoints = {
    // Auth
    auth: {
      login: () => this.buildUrl("login"),
      register: () => this.buildUrl("register"),
      logout: () => this.buildUrl("logout"),
      google: () => this.buildUrl("auth/google"),
      googleCallback: () => this.buildUrl("google/callback"),
      forgotPassword: () => this.buildUrl("forgot-password"),
      resetPassword: () => this.buildUrl("reset-password"),
    },

    // User
    user: {
      profile: () => this.buildUrl("api/user/profile"),
      updateProfile: () => this.buildUrl("api/user/profile"),
      changePassword: () => this.buildUrl("api/user/change-password"),
    },

    // Products
    products: {
      list: () => this.buildUrl("api/products"),
      create: () => this.buildUrl("api/products"),
      show: (id: string | number) => this.buildUrl(`api/products/${id}`),
      update: (id: string | number) => this.buildUrl(`api/products/${id}`),
      delete: (id: string | number) => this.buildUrl(`api/products/${id}`),
      search: () => this.buildUrl("api/products/search"),
    },

    // Messages
    messages: {
      conversations: () => this.buildUrl("api/messages/conversations"),
      conversation: (userId: string | number) =>
        this.buildUrl(`api/messages/conversations/${userId}`),
      send: () => this.buildUrl("api/messages/send"),
      markAsRead: (messageId: string | number) =>
        this.buildUrl(`api/messages/${messageId}/read`),
    },

    // Reventes
    reventes: {
      list: () => this.buildUrl("api/reventes"),
      create: () => this.buildUrl("api/reventes"),
      show: (id: string | number) => this.buildUrl(`api/reventes/${id}`),
      update: (id: string | number) =>
        this.buildUrl(`api/reventes/${id}`),
      respond: (id: string | number) =>
        this.buildUrl(`api/reventes/${id}/respond`),
    },

    // Storage
    storage: {
      url: (path: string) => {
        const cleanPath = path.startsWith("/") ? path.slice(1) : path;
        return `${this.baseUrl}/storage/${cleanPath}`;
      },
    },

    // Parrainage
    parrainage: {
      team: () => this.buildUrl("api/parrainage/team"),
      stats: () => this.buildUrl("api/parrainage/stats"),
    },
  };

  /**
   * Vérifie si on est en environnement de production
   */
  public isProd(): boolean {
    return this.isProduction;
  }

  /**
   * Vérifie si on est en environnement de développement
   */
  public isDev(): boolean {
    return !this.isProduction;
  }

  /**
   * Retourne l'environnement actuel
   */
  public getEnvironment(): "development" | "staging" | "production" {
    if (this.baseUrl.includes("localhost")) return "development";
    return "production";
  }

  /**
   * Méthode statique pour un accès rapide
   */
  public static getInstance(): UrlHelper {
    if (!(window as any).__urlHelperInstance) {
      (window as any).__urlHelperInstance = new UrlHelper();
    }
    return (window as any).__urlHelperInstance;
  }
}

// Instance singleton exportée
export const urlHelper = UrlHelper.getInstance();

// Export par défaut pour une utilisation facile
export default urlHelper;
