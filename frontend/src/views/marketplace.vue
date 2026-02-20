<template>
  <SeoHead v-bind="seoMeta" />

  <div class="min-h-screen bg-gray-50 !h-auto">
    <!-- Catégories de navigation - Sticky -->
    <div class="bg-white border-b shadow-sm sticky -top-17 z-30">
      <div class="max-w-7xl mx-auto">
        <!-- Desktop : Catégories horizontales défilables -->
        <div class="hidden md:block relative">
          <!-- Bouton scroll gauche -->
          <button
            v-if="showLeftScroll"
            @click="scrollCategories('left')"
            class="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 border border-gray-200 hover:shadow-lg transition-all"
          >
            <i class="fas fa-chevron-left text-sm"></i>
          </button>

          <!-- Catégories scrollables horizontalement -->
          <div
            ref="categoriesContainer"
            class="flex overflow-x-auto hide-scrollbar px-4 py-2.5 gap-1 scroll-smooth"
            @scroll="checkScrollButtons"
          >
            <button
              v-for="category in getFilteredCategories()"
              :key="category.id"
              @click="setActiveCategory(category.id)"
              :class="[
                'flex items-center px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:shadow-sm',
                filters.activeCategory === category.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200',
              ]"
            >
              <i
                v-if="category.icon"
                :class="category.icon"
                class="mr-1.5 text-sm"
              ></i>
              {{ category.name }}
            </button>
          </div>

          <!-- Bouton scroll droit -->
          <button
            v-if="showRightScroll"
            @click="scrollCategories('right')"
            class="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 border border-gray-200 hover:shadow-lg transition-all"
          >
            <i class="fas fa-chevron-right text-sm"></i>
          </button>
        </div>

        <!-- Mobile : Header avec sélecteur compact -->
        <div class="md:hidden">
          <div class="flex items-center gap-2 px-4 py-2.5">
            <!-- Sélecteur de catégorie mobile -->
            <div class="relative flex-1">
              <select
                v-model="filters.activeCategory"
                @change="setActiveCategory($event.target.value)"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white appearance-none focus:border-primary focus:ring-1 focus:ring-green-200 outline-none"
              >
                <option value="all">Toutes les catégories</option>
                <option
                  v-for="category in categories.filter(
                    (c) => c.type === filters.contentType,
                  )"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
              >
                <i class="fas fa-chevron-down text-[10px]"></i>
              </div>
            </div>

            <!-- Filtres rapides compact -->
            <button
              @click="toggleFiltersPanel"
              class="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
              :class="{ 'bg-primary/10 text-primary': showFilters }"
            >
              <i class="fas fa-sliders-h text-sm"></i>
            </button>
          </div>

          <!-- Filtres rapides déroulants -->
          <div
            v-if="showFilters"
            class="px-4 py-2 bg-gray-50 border-t border-gray-100"
          >
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="filter in getQuickFilters()"
                :key="filter.id"
                @click="toggleQuickFilter(filter.id)"
                class="px-2.5 py-1 text-[10px] rounded-full border transition-all"
                :class="
                  filters.quickFilters.includes(filter.id)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200'
                "
              >
                {{ filter.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div class="max-w-7xl mx-auto px-4 py-6 bg-slate-100">
      <!-- Affichage des contenus -->
      <div v-if="isLoading">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
        >
          <ProductCardSkeleton v-for="i in 12" :key="i" />
        </div>
      </div>

      <!-- SECTION TENDANCES selon le type -->
      <div
        v-else-if="filters.activeCategory === 'all' && !filters.searchQuery"
        class="space-y-8"
      >
        <section>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
          >
            <template v-for="item in allItems" :key="`item-${item.id}`">
              <MesProductCard
                v-if="filters.contentType === 'product'"
                :produit="item"
                view-mode="grid"
                @click="viewProduct(item)"
              />
              <ServiceCard
                v-else
                :service="item"
                view-mode="grid"
                @click="viewService(item)"
              />
            </template>
          </div>

          <!-- Élément sentinelle pour le scroll infini -->
          <div ref="infiniteScrollTrigger" class="mt-4 pb-8">
            <div
              v-if="isLoadingMore"
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
            >
              <ProductCardSkeleton v-for="i in 12" :key="i" />
            </div>
            <div
              v-else-if="!hasMoreItems && allItems.length > 0"
              class="flex justify-center"
            >
              <p class="text-gray-400 text-sm italic">
                Vous avez vu tous les articles
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- RECHERCHE ou CATÉGORIE SPÉCIFIQUE -->
      <div v-else>
        <!-- Résumé des résultats -->
        <div class="bg-white rounded-lg p-4 mb-4 shadow-sm border">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-gray-600 text-sm">
                {{ allItems.length }} résultat(s)
                <span v-if="filters.searchQuery" class="text-primary">
                  pour "{{ filters.searchQuery }}"
                </span>
                <span
                  v-else-if="filters.activeCategory !== 'all'"
                  class="text-primary"
                >
                  dans cette catégorie
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- Grille des résultats -->
        <div
          :class="[
            'grid gap-4',
            filters.viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
              : 'grid-cols-1',
          ]"
        >
          <template v-for="item in allItems" :key="`${item.id}`">
            <MesProductCard
              :produit="item"
              :view-mode="filters.viewMode"
              @click="viewProduct(item)"
            />
          </template>
        </div>

        <!-- Élément sentinelle pour le scroll infini (mode filtré) -->
        <div ref="infiniteScrollTrigger" class="mt-4 pb-8">
          <div
            v-if="isLoadingMore"
            :class="[
              'grid gap-4',
              filters.viewMode === 'grid'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                : 'grid-cols-1',
            ]"
          >
            <ProductCardSkeleton v-for="i in 10" :key="i" />
          </div>
          <div
            v-else-if="!hasMoreItems && allItems.length > 0"
            class="flex justify-center"
          >
            <p class="text-gray-400 text-sm italic">Fin des résultats</p>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-if="!isLoading && allItems.length === 0" class="text-center py-12">
        <div class="bg-white rounded-lg p-8 shadow-sm border">
          <div
            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-search text-gray-400 text-xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Aucun résultat trouvé
          </h3>
          <p class="text-gray-600 mb-4">
            {{ getEmptyStateMessage() }}
          </p>
          <button
            @click="resetFilters"
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMarketplaceStore } from "../stores/marketplace";
import type { Product, Service } from "../stores/marketplace";
import SeoHead from "../components/SeoHead.vue";
import MesProductCard from "../components/mesProduits/MesProductCard.vue";
import ServiceCard from "../components/mesServices/MesServiceCard.vue";
import ProductCardSkeleton from "../components/ProductCardSkeleton.vue";

const router = useRouter();
const route = useRoute();
const marketplaceStore = useMarketplaceStore();

const { filters, isLoading } = marketplaceStore;
const categories = computed(() => marketplaceStore.categories || []);

// États pour le scroll infini
const infiniteScrollTrigger = ref<HTMLElement | null>(null);
const isLoadingMore = ref(false);
const hasMoreItems = computed(
  () =>
    marketplaceStore.pagination.currentPage <
    marketplaceStore.pagination.lastPage,
);

// États pour les catégories scrollables
const categoriesContainer = ref<HTMLElement | null>(null);
const showLeftScroll = ref(false);
const showRightScroll = ref(false);
const showFilters = ref(false);

// États recherche mobile
const showSearchBar = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

// Fonctions pour le scroll horizontal des catégories
const checkScrollButtons = () => {
  if (!categoriesContainer.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = categoriesContainer.value;
  showLeftScroll.value = scrollLeft > 10;
  showRightScroll.value = scrollLeft < scrollWidth - clientWidth - 10;
};

const scrollCategories = (direction: "left" | "right") => {
  if (!categoriesContainer.value) return;

  const scrollAmount = 200;
  const currentScroll = categoriesContainer.value.scrollLeft;

  categoriesContainer.value.scrollTo({
    left:
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount,
    behavior: "smooth",
  });
};

const toggleFiltersPanel = () => {
  showFilters.value = !showFilters.value;
};

// Gestionnaires d'événements clavier
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && showSearchBar.value) {
    showSearchBar.value = false;
  }
};

const onClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const isSearchArea =
    target.closest(".search-container") ||
    target.closest('button[class*="fa-search"]');

  if (showSearchBar.value && !isSearchArea) {
    showSearchBar.value = false;
  }
};

// Computed properties
const allItems = computed(() => {
  return filters.contentType === "product"
    ? marketplaceStore.products
    : marketplaceStore.services;
});

// Filtres rapides
const quickFilters = {
  product: [
    { id: "in stock", label: "📦 En stock" },
    { id: "revendable", label: "🔄 Revendable" },
    { id: "free shipping", label: "🚚 Livraison gratuite" },
    { id: "discount", label: "💸 En promo" },
  ],
  service: [
    { id: "available", label: "✅ Disponible" },
    { id: "urgent", label: "⚡ Urgent" },
    { id: "pro", label: "🏆 Professionnel" },
    { id: "home", label: "🏠 À domicile" },
  ],
};

// SEO
const seoMeta = computed(() => {
  const type = filters.contentType === "product" ? "produits" : "services";
  return {
    title: `${filters.contentType === "product" ? "Produits" : "Services"} - Marketplace | Espace Cameroun`,
    description: `Découvrez notre sélection de ${type} de qualité.`,
    keywords: `marketplace, cameroun, ${type}`,
    url: window.location.href,
    type: "website",
  };
});

// Méthodes du store
const setActiveCategory = async (categoryId: string) => {
  await marketplaceStore.setActiveCategory(categoryId);
};

const setSearchQuery = async (query: string) => {
  await marketplaceStore.setSearchQuery(query);
};

const resetFilters = async () => {
  await marketplaceStore.resetFilters();
};

const toggleQuickFilter = (filterId: string) => {
  marketplaceStore.toggleQuickFilter(filterId);
};

const loadMoreItems = async () => {
  if (isLoadingMore.value || !hasMoreItems.value) return;
  isLoadingMore.value = true;
  try {
    await marketplaceStore.fetchDataWithFilters(true);
  } finally {
    isLoadingMore.value = false;
  }
};

// Helpers
const getQuickFilters = () => {
  return quickFilters[filters.contentType] || [];
};

const areCategoriesLoaded = computed(() => categories.value.length > 0);

const getFilteredCategories = () => {
  if (!areCategoriesLoaded.value) return [];
  return [
    {
      id: "all",
      name: "Tous",
      icon: "fas fa-th-large",
      type: filters.contentType,
    },
    ...categories.value.filter((cat) => cat.type === filters.contentType),
  ];
};

const getEmptyStateMessage = () => {
  if (filters.searchQuery) {
    return `Aucun ${filters.contentType === "product" ? "produit" : "service"} trouvé pour "${filters.searchQuery}".`;
  }
  if (filters.activeCategory !== "all") {
    return `Aucun ${filters.contentType === "product" ? "produit" : "service"} dans cette catégorie.`;
  }
  return `Aucun ${filters.contentType === "product" ? "produit" : "service"} disponible.`;
};

const viewProduct = (product: Product) => {
  router.push(`/produits/${product.id}`);
};

const viewService = (service: Service) => {
  router.push(`/services/${service.id}`);
};

// Intersection Observer pour scroll infini
let observer: IntersectionObserver | null = null;

const setupIntersectionObserver = () => {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoading.value) {
        loadMoreItems();
      }
    },
    { rootMargin: "200px", threshold: 0.1 },
  );
  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value);
  }
};

// Lifecycle
onMounted(async () => {
  // Initialisation
  if (route.query.search) {
    marketplaceStore.filters.searchQuery = route.query.search as string;
  }

  await marketplaceStore.fetchMarketplaceData();
  setupIntersectionObserver();

  // Ajouter les listeners
  window.addEventListener("resize", checkScrollButtons);
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", onClickOutside);

  checkScrollButtons();
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  window.removeEventListener("resize", checkScrollButtons);
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("click", onClickOutside);
});

// Watchers
watch(
  [
    () => filters.activeCategory,
    () => filters.contentType,
    () => filters.searchQuery,
  ],
  () => {
    nextTick(() => {
      setupIntersectionObserver();
    });
  },
);

watch(
  () => route.query.search,
  (newSearch) => {
    if (
      newSearch !== undefined &&
      newSearch !== marketplaceStore.filters.searchQuery
    ) {
      marketplaceStore.setSearchQuery(newSearch as string);
    }
  },
);
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
