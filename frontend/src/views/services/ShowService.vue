<template>
  <div class="min-h-screen bg-gray-50 relative">
    <SeoHead :title="seoTitle" :description="seoDescription" />

    <!-- Loading / Error -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-96">
      <Loader :isLoading="true" />
    </div>
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-8 text-center">
      <div class="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <i
          class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"
        ></i>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Service non trouvé
        </h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="$router.back()"
          class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
        >
          Retour
        </button>
      </div>
    </div>

    <!-- Service Details -->
    <div
      v-else-if="service"
      class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6"
    >
      <!-- Breadcrumb -->
      <nav
        class="flex items-center space-x-2 text-sm text-gray-600 mb-6 overflow-x-auto hide-scrollbar"
      >
        <router-link to="/" class="hover:text-primary">Accueil</router-link>
        <i class="fas fa-chevron-right text-sm"></i>
        <router-link to="/services" class="hover:text-primary"
          >Services</router-link
        >
        <i class="fas fa-chevron-right text-sm"></i>
        <span class="text-gray-900 truncate">{{ service.category?.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Gallery -->
          <div
            class="bg-white rounded-xl shadow-sm border overflow-hidden image-container"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <div class="aspect-[4/3] sm:aspect-[16/9] bg-gray-100">
              <img
                :src="currentImage"
                :alt="service.titre"
                class="w-full h-full object-cover"
              />
            </div>
            <!-- Dots mobile -->
            <div
              v-if="service.images?.length > 1"
              class="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1 sm:hidden"
            >
              <div
                v-for="(_, i) in service.images"
                :key="i"
                class="w-1.5 h-1.5 rounded-full"
                :class="currentImageIndex === i ? 'bg-white' : 'bg-white/50'"
              ></div>
            </div>
            <!-- Desktop arrows -->
            <button
              v-if="service.images?.length > 1 && currentImageIndex > 0"
              @click="currentImageIndex--"
              class="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full items-center justify-center"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              v-if="
                service.images?.length > 1 &&
                currentImageIndex < service.images.length - 1
              "
              @click="currentImageIndex++"
              class="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full items-center justify-center"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
            <!-- Thumbnails desktop -->
            <div
              v-if="service.images?.length > 1"
              class="hidden sm:flex space-x-2 p-4 overflow-x-auto"
            >
              <button
                v-for="(img, i) in service.images"
                :key="i"
                @click="currentImageIndex = i"
                :class="[
                  'w-16 h-16 rounded-lg overflow-hidden border-2',
                  currentImageIndex === i
                    ? 'border-primary'
                    : 'border-transparent',
                ]"
              >
                <img :src="img" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Details -->
          <div class="bg-white rounded-xl shadow-sm border p-6">
            <h1
              class="text-2xl font-bold mb-4"
              @click="recordServiceClick('title_click')"
            >
              {{ service.titre }}
            </h1>

            <div
              class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6"
            >
              <div
                class="flex items-center gap-2"
                @click="recordServiceClick('rating_click')"
              >
                <i class="fas fa-star text-yellow-400"></i>
                <span class="font-semibold">{{
                  service.note_moyenne || "N/A"
                }}</span>
                <span class="text-gray-600 text-sm"
                  >({{ service.nombre_avis }} avis)</span
                >
              </div>
              <div class="flex items-center gap-1 text-green-600 text-sm">
                <i class="fas fa-check-circle"></i>
                <span class="capitalize">{{ service.disponibilite }}</span>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">Description</h3>
              <p
                class="text-gray-700 whitespace-pre-line"
                @click="recordServiceClick('description_click')"
              >
                {{ service.description }}
              </p>
            </div>

            <div v-if="service.competences?.length" class="mb-6">
              <h3 class="text-lg font-semibold mb-3">Compétences</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="c in service.competences"
                  :key="c"
                  class="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                  >{{ c }}</span
                >
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div v-if="service.annees_experience">
                <h4 class="font-semibold">Années d'expérience</h4>
                <p>{{ service.annees_experience }} an(s)</p>
              </div>
              <div v-if="service.qualifications">
                <h4 class="font-semibold">Qualifications</h4>
                <p>{{ service.qualifications }}</p>
              </div>
            </div>

            <div
              class="mt-6 pt-6 border-t text-sm text-gray-600 flex items-center gap-2"
            >
              <i class="fas fa-map-marker-alt text-primary"></i>
              <span
                >{{ service.ville
                }}{{
                  service.localisation ? ", " + service.localisation : ""
                }}</span
              >
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <div
            class="bg-white rounded-xl shadow-sm border p-6 lg:sticky lg:top-4"
          >
            <div class="space-y-3">
              <router-link
                :to="`/messages/${service.user?.id}`"
                @click="contactProvider"
                class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark flex items-center justify-center gap-2 font-semibold"
              >
                <i class="fas fa-comment-dots"></i>
                <span>Contacter le prestataire</span>
              </router-link>

              <button
                @click="toggleFavorite"
                class="w-full border py-3 rounded-lg flex items-center justify-center gap-2 font-semibold"
                :class="
                  isFavorited
                    ? 'border-secondary text-secondary bg-secondary/5'
                    : 'border-gray-300 text-gray-700'
                "
              >
                <i :class="isFavorited ? 'fas fa-heart' : 'far fa-heart'"></i>
                <span>{{
                  isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"
                }}</span>
              </button>

              <button
                @click="shareNative"
                class="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-gray-50"
              >
                <i class="fas fa-share-alt"></i>
                <span>Partager</span>
              </button>
            </div>

            <div class="mt-6 pt-6 border-t">
              <h3 class="font-semibold mb-3">Prestataire</h3>
              <div
                class="flex items-center gap-3"
                @click="recordServiceClick('provider_click')"
              >
                <img
                  :src="service.user?.photo || '/default-avatar.png'"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p class="font-semibold truncate">{{ service.user?.nom }}</p>
                  <p class="text-sm text-gray-600">
                    Membre depuis
                    {{ formatMemberSince(service.user?.created_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ReviewsService
            :service-id="service.id"
            :reviews-stats="reviewsStats"
          />
        </div>
      </div>

      <!-- Services similaires -->
      <div v-if="similarServices.length" class="mt-12">
        <h2 class="text-2xl font-bold mb-6">Services similaires</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ServiceCard
            v-for="s in similarServices"
            :key="s.id"
            :service="s"
            @click="viewService(s)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../stores/Auth";
import SeoHead from "../../components/SeoHead.vue";
import Loader from "../../components/Loader.vue";
import ServiceCard from "../../components/mesServices/MesServiceCard.vue";
import ReviewsService from "./ReviewsService.vue";
import apiClient from "../../api";
import type { Service } from "../../stores/marketplace";
import { interactionService } from "../../utils/interaction";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

// États
const service = ref<Service | null>(null);
const similarServices = ref<Service[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const currentImageIndex = ref(0);
const isFavorited = ref(false);
const touchStartX = ref(0);
const hasViewed = ref(false);
const lastClickTime = ref(0);
let pageViewStartTime = 0;

// Computed
const currentImage = computed(
  () =>
    service.value?.images?.[currentImageIndex.value] || "/default-service.jpg",
);
const seoTitle = computed(() =>
  service.value ? `${service.value.titre} - Services` : "Service",
);
const seoDescription = computed(
  () =>
    service.value?.description.substring(0, 160) ||
    "Service professionnel de qualité",
);
const reviewsStats = computed(() => ({
  average: service.value?.note_moyenne || 0,
  total: service.value?.nombre_avis || 0,
}));
const shareUrl = computed(
  () => `${window.location.origin}/services/${service.value?.id}`,
);
const shareText = computed(
  () => `Découvrez le service "${service.value?.titre}" sur Espace Cameroun`,
);

// Interactions
const recordView = async () => {
  if (!service.value || hasViewed.value || !authStore.user) return;
  await interactionService.recordInteraction(
    service.value.id,
    "service",
    "clic",
    { source: "service_page" },
  );
  hasViewed.value = true;
};

const recordServiceClick = async (type: string) => {
  if (!service.value || !authStore.user) return;
  const now = Date.now();
  if (now - lastClickTime.value < 1000) return;
  lastClickTime.value = now;
  await interactionService.recordInteraction(
    service.value.id,
    "service",
    "clic",
    { click_type: type },
  );
};

const contactProvider = async () => {
  if (!authStore.user) {
    toast.error("Connectez-vous pour contacter");
    router.push("/login");
    return;
  }
  await interactionService.recordInteraction(
    service.value!.id,
    "service",
    "contact",
    { type: "message_provider" },
  );
  router.push(`/messages/${service.value!.user?.id}`);
};

const toggleFavorite = async () => {
  isFavorited.value = !isFavorited.value;
  if (!authStore.user) {
    toast.error("Connectez-vous");
    router.push("/login");
    return;
  }
  try {
    await interactionService.recordInteraction(
      service.value!.id,
      "service",
      "favori",
      { action: isFavorited.value ? "added" : "removed" },
    );
  } catch {
    isFavorited.value = !isFavorited.value;
    toast.error("Erreur favoris");
  }
};

const shareNative = async () => {
  if (navigator.share) {
    await navigator.share({
      title: service.value?.titre,
      text: shareText.value,
      url: shareUrl.value,
    });
    await interactionService.recordInteraction(
      service.value!.id,
      "service",
      "partage",
      { method: "native" },
    );
  } else {
    await navigator.clipboard.writeText(shareUrl.value);
    toast.success("Lien copié !");
    await interactionService.recordInteraction(
      service.value!.id,
      "service",
      "partage",
      { method: "copy_link" },
    );
  }
};

// Image swipe
const handleTouchStart = (e: TouchEvent) =>
  (touchStartX.value = e.touches[0].clientX);
const handleTouchEnd = (e: TouchEvent) => {
  if (!service.value?.images || service.value.images.length <= 1) return;
  const diff = touchStartX.value - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentImageIndex.value < service.value.images.length - 1)
      currentImageIndex.value++;
    else if (diff < 0 && currentImageIndex.value > 0) currentImageIndex.value--;
    recordServiceClick(diff > 0 ? "image_next" : "image_prev");
  }
};

// Data fetching
const fetchServiceDetails = async () => {
  try {
    isLoading.value = true;
    const { data } = await apiClient.get(`/services/${route.params.id}`);
    if (data.success) {
      service.value = data.data.service;
      similarServices.value = data.data.similar_services;
      isFavorited.value = data.data.is_favorited || false;
      await recordView();
    } else error.value = data.message;
  } catch (err: any) {
    error.value = err.response?.data?.message || "Service introuvable";
  } finally {
    isLoading.value = false;
  }
};

const viewService = (s: Service) => router.push(`/services/${s.id}`);
const formatMemberSince = (d: string) => new Date(d).getFullYear();

// Tracking temps passé
const trackTimeOnPage = () => {
  pageViewStartTime = Date.now();
  window.addEventListener("beforeunload", () => {
    const secs = Math.floor((Date.now() - pageViewStartTime) / 1000);
    if (secs > 5 && service.value && authStore.user) {
      interactionService.recordInteraction(
        service.value.id,
        "service",
        "clic",
        { duration_seconds: secs },
      );
    }
  });
};

//watch url
// watch(())
// Ajoute ce watch juste après tes computed / avant onMounted
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      // Recharge les données
      await fetchServiceDetails();
    }
  },
  { immediate: false },
);
onMounted(() => {
  fetchServiceDetails();
  trackTimeOnPage();
  document.documentElement.style.scrollPaddingBottom =
    window.innerWidth < 1024 ? "80px" : "0";
});

onUnmounted(() => {
  document.documentElement.style.scrollPaddingBottom = "0";
});
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
