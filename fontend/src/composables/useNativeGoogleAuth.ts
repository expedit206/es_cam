import { ref } from "vue";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/Auth";
import apiClient from "../api/index";

export function useNativeGoogleAuth() {
  const isLoading = ref(false);
  const router = useRouter();
  const toast = useToast();
  const authStore = useAuthStore();

  // Initialiser Google Auth
  const initializeGoogleAuth = async () => {
    try {
      // Le plugin s'initialise automatiquement avec la config de capacitor.config.ts
      console.log("Google Auth initialisé");
    } catch (error) {
      console.error("Erreur initialisation Google Auth:", error);
    }
  };

  // Connexion avec Google
  const loginWithGoogle = async () => {
    try {
      isLoading.value = true;

      console.log("Début authentification Google native...");

      // 1. Lancer l'authentification native
      const result = await GoogleAuth.signIn();
      console.log("Résultat Google Auth:", result);

      // 2. Envoyer le token à ton backend Laravel
      await sendGoogleTokenToBackend(result);
    } catch (error:any) {
      console.error("Erreur authentification Google:", error);

      if (
        error.message.includes("canceled") ||
        error.message.includes("annulé")
      ) {
        toast.info("Connexion Google annulée");
      } else {
        toast.error("Erreur lors de la connexion Google");
      }
    } finally {
      isLoading.value = false;
    }
  };

  // Envoyer le token Google au backend
  const sendGoogleTokenToBackend = async (googleData:any) => {
    try {
      console.log("Envoi du token Google au backend...");

      const response = await apiClient.post("/auth/google/native", {
        token: googleData.authentication.accessToken,
        id_token: googleData.authentication.idToken,
        user: {
          id: googleData.id,
          email: googleData.email,
          name: googleData.name,
          photo: googleData.imageUrl,
        },
      });

      const { token, user } = response.data;

      // 3. Stocker les informations d'authentification
      authStore.token = token;
      authStore.user = user;
      localStorage.setItem("token", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("Connexion réussie !");
      router.push({ name: "home" });
    } catch (error : any) {
      console.error("Erreur envoi token backend:", error);
      const message =
        error.response?.data?.message || "Erreur lors de la connexion";
      toast.error(message);

      // Déconnexion Google en cas d'erreur
      try {
        await GoogleAuth.signOut();
      } catch (signOutError) {
        console.error("Erreur déconnexion Google:", signOutError);
      }
    }
  };

  // Déconnexion
  const logoutFromGoogle = async () => {
    try {
      await GoogleAuth.signOut();
      console.log("Déconnexion Google réussie");
    } catch (error) {
      console.error("Erreur déconnexion Google:", error);
    }
  };

  // Vérifier si déjà connecté
  const checkExistingGoogleAuth = async () => {
    try {
      const result = await GoogleAuth.refresh();
      console.log("Session Google existante:", result);
      return result;
    } catch (error) {
      console.log("Aucune session Google active");
      return null;
    }
  };

  return {
    isLoading,
    initializeGoogleAuth,
    loginWithGoogle,
    logoutFromGoogle,
    checkExistingGoogleAuth,
  };
}
  