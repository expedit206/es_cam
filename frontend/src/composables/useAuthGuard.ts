import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/Auth";
import { useToast } from "vue-toastification";

/**
 * Composable pour gérer l'accès aux fonctionnalités nécessitant une connexion.
 * Garantit une expérience utilisateur cohérente avec redirection et message explicatif.
 */
export function useAuthGuard() {
  const authStore = useAuthStore();
  const router = useRouter();
  const toast = useToast();

  const isAuthenticated = computed(() => !!authStore.user);

  /**
   * Vérifie si l'utilisateur est connecté.
   * Si non, affiche un message et redirige vers la page de connexion.
   * 
   * @param message Message à afficher si l'utilisateur n'est pas connecté
   * @returns true si l'utilisateur est connecté, false sinon
   */
  const checkAuth = (message: string = "Veuillez vous connecter pour accéder à cette fonctionnalité") => {
    if (!authStore.user) {
      toast.info(message, {
        timeout: 5000,
        closeOnClick: true,
        pauseOnHover: true,
      });

      // Rediriger vers login avec l'URL actuelle pour y revenir après connexion
      router.push({
        path: "/login",
        query: { redirect: router.currentRoute.value.fullPath }
      });
      
      return false;
    }
    return true;
  };

  return {
    isAuthenticated,
    checkAuth,
    user: computed(() => authStore.user),
  };
}
