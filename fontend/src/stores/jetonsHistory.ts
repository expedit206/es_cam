// stores/transactionHistory.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import apiClient from "../api/index";
import { useAuthStore } from "../stores/Auth";

export interface Transaction {
  id: number;
  type: "marketplace" | "platform";
  statut: "complete" | "pending" | "failed";
  montant_total: number;
  prix_unitaire: number;
  nombre_jetons: number;
  montant_net_vendeur?: number;
  commission_plateforme?: number;
  notchpay_reference: string;
  acheteur_id: number;
  vendeur_id?: number;
  acheteur?: any;
  vendeur?: any;
  created_at: string;
  updated_at: string;
  checkingStatus?: boolean;
}

export const useTransactionHistoryStore = defineStore(
  "transactionHistory",
  () => {
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();
    const authStore = useAuthStore();

    // États
    const transactions = ref<Transaction[]>([]);
    const isLoading = ref(false);
    const activeTypeFilter = ref("all");
    const activeStatusFilter = ref("all");
    const activeRoleFilter = ref("all");
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    // Computed properties
    const user = computed(() => authStore.user);

    const typeFilters = computed(() => [
      { label: "Tous", value: "all" },
      { label: "Marketplace", value: "marketplace" },
      { label: "Plateforme", value: "platform" },
    ]);

    const statusFilters = computed(() => [
      { label: "Tous", value: "all" },
      { label: "Confirmées", value: "complete" },
      { label: "En attente", value: "pending" },
      { label: "Échouées", value: "failed" },
    ]);

    const roleFilters = computed(() => [
      { label: "Tous", value: "all" },
      { label: "En tant qu'acheteur", value: "buyer" },
      { label: "En tant que vendeur", value: "seller" },
    ]);

    // Transactions filtrées et paginées
    const filteredTransactions = computed(() => {
      let filtered = transactions.value;

      // Filtre par type
      if (activeTypeFilter.value !== "all") {
        filtered = filtered.filter((t) => t.type === activeTypeFilter.value);
      }

      // Filtre par statut
      if (activeStatusFilter.value !== "all") {
        filtered = filtered.filter(
          (t) => t.statut === activeStatusFilter.value
        );
      }

      // Filtre par rôle
      if (activeRoleFilter.value !== "all") {
        if (activeRoleFilter.value === "buyer") {
          filtered = filtered.filter((t) => isAcheteur(t));
        } else if (activeRoleFilter.value === "seller") {
          filtered = filtered.filter((t) => isVendeur(t));
        }
      }

      return filtered;
    });

    const paginatedTransactions = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      return filteredTransactions.value.slice(
        startIndex,
        startIndex + itemsPerPage.value
      );
    });

    // Statistiques
    const totalTransactions = computed(() => transactions.value.length);
    const successfulTransactions = computed(
      () => transactions.value.filter((t) => t.statut === "complete").length
    );
    const totalJetonsAchetes = computed(() =>
      transactions.value
        .filter((t) => isAcheteur(t) && t.statut === "complete")
        .reduce((sum, t) => sum + t.nombre_jetons, 0)
    );
    const totalJetonsVendus = computed(() =>
      transactions.value
        .filter((t) => isVendeur(t) && t.statut === "complete")
        .reduce((sum, t) => sum + t.nombre_jetons, 0)
    );
    const totalPages = computed(() =>
      Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
    );

    // Métadonnées SEO
    const seoMeta = computed(() => ({
      title: "Historique des Transactions - Espace Cameroun",
      description:
        "Consultez votre historique complet des transactions de jetons sur Espace Cameroun.",
      keywords:
        "historique transactions, jetons, marketplace, achat, vente, Espace Cameroun",
      url: `${window.location.origin}${router.currentRoute.value.path}`,
      type: "website",
    }));

    const structuredData = computed(() => ({
      type: "webpage" as const,
      data: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Historique des Transactions",
        description: "Historique complet des transactions de jetons",
        url: `${window.location.origin}${router.currentRoute.value.path}`,
      },
    }));

    // Méthodes de rôle
    const isAcheteur = (transaction: Transaction) => {
      return transaction.acheteur_id === user.value?.id;
    };

    const isVendeur = (transaction: Transaction) => {
      return transaction.vendeur_id === user.value?.id;
    };

    const getRoleText = (transaction: Transaction) => {
      if (isAcheteur(transaction)) return "Acheteur";
      if (isVendeur(transaction)) return "Vendeur";
      return "";
    };

    const getRoleIcon = (transaction: Transaction) => {
      if (isAcheteur(transaction)) return "fas fa-shopping-cart";
      if (isVendeur(transaction)) return "fas fa-coins";
      return "fas fa-user";
    };

    const getRoleBadgeColor = (transaction: Transaction) => {
      if (isAcheteur(transaction)) return "bg-blue-100 text-blue-800";
      if (isVendeur(transaction)) return "bg-green-100 text-green-800";
      return "bg-gray-100 text-gray-800";
    };

    const getAmountColor = (transaction: Transaction) => {
      if (isAcheteur(transaction)) return "text-red-600";
      if (isVendeur(transaction)) return "text-green-600";
      return "text-[var(--espace-vert)]";
    };

    // Méthodes utilitaires
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("fr-FR").format(price);
    };

    const getTransactionTypeIcon = (type: string) => {
      switch (type) {
        case "marketplace":
          return {
            icon: "fas fa-exchange-alt",
            bgColor: "bg-[var(--espace-or)]",
          };
        case "platform":
          return { icon: "fas fa-store", bgColor: "bg-[var(--espace-vert)]" };
        default:
          return { icon: "fas fa-shopping-cart", bgColor: "bg-gray-500" };
      }
    };

    const getTransactionTitle = (transaction: Transaction) => {
      if (transaction.type === "platform") {
        return `${isAcheteur(transaction) ? "Achat de" : "Vente de"} ${transaction.nombre_jetons} jetons (Plateforme)`;
      } else {
        return `${isAcheteur(transaction) ? "Achat de" : "Vente de"} ${transaction.nombre_jetons} jetons (Marketplace)`;
      }
    };

    const getStatusColor = (statut: string) => {
      switch (statut) {
        case "complete":
          return "bg-green-100 text-green-800 border-green-200";
        case "pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "failed":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getStatusIcon = (statut: string) => {
      switch (statut) {
        case "complete":
          return "fas fa-check-circle";
        case "pending":
          return "fas fa-clock";
        case "failed":
          return "fas fa-times-circle";
        default:
          return "fas fa-info-circle";
      }
    };

    const getStatusText = (statut: string) => {
      switch (statut) {
        case "complete":
          return "Confirmée";
        case "pending":
          return "En attente";
        case "failed":
          return "Échouée";
        default:
          return statut;
      }
    };

    // Actions
    const fetchTransactions = async () => {
      try {
        isLoading.value = true;
        const response = await apiClient.get("/jeton/transactions/history");
        transactions.value = response.data.data || response.data;
      } catch (error) {
        console.error("Erreur lors du chargement des transactions:", error);
        toast.error("Erreur lors du chargement des transactions");
        throw error;
      } finally {
        isLoading.value = false;
      }
    };

    const checkTransactionStatus = async (transaction: Transaction) => {
      try {
        transaction.checkingStatus = true;
        const response = await apiClient.get(
          `/jeton/transaction/${transaction.id}/status`
        );

        if (response.data.statut === "complete" && user.value) {
          user.value.jetons = response.data.nombre_jetons;
        }

        toast.success("Statut vérifié avec succès");

        // Mettre à jour la transaction
        const index = transactions.value.findIndex(
          (t) => t.id === transaction.id
        );
        if (index !== -1) {
          transactions.value[index] = {
            ...transactions.value[index],
            ...response.data.transaction,
          };
        }
      } catch (error) {
        console.error("Erreur vérification statut:", error);
        toast.error("Erreur lors de la vérification du statut");
        throw error;
      } finally {
        transaction.checkingStatus = false;
      }
    };

    const redoPlatformPurchase = (transaction: Transaction) => {
      router.push({
        path: "/acheter-jetons",
        query: {
          quantity: transaction.nombre_jetons,
          amount: transaction.montant_total,
        },
      });
    };

    const createNewOffer = (transaction: Transaction) => {
      router.push({
        path: "/jetonMarket/create-offer",
        query: {
          quantity: transaction.nombre_jetons,
          price: transaction.prix_unitaire,
        },
      });
    };

    // Gestion des paramètres d'URL (toasts)
    const handleUrlParams = () => {
      const query = route.query;

      if (query.payment || query.reference) {
        const paymentStatus = query.payment as string;
        const reference = query.reference as string;
        const jetons = query.jetons as string;

        switch (paymentStatus) {
          case "success":
          case "complete":
            toast.success(
              `✅ Paiement réussi ! ${jetons ? jetons + " jetons ont été crédités à votre compte." : "Vos jetons ont été crédités avec succès."}`,
              { timeout: 5000 }
            );
            break;
          case "failed":
            toast.error(
              "❌ Paiement échoué. Veuillez réessayer ou contacter le support.",
              { timeout: 5000 }
            );
            break;
          case "canceled":
            toast.warning(
              "⚠️ Paiement annulé. Vous pouvez réessayer quand vous voulez.",
              { timeout: 4000 }
            );
            break;
          case "expired":
            toast.warning(
              "⏰ Le délai de paiement a expiré. Veuillez initier une nouvelle transaction.",
              { timeout: 4000 }
            );
            break;
          case "pending":
            toast.info(
              "⏳ Paiement en cours de traitement. Vous pouvez vérifier le statut.",
              { timeout: 4000 }
            );
            break;
          case "error":
            const errorMessage = query.message as string;
            let userFriendlyMessage =
              "Une erreur est survenue lors du traitement du paiement.";
            switch (errorMessage) {
              case "reference_missing":
                userFriendlyMessage = "Référence de paiement manquante.";
                break;
              case "transaction_not_found":
                userFriendlyMessage =
                  "Transaction non trouvée. Contactez le support.";
                break;
              case "processing_error":
                userFriendlyMessage =
                  "Erreur lors du traitement. Veuillez réessayer.";
                break;
              case "api_error":
                userFriendlyMessage =
                  "Erreur de connexion avec le service de paiement.";
                break;
            }
            toast.error(`❌ ${userFriendlyMessage}`, { timeout: 5000 });
            break;
          default:
            toast.info(`ℹ️ Statut du paiement: ${paymentStatus}`, {
              timeout: 4000,
            });
            break;
        }

        setTimeout(() => {
          cleanUrl();
        }, 100);
      }
    };

    const cleanUrl = () => {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    };

    // Pagination
    const loadNextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const loadPreviousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const setActiveTypeFilter = (filter: string) => {
      activeTypeFilter.value = filter;
      currentPage.value = 1;
    };

    const setActiveStatusFilter = (filter: string) => {
      activeStatusFilter.value = filter;
      currentPage.value = 1;
    };

    const setActiveRoleFilter = (filter: string) => {
      activeRoleFilter.value = filter;
      currentPage.value = 1;
    };

    // Initialisation
    const initializeTransactions = async () => {
      await fetchTransactions();
    };

    return {
      // États
      transactions,
      isLoading,
      activeTypeFilter,
      activeStatusFilter,
      activeRoleFilter,
      currentPage,
      itemsPerPage,

      // Computed
      typeFilters,
      statusFilters,
      roleFilters,
      filteredTransactions: paginatedTransactions,
      totalTransactions,
      successfulTransactions,
      totalJetonsAchetes,
      totalJetonsVendus,
      totalPages,
      seoMeta,
      structuredData,

      // Méthodes utilitaires
      isAcheteur,
      isVendeur,
      getRoleText,
      getRoleIcon,
      getRoleBadgeColor,
      getAmountColor,
      formatDate,
      formatPrice,
      getTransactionTypeIcon,
      getTransactionTitle,
      getStatusColor,
      getStatusIcon,
      getStatusText,

      // Actions
      fetchTransactions,
      checkTransactionStatus,
      redoPlatformPurchase,
      createNewOffer,
      handleUrlParams,
      cleanUrl,
      loadNextPage,
      loadPreviousPage,
      setActiveTypeFilter,
      setActiveStatusFilter,
      setActiveRoleFilter,
      initializeTransactions,
    };
  }
);
