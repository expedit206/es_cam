// src/stores/product.js
import { defineStore } from "pinia";
import apiClient from "../api/index";
import { Product } from "../components/types/index";
import { useAuthStore } from "./Auth";

import router from "../router/index";
import { useToast } from "vue-toastification";

const toast = useToast();

interface FetchProductsParams {
  per_page?: string | number;
  [key: string]: any; // Allow additional params for flexibility
}

export const useProductStore = defineStore("product", {
  state: () => ({
    product: {} as Product, // Single product
    products: [] as Product[],
    isLoading: false,
    hasMore: true,
    page: 1,
    sort: "random",
    userId: null,
    relatedProperties: [],
  }),

  getters: {
    user: (state) => useAuthStore().user,
  },

  actions: {
    async fetchProducts(
      params: FetchProductsParams = {},
      reset = false,
      forceReload = false
    ) {
      if (this.isLoading || (!reset && !this.hasMore && !forceReload)) return;
      this.isLoading = true;

      if (reset || forceReload) {
        this.products = [];
        this.page = 1;
        this.hasMore = true;
      }
      await useAuthStore().checkAuth();

      const endpoint = useAuthStore().user ? "/produit" : "/public-produits";
      // console.log(endpoint);

      try {
        const response = await apiClient.get(endpoint, {
          params: {
            ...params,
            page: this.page,
            sort: this.sort,
          },
        });

        console.log(response.data.data);
        console.log(response.data);

        const newProducts = response.data.data || [];

        if (!Array.isArray(newProducts)) {
          throw new Error("Les données des produits ne sont pas un tableau");
        }

        if (reset || forceReload || params.per_page === "all") {
          this.products = newProducts;
        } else {
          this.products = [...this.products, ...newProducts];
        }

        this.hasMore =
          response.data.current_page < (response.data.last_page || 1);
        this.page = response.data.current_page + 1;
      } catch (error: any) {
        console.error("Erreur lors du fetch:", error);
        if (error.response?.data?.message === "Unauthenticated.") {
          router.push("login");
        }
      } finally {
        this.isLoading = false;
      }
    },
    async toggleFavorite(produitId: string) {
      const authStore = useAuthStore();
      if (!authStore.user) {
        await authStore.checkAuth();
        if (!authStore.user) {
          console.warn(
            "Utilisateur non connecté, redirection ou action nécessaire"
          );
          toast.error("Vous devez être connecté pour ajouter aux favoris");
          // router.push("/login");
        // router.push({ name: "login" });

          // window.location.href = "/login";
return
          // window.location.reload();
        }
      }
      const product = this.products.find((p) => p.id === produitId);
      let localUpdate = false;
      if (product) {
        product.is_favorited_by = !product.is_favorited_by;
        product.counts.favorites_count = product.is_favorited_by
          ? product.counts.favorites_count + 1
          : product.counts.favorites_count - 1;
        localUpdate = true;
      }

      if (this.product && this.product.id === produitId) {
        this.product.is_favorited_by = !this.product.is_favorited_by;
        this.product.counts.favorites_count = this.product.is_favorited_by
          ? this.product.counts.favorites_count + 1
          : this.product.counts.favorites_count - 1;
        localUpdate = true;
      }

      try {
        const response = await apiClient.post(
          `/produits/${produitId}/favorite`
        );
        const updatedProduct = response.data.produit;

        if (localUpdate) {
          const productIndex = this.products.findIndex(
            (p) => p.id === produitId
          );
          if (productIndex !== -1) {
            this.products[productIndex] = {
              ...this.products[productIndex],
              ...updatedProduct,
            };
          }
          if (this.product && this.product.id === produitId) {
            this.product = { ...this.product, ...updatedProduct };
          }
        }

        return response.data.message;
      } catch (error: any) {
        if (error.response?.data?.message === "Unauthenticated.") {
          // const router = useRouter();
          router.push("login");
        }
        console.error("Erreur toggleFavorite:", error);

        if (localUpdate) {
          const product = this.products.find((p) => p.id === produitId);
          if (product) {
            product.is_favorited_by = !product.is_favorited_by;
            product.counts.favorites_count = product.is_favorited_by
              ? product.counts.favorites_count - 1
              : product.counts.favorites_count + 1;
          }
          if (this.product && this.product.id === produitId) {
            this.product.is_favorited_by = !this.product.is_favorited_by;
            this.product.counts.favorites_count = this.product.is_favorited_by
              ? this.product.counts.favorites_count - 1
              : this.product.counts.favorites_count + 1;
          }
        }
      }
    },

    async viewProduct(produitId: string | string[]) {
      const authStore = useAuthStore();
      const viewEndpoint = authStore.user
        ? "/record_view"
        : "/public-record-view";
      const productEndpoint = authStore.user
        ? `/produits/${produitId}`
        : `/public-produits/${produitId}`;

      try {
        const response = await apiClient.get(productEndpoint);
        this.product = response.data.produit;

        // Mettre à jour les produits existants ou ajouter le nouveau
        const productIndex = this.products.findIndex((p) => p.id === produitId);
        if (productIndex !== -1) {
          this.products[productIndex] = {
            ...this.products[productIndex],
            ...this.product,
          };
        } else {
          this.products.push(this.product);
        }

        // Enregistrer la vue
        const payload = { product_id: produitId, user_id: 0 };
        if (authStore.user?.id) payload.user_id = authStore.user.id;
        await apiClient.post(viewEndpoint, payload);
      } catch (error: any) {
        if (error.response?.data?.message === "Unauthenticated.") {
          router.push("login");
        }
        throw (
          error.response?.data?.message ||
          "Erreur lors du chargement du produit"
        );
      }
    },

    setSort(sort: any) {
      this.sort = sort;
      this.page = 1;
      this.products = [];
      this.hasMore = true;
      this.fetchProducts({}, true);
    },

    setUserId(userId: any) {
      this.userId = userId;
    },
  },
});
