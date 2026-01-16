<template>
  <!-- Composant SEO global pour la page d'accueil -->
  <SeoHead title="Espace Cameroun - Marketplace Innovante pour le Commerce Local"
    description="Rejoignez Espace Cameroun, la plateforme qui révolutionne le commerce au Cameroun. Achetez, vendez et collaborez avec des commerçants locaux."
    keywords="marketplace cameroun, ecommerce, acheter vendre, commerce local, orange money, mtn mobile money, jetons espace cameroun"
    url="https://espacecameroun.com" type="website" />

  <StructuredData type="website" :data="{
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Espace Cameroun',
    'description': 'Marketplace innovante pour le commerce local au Cameroun',
    'url': 'https://espacecameroun.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://espacecameroun.com/recherche?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }" />

  <!-- 🔹 Structure principale avec sidebar -->
  <div class="relative overflow-hidden flex flex-col lg:flex-row min-h-full h-full ">

    <!-- 🔹 Bannière "Hors ligne" -->
    <transition name="offline-fade">
      <div v-if="!isOnline && showOfflineBanner"
        class="fixed top-0 left-0 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white text-center py-3 z-[100] shadow-lg animate-pulse px-4"
        role="alert" aria-live="assertive" aria-label="Notification de connexion hors ligne">
        <i class="fas fa-wifi-slash text-2xl mr-2" aria-hidden="true"></i>
        <span class="text-sm sm:text-base">
          Vous êtes hors ligne. Certaines fonctionnalités peuvent ne pas fonctionner.
        </span>
        <button @click="showOfflineBanner = false"
          class="ml-3 px-3 py-1 rounded bg-white text-red-700 font-semibold shadow hover:bg-red-100 transition"
          aria-label="Masquer la notification de connexion">
          OK
        </button>
        <button @click="retryConnection"
          class="ml-2 px-3 py-1 rounded bg-white text-red-700 font-semibold shadow hover:bg-red-100 transition"
          aria-label="Réessayer la connexion internet">
          Réessayer
        </button>
      </div>
    </transition>

    <!-- 🔹 HeaderBar (maintenant une sidebar sur desktop) -->
    <HeaderBar />
    
    <!-- <SoldeUser /> -->
    <!-- 🔹 Contenu principal avec marge pour la sidebar -->
    <main role="main" class="flex-grow overflow-auto h-full w-full lg:ml-0">
      <router-view />
    </main>

    <!-- 🔹 Footer mobile -->
    <footer role="contentinfo" class="lg:hidden flex-shrink-0">
      <FooterBar />
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SeoHead from './components/SeoHead.vue';
import StructuredData from './components/StructuredData.vue';
import HeaderBar from './components/HeaderBar.vue';
import FooterBar from './components/FooterBar.vue';
import SoldeUser from './components/SoldeUser.vue';

const isOnline = ref(navigator.onLine);
const showOfflineBanner = ref(!navigator.onLine);

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
  if (!navigator.onLine) {
    showOfflineBanner.value = true;
  }
};

const retryConnection = () => {
  fetch(window.location.origin, { method: 'HEAD', cache: 'no-store' })
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
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>

<style>
/* Forcer tous les composants enfants du main à prendre 100% de la hauteur */
main>* {
  height: 100% !important;
  min-height: 100% !important;
}

main>div {
  /* display: block !important; */
}

.offline-fade-enter-active,
.offline-fade-leave-active {
  transition: opacity 0.7s, transform 0.7s;
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