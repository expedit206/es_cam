// stores/revente.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import apiClient from "../api/index";
import { Revente } from "../components/types/index";

export const useReventeStore = defineStore("revente", () => {
  const router = useRouter();
  const toast = useToast();

  // États
  const reventes = ref<{
    sent_reventes: Revente[];
    received_reventes: Revente[];
  }>({
    sent_reventes: [],
    received_reventes: [],
  });

  const isLoading = ref(false);
  const activeTab = ref<"received" | "sent">("received");
  const showExplanation = ref(false);

  // Computed properties
  const receivedReventesCount = computed(
    () => reventes.value.received_reventes?.length || 0
  );
  const sentReventesCount = computed(
    () => reventes.value.sent_reventes?.length || 0
  );

  const currentReventes = computed(() =>
    activeTab.value === "received"
      ? reventes.value.received_reventes
      : reventes.value.sent_reventes
  );

  const hasReceivedReventes = computed(() => receivedReventesCount.value > 0);
  const hasSentReventes = computed(() => sentReventesCount.value > 0);

  // Méthodes utilitaires pour le localStorage
  const saveReventesToLocalStorage = (reventes: any[]) => {
    localStorage.setItem("pending_reventes", JSON.stringify(reventes));
  };

  const getPendingReventesFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("pending_reventes") || "[]");
  };

  // Actions
  const fetchReventes = async () => {
    isLoading.value = true;
    try {
      const response = await apiClient.get("/reventes");
      reventes.value = response.data;

      // Synchroniser avec le localStorage
      const pendingReventes = getPendingReventesFromLocalStorage();
      if (pendingReventes.length > 0) {
        const sentProduitIds = new Set(
          reventes.value.sent_reventes.map((c) => c.produit_id)
        );
        const updatedPending = pendingReventes.filter(
          (item: any) => !sentProduitIds.has(item.produit_id)
        );

        if (updatedPending.length !== pendingReventes.length) {
          saveReventesToLocalStorage(updatedPending);
        }
      }
    } catch (error: any) {
      toast.error("Erreur lors du chargement des reventes");
      if (error.response?.data?.message == "Unauthenticated.") {
        router.push("/login");
      }
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateReventeStatus = async (reventeId: number, statut: string) => {
    try {
      const response = await apiClient.put(
        `/reventes/${reventeId}/updateStatus`,
        { statut }
      );
      toast.success(response.data.message);
      await fetchReventes(); // Recharger les données
    } catch (error: any) {
      toast.error(
        `Erreur lors de la mise à jour: ${error.response?.data.message}`
      );
      throw error;
    }
  };

  const viewProduit = (produitId: string) => {
    router.push({ path: `/produits/${produitId}` });
  };

  const setActiveTab = (tab: "received" | "sent") => {
    activeTab.value = tab;
  };

  const toggleExplanation = () => {
    showExplanation.value = !showExplanation.value;
  };

  // Méthodes pour les statuts
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "valider":
        return "bg-[var(--espace-vert)] text-white border-green-200";
      case "en_attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "refuser":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case "valider":
        return "Validé";
      case "en_attente":
        return "En attente";
      case "refuser":
        return "Rejeté";
      default:
        return statut;
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "valider":
        return "fas fa-check-circle";
      case "en_attente":
        return "fas fa-clock";
      case "refuser":
        return "fas fa-times-circle";
      default:
        return "fas fa-info-circle";
    }
  };

  // Méthodes pour les textes (peuvent être adaptées pour i18n)
  const getEmptyStateMessage = () => {
    if (activeTab.value === "received") {
      return {
        title: "Aucune demande reçue",
        description:
          "Les demandes de revente que vous recevez apparaîtront ici.",
        action: "Parcourir les produits",
        icon: "fas fa-inbox",
      };
    } else {
      return {
        title: "Aucune demande envoyée",
        description:
          "Les demandes de revente que vous envoyez apparaîtront ici.",
        action: "Proposer une revente",
        icon: "fas fa-paper-plane",
      };
    }
  };

  // Initialisation
  const initializeReventes = async () => {
    await fetchReventes();
  };

  return {
    // États
    reventes,
    isLoading,
    activeTab,
    showExplanation,

    // Computed
    receivedReventesCount,
    sentReventesCount,
    currentReventes,
    hasReceivedReventes,
    hasSentReventes,

    // Actions
    fetchReventes,
    updateReventeStatus,
    viewProduit,
    setActiveTab,
    toggleExplanation,
    getStatusColor,
    getStatusText,
    getStatusIcon,
    getEmptyStateMessage,
    initializeReventes,
  };
});
