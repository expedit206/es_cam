// stores/catalog.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "../api/index";
import { Product, Service, Category } from "../components/types/index";
import { useToast } from "vue-toastification";
import { useAuthStore } from "./Auth";

export const useCatalogStore = defineStore("catalog", () => {
  const toast = useToast();

  // États PERSISTANTS (ne sont pas reset à chaque rechargement)
  const products = ref<Product[]>([]);
  const services = ref<Service[]>([]);
  const productCategories = ref<Category[]>([]);
  const serviceCategories = ref<Category[]>([]);

  // États TEMPORAIRES (peuvent être reset)
  const isLoading = ref(false);
  const activeTab = ref<"products" | "services">("products");
  const searchQuery = ref("");
  const showFilters = ref(false);

  const productFilters = ref({
    stock: "all",
    revendable: "all",
    sortBy: "newest",
  });

  const serviceFilters = ref({
    status: "all",
    category: "all",
  });

  // Computed - Statistiques (basées sur les données persistantes)
  const productsStats = computed(() => ({
    total: products.value.length,
    inStock: products.value.filter((p) => p?.quantite > 0).length,
    revendable: products.value.filter((p) => p?.revendable).length,
    totalViews: products.value.reduce(
      (sum, p) => sum + (parseInt(p?.views_count) || 0),
      0
    ),
  }));

  const servicesStats = computed(() => ({
    total: services.value.length,
    available: services.value.filter((s) => s?.disponibilite === "disponible")
      .length,
  }));

  // Computed - Filtres actifs
  const activeFilterCount = computed(() => {
    let count = 0;
    if (searchQuery.value) count++;

    if (activeTab.value === "products") {
      if (productFilters.value.stock !== "all") count++;
      if (productFilters.value.revendable !== "all") count++;
      if (productFilters.value.sortBy !== "newest") count++;
    } else {
      if (serviceFilters.value.status !== "all") count++;
      if (serviceFilters.value.category !== "all") count++;
    }
    return count;
  });

  const hasActiveFilters = computed(() => activeFilterCount.value > 0);

  // Computed - Données filtrées (basées sur les données persistantes)
  const filteredProducts = computed(() => {
    let filtered = [...products.value];

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product?.nom.toLowerCase().includes(query) ||
          product?.description?.toLowerCase().includes(query) ||
          product?.category?.nom.toLowerCase().includes(query)
      );
    }

    if (productFilters.value.stock !== "all") {
      filtered = filtered.filter((product) =>
        productFilters.value.stock === "in_stock"
          ? product.quantite > 0
          : product.quantite === 0
      );
    }

    if (productFilters.value.revendable !== "all") {
      filtered = filtered.filter((product) =>
        productFilters.value.revendable === "revendable"
          ? product.revendable
          : !product.revendable
      );
    }

    switch (productFilters.value.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "price_asc":
        filtered.sort((a, b) => a.prix - b.prix);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.prix - a.prix);
        break;
    }

    return filtered;
  });

  const filteredServices = computed(() => {
    let filtered = [...services.value];
//     console.log(services.value);
    
// alert()
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service?.titre.toLowerCase().includes(query) ||
          service?.description?.toLowerCase().includes(query) ||
          service?.competences?.some((comp: string) =>
            comp.toLowerCase().includes(query)
          ) ||
          service?.category?.nom.toLowerCase().includes(query)
      );
    }

    if (serviceFilters.value.status !== "all") {
      filtered = filtered.filter(
        (service) => service?.disponibilite === serviceFilters.value.status
      );
    }

    if (serviceFilters.value.category !== "all") {
      filtered = filtered.filter(
        (service) => service?.category.nom === serviceFilters.value.category
      );
    }

    return filtered;
  });

  // Getters pour les données actuelles selon l'onglet
  const currentItems = computed(() =>
    activeTab.value === "products"
      ? filteredProducts.value
      : filteredServices.value
  );

  const currentCategories = computed(() =>
    activeTab.value === "products"
      ? productCategories.value
      : serviceCategories.value
  );

  // Actions
  const fetchProducts = async (forceRefresh = false) => {
    // Ne pas recharger si déjà chargé et pas de force refresh
    if (products.value.length > 0 && !forceRefresh) {
      return;
    }

    isLoading.value = true;
    try {
      const response = await apiClient.get("/user/mesProduits");
      const authStore = useAuthStore();
      products.value = response.data.produits.map((p: any) => ({
        ...p,
        user: authStore.user,
        photo_url: p.photos && p.photos.length > 0 ? p.photos[0] : "",
      }));
    } catch (error) {
      toast.error("Erreur lors du chargement des produits");
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchServices = async (forceRefresh = false) => {
    // Ne pas recharger si déjà chargé et pas de force refresh
    if (services.value.length > 0 && !forceRefresh) {
      return;
    }

    isLoading.value = true;
    try {
      const response = await apiClient.get("/services/mes-services");
      services.value = response.data.data;
    } catch (error: any) {
      toast.error(error.data?.response.data);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProductCategories = async () => {
    // Ne recharger les catégories que si nécessaire
    if (productCategories.value.length > 0) {
      return;
    }

    try {
      const response = await apiClient.get("/produits/categories");
      productCategories.value = response.data.categoryProduits;
    } catch (error) {
      toast.error("Erreur lors du chargement des catégories produits");
      throw error;
    }
  };

  const fetchServiceCategories = async () => {
    // Ne recharger les catégories que si nécessaire
    if (serviceCategories.value.length > 0) {
      return;
    }

    try {
      const response = await apiClient.get("/services/categories");
      serviceCategories.value = response.data.categoryServices;
    } catch (error) {
      toast.error("Erreur lors du chargement des catégories services");
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    isLoading.value = true;
    try {
      await apiClient.post(`/user/delete/produit/${productId}`);
      products.value = products.value.filter((p) => p.id !== productId);
      toast.success("Produit supprimé avec succès");
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error("Vous n'êtes pas autorisé à supprimer ce produit");
      } else {
        toast.error("Erreur lors de la suppression du produit");
      }
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      await apiClient.delete(`/services/${serviceId}`);
      services.value = services.value.filter((s) => String(s.id) !== String(serviceId));
      toast.success("Service supprimé avec succès");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la suppression du service"
      );
      throw error;
    }
  };

  const toggleServiceAvailability = async (serviceId: string) => {
    try {
      await apiClient.patch(`/services/${serviceId}/toggle-disponibilite`);
      const service = services.value.find((s) => String(s.id) === String(serviceId));
      if (service) {
        service.disponibilite =
          service.disponibilite === "disponible"
            ? "indisponible"
            : "disponible";
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors du changement de disponibilité"
      );
      throw error;
    }
  };

  const resetFilters = () => {
    searchQuery.value = "";
    if (activeTab.value === "products") {
      productFilters.value = {
        stock: "all",
        revendable: "all",
        sortBy: "newest",
      };
    } else {
      serviceFilters.value = {
        status: "all",
        category: "all",
      };
    }
    showFilters.value = false;
  };

  const addProduct = (product: Product) => {
    products.value.unshift(product);
  };

  const updateProduct = (updatedProduct: Product) => {
    const index = products.value.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      products.value[index] = updatedProduct;
    }
  };

  const addService = (service: Service) => {
    console.log('service'+service);
    
    services.value.unshift(service);
  };

  const updateService = (updatedService: Service) => {
    const index = services.value.findIndex((s) => s.id === updatedService.id);
    if (index !== -1) {
      services.value[index] = updatedService;
    }
  };

  // Initialisation intelligente - ne charge que si nécessaire
  const initializeCatalog = async (forceRefresh = false) => {
    // Charger les catégories en premier (toujours nécessaires)
    await Promise.all([fetchProductCategories(), fetchServiceCategories()]);

    // Charger les données selon l'onglet actuel
    if (activeTab.value === "products") {
      await fetchProducts(forceRefresh);
    } else {
      await fetchServices(forceRefresh);
    }
  };

  // Méthode pour forcer le rafraîchissement des données
  const refreshData = async () => {
    await initializeCatalog(true);
  };

  return {
    // États persistants
    products,
    services,
    productCategories,
    serviceCategories,

    // États temporaires
    isLoading,
    activeTab,
    searchQuery,
    showFilters,
    productFilters,
    serviceFilters,

    // Computed
    productsStats,
    servicesStats,
    activeFilterCount,
    hasActiveFilters,
    filteredProducts,
    filteredServices,
    currentItems,
    currentCategories,

    // Actions
    fetchProducts,
    fetchServices,
    fetchProductCategories,
    fetchServiceCategories,
    deleteProduct,
    deleteService,
    toggleServiceAvailability,
    resetFilters,
    addProduct,
    updateProduct,
    addService,
    updateService,
    initializeCatalog,
    refreshData,
  };
});
