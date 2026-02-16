<template>
  <SeoHead
    :title="t('my_profile')"
    :description="t('profile_seo_description')"
    :keywords="t('profile_seo_keywords')"
    url="https://espacecameroun.com/profil"
    type="profile"
  />

  <StructuredData type="webpage" :data="structuredData" />

  <div class="min-h-screen bg-gray-50">
    <!-- Header de profil -->
    <div class="bg-white shadow-sm border-b">
      <!-- Section info utilisateur -->
      <div class="container mx-auto px-4 py-8">
        <div
          class="flex flex-col sm:flex-row items-center sm:items-start gap-6"
        >
          <!-- Photo de profil avec upload -->
          <div class="relative">
            <div
              class="w-28 h-28 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden"
            >
              <img
                v-if="user?.photo"
                :src="storageUrl + user.photo"
                :alt="user.nom"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center"
              >
                <i class="fas fa-user text-gray-400 text-3xl"></i>
              </div>
            </div>

            <!-- Bouton modifier photo -->
            <button
              @click="openPhotoMenu"
              class="absolute -bottom-2 -right-2 w-8 h-8 bg-secondary text-primary-dark rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-all"
            >
              <i class="fas fa-camera text-xs"></i>
              <!-- Menu upload photo -->
            </button>
            <div
              v-if="showPhotoMenu"
              class="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
            >
              <button
                @click="openCamera"
                class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 border-b border-gray-100"
              >
                <i class="fas fa-camera text-gray-600"></i>
                <span>{{ t("take_photo") }}</span>
              </button>
              <button
                @click="openGallery"
                class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700"
              >
                <i class="fas fa-images text-gray-600"></i>
                <span>{{ t("choose_photo") }}</span>
              </button>
            </div>
          </div>

          <!-- Informations utilisateur -->
          <div class="text-center sm:text-left space-y-3 flex-1">
            <h1 class="text-2xl font-bold text-gray-900">{{ user?.nom }}</h1>

            <!-- Informations de base -->
            <div
              class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-600"
            >
              <div v-if="user?.ville" class="flex items-center gap-1">
                <i class="fas fa-map-marker-alt"></i>
                <span
                  >{{ user.ville
                  }}{{ user?.quartier ? ", " + user.quartier : "" }}</span
                >
              </div>
              <div class="flex items-center gap-1">
                <i class="fas fa-calendar"></i>
                <span>Membre depuis {{ memberSince }}</span>
              </div>
              <div v-if="userAge" class="flex items-center gap-1">
                <i class="fas fa-birthday-cake"></i>
                <span>{{ userAge }} ans</span>
              </div>
            </div>

            <!-- Badge vérifié -->
            <div
              v-if="user?.est_verifie"
              class="flex items-center justify-center sm:justify-start gap-2 text-blue-600 text-sm"
            >
              <i class="fas fa-check-circle"></i>
              <span class="font-medium">{{ t("verified_account") }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Informations personnelles détaillées -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            {{ t("personal_information") }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Colonne gauche -->
            <div class="space-y-6">
              <!-- Identité -->
              <div class="space-y-4">
                <h3 class="font-medium text-gray-900 flex items-center gap-2">
                  <i class="fas fa-id-card text-primary"></i>
                  {{ t("identity") }}
                </h3>
                <div class="space-y-3">
                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-gray-600">{{ t("full_name") }}</span>
                    <span class="font-medium text-gray-900">{{
                      user?.nom
                    }}</span>
                  </div>
                  <div
                    v-if="userAge"
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-gray-600">{{ t("age") }}</span>
                    <span class="font-medium text-gray-900"
                      >{{ userAge }} ans</span
                    >
                  </div>
                  <div
                    v-if="user?.date_naissance"
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-gray-600">{{ t("birth_date") }}</span>
                    <span class="font-medium text-gray-900">{{
                      formatDate(user.date_naissance)
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Localisation -->
              <div class="space-y-4">
                <h3 class="font-medium text-gray-900 flex items-center gap-2">
                  <i class="fas fa-map-marker-alt text-primary"></i>
                  {{ t("location") }}
                </h3>
                <div class="space-y-3">
                  <div
                    v-if="user?.ville"
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-gray-600">{{ t("city") }}</span>
                    <span class="font-medium text-gray-900">{{
                      user.ville
                    }}</span>
                  </div>
                  <div
                    v-if="user?.quartier"
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-gray-600">{{ t("neighborhood") }}</span>
                    <span class="font-medium text-gray-900">{{
                      user.quartier
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Colonne droite -->
            <div class="space-y-6">
              <!-- Contact -->
              <div class="space-y-4">
                <h3 class="font-medium text-gray-900 flex items-center gap-2">
                  <i class="fas fa-address-book text-primary"></i>
                  {{ t("contact") }}
                </h3>
                <div class="space-y-3">
                  <div
                    v-if="user?.email"
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-gray-600">{{ t("email") }}</span>
                    <span class="font-medium text-gray-900">{{
                      user.email
                    }}</span>
                  </div>
                  <div
                    v-if="user?.telephone"
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-gray-600">{{ t("phone") }}</span>
                    <span class="font-medium text-gray-900">{{
                      user.telephone
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Compte -->
              <div class="space-y-4">
                <h3 class="font-medium text-gray-900 flex items-center gap-2">
                  <i class="fas fa-user-circle text-primary"></i>
                  {{ t("account") }}
                </h3>
                <div class="space-y-3">
                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-gray-600">{{ t("member_since") }}</span>
                    <span class="font-medium text-gray-900">{{
                      memberSinceFull
                    }}</span>
                  </div>
                  <div
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-gray-600">{{ t("status") }}</span>
                    <span
                      :class="[
                        'px-2 py-1 rounded-full text-xs font-medium',
                        user?.est_verifie
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800',
                      ]"
                    >
                      {{ user?.est_verifie ? t("verified") : t("unverified") }}
                    </span>
                  </div>
                  <div
                    v-if="user?.parrainage_code"
                    class="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span class="text-gray-600">{{ t("referral_code") }}</span>
                    <span class="font-medium text-gray-900 font-mono">{{
                      user.parrainage_code
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section sécurité -->
        <div class="bg-white rounded-xl shadow-sm border p-6 mt-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            {{ t("security") }}
          </h2>

          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <i class="fas fa-shield-alt text-green-600"></i>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">
                    {{ t("account_protection") }}
                  </h3>
                  <p class="text-gray-600 text-sm">
                    {{ t("account_protection_desc") }}
                  </p>
                </div>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  user?.est_verifie
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800',
                ]"
              >
                {{
                  user?.est_verifie ? t("protected") : t("needs_verification")
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Section parrainage -->
        <div
          v-if="user?.parrainage_code"
          class="bg-white rounded-xl shadow-sm border p-6 mt-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {{ t("referral_program") }}
          </h2>

          <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-user-plus text-white"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">
                  {{ t("your_referral_code") }}
                </h3>
                <p class="text-gray-600 text-sm mt-1 mb-3">
                  {{ t("referral_description") }}
                </p>
                <div class="flex items-center gap-3">
                  <div
                    class="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3"
                  >
                    <code class="text-lg font-mono text-gray-800 font-bold">{{
                      user.parrainage_code
                    }}</code>
                  </div>
                  <button
                    @click="copyReferralCode"
                    class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 font-medium"
                  >
                    <i class="fas fa-copy"></i>
                    {{ t("copy_code") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview photo -->
    <div
      v-if="previewUrl"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ t("new_profile_picture") }}
        </h3>
        <div class="flex flex-col items-center space-y-4">
          <img
            :src="previewUrl"
            :alt="t('preview')"
            class="w-32 h-32 rounded-xl object-cover shadow-md"
          />
          <div class="flex gap-3 w-full">
            <button
              @click="uploadProfilePicture"
              :disabled="uploading"
              class="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <i v-if="uploading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-check"></i>
              <span>{{ uploading ? t("uploading") : t("confirm") }}</span>
            </button>
            <button
              @click="cancelUpload"
              class="flex-1 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {{ t("cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Camera Modal -->
    <div
      v-if="showCameraModal"
      class="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4 text-center">
          {{ t("take_photo") }}
        </h3>
        <video
          ref="videoRef"
          autoplay
          playsinline
          class="rounded-xl w-full bg-black"
        />
        <div class="flex justify-center space-x-4 mt-4">
          <button
            @click="capturePhoto"
            class="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <i class="fas fa-camera"></i>
            <span>{{ t("capture") }}</span>
          </button>
          <button
            @click="closeCamera"
            class="border border-gray-300 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {{ t("cancel") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Input fichier caché -->
    <input
      ref="galleryInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/Auth";
import apiClient from "../api/index";
import SeoHead from "../components/SeoHead.vue";
import StructuredData from "../components/StructuredData.vue";
import { useI18n } from "../components/useI18n";

const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

// États pour l'upload de photo
const showPhotoMenu = ref(false);
const uploading = ref(false);
const previewUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const showCameraModal = ref(false);

// Refs
const galleryInput = ref<HTMLInputElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
let cameraStream: MediaStream | null = null;

// Computed
const memberSince = computed(() => {
  if (!user.value?.created_at) return "";
  return new Date(user.value.created_at).getFullYear().toString();
});

const memberSinceFull = computed(() => {
  if (!user.value?.created_at) return "";
  return new Date(user.value.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const userAge = computed(() => {
  if (!user.value?.date_naissance) return null;
  const birthDate = new Date(user.value.date_naissance);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

const structuredData = computed(() => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: t("my_profile"),
  description: t("profile_seo_description"),
  url: "https://espacecameroun.com/profil",
  mainEntity: {
    "@type": "Person",
    name: user.value?.nom,
    email: user.value?.email,
    telephone: user.value?.telephone,
    birthDate: user.value?.date_naissance,
    image: user.value?.photo ? storageUrl.value + user.value.photo : undefined,
    memberSince: user.value?.created_at,
    address: user.value?.ville
      ? {
          "@type": "PostalAddress",
          addressLocality: user.value.ville,
          addressRegion: user.value.quartier,
        }
      : undefined,
  },
}));

const storageUrl = computed(() => {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1"
    ? "http://localhost:8000/storage/"
    : "https://api.espacecameroun.com/storage/";
});

// Méthodes pour l'upload de photo
const openPhotoMenu = () => {
  showPhotoMenu.value = true;
  console.log(showPhotoMenu.value);
};

const openGallery = () => {
  galleryInput.value?.click();
  showPhotoMenu.value = false;
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error(t("invalid_image_type"));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("image_too_large"));
      return;
    }
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
    showPhotoMenu.value = false;
  }
};

const openCamera = async () => {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    showCameraModal.value = true;
    showPhotoMenu.value = false;
    setTimeout(() => {
      if (videoRef.value) {
        videoRef.value.srcObject = cameraStream;
      }
    }, 100);
  } catch (err) {
    toast.error(t("camera_access_error"));
    console.error(err);
  }
};

const capturePhoto = () => {
  if (!videoRef.value) return;
  const video = videoRef.value;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob((blob) => {
    if (blob) {
      selectedFile.value = new File([blob], "photo.jpg", {
        type: "image/jpeg",
      });
      previewUrl.value = URL.createObjectURL(selectedFile.value);
      closeCamera();
    }
  }, "image/jpeg");
};

const closeCamera = () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  showCameraModal.value = false;
};

const cancelUpload = () => {
  selectedFile.value = null;
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = null;
};

const uploadProfilePicture = async () => {
  if (!selectedFile.value) return;
  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append("photo", selectedFile.value);
    const response = await apiClient.post("/profile/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.data.photo) {
      // Mettre à jour l'utilisateur dans le store
      if (authStore.user) {
        authStore.user.photo = response.data.photo;
      }
      toast.success(t("profile_picture_updated"));
      cancelUpload();
    }
  } catch (err: any) {
    console.error("Erreur upload photo:", err);
    toast.error(err.response?.data?.message || t("upload_error"));
  } finally {
    uploading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("fr-FR");
};

const copyReferralCode = async () => {
  if (!user.value?.parrainage_code) return;
  try {
    await navigator.clipboard.writeText(user.value.parrainage_code);
    toast.success(t("referral_code_copied"));
  } catch (err) {
    toast.error(t("copy_error"));
  }
};

// Fermer le menu photo quand on clique ailleurs
onMounted(() => {});
</script>
