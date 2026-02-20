<template>
  <div class="w-full">
    <!-- Search Results Summary -->
    <div v-if="showSearchSummary && hasActiveFilters" class="mb-4 sm:mb-6 px-1">
      <p class="text-gray-600 text-sm sm:text-base">
        {{ t("products_found", { count: products.length }) }}
        <span v-if="searchQuery">
          {{ t("for_query") }} "{{
            searchQuery.length > 20
              ? searchQuery.substring(0, 20) + "..."
              : searchQuery
          }}"</span
        >
      </p>
    </div>


    <div v-if="isLoading">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            <ProductCardSkeleton v-for="i in 12" :key="i" />
        </div>
    </div>

    <!-- Product Grid -->
    <div
      v-else-if="products.length"
      class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-6 pb-4"
      :class="gridClass"
    >
      <MesProductCard
        v-for="product in products"
        :key="product?.id"
        :produit="product"
        @edit="$emit('edit-product', product)"
        @delete="$emit('delete-product', product.id)"
        class="h-full"
      />
    </div>

    <!-- Empty States -->
    <div v-else class="text-center py-12 sm:py-16">
      <slot name="empty">
        <div
          class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 max-w-md mx-auto"
        >
          <template v-if="hasActiveFilters">
            <div
              class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-search text-gray-400 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ t("no_products_found") }}
            </h3>
            <p class="text-gray-500 mb-6">
              {{ t("no_products_match_criteria") }}
            </p>
            <button
              @click="$emit('reset-filters')"
              class="text-[var(--espace-vert)] font-bold hover:underline"
            >
              {{ t("reset_filters") || t("reset") }}
            </button>
          </template>
          <template v-else>
            <div
              class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i
                :class="emptyIcon"
                class="text-[var(--espace-vert)] text-2xl"
              ></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              {{ emptyTitle || t("no_products_yet") }}
            </h3>
            <p class="text-gray-500 mb-6">
              {{ emptyMessage || t("start_adding_products") }}
            </p>
            <button
              v-if="showAddButton"
              @click="$emit('open-add-modal')"
              class="bg-[var(--espace-vert)] text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg active:scale-95"
            >
              <i class="fas fa-plus-circle mr-2"></i>
              {{ t("create_product") }}
            </button>
          </template>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { Product } from "../types/index";
import MesProductCard from "../mesProduits/MesProductCard.vue";
import { useI18n } from "../useI18n";
import ProductCardSkeleton from "../ProductCardSkeleton.vue";

const { t } = useI18n();

const props = defineProps<{
  products: Product[];
  isLoading: boolean;
  hasActiveFilters?: boolean;
  searchQuery?: string;
  showSearchSummary?: boolean;
  gridClass?: string;
  skeletonCount?: number;
  // Empty state customization
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: string;
  showAddButton?: boolean;
}>();

// Defaults
const skeletonCount = props.skeletonCount || 10;
const emptyIcon = props.emptyIcon || "fas fa-box-open";

defineEmits<{
  "edit-product": [product: Product];
  "delete-product": [productId: string];
  "reset-filters": [];
  "open-add-modal": [];
}>();
</script>
