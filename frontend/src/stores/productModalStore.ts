import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Product } from '../components/types';
import apiClient from '../api';
import { useToast } from 'vue-toastification';

export const useProductModalStore = defineStore('productModal', () => {
  const visible = ref(false);
  const product = ref<Product | null>(null);
  const loading = ref(false);
  const toast = useToast();
  const categoryProduits = ref<any[]>([]);

  // Actions
  const openModal = async (prod: Product | null = null) => {
    product.value = prod;
    visible.value = true;
    
    // Load categories immediately when opening if not loaded
    if (categoryProduits.value.length === 0) {
      await fetchCategories();
    }
  };

  const closeModal = () => {
    visible.value = false;
    product.value = null;
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/produits/categories");
      categoryProduits.value = response.data.categoryProduits;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  
  const updatedProduct = ref<Product | null>(null);

  const handleSaved = (savedProduct: Product) => {
      updatedProduct.value = savedProduct;
  };

  return {
    visible,
    product,
    loading,
    categoryProduits,
    updatedProduct,
    openModal,
    closeModal,
    fetchCategories,
    handleSaved
  };
});
