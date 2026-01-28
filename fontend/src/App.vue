<template>
  <!-- Composant SEO global pour la page d'accueil -->
  <SeoHead
    title="Espace Cameroun - Marketplace Innovante pour le Commerce Local"
    description="Rejoignez Espace Cameroun, la plateforme qui révolutionne le commerce au Cameroun. Achetez, vendez et collaborez avec des commerçants locaux."
    keywords="marketplace cameroun, ecommerce, acheter vendre, commerce local, orange money, mtn mobile money, jetons espace cameroun"
    url="https://espacecameroun.com"
    type="website"
  />

  <StructuredData
    type="website"
    :data="{
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Espace Cameroun',
      description: 'Marketplace innovante pour le commerce local au Cameroun',
      url: 'https://espacecameroun.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://espacecameroun.com/recherche?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    }"
  />

  <!-- 🔹 Structure principale avec sidebar -->
  <div
    class="relative overflow-hidden flex flex-col lg:flex-row min-h-full h-full"
  >
    <ProduitModal />
    <!-- 🔹 Bannière "Hors ligne" -->
    <transition name="offline-fade">
      <div
        v-if="!isOnline && showOfflineBanner"
        class="fixed top-0 left-0 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white text-center py-3 z-[100] shadow-lg animate-pulse px-4"
        role="alert"
        aria-live="assertive"
        aria-label="Notification de connexion hors ligne"
      >
        <i class="fas fa-wifi-slash text-2xl mr-2" aria-hidden="true"></i>
        <span class="text-sm sm:text-base">
          Vous êtes hors ligne. Certaines fonctionnalités peuvent ne pas
          fonctionner.
        </span>
        <button
          @click="showOfflineBanner = false"
          class="ml-3 px-3 py-1 rounded bg-white text-red-700 font-semibold shadow hover:bg-red-100 transition"
          aria-label="Masquer la notification de connexion"
        >
          OK
        </button>
        <button
          @click="retryConnection"
          class="ml-2 px-3 py-1 rounded bg-white text-red-700 font-semibold shadow hover:bg-red-100 transition"
          aria-label="Réessayer la connexion internet"
        >
          Réessayer
        </button>
      </div>
    </transition>

    <!-- 🔹 HeaderBar (maintenant une sidebar sur desktop) -->
    <HeaderBar :show-header="isVisible" />

    <!-- <SoldeUser /> -->
    <!-- 🔹 Contenu principal avec marge pour la sidebar -->
    <main
      role="main"
      ref="mainContentRef"
      class="flex-grow overflow-auto h-full w-full lg:ml-0 scroll-smooth shadow-inner"
      :class="{ 'pt-16 pb-20 lg:pt-16 lg:pb-0': !isLayoutPermanentlyHidden }"
    >
      <router-view />
    </main>

    <!-- 🔹 Footer mobile -->
    <footer
      role="contentinfo"
      class="lg:hidden fixed bottom-0 left-0 w-full z-40 transition-transform duration-300"
      :class="[
        isVisible ? 'translate-y-0' : 'translate-y-full',
        isLayoutPermanentlyHidden ? 'hidden' : '',
      ]"
    >
      <FooterBar />
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import SeoHead from "./components/SeoHead.vue";
import StructuredData from "./components/StructuredData.vue";
import HeaderBar from "./components/HeaderBar.vue";
import FooterBar from "./components/FooterBar.vue";
import ProduitModal from "./components/mesProduits/ProduitModal.vue";

const route = useRoute();
const isOnline = ref(navigator.onLine);
const showOfflineBanner = ref(!navigator.onLine);
const mainContentRef = ref(null);
const showLayout = ref(true);
const lastScrollTop = ref(0);
const SCROLL_THRESHOLD = 50; // Minimum scroll to trigger change

// Computed property to check if layout should be permanently hidden (e.g. messages)
const isLayoutPermanentlyHidden = computed(
  () => route.meta.hideLayout === true,
);

// Computed for final visibility
const isVisible = computed(() => {
  if (isLayoutPermanentlyHidden.value) return false;
  return showLayout.value;
});

const handleScroll = () => {
  if (isLayoutPermanentlyHidden.value) return;

  const currentScrollTop = mainContentRef.value?.scrollTop || 0;

  // Don't trigger on elastic scroll (negative values)
  if (currentScrollTop < 0) return;

  // Always show near top
  if (currentScrollTop < SCROLL_THRESHOLD) {
    showLayout.value = true;
    lastScrollTop.value = currentScrollTop;
    return;
  }

  const diff = currentScrollTop - lastScrollTop.value;

  // Scroll Down -> Hide (if moved enough)
  if (diff > 10) {
    showLayout.value = false;
  }
  // Scroll Up -> Show (if moved enough)
  else if (diff < -10) {
    showLayout.value = true;
  }

  lastScrollTop.value = currentScrollTop;
};

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
  if (!navigator.onLine) {
    showOfflineBanner.value = true;
  }
};

const retryConnection = () => {
  fetch(window.location.origin, { method: "HEAD", cache: "no-store" })
    .then(() => {
      isOnline.value = true;
      showOfflineBanner.value = false;
    })
    .catch(() => {
      isOnline.value = false;
      showOfflineBanner.value = true;
    });
};

onMounted(() => {
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  if (mainContentRef.value) {
    mainContentRef.value.addEventListener("scroll", handleScroll, {
      passive: true,
    });
  }
});

onUnmounted(() => {
  window.removeEventListener("online", updateOnlineStatus);
  window.removeEventListener("offline", updateOnlineStatus);

  if (mainContentRef.value) {
    mainContentRef.value.removeEventListener("scroll", handleScroll);
  }
});

// Reset layout visibility on route change
watch(
  () => route.path,
  () => {
    if (!isLayoutPermanentlyHidden.value) {
      showLayout.value = true;
    }
  },
);
</script>

<style>
/* Forcer tous les composants enfants du main à prendre 100% de la hauteur */
main > * {
  height: 100% !important;
  min-height: 100% !important;
}

.offline-fade-enter-active,
.offline-fade-leave-active {
  transition:
    opacity 0.7s,
    transform 0.7s;
}

.offline-fade-enter-from,
.offline-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

html,
body {
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
