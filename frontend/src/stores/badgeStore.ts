// src/stores/badgeStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "../api/index";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

export const useBadgeStore = defineStore("badge", () => {
  const router = useRouter();
  const toast = useToast();

  // États des badges
  const badgeCounts = ref({
    messages: 0,
    reventes: 0,
    parrainages: 0,
    total: 0,
  });

  const isLoading = ref(false);
  const lastUpdated = ref<Date | null>(null);

  // Getters
  const hasUnreadMessages = computed(() => badgeCounts.value.messages > 0);
  const hasPendingReventes = computed(() => badgeCounts.value.reventes > 0);
  const hasNewParrainages = computed(() => badgeCounts.value.parrainages > 0);
  const hasAnyNotification = computed(() => badgeCounts.value.total > 0);

  // Récupérer les compteurs de badges depuis l'API
  const fetchBadgeCounts = async () => {
    try {
      isLoading.value = true;
      const response = await apiClient.get("/badges/count");

      badgeCounts.value = {
        messages: response.data.data.messages || 0,
        reventes: response.data.data.reventes || 0,
        parrainages: response.data.data.parrainages || 0,
        total: response.data.data.total_unread || 0,
      };


      console.log(badgeCounts);
      console.log(response.data.data);
      
      lastUpdated.value = new Date();

      return badgeCounts.value;
    } catch (error: any) {
      if (error.response?.data?.message === "Unauthenticated.") {
        router.push("/login");
      } else {
        console.error("Erreur lors de la récupération des badges:", error);
        toast.error("Impossible de récupérer les notifications");
      }
      return badgeCounts.value;
    } finally {
      isLoading.value = false;
    }
  };

  // Marquer les notifications comme lues
  const markAsRead = async (
    type: "all" | "messages" | "reventes" | "parrainages" = "all"
  ) => {
    try {
      await apiClient.post("/badges/mark-read", { type });

      // Mettre à jour localement après marquage
      switch (type) {
        case "messages":
          badgeCounts.value.messages = 0;
          break;
        case "reventes":
          badgeCounts.value.reventes = 0;
          break;
        case "parrainages":
          badgeCounts.value.parrainages = 0;
          break;
        case "all":
          badgeCounts.value.messages = 0;
          badgeCounts.value.reventes = 0;
          badgeCounts.value.parrainages = 0;
          break;
      }

      badgeCounts.value.total =
        badgeCounts.value.messages +
        badgeCounts.value.reventes +
        badgeCounts.value.parrainages;

      lastUpdated.value = new Date();

      return true;
    } catch (error: any) {
      console.error("Erreur lors du marquage comme lu:", error);
      toast.error("Impossible de marquer comme lu");
      return false;
    }
  };

  // Synchroniser manuellement avec le backend
  const syncWithBackend = async () => {
    try {
      await apiClient.post("/badges/sync");
      await fetchBadgeCounts();
      toast.success("Badges synchronisés");
    } catch (error: any) {
      console.error("Erreur lors de la synchronisation:", error);
    }
  };

  // Incrémenter localement (pour une réponse rapide UI)
  const incrementLocalCount = (
    type: "messages" | "reventes" | "parrainages"
  ) => {
    badgeCounts.value[type] += 1;
    badgeCounts.value.total += 1;
  };

  // Décrémenter localement
  const decrementLocalCount = (
    type: "messages" | "reventes" | "parrainages"
  ) => {
    if (badgeCounts.value[type] > 0) {
      badgeCounts.value[type] -= 1;
      badgeCounts.value.total -= 1;
    }
  };

  // Réinitialiser tous les compteurs
  const resetAllCounts = () => {
    badgeCounts.value = {
      messages: 0,
      reventes: 0,
      parrainages: 0,
      total: 0,
    };
    lastUpdated.value = null;
  };



  return {
    // États
    badgeCounts,
    isLoading,
    lastUpdated,

    // Getters
    hasUnreadMessages,
    hasPendingReventes,
    hasNewParrainages,
    hasAnyNotification,

    // Actions
    fetchBadgeCounts,
    markAsRead,
    syncWithBackend,
    incrementLocalCount,
    decrementLocalCount,
    resetAllCounts,
  };
});
