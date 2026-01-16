import { defineStore } from "pinia";
import apiClient from "../api/index";
import { User } from "../components/types/index";
import { useRouter } from "vue-router";

const router = useRouter();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // Connexion classique (existant, inchangé)
    async login(credentials: { login: string; mot_de_passe: string }) {
      const response = await apiClient.post("/login", credentials);
      this.user = response.data.user;
      this.token = response.data.token;
      localStorage.setItem("token", this.token ?? "");
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${this.token}`;
    },


    // Inscription (existant, inchangé)
    async register(data: {
      nom: string;
      telephone: string;
      email?: string | null;
      ville?: string | null;
      mot_de_passe: string;
      parrain_code?: string;
    }) {
      const response = await apiClient.post("/register", data);
      this.user = response.data.user;
      this.token = response.data.token;
      localStorage.setItem("token", this.token ?? "");
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${this.token}`;
    },

    // Vérifier l'authentification (existant, inchangé)
    async checkAuth() {
      if (!this.token) return false;
      try {
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${this.token}`;
        const response = await apiClient.get("/user");
        console.log(response.data );
        
        this.user = response.data.user;
        return true;
      } catch (error) {

        console.error("Utilisateur non authentifié:", error);
        // router.push("/login");
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
        return false;
      }
    },

    // Déconnexion (existant, inchangé)
    async logout() {
      try {
        router.push("/login");
        if (this.token) {
          await apiClient.post("/logout");
        }
      } catch {
        // Ignorer si token invalide ou expiré
      }
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
      const keysToRemove = [
        "pending_reventes",
        "pending_orders",
        "cart",
        "token",
        "espace_referral_code",

        "unread_messages",
        "viewedProducts",
      ];
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    },
  },
});
