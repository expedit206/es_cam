<template>
    <div>
        <!-- Résultats de recherche -->
        <div v-if="hasActiveFilters" class="mb-4 sm:mb-6">
            <p class="text-gray-600 text-sm sm:text-base">
                {{ t('products_found', { count: products.length }) }}
                <span v-if="searchQuery"> {{ t('for_query') }}"{{ searchQuery.length > 20 ? searchQuery.substring(0,
                    20) + '...' : searchQuery }}"</span>
            </p>
        </div>

        <!-- Grille des produits -->
        <div v-if="isLoading" class="flex justify-center py-12 sm:py-16">
            <div class="text-center">
                <div
                    class="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[var(--espace-vert)] border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4">
                </div>
                <p class="text-gray-600 text-sm sm:text-base">{{ t('loading_products') }}</p>
            </div>
        </div>

        <div v-else-if="products.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pb-12 sm:pb-16">
            <MesProductCard v-for="product in products" :key="product?.id" :produit="product"
                @edit="$emit('edit-product', product)" @delete="$emit('delete-product', product.id)" />
        </div>

        <!-- États vides -->
        <div v-else-if="hasActiveFilters" class="text-center py-12 sm:py-16 lg:py-20">
            <div
                class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-100 max-w-md mx-auto">
                <div
                    class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8">
                    <i class="fas fa-search text-gray-400 text-2xl sm:text-3xl lg:text-4xl"></i>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{{ t('no_products_found') }}</h3>
                <p class="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
                    {{ t('no_products_match_criteria') }}
                </p>
                <button @click="$emit('reset-filters')"
                    class="bg-[var(--espace-vert)] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 mx-auto group w-full sm:w-auto">
                    <i class="fas fa-redo text-sm sm:text-lg group-hover:scale-110 transition-transform"></i>
                    <span class="text-sm sm:text-base lg:text-lg">{{ t('reset') }}</span>
                </button>
            </div>
        </div>

        <div v-else class="text-center py-12 sm:py-16 lg:py-20">
            <div
                class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-100 max-w-md mx-auto">
                <div
                    class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8">
                    <i class="fas fa-box-open text-[var(--espace-vert)] text-2xl sm:text-3xl lg:text-4xl"></i>
                </div>
                <p class="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
                    {{ t('start by adding first product') }}
                </p>
                <button @click="$emit('open-add-modal')"
                    class="bg-[var(--espace-vert)] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 mx-auto group w-full sm:w-auto">
                    <i class="fas fa-plus-circle text-sm sm:text-lg group-hover:scale-110 transition-transform"></i>
                    <span class="text-sm sm:text-base lg:text-lg">{{ t('create_product') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Product } from '../types/index';
import MesProductCard from '../mesProduits/MesProductCard.vue';
import { useI18n } from '../useI18n';
const { t } = useI18n();

defineProps<{
    products: Product[];
    isLoading: boolean;
    hasActiveFilters: boolean;
    searchQuery: string;
}>();

defineEmits<{
    'edit-product': [product: Product];
    'delete-product': [productId: string];
    'reset-filters': [];
    'open-add-modal': [];
}>();
</script>