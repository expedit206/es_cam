<template>
  <SeoHead v-bind="seoMeta" />

  <div class="min-h-screen bg-gray-50">
    <!-- Barre de recherche principale AVEC FILTRES TYPE -->
    <div class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl px-4 py-1">
        <div class="flex flex-col gap-3">
          <!-- Première ligne : Navigation + Recherche (mobile) / Ensemble (desktop) -->
          <div class="flex items-center gap-1 w-full sm:flex-1">
            <!-- Navigation Produits/Services -->
            <!-- <div class="flex bg-gray-100 rounded-lg p-1">
                            <button @click="setContentType('product')" :class="[
                                'px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2',
                                filters.contentType === 'product'
                                    ? 'bg-white text-[var(--espace-vert)] shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            ]">
                                <i class="fas fa-box text-xs sm:text-sm"></i>
                                <span class=" xs:inline">Produits</span>
                            </button>
                            <button @click="setContentType('service')" :class="[
                                'px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2',
                                filters.contentType === 'service'
                                    ? 'bg-white text-[var(--espace-vert)] shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            ]">
                                <i class="fas fa-concierge-bell text-xs sm:text-sm"></i>
                                <span class=" xs:inline">Services</span>
                            </button>
                        </div> -->

            <!-- Sur mobile : Icône recherche à droite -->
            <!-- Sur desktop : Barre de recherche fixe -->
            <!-- <div class="sm:hidden">
                            <button @click="toggleSearchBar"
                                class="p-2 text-gray-600 hover:text-[var(--espace-vert)] hover:bg-green-50 rounded-lg transition-all duration-200"
                                :class="{ 'text-[var(--espace-vert)] bg-green-50': showSearchBar }">
                                <i class="fas fa-search text-lg"></i>
                            </button>
                        </div> -->

            <!-- Sur desktop : Barre de recherche toujours visible -->
            <!-- <div class="hidden sm:flex flex-1 ml-4">
                            <div class="relative w-full">
                                <i
                                    class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input v-model="filters.searchQuery" type="text" :placeholder="getSearchPlaceholder()"
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[var(--espace-vert)] focus:ring-2 focus:ring-green-200 outline-none transition-all text-sm"
                                    @input="handleSearchInput">
                                <button v-if="filters.searchQuery" @click="setSearchQuery('')"
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times text-sm"></i>
                                </button>
                            </div>
                        </div> -->
          </div>

          <!-- Filtres rapides -->
          <!-- <div class="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                        <button v-for="filter in getQuickFilters()" :key="filter.id"
                            @click="toggleQuickFilter(filter.id)" :class="[
                                'px-2 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1',
                                filters.activeQuickFilters.includes(filter.id)
                                    ? 'bg-[var(--espace-vert)] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            ]">
                            <i :class="filter.icon"></i>
                            <span>{{ filter.label }}</span>
                        </button>
                    </div> -->
        </div>
        <!-- Barre de recherche mobile dépliante -->
        <div v-if="showSearchBar" class="mt-3 animate-slide-down">
          <div class="relative">
            <i
              class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            ></i>
            <input
              v-model="filters.searchQuery"
              type="text"
              :placeholder="getSearchPlaceholder()"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--espace-vert)] focus:ring-2 focus:ring-green-200 outline-none transition-all"
              @input="handleSearchInput"
              ref="searchInput"
            />
            <button
              v-if="filters.searchQuery"
              @click="setSearchQuery('')"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Catégories de navigation -->
    <div
      class="bg-white sticky z-30 border-b shadow-sm transition-all duration-300 lg:top-14"
      :class="isHeaderVisible ? 'top-14' : 'top-0'"
    >
      <div class="max-w-7xl mx-auto">
        <!-- Desktop : Catégories horizontales -->
        <div class="hidden md:block">
          <div class="flex flex-wrap gap-2 px-4 py-3">
            <button
              v-for="category in getFilteredCategories()"
              :key="category.id"
              @click="setActiveCategory(category.id)"
              :class="[
                'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filters.activeCategory === category.id
                  ? 'bg-[var(--espace-vert)] text-white shadow-sm'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200',
              ]"
            >
              <i v-if="category.icon" :class="category.icon" class="mr-2"></i>
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- Mobile : Header avec sélecteur -->
        <div class="md:hidden border-b border-gray-200">
          <div class="flex items-center justify-between px-4 py-3">
            <!-- Sélecteur de catégorie mobile -->
            <div class="relative flex-1 ml-4">
              <select
                v-model="filters.activeCategory"
                @change="setActiveCategory($event.target.value)"
                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white appearance-none focus:border-[var(--espace-vert)] focus:ring-2 focus:ring-green-200 outline-none transition-all"
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
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              >
                <i class="fas fa-chevron-down text-sm"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Contenu Principal -->
    <div class="max-w-7xl mx-auto px-4 py-6 bg-slate-100">
      <!-- En-tête dynamique -->

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
                <span
                  v-if="filters.searchQuery"
                  class="text-[var(--espace-vert)]"
                >
                  pour "{{ filters.searchQuery }}"
                </span>
                <span
                  v-else-if="filters.activeCategory !== 'all'"
                  class="text-[var(--espace-vert)]"
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
            class="bg-[var(--espace-vert)] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
import type { Product, Service, Category } from "../stores/marketplace";
import SeoHead from "../components/SeoHead.vue";
import MesProductCard from "../components/mesProduits/MesProductCard.vue";
import ServiceCard from "../components/mesServices/MesServiceCard.vue";
import Pagination from "../components/Pagination.vue";
import Loader from "../components/Loader.vue";
import ProductCardSkeleton from "../components/ProductCardSkeleton.vue";

const router = useRouter();
const route = useRoute();
const marketplaceStore = useMarketplaceStore();

const { filters, pagination, isLoading } = marketplaceStore;
const categories = computed(() => marketplaceStore.categories || []);

// Getters via computed (attendent que le store soit prêt)
const trendingProducts = computed(() => marketplaceStore.trendingProducts);
const popularServices = computed(() => marketplaceStore.popularServices);
const productsStats = computed(() => marketplaceStore.productsStats);
const servicesStats = computed(() => marketplaceStore.servicesStats);
// const filteredItems = computed(() => marketplaceStore.filteredItems);

// États pour le scroll infini
const infiniteScrollTrigger = ref<HTMLElement | null>(null);
const isLoadingMore = ref(false);
const hasMoreItems = computed(
  () =>
    marketplaceStore.pagination.currentPage <
    marketplaceStore.pagination.lastPage,
);

// État pour contrôler l'affichage de la barre de recherche mobile
const showSearchBar = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

// Gestion du scroll pour la barre de catégories sticky
const isHeaderVisible = ref(true);
const lastScrollTop = ref(0);

const handleScroll = () => {
  const main = document.querySelector("main");
  if (!main) return;

  const currentScrollTop = main.scrollTop;
  if (currentScrollTop < 0) return; // Ignore elastic scrolling

  // Toujours visible en haut de page
  if (currentScrollTop < 50) {
    isHeaderVisible.value = true;
    lastScrollTop.value = currentScrollTop;
    return;
  }

  const diff = currentScrollTop - lastScrollTop.value;
  // Scroll vers le bas -> cacher (top-0)
  if (diff > 10) {
    isHeaderVisible.value = false;
  }
  // Scroll vers le haut -> afficher (top-14)
  else if (diff < -10) {
    isHeaderVisible.value = true;
  }

  lastScrollTop.value = currentScrollTop;
};

// ... existing code ...

const toggleSearchBar = async () => {
  showSearchBar.value = !showSearchBar.value;
  // Focus sur l'input quand la barre se déplie (mobile seulement)
  if (showSearchBar.value) {
    // await nextTick();
    // searchInput.value?.focus();
  }
  // alert(showSearchBar.value)
};

// Fermer la barre de recherche mobile en appuyant sur Echap
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && showSearchBar.value) {
    showSearchBar.value = false;
  }
};

// Écouter les événements clavier
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});

// Fermer la barre de recherche mobile quand on clique ailleurs
const onClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const isSearchArea =
    target.closest(".search-container") ||
    target.closest('button[class*="fa-search"]');

  if (showSearchBar.value && !isSearchArea) {
    showSearchBar.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});

// Computed properties simplifiées
const allItems = computed(() => {
  return filters.contentType === "product"
    ? marketplaceStore.products
    : marketplaceStore.services;
});

const newItems = computed(() => {
  return allItems.value
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 10);
});

// Filtres rapides adaptés au type de contenu
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

// Métadonnées SEO
const seoMeta = computed(() => {
  const type = filters.contentType === "product" ? "produits" : "services";

  return {
    title: `${filters.contentType === "product" ? "Produits" : "Services"} - Marketplace | Espace Cameroun`,
    description: `Découvrez notre sélection de ${type} de qualité. ${getSectionDescription()}`,
    keywords: `marketplace, cameroun, ${type}, ${filters.contentType === "product" ? "achats en ligne" : "services professionnels"}`,
    url: window.location.href,
    type: "website",
  };
});

// Dans votre composant
const setContentType = async (type: "product" | "service") => {
  try {
    await marketplaceStore.setContentType(type);
  } catch (error) {
    console.error("Error setting content type:", error);
  }
};

const setActiveCategory = async (categoryId: string) => {
  try {
    await marketplaceStore.setActiveCategory(categoryId);
  } catch (error) {
    console.error("Error setting active category:", error);
  }
};

const setSearchQuery = async (query: string) => {
  try {
    await marketplaceStore.setSearchQuery(query);
  } catch (error) {
    console.error("Error setting search query:", error);
  }
};

const resetFilters = async () => {
  try {
    await marketplaceStore.resetFilters();
  } catch (error) {
    console.error("Error resetting filters:", error);
  }
};

const setSortBy = (sortBy: string) => {
  marketplaceStore.setSortBy(sortBy);
};

const setViewMode = (mode: "grid" | "list") => {
  marketplaceStore.setViewMode(mode);
};

const toggleQuickFilter = (filterId: string) => {
  marketplaceStore.toggleQuickFilter(filterId);
};

const loadMoreItems = async () => {
  if (isLoadingMore.value || !hasMoreItems.value) return;

  isLoadingMore.value = true;
  try {
    await marketplaceStore.fetchDataWithFilters(true);
  } catch (error) {
    console.error("Erreur lors du chargement de plus d'articles:", error);
  } finally {
    isLoadingMore.value = false;
  }
};

// Méthodes helpers
const getQuickFilters = () => {
  return quickFilters[filters.contentType] || [];
};

const areCategoriesLoaded = computed(() => categories.value.length > 0);

// Dans votre composant, modifiez la méthode getFilteredCategories()
const getFilteredCategories = () => {
  if (!areCategoriesLoaded.value) return [];

  // Créer un tableau avec la catégorie "Tous" en premier
  const allCategories = [
    {
      id: "all",
      name: "Tous",
      icon: "fas fa-th-large",
      type: filters.contentType,
    },
    ...categories.value.filter((cat) => cat.type === filters.contentType),
  ];

  return allCategories;
};

const getSearchPlaceholder = () => {
  return filters.contentType === "product"
    ? "Rechercher des produits, marques..."
    : "Rechercher des services, compétences...";
};

const getSectionTitle = () => {
  if (filters.searchQuery) return `Résultats pour "${filters.searchQuery}"`;
  if (filters.activeCategory !== "all") {
    return (
      categories.value.find((c) => c.id === filters.activeCategory)?.name ||
      "Catégorie"
    );
  }
  // return filters.contentType === 'product' ? 'Nos Produits' : 'Nos Services';
};

const getSectionDescription = () => {
  // if (filters.searchQuery) return `${filteredItems.value.length} résultat(s) trouvé(s)`;
  // if (filters.activeCategory !== 'all') return 'Les meilleures offres de cette catégorie';
  // return `${filteredItems.value.length} ${filters.contentType === 'product' ? 'produit(s)' : 'service(s)'} disponible(s)`;
};

const getEmptyStateMessage = () => {
  if (filters.searchQuery) {
    return `Aucun ${filters.contentType === "product" ? "produit" : "service"} trouvé pour "${filters.searchQuery}". Essayez avec d'autres termes.`;
  }
  if (filters.activeCategory !== "all") {
    return `Aucun ${filters.contentType === "product" ? "produit" : "service"} trouvé dans cette catégorie.`;
  }
  return `Aucun ${filters.contentType === "product" ? "produit" : "service"} disponible pour le moment.`;
};

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  setSearchQuery(target.value);
};

const viewProduct = (product: Product) => {
  router.push(`/produits/${product.id}`);
};

const viewService = (service: Service) => {
  router.push(`/services/${service.id}`);
};

// Watchers pour le chargement automatique des données
watch(
  () => filters.contentType,
  async (newType) => {
    if (newType === "product" && marketplaceStore.products.length === 0) {
      await marketplaceStore.fetchProducts();
    } else if (
      newType === "service" &&
      marketplaceStore.services.length === 0
    ) {
      await marketplaceStore.fetchServices();
    }
  },
);

// Configuration de l'Intersection Observer pour le scroll infini
let observer: IntersectionObserver | null = null;

const setupIntersectionObserver = () => {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !(isLoading as any).value) {
        loadMoreItems();
      }
    },
    {
      rootMargin: "200px", // Charger un peu avant la fin
      threshold: 0.1,
    },
  );

  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value);
  }
};

onMounted(async () => {
  // Si un paramètre de recherche est présent dans l'URL
  if (route.query.search) {
    marketplaceStore.filters.searchQuery = route.query.search as string;
  }

  await marketplaceStore.fetchMarketplaceData();
  setupIntersectionObserver();

  const main = document.querySelector("main");
  if (main) main.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  const main = document.querySelector("main");
  if (main) main.removeEventListener("scroll", handleScroll);

  if (observer) observer.disconnect();
});

// Ré-attacher l'observateur si les contenus changent (quand l'élément peut être recréé par v-if)
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

// Surveiller les changements de l'URL pour la recherche
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

/* Masquer la scrollbar pour les filtres rapides */
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>
