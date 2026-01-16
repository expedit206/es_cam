// stores/marketplace.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "../api/index";
import { User } from "../components/types";

export interface Product {
  id: string;
  type: "product";
  nom: string;
  description: string;
  prix: number | undefined;
  quantite: number;
  category: Category;
  ville: string;
  photos: string[];
  condition: "neuf" | "occasion" | "reconditionne";
  revendable: boolean;
  marge_revente_min: number | null;
  localisation: any;
  est_actif: boolean;
  created_at: string;
  views_count?: number;
  favorites_count?: number;
  boosted?: boolean;
  note_moyenne?: number;
  nombre_avis?: number;
  user: User;
}

export interface Service {
  id: string;
  type: "service";
  titre: string;
  description: string;
  prix: number;
  annees_experience: number | null;
  competences: string[];
  qualifications: string | null;
  localisation: string;
  ville: string | null;
  disponibilite: "disponible" | "indisponible";
  images: string[] | null;
  note_moyenne: number;
  nombre_avis: number;
  category: Category;
  created_at: string;
  views_count?: number;
  favorites_count?: number;
  boosted?: boolean;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: "product" | "service";
}

interface MarketplaceState {
  products: Product[];
  services: Service[];
  categories: Category[];
  featuredProducts: Product[];
  featuredServices: Service[];
  isLoading: boolean;
  filters: {
    searchQuery: string;
    contentType: "product" | "service";
    activeCategory: string;
    sortBy: string;
    activeQuickFilters: string[];
    viewMode: "grid" | "list";
  };
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export const useMarketplaceStore = defineStore("marketplace", {
  state: (): MarketplaceState => ({
    products: [],
    services: [],
    categories: [],
    featuredProducts: [],
    featuredServices: [],
    isLoading: false,
    filters: {
      searchQuery: "",
      contentType: "product",
      activeCategory: "all",
      sortBy: "relevant",
      activeQuickFilters: [],
      viewMode: "grid",
    },
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 12,
      total: 0,
    },
  }),

  getters: {
    // Filtrage SIMPLIFIÉ - seulement le type sélectionné
    filteredItems: (state) => {
      let items: (Product | Service)[] = [];

      // Filtrer par type de contenu seulement
      if (state.filters.contentType === "product") {
        items = [...state.products];
      } else {
        items = [...state.services];
      }
console.log(items);

      // Filtre par recherche (maintenant géré par l'API)
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase();
        items = items.filter((item) => {
          if (item.type === "product") {
            return (
              item.nom.toLowerCase().includes(query) ||
              item.description?.toLowerCase().includes(query) ||
              item.category?.name.toLowerCase().includes(query)
            );
          } else {
            return (
              item.titre?.toLowerCase().includes(query) ||
              item.description?.toLowerCase().includes(query) ||
              item.competences?.some((comp) =>
                comp.toLowerCase().includes(query)
              )
            );
          }
        });
      }

      // Filtre par catégorie (maintenant géré par l'API)
      if (state.filters.activeCategory !== "all") {
        items = items.filter(
          (item) => item.category?.id === state.filters.activeCategory
        );
      }

      // Tri
      switch (state.filters.sortBy) {
        case "newest":
          items.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          break;
        case "price_asc":
          items.sort((a, b) => (a.prix || 0) - (b.prix || 0));
          break;
        case "price_desc":
          items.sort((a, b) => (b.prix || 0) - (a.prix || 0));
          break;
        case "popular":
          items.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
          break;
        case "stock":
          items = items.filter(
            (item) => item.type === "product" && item.quantite > 0
          );
          break;
        case "available":
          items = items.filter(
            (item) =>
              item.type === "service" && item.disponibilite === "disponible"
          );
          break;
      }

      return items;
    },

    // Produits tendances (getter)
    trendingProducts: (state) => {
      return state.products
        .filter((product) => product.est_actif)
        .sort((a, b) => {
          const scoreA = (a.views_count || 0) + (a.favorites_count || 0) * 2;
          const scoreB = (b.views_count || 0) + (b.favorites_count || 0) * 2;
          return scoreB - scoreA;
        })
        .slice(0, 12);
    },

    // Services populaires (getter)
    popularServices: (state) => {
      return state.services
        .filter((service) => service.disponibilite === "disponible")
        .sort((a, b) => {
          const scoreA = (a.note_moyenne || 0) * 10 + (a.nombre_avis || 0);
          const scoreB = (b.note_moyenne || 0) * 10 + (b.nombre_avis || 0);
          return scoreB - scoreA;
        })
        .slice(0, 12);
    },

    // Statistiques
    productsStats: (state) => ({
      total: state.products.length,
      inStock: state.products.filter((p) => p.quantite > 0).length,
      revendable: state.products.filter((p) => p.revendable).length,
    }),

    servicesStats: (state) => ({
      total: state.services.length,
      available: state.services.filter((s) => s.disponibilite === "disponible")
        .length,
    }),

    // Catégories filtrées selon le type de contenu
    filteredCategories: (state) => {
      return state.categories.filter(
        (cat) => cat.type === state.filters.contentType
      );
    },
  },

  actions: {
    // Charger toutes les données
    async fetchMarketplaceData() {
      this.isLoading = true;
      try {
        // D'abord charger les catégories
        await this.fetchCategories();
        
        // Ensuite charger les données avec pagination
        await this.fetchDataWithFilters(false);
        
        this.updateFeaturedData();
      } catch (error) {
        console.error("Error fetching marketplace data:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Charger les produits - AVEC SUPPORT DES CATÉGORIES ET RECHERCHE
    async fetchProducts(categoryId?: string, searchQuery?: string, append: boolean = false) {
      if (!append) this.isLoading = true;
      try {
        const params: any = {
          page: append ? this.pagination.currentPage + 1 : 1,
          per_page: this.pagination.perPage
        };

        if (categoryId && categoryId !== "all") {
          params.categoryId = categoryId;
        }

        if (searchQuery && searchQuery.trim() !== "") {
          params.search = searchQuery;
        }

        if (this.filters.sortBy !== "relevant") {
          params.sort = this.filters.sortBy;
        }

        const response = await apiClient.get("/marketplace/produits", {
          params,
        });
        
        const responseData = response.data.produits;
        const newProducts = (responseData.data || []).map((product: any) => ({
          ...product,
          type: "product" as const,
        }));

        if (append) {
          this.products = [...this.products, ...newProducts];
        } else {
          this.products = newProducts;
        }

        // Mettre à jour la pagination
        this.pagination = {
          currentPage: responseData.current_page || 1,
          lastPage: responseData.last_page || 1,
          perPage: responseData.per_page || 12,
          total: responseData.total || 0
        };

      } catch (error:any) {
        console.error("Error fetching products:", error);
        throw error;
      } finally {
        if (!append) this.isLoading = false;
      }
    },

    // Charger les services - AVEC SUPPORT DES CATÉGORIES ET RECHERCHE
    async fetchServices(categoryId?: string, searchQuery?: string, append: boolean = false) {
      if (!append) this.isLoading = true;
      try {
        const params: any = {
          page: append ? this.pagination.currentPage + 1 : 1,
          per_page: this.pagination.perPage
        };

        if (categoryId && categoryId !== "all") {
          params.categoryId = categoryId;
        }

        if (searchQuery && searchQuery.trim() !== "") {
          params.search = searchQuery;
        }

        if (this.filters.sortBy !== "relevant") {
          params.sort = this.filters.sortBy;
        }

        const response = await apiClient.get("/marketplace/services", {
          params,
        });

        const responseData = response.data;
        const newServices = (responseData.data || []).map((service: any) => ({
            ...service,
            type: "service" as const,
            prix: service.prix || 0,
            category: service.categorie || service.category,
        }));

        if (append) {
          this.services = [...this.services, ...newServices];
        } else {
          this.services = newServices;
        }

        // Mettre à jour la pagination
        this.pagination = {
          currentPage: responseData.meta?.current_page || 1,
          lastPage: responseData.meta?.last_page || 1,
          perPage: responseData.meta?.per_page || 12,
          total: responseData.meta?.total || 0
        };

      } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
      } finally {
        if (!append) this.isLoading = false;
      }
    },

    // Charger les catégories
    async fetchCategories() {
      try {
        if (this.filters.contentType === "product") {
          const response = await apiClient.get("/produits/categories");

          this.categories =
            response.data.categoryProduits?.map((cat: any) => ({
              id: cat.id,
              name: cat.nom,
              icon: this.getCategoryIcon(cat.nom),
              type: "product" as const,
            })) || [];
        } else {
          const response = await apiClient.get("/services/categories");
          this.categories =
            response.data.categoryServices?.map((cat: any) => ({
              id: cat.id,
              name: cat.nom,
              icon: this.getCategoryIcon(cat.nom),
              type: "service" as const,
            })) || [];
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },

    // NOUVELLE ACTION : Charger les données avec filtres
    async fetchDataWithFilters(append: boolean = false) {
      if (!append) this.isLoading = true;
      try {
        if (this.filters.contentType === "product") {
          await this.fetchProducts(
            this.filters.activeCategory,
            this.filters.searchQuery,
            append
          );
        } else {
          await this.fetchServices(
            this.filters.activeCategory,
            this.filters.searchQuery,
            append
          );
        }

        this.updateFeaturedData();
      } catch (error) {
        console.error("Error fetching data with filters:", error);
        throw error;
      } finally {
        if (!append) this.isLoading = false;
      }
    },

    // Mettre à jour les données featured
    updateFeaturedData() {
      this.featuredProducts = this.products
        .filter((product) => product.boosted)
        .slice(0, 6);

      this.featuredServices = this.services
        .filter((service) => service.boosted)
        .slice(0, 6);
    },

    // Méthodes pour les filtres - MODIFIÉES
    async setContentType(type: "product" | "service") {
      this.filters.contentType = type;
      this.filters.activeCategory = "all";
      this.filters.searchQuery = "";
      this.pagination.currentPage = 1;

      // Recharger les catégories et les données quand le type change
      await this.fetchCategories();
      await this.fetchDataWithFilters();
    },

    async setSearchQuery(query: string) {
      this.filters.searchQuery = query;
      this.pagination.currentPage = 1;
      await this.fetchDataWithFilters();
    },

    // MODIFIÉ : Faire un appel API quand une catégorie est sélectionnée
    async setActiveCategory(categoryId: string) {
      this.filters.activeCategory = categoryId;
      this.pagination.currentPage = 1;
      await this.fetchDataWithFilters();
    },

    async setSortBy(sortBy: string) {
      this.filters.sortBy = sortBy;
      await this.fetchDataWithFilters();
    },

    setViewMode(mode: "grid" | "list") {
      this.filters.viewMode = mode;
    },

    toggleQuickFilter(filterId: string) {
      const index = this.filters.activeQuickFilters.indexOf(filterId);
      if (index > -1) {
        this.filters.activeQuickFilters.splice(index, 1);
      } else {
        this.filters.activeQuickFilters.push(filterId);
      }
      this.pagination.currentPage = 1;
    },

    async resetFilters() {
      this.filters = {
        searchQuery: "",
        contentType: "product",
        activeCategory: "all",
        sortBy: "relevant",
        activeQuickFilters: [],
        viewMode: "grid",
      };
      this.pagination.currentPage = 1;

      // Recharger toutes les données
      await this.fetchMarketplaceData();
    },

    setPage(page: number) {
      this.pagination.currentPage = page;
    },

    // Helper pour les icônes de catégories
    getCategoryIcon(categoryName: string): string {
      const iconMap: { [key: string]: string } = {
        Électronique: "fas fa-laptop",
        Mode: "fas fa-tshirt",
        Maison: "fas fa-home",
        Beauté: "fas fa-spa",
        Sports: "fas fa-basketball-ball",
        Réparation: "fas fa-tools",
        Nettoyage: "fas fa-broom",
        Formation: "fas fa-graduation-cap",
        Santé: "fas fa-heartbeat",
        Technologie: "fas fa-code",
        Automobile: "fas fa-car",
        Immobilier: "fas fa-building",
        Alimentation: "fas fa-utensils",
        Loisirs: "fas fa-gamepad",
        Jardinage: "fas fa-leaf",
      };

      return iconMap[categoryName] || "fas fa-tag";
    },
  },
});
