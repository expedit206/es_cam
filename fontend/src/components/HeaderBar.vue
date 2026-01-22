<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/Auth";
import { useBadgeStore } from "../stores/badgeStore";
import apiClient from "../api/index";
import { useProductStore } from "../stores/product";
import { useI18n } from "../components/useI18n";
import { debounce } from "../utils/debounce";

const categories = [
  { id: 1, name: "Téléphones", slug: "telephones", icon: "fas fa-mobile-alt" },
  { id: 2, name: "Mode", slug: "mode", icon: "fas fa-tshirt" },
  { id: 3, name: "Électronique", slug: "electronique", icon: "fas fa-laptop" },
  { id: 4, name: "Maison", slug: "maison", icon: "fas fa-home" },
  { id: 5, name: "Véhicules", slug: "vehicules", icon: "fas fa-car" },
];

const { t } = useI18n();
const authStore = useAuthStore();
const badgeStore = useBadgeStore();
const router = useRouter();
const user = computed(() => authStore.user);
const route = useRoute();
const animateReventeBadge = ref(false);
const animateMessagesBadge = ref(false);
const animateNotificationsBadge = ref(false);
const searchQuery = ref("");
const productStore = useProductStore();
const showSearchOverlay = ref(false); // Changé de showSearch
const searchOverlayRef = ref<HTMLElement | null>(null);
const ignoreNextClick = ref(false);
const isSidebarCollapsed = ref(false);
const showMobileMenu = ref(false);

// Historique de recherche
const searchHistory = ref<string[]>([]);
const showSearchHistory = ref(false);
const liveSearchResults = ref<any[]>([]);
const isSearching = ref(false);

// Suggestions de recherche
const searchSuggestions = ref([
  { text: "iPhone 14", category: "Téléphones" },
  { text: "Mode africaine", category: "Vêtements" },
  { text: "Maison à louer", category: "Immobilier" },
  { text: "Toyota RAV4", category: "Véhicules" },
  // { text: "Services de plomberie", category: "Services" },
]);

// Ref pour le bouton menu mobile
const mobileMenuButtonRef = ref<HTMLElement | null>(null);
const mobileMenuRef = ref<HTMLElement | null>(null);

// Ref pour le bouton de recherche mobile
const mobileSearchButtonRef = ref<HTMLElement | null>(null);

const subscribeToChannel = () => {
  if (!user.value?.id) return;
  console.log("Écoute des messages en temps réel activée");
};

const getStorageBaseUrl = () => {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8000/storage/";
  }
  return "https://api.espacecameroun.com/storage/";
};

const storageUrl = computed(() => getStorageBaseUrl());

// Navigation pour sidebar desktop
const navLinks = computed(() => {
  const baseLinks = [
    // Navigation principale
    { to: "/", label: t("Home"), icon: "fa-home", badge: 0, showAlways: true },
    {
      to: "/market-place",
      label: t("Explore"),
      icon: "fa-search",
      badge: 0,
      showAlways: true,
    },

    // Marketplace
    {
      to: "/gallery",
      label: t("Gallery"),
      icon: "fa-circle-plus",
      featured: true,
      badge: 0,
      showAlways: true,
    },
    {
      to: "/categories",
      label: t("Categories"),
      icon: "fa-tags",
      badge: 0,
      showAlways: true,
    },

    // Messages et reventes (seulement connecté)
    {
      to: "/messages",
      label: t("Messages"),
      icon: "fa-comment-dots",
      badge: authStore.user ? badgeStore.badgeCounts.messages : 0,
      badgeKey: "messages",
      requiresAuth: true,
    },
    {
      to: "/reventes",
      label: t("Reventes"),
      icon: "fa-handshake",
      badge: authStore.user ? badgeStore.badgeCounts.reventes : 0,
      badgeKey: "reventes",
      requiresAuth: true,
    },

    // Mon espace (seulement connecté)
    {
      to: "/favoris",
      label: t("My Favorites"),
      icon: "fa-heart",
      badge: 0,
      requiresAuth: true,
    },

    // Monnaie & jetons (seulement connecté)
    // { to: '/jeton-history', label: t('my tokens'), icon: 'fa-coins', badge: 0, requiresAuth: true },



    // Blog
    {
      to: "/blog",
      label: "Blog",
      icon: "fa-newspaper",
      badge: 0,
      showAlways: true,
    },

    // Support & informations
    {
      to: "/aide",
      label: t("Help & Support"),
      icon: "fa-question-circle",
      badge: 0,
      showAlways: true,
    },
    {
      to: "/doc",
      label: t("About App"),
      icon: "fa-info-circle",
      badge: 0,
      showAlways: true,
    },

    // Paramètres (seulement connecté)
    {
      to: "/parametres",
      label: t("Settings"),
      icon: "fa-cog",
      badge: 0,
      requiresAuth: true,
    },
  ];

  // Ajouter le lien Admin si nécessaire
  if (user.value && user.value?.role === 'admin') {
    baseLinks.push({
      to: "/admin/dashboard",
      label: "Administration",
      icon: "fa-user-shield",
      badge: 0,
      showAlways: true,
    } as any);
  }

  // Filtrer les liens selon l'état de connexion
  return baseLinks.filter(link => !link.requiresAuth || (user.value));
});
console.log(user.value)

// Menu mobile - Adapté selon l'état de connexion
const mobileMenuItems = computed(() => {
  const items = [];

  // Liens communs (toujours présents au début ou ordonnés logiquement)

  if (!user.value) {
    // Menu pour utilisateur NON connecté
    return [

      {
        label: t("Categories"),
        icon: "fa-tags",
        action: () => router.push("/categories"),
      },
      {
        label: "Blog",
        icon: "fa-newspaper",
        action: () => router.push("/blog"),
      },
      {
        label: t("Login"),
        icon: "fa-sign-in-alt",
        action: () => router.push("/login"),
      },
      {
        label: t("Register"),
        icon: "fa-user-plus",
        action: () => router.push("/register"),
      },
      {
        label: t("Help & Support"),
        icon: "fa-question-circle",
        action: () => router.push("/aide"),
      },
      {
        label: t("About App"),
        icon: "fa-info-circle",
        action: () => router.push("/doc"),
      },
    ];
  }

  // Menu pour utilisateur connecté
  // Administration au début pour les admins
  if (user.value?.role === 'admin') {
    items.unshift({
      label: "Administration",
      icon: "fa-user-shield",
      action: () => router.push("/admin/dashboard"),
    });
  }

  return [
    ...items,

    {
      label: t("Profile"),
      icon: "fa-user",
      action: () => router.push("/profil"),
    },
    {
      label: t("My Favorites"),
      icon: "fa-heart",
      action: () => router.push("/favoris"),
    },

    // Messages & Reventes (avec badges)
  


   

    {
      label: t("Categories"),
      icon: "fa-tags",
      action: () => router.push("/categories"),
    },
    {
      label: "Blog",
      icon: "fa-newspaper",
      action: () => router.push("/blog"),
    },

    {
      label: t("Help & Support"),
      icon: "fa-question-circle",
      action: () => router.push("/aide"),
    },
    {
      label: t("About App"),
      icon: "fa-info-circle",
      action: () => router.push("/doc"),
    },

    {
      label: t("Settings"),
      icon: "fa-cog",
      action: () => router.push("/parametres"),
    },

    {
      label: t("Logout"),
      icon: "fa-sign-out-alt",
      danger: true,
      action: () => {
        authStore.logout();
        badgeStore.resetAllCounts();
        showMobileMenu.value = false;
        router.push("/");
      },
    },
  ];
});

const notifications = computed(() => [
  {
    id: 1,
    type: "message",
    content: t("New message received"),
    time: "2 min",
    read: false,
  },
  {
    id: 2,
    type: "revente",
    content: t("Resale request received"),
    time: "5 min",
    read: false,
  },
  {
    id: 3,
    type: "system",
    content: t("System update"),
    time: "1h",
    read: true,
  },
]);

const unreadNotificationsCount = computed(() => {
  return notifications.value.filter((notif) => !notif.read).length;
});

const fetchBadges = async () => {
  if (!user.value) return;
  try {
    await badgeStore.fetchBadgeCounts();
  } catch (error) {
    console.error(t("Error loading badges:"), error);
  }
};

const initializeUserData = async () => {
  if (!user.value && authStore.token) {
    try {
      await authStore.checkAuth();
    } catch (error) {
      console.error(t("Error fetching user:"), error);
    }
  }
  if (user.value) {
    await fetchBadges();
  }
};

// Charger l'historique de recherche depuis le localStorage
const loadSearchHistory = () => {
  const savedHistory = localStorage.getItem("espace_search_history");
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory);
  }
};

// Sauvegarder une recherche dans l'historique
const saveToSearchHistory = (query: string) => {
  if (!query.trim()) return;

  // Supprimer les doublons
  const index = searchHistory.value.indexOf(query);
  if (index > -1) {
    searchHistory.value.splice(index, 1);
  }

  // Ajouter au début
  searchHistory.value.unshift(query);

  // Limiter à 10 éléments
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10);
  }

  // Sauvegarder
  localStorage.setItem(
    "espace_search_history",
    JSON.stringify(searchHistory.value)
  );
};

// Effacer un élément de l'historique
const removeFromSearchHistory = (query: string, event: Event) => {
  event.stopPropagation();
  const index = searchHistory.value.indexOf(query);
  if (index > -1) {
    searchHistory.value.splice(index, 1);
    localStorage.setItem(
      "espace_search_history",
      JSON.stringify(searchHistory.value)
    );
  }
};

// Effacer tout l'historique
const clearSearchHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem("espace_search_history");
};

// Watchers pour animer les badges
watch(
  () => badgeStore.badgeCounts.reventes,
  (newValue, oldValue) => {
    if (newValue > oldValue && newValue > 0) {
      animateReventeBadge.value = true;
      setTimeout(() => (animateReventeBadge.value = false), 300);
    }
  }
);

watch(
  () => badgeStore.badgeCounts.messages,
  (newValue, oldValue) => {
    if (newValue > oldValue && newValue > 0) {
      animateMessagesBadge.value = true;
      setTimeout(() => (animateMessagesBadge.value = false), 300);
    }
  }
);

// Écouter les changements d'authentification
watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await fetchBadges();
    } else {
      badgeStore.resetAllCounts();
    }
  },
  { immediate: true }
);

const performLiveSearch = debounce(async (query: string) => {
  if (!query || query.length < 2) {
    liveSearchResults.value = [];
    return;
  }

  isSearching.value = true;
  try {
    // Recherche mixte produits et services via l'endpoint global
    const response = await apiClient.get("/marketplace/search", {
      params: { q: query, limit: 10 },
    });

    if (response.data && response.data.data) {
      const products = response.data.data.products || [];
      const services = []; // response.data.data.services || [];

      // Combiner les résultats pour l'affichage en direct
      liveSearchResults.value = [...products, ...services].slice(0, 10);
    } else {
      liveSearchResults.value = [];
    }
  } catch (error) {
    console.error("Erreur recherche live:", error);
    liveSearchResults.value = [];
  } finally {
    isSearching.value = false;
  }
}, 300);

watch(searchQuery, (newVal) => {
  if (!newVal) {
    liveSearchResults.value = [];
    showSearchHistory.value = true;
  } else {
    showSearchHistory.value = false;
    performLiveSearch(newVal);
  }
});

const goToProduct = (item: any) => {
  showSearchOverlay.value = false;
  // Réinitialiser le champ de recherche après clic
  searchQuery.value = "";

  // Déterminer s'il s'agit d'un produit ou d'un service
  const isService = item.result_type === "service" || !!item.titre;

  if (isService) {
    router.push(`/services/${item.id}`);
  } else {
    router.push(`/produits/${item.id}`);
  }
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target) target.src = "/placeholder.jpg";
};

// Effectuer une recherche
const performSearch = async (query?: string) => {
  const searchTerm = query || searchQuery.value.trim();
  if (!searchTerm) return;

  // Sauvegarder dans l'historique
  saveToSearchHistory(searchTerm);

  // Fermer l'overlay de recherche
  showSearchOverlay.value = false;
  showSearchHistory.value = false;

  // Rediriger vers la page de recherche
  router.push(`/market-place?search=${encodeURIComponent(searchTerm)}`);

  // Réinitialiser le champ de recherche
  searchQuery.value = "";
};

// Recherche rapide depuis l'historique ou les suggestions
const quickSearch = (query: string) => {
  searchQuery.value = query;
  performSearch(query);
};

// Toggle overlay de recherche mobile
const toggleSearchOverlay = () => {
  showSearchOverlay.value = !showSearchOverlay.value;
  if (showSearchOverlay.value) {
    loadSearchHistory();
    showSearchHistory.value = true;
    ignoreNextClick.value = true;
    nextTick(() => {
      const input = document.querySelector(
        "#mobile-search-input"
      ) as HTMLInputElement;
      if (input) input.focus();
    });
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (ignoreNextClick.value) {
    ignoreNextClick.value = false;
    return;
  }

  // Fermer le menu mobile si on clique à l'extérieur
  if (
    showMobileMenu.value &&
    mobileMenuButtonRef.value &&
    !mobileMenuButtonRef.value.contains(event.target as Node) &&
    mobileMenuRef.value &&
    !mobileMenuRef.value.contains(event.target as Node)
  ) {
    showMobileMenu.value = false;
  }

  // Fermer l'overlay de recherche si on clique à l'extérieur
  if (
    showSearchOverlay.value &&
    searchOverlayRef.value &&
    !searchOverlayRef.value.contains(event.target as Node) &&
    mobileSearchButtonRef.value &&
    !mobileSearchButtonRef.value.contains(event.target as Node)
  ) {
    showSearchOverlay.value = false;
    showSearchHistory.value = false;
  }
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

// Navigation
const handleNavigation = async (to: string, badgeKey?: string) => {
  if (badgeKey) {
    await badgeStore.markAsRead(badgeKey as "reventes" | "parrainages");
  }
  router.push(to);
};



onMounted(async () => {
  await initializeUserData();
  document.addEventListener("click", handleClickOutside);

  if (user.value?.id) {
    subscribeToChannel();
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <!-- Sidebar pour desktop (inchangée) -->
  <div
    class="lg:flex hidden flex-col bg-green-100/10 h-full w-4 z-100 left-0 top-0 z-50 transition-all duration-300"
    :class="isSidebarCollapsed ? 'w-20' : 'w-64'"
  >
    <!-- Logo -->
    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
      <RouterLink to="/" :aria-label="t('Go back to home')" class="flex items-center">
        <img
          :src="
            isSidebarCollapsed
              ? '/src/assets/images/logo/logo_vert.png'
              : '/src/assets/images/logo/LOGO_vert_all.png'
          "
          :alt="t('Espace Cameroun Logo')"
          class="h-8 object-contain transition-transform duration-300"
          :class="isSidebarCollapsed ? 'w-18' : 'w-32'"
        />
      </RouterLink>

      <!-- Bouton pour réduire/étendre -->
      <button
        @click="toggleSidebar"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <i
          class="fas"
          :class="isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"
        ></i>
      </button>
    </div>

    <!-- Recherche Desktop Sidebar -->
    <div class="px-3 py-4 border-b border-gray-100" v-if="!isSidebarCollapsed">
      <div class="relative group">
        <i
          class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--espace-vert)] transition-colors"
        ></i>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('Search') + '...'"
          class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-[var(--espace-vert)] transition-all"
          @keyup.enter="performSearch()"
          @focus="showSearchHistory = !searchQuery"
        />

        <!-- Résultats live desktop -->
        <div
          v-if="searchQuery.length >= 2 && liveSearchResults.length > 0"
          class="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-[200] max-h-[400px] overflow-y-auto"
        >
          <div class="p-2 space-y-1">
            <button
              v-for="item in liveSearchResults"
              :key="item.id"
              @click="goToProduct(item)"
              class="w-full text-left p-2 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors border border-transparent hover:border-gray-100"
            >
              <img
                :src="
                  item.photos?.[0]
                    ? storageUrl + item.photos[0]
                    : item.images?.[0]
                      ? storageUrl + item.images[0]
                      : '/placeholder.jpg'
                "
                class="w-10 h-10 object-cover rounded-md bg-gray-100 shrink-0"
                @error="handleImageError($event)"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 truncate text-xs">
                  {{ item.nom || item.titre }}
                </h4>
                <p class="text-[10px] text-[var(--espace-vert)] font-bold">
                  {{ item.prix }} FCFA
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Icône recherche si sidebar réduite -->
    <div
      class="flex justify-center py-4 border-b border-gray-100"
      v-if="isSidebarCollapsed"
    >
      <button
        @click="toggleSidebar"
        class="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
      >
        <i class="fas fa-search"></i>
      </button>
    </div>

    <!-- Navigation -->
    <div
      v-if="user"
      class="hidden lg:flex z-150 flex items-center gap-2 rounded-full px-4 pt-1"
    >
      <i class="fas fa-coins text-[var(--espace-or)] text-lg"></i>
      <span class="text-sm font-semibold text-[var(--espace-vert)]">
        <!-- <router-link to="/jeton-history">
                    <span v-if="!isSidebarCollapsed">
                        {{ t('tokens') }}:
                    </span>
                    <span>{{ user?.jetons }}</span>
                </router-link> -->
      </span>
    </div>
    <nav class="flex-1 py-4 space-y-2 overflow-y-scroll">
      <!-- Liens de navigation -->
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="flex items-center mx-3 p-3 rounded-xl transition-all duration-300 group relative justify-center"
        :class="[
          $route.path === link.to
            ? 'bg-[var(--espace-vert)] text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-100 hover:text-[var(--espace-vert)]',
          isSidebarCollapsed ? 'justify-center' : 'justify-start',
        ]"
        :title="isSidebarCollapsed ? link.label : ''"
        @click="link.badgeKey ? handleNavigation(link.to, link.badgeKey) : null"
      >
        <!-- Icône -->
        <div class="relative flex justify-center">
          <i
            class="fas text-lg text-center transition-transform duration-300"
            :class="[
              link.icon,
              link.featured ? 'transform group-hover:scale-110' : '',
            ]"
          ></i>

          <!-- Badge -->
          <span
            v-if="link.badge > 0"
            class="absolute -top-2 -right-2 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white"
            :class="{
              'animate-scale':
                (link.to === '/reventes' && animateReventeBadge) ||
                (link.to === '/messages' && animateMessagesBadge),
              'featured-badge': link.featured,
            }"
          >
            {{ link.badge > 99 ? "99+" : link.badge }}
          </span>
        </div>

        <!-- Label -->
        <span
          v-if="!isSidebarCollapsed"
          class="ml-3 font-medium transition-all duration-300 whitespace-nowrap"
          :class="[link.featured ? 'font-semibold' : '']"
        >
          {{ link.label }}
        </span>

        <!-- Indicateur de page active -->
        <div
          v-if="$route.path === link.to && !isSidebarCollapsed"
          class="absolute right-3 w-2 h-2 bg-white rounded-full"
        ></div>
      </RouterLink>
    </nav>

    <!-- Section utilisateur -->
    <div class="p-4 border-t border-gray-200">
      <RouterLink
        v-if="user"
        to="/profil"
        class="flex items-center rounded-lg hover:bg-gray-100 transition-colors p-2 w-full"
        :class="isSidebarCollapsed ? 'justify-center' : ''"
        :aria-label="t('Profile')"
      >
        <div class="relative">
          <img
            v-if="user?.photo"
            :src="storageUrl + user.photo"
            :alt="t('Profile picture')"
            class="w-8 h-8 rounded-full object-cover border-2 border-gray-300 transition-transform duration-300 hover:scale-105"
          />
          <div
            v-else
            class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center transition-transform duration-300 hover:scale-105"
          >
            <i class="fas fa-user-circle text-gray-500"></i>
          </div>
        </div>

        <div
          v-if="!isSidebarCollapsed"
          class="ml-3 transition-all duration-300 overflow-hidden text-left"
        >
          <p class="text-sm font-medium text-gray-700 truncate">
            {{ user?.nom || user?.email }}
          </p>
          <p class="text-xs text-gray-500">
            {{ t("Profile") }}
          </p>
        </div>
      </RouterLink>

      <!-- Si non connecté, lien vers login -->
      <RouterLink
        v-else
        to="/login"
        class="flex items-center rounded-lg hover:bg-gray-100 transition-colors p-2 w-full text-gray-700"
        :class="isSidebarCollapsed ? 'justify-center' : ''"
      >
        <i class="fas fa-sign-in-alt text-lg"></i>
        <span v-if="!isSidebarCollapsed" class="ml-3 font-medium">
          {{ t("Login") }}
        </span>
      </RouterLink>
    </div>
  </div>

  <!-- Header mobile avec recherche avancée -->
  <div class="lg:hidden relative w-full z-155">
    <!-- Barre de navigation principale mobile -->
    <header class="bg-white shadow-md sticky top-0 z-40 border-b">
      <div class="px-4 py-3">
        <div class="flex items-center">
          <!-- Logo -->
          <RouterLink to="/" class="flex items-center shrink-0">
            <img
              src="/src/assets/images/logo/LOGO_vert_all.png"
              class="h-8 w-auto object-contain"
            />
          </RouterLink>

          <!-- Recherche visible -->
          <div class="flex-1 mx-3">
            <div
              class="flex items-center bg-gray-100 rounded-full px-4 py-2 cursor-text"
              @click="toggleSearchOverlay"
            >
              <i class="fas fa-search text-gray-400 mr-2"></i>
              <span class="text-gray-400 text-sm truncate">
                {{ t("What are you looking for?") }}…
              </span>
            </div>
          </div>

          <!-- Menu -->
          <button
            ref="mobileMenuButtonRef"
            @click="toggleMobileMenu"
            class="relative p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <i class="fas fa-bars text-xl text-gray-700"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Overlay de recherche mobile (comme les apps modernes) -->
    <div
      v-if="showSearchOverlay"
      ref="searchOverlayRef"
      class="fixed inset-0 bg-white z-50 transform transition-all duration-300 ease-out"
      :class="showSearchOverlay ? 'translate-y-0' : '-translate-y-full'"
    >
      <!-- Barre de recherche en haut -->
      <div class="bg-white border-b px-4 py-3">
        <div class="flex items-center">
          <!-- Bouton retour -->
          <button @click="showSearchOverlay = false" class="p-2 mr-3">
            <i class="fas fa-arrow-left text-xl text-gray-700"></i>
          </button>

          <!-- Champ de recherche -->
          <div class="flex-1 relative">
            <input
              id="mobile-search-input"
              v-model="searchQuery"
              type="text"
              :placeholder="t('What are you looking for?')"
              class="w-full px-4 py-3 pl-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] focus:bg-white"
              @input="showSearchHistory = searchQuery.length === 0"
              @keyup.enter="performSearch()"
            />
            <!-- <i class="fas fa-search absolute left-3 top-4 text-gray-400"></i> -->

            <!-- Bouton effacer -->
            <button
              v-if="searchQuery.length > 0"
              @click="
                searchQuery = '';
                showSearchHistory = true;
              "
              class="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <button
            @click="performSearch()"
            :disabled="!searchQuery.trim()"
            class="ml-3 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
            :class="
              searchQuery.trim()
                ? 'bg-[var(--espace-vert)] text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            "
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      <!-- Contenu de l'overlay -->
      <div class="overflow-y-auto h-[calc(100vh-70px)] pb-20">
        <!-- Historique de recherche -->
        <div
          v-if="showSearchHistory && searchHistory.length > 0"
          class="px-4 pt-4"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ t("Recent searches") }}
            </h3>
            <button
              @click="clearSearchHistory"
              class="text-sm text-[var(--espace-vert)] hover:underline"
            >
              {{ t("Clear all") }}
            </button>
          </div>

          <div class="space-y-2">
            <button
              v-for="(item, index) in searchHistory"
              :key="index"
              @click="quickSearch(item)"
              class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div class="flex items-center">
                <i class="fas fa-history text-gray-400 mr-3"></i>
                <span class="text-gray-700">{{ item }}</span>
              </div>
              <button
                @click.stop="removeFromSearchHistory(item, $event)"
                class="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-opacity"
              >
                <i class="fas fa-times text-gray-400 text-sm"></i>
              </button>
            </button>
          </div>
        </div>

        <!-- Suggestions de recherche -->
        <div v-if="showSearchHistory" class="px-4 pt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">
            {{ t("Popular suggestions") }}
          </h3>

          <div class="space-y-2">
            <button
              v-for="(suggestion, index) in searchSuggestions"
              :key="index"
              @click="quickSearch(suggestion.text)"
              class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <i class="fas fa-search text-gray-400 mr-3"></i>
                  <span class="text-gray-700">{{ suggestion.text }}</span>
                </div>
                <span
                  class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                >
                  {{ suggestion.category }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Catégories rapides -->
        <div v-if="showSearchHistory" class="px-4 pt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">
            {{ t("Search by category") }}
          </h3>

          <div class="grid grid-cols-2 gap-3">
            <RouterLink
              v-for="cat in categories"
              :key="cat.id"
              :to="`/categorie/${cat.slug}`"
              @click="showSearchOverlay = false"
              class="flex items-center p-3 rounded-lg border border-gray-200 hover:border-[var(--espace-vert)] hover:bg-gray-50 transition-colors"
            >
              <div
                class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3"
              >
                <i :class="cat.icon" class="text-gray-600"></i>
              </div>
              <span class="text-sm font-medium text-gray-700">{{
                cat.name
              }}</span>
            </RouterLink>
          </div>
        </div>

        <!-- Résultats de recherche en temps réel -->
        <div
          v-if="searchQuery.length > 0 && !showSearchHistory"
          class="px-4 pt-4"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-3">
            {{ t("No results found for") }} "{{ searchQuery }}"
          </h3>

          <div v-if="isSearching" class="text-center py-8">
            <i
              class="fas fa-spinner fa-spin text-2xl text-[var(--espace-vert)]"
            ></i>
          </div>

          <div v-else-if="liveSearchResults.length > 0" class="space-y-3">
            <button
              v-for="item in liveSearchResults"
              :key="item.id"
              @click="goToProduct(item)"
              class="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-start gap-3 transition-colors border border-gray-100 hover:border-gray-200 shadow-sm"
            >
              <img
                :src="
                  item.photos?.[0]
                    ? storageUrl + item.photos[0]
                    : item.images?.[0]
                      ? storageUrl + item.images[0]
                      : '/placeholder.jpg'
                "
                class="w-16 h-16 object-cover rounded-md bg-gray-200 shrink-0"
                @error="handleImageError($event)"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 line-clamp-1 text-sm">
                  {{ item.nom || item.titre }}
                </h4>
                <p class="text-xs text-gray-500 line-clamp-2 mt-1">
                  {{ item.description }}
                </p>
                <div class="flex items-center justify-between mt-2">
                  <p class="text-[var(--espace-vert)] font-bold text-sm">
                    {{ item.prix }} FCFA
                  </p>
                  <span
                    class="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {{ item.type || (item.titre ? "Service" : "Produit") }}
                  </span>
                </div>
              </div>
            </button>

            <button
              @click="performSearch()"
              class="w-full py-3 text-center text-[var(--espace-vert)] font-medium bg-green-50 rounded-lg mt-2 hover:bg-green-100 transition-colors"
            >
              {{ t("View all results") }}
            </button>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <i class="fas fa-search text-4xl mb-3 opacity-30"></i>
            <p>{{ t("No results found for") }} "{{ searchQuery }}"</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu mobile déroulant -->
    <div
      v-if="showMobileMenu && !showSearchOverlay"
      ref="mobileMenuRef"
      class="fixed inset-0 bg-white z-40 animate-slide-down"
    >
      <!-- Contenu du menu -->
      <div class="h-full overflow-y-auto pb-24">
        <!-- En-tête menu -->
        <div v-if="user" class="p-5 border-b bg-gray-50">
          <div class="flex items-center gap-4">
            <img
              v-if="user?.photo"
              :src="storageUrl + user.photo"
              :alt="t('profile picture')"
              class="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
            />
            <div
              v-else
              class="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <i class="fas fa-user-circle text-gray-500 text-3xl"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 text-lg truncate">
                {{ user?.nom || user?.email }}
              </p>
              <!-- <div class="flex items-center mt-1"> -->
              <!-- <i class="fas fa-coins text-[var(--espace-or)] mr-1"></i> -->
              <!-- <span class="text-sm text-gray-600">
                                    {{ user?.jetons || 0 }} {{ t('tokens') }}
                                </span> -->
              <!-- </div> -->
            </div>
            <button
              @click="toggleMobileMenu"
              class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <i class="fas text-xl text-gray-700 fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Options du menu -->
        <div class="py-2">
          <button
            v-for="item in mobileMenuItems"
            :key="item.label"
            @click="
              item.action();
              showMobileMenu = false;
            "
            class="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-center gap-4 group relative border-b border-gray-100"
            :class="{ 'text-red-600 hover:bg-red-50': item.danger }"
          >
            <!-- Icône -->
            <i
              class="fas text-gray-400 group-hover:text-[var(--espace-vert)] text-lg w-6 flex-shrink-0"
              :class="[item.icon, item.danger ? 'text-red-500' : '']"
            ></i>

            <!-- Label -->
            <div class="flex-1 min-w-0">
              <p
                class="font-medium text-base truncate"
                :class="{ 'text-red-600': item.danger }"
              >
                {{ item.label }}
              </p>
            </div>

            <!-- Badge -->
            <span
              v-if="item.badge && item.badge > 0"
              class="bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold"
            >
              {{ item.badge > 99 ? "99+" : item.badge }}
            </span>
          </button>
        </div>

        <!-- Bouton Publier -->
        <div v-if="user" class="p-5 border-t border-gray-200 bg-gray-50">
          <RouterLink
            to="/gallery"
            @click="showMobileMenu = false"
            class="w-full bg-[var(--espace-vert)] text-white py-4 px-5 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-3 shadow-lg"
          >
            <i class="fas fa-circle-plus text-xl"></i>
            Publier une annonce
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --espace-vert: #14532d;
  --espace-or: #facc15;
}

/* Animation pour l'overlay de recherche */
.fixed {
  transition: transform 0.3s ease-out;
}

/* Animation pour le menu mobile */
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}

/* Animation pour les badges */
@keyframes scaleBadge {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
}

.animate-scale {
  animation: scaleBadge 0.3s ease-in-out;
}

.featured-badge {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(250, 204, 21, 0.4);
}

/* Style pour le scroll */
.overflow-y-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.overflow-y-scroll::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

/* Amélioration pour mobile */
@media (max-width: 640px) {
  .h-\[calc\(100vh-70px\)\] {
    height: calc(100vh - 70px);
  }

  .pb-20 {
    padding-bottom: 5rem;
  }
}
</style>

<!-- Données pour les catégories (à ajouter dans script) -->
