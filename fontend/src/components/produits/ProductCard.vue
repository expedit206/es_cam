<!-- src/components/ProductCard.vue -->
<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useProductStore } from '../../stores/product';
import { Product } from "../types/index";
import { useI18n } from '../useI18n';

const { t } = useI18n();

const props = defineProps<{
  produit: Product
}>();

const emit = defineEmits(['toggle-favorite', 'handleToggleFavorite']);
const toast = useToast();
const productStore = useProductStore();

// États pour le slider
const currentSlideIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);

// Fonction pour formater les nombres
const formatNumber = (num: number | undefined): string => {
  if (num == null || isNaN(num) || num === 0) return "0";
  const absNum = Math.abs(num);
  if (absNum < 1000) return num.toString();
  if (absNum < 10000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + "k";
  if (absNum < 1000000) return Math.floor(num / 1000) + "k";
  return (num / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
};

// Formatage du prix
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR').format(price);
};

// Navigation slider
const nextSlide = () => {
  const maxIndex = (props.produit.photos?.length || 1) - 1;
  currentSlideIndex.value = Math.min(currentSlideIndex.value + 1, maxIndex);
};

const prevSlide = () => {
  currentSlideIndex.value = Math.max(currentSlideIndex.value - 1, 0);
};

// Navigation vers un slide spécifique
const goToSlide = (index: number) => {
  const maxIndex = (props.produit.photos?.length || 1) - 1;
  currentSlideIndex.value = Math.max(0, Math.min(index, maxIndex));
};

// Gestion du défilement tactile
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchMove = (e: TouchEvent) => {
  touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const diff = touchStartX.value - touchEndX.value;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextSlide();
    else prevSlide();
  }
};

// Gestion des favoris
const handleFavorite = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();

  try {
    await productStore.toggleFavorite(props.produit.id);
    emit('toggle-favorite', props.produit.id);
  } catch (error: any) {
    console.error(t('favorite_update_error'), error);
  }
};

// Obtenir l'image principale
const mainImage = computed(() => {
  return props.produit.photos?.[0] || props.produit.photo_url || '/placeholder-product.jpg';
});

// Vérifier si le produit a plusieurs images
const hasMultipleImages = computed(() => {
  return props.produit.photos && props.produit.photos.length > 1;
});
</script>

<template>
  <div
    class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div :to="`/produits/${produit.id}`" class="block relative">
      <!-- Container d'image -->
      <div class="relative w-full h-30 overflow-hidden bg-gray-50">
        <!-- Slider d'images -->
        <div class="flex w-full h-full transition-transform duration-300 ease-out"
          :style="{ transform: `translateX(-${currentSlideIndex * 100}%)` }" @touchstart="handleTouchStart"
          @touchmove="handleTouchMove" @touchend="handleTouchEnd">
          <div v-for="(photo, index) in produit.photos || [mainImage]" :key="index"
            class="w-full h-full flex-shrink-0 flex items-center justify-center py-2">
            <router-link :to="`/produits/${produit.id}`"
              class="w-full h-full flex-shrink-0 flex items-center justify-center ">
              <img :src="photo"
                class="h-full object-contain transition-transform duration-300 group-hover:scale-105 object-center r"
                :alt="t('product_image_alt', { name: produit.nom, index: index + 1 })" loading="lazy" />
            </router-link>
          </div>
        </div>

        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-1">
          <span v-if="produit.revendable"
            class="text-[var(--espace-vert)]/50  text-xs font-semibold rounded-full shadow-lg flex items-center g">
            <i class=" sm:flex fas fa-handshake text-[10px]"></i>
          </span>
          <span v-if="produit.boosted"
            class="bg-yellow-500 text-green-900 text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
            <i class="fas fa-rocket text-[10px]"></i>
            {{ t('boosted') }}
          </span>
        </div>

        <!-- Indicateurs de slide cliquables -->
        <div v-if="hasMultipleImages" class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
          <button v-for="(_, index) in produit.photos" :key="index" @click="goToSlide(index)"
            class="  lg:w-3 w-2   lg:h-3 h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            :class="index === currentSlideIndex ? 'bg-slate-500 shadow-lg' : 'bg-slate-300 hover:bg-slate-500'"
            :aria-label="t('go_to_image', { number: index + 1 })"
            :title="t('view_image', { number: index + 1 })"></button>
        </div>
      </div>

      <!-- Contenu du produit -->
      <div class="p-4">
  

        <!-- En-tête avec nom et prix -->
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="text-xs font-semibold text-gray-900 leading-tight flex-1 truncate">
            {{ produit.nom }}
          </h3>
         
        </div>

        <!-- Description -->
        <p class=" text-xs text-gray-600 mb-1 truncate ">
          {{ produit.description || t('no_description_available') }}
        </p>

        <!-- Catégorie et ville -->
        <div v-if="produit.category?.nom" class="mt-1 flex justify-between w-full">
          <span class="inline-block bg-gray-200 text-gray-700 text-xs py-1 rounded-full px-1">
            {{ produit.category.nom }}
          </span>
        </div>
        <div class="flex items-center gap-1 text-end text-gray-500" v-if="produit.ville">
          <i class="fas fa-map-marker-alt text-xs"></i>
          <span class="text-xs">{{ produit.ville }}</span>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="px-4 pb-3">
      <div
        class="w-full text-[var(--espace-vert)] border- py-0 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 flex  gap-2 ">
        <i class="fas fa-shopping-cart text-xs "></i>
        <p class="text-lg font-bold text-[var(--espace-vert)] leading-none">
          {{ formatPrice(produit.prix) }} FCFA
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  -webkit-line-clamp: 1;
}
.line-clamp-2 {
  -webkit-line-clamp: 1;
}

/* Animation subtile pour les interactions */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.03);
}

/* Style pour le slider sur mobile */
@media (max-width: 768px) {
  .slider-container {
    touch-action: pan-y;
  }
}

/* Amélioration de l'accessibilité */
button:focus {
  outline-offset: 2px;
}

/* Transition pour les badges */
.badge-enter-active,
.badge-leave-active {
  transition: all 0.3s ease;
}

.badge-enter-from,
.badge-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Style pour les images de placeholder */
img {
  background-color: #f9fafb;
}

/* Effet de profondeur */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.hover\:shadow-xl:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
</style>