<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/Auth";
import { useToast } from "vue-toastification";
import FormField from "../components/Form.vue";
import Loader from "../components/Loader.vue";
import apiClient from "../api/index";
import { User } from "../components/types/index";
import SeoHead from "../components/SeoHead.vue";
import StructuredData from "../components/StructuredData.vue";
import LanguageSwitcher from "../components/LanguageSwitcher.vue";
import { useI18n } from "../components/useI18n"; // Import du composable i18n

const { t } = useI18n(); // Initialisation des traductions
const isLoading = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const user = authStore.user;
const activeSection = ref("profile");
const profileForm = ref({
  id: user?.id ?? 0,
  nom: user?.nom ?? "",
  email: user?.email ?? "",
  telephone: user?.telephone ?? "",
  ville: user?.ville ?? "",
});

const passwordForm = ref({
  current_password: "",
  new_password: "",
  confirm_new_password: "",
});

const passwordStrength = ref("");

const getStorageBaseUrl = () => {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8000/storage/";
  }
  return "https://api.espacecameroun.com/storage/";
};

const storageUrl = computed(() => getStorageBaseUrl());

const settingsLinks = computed(() => {
  const links = [
    {
      to: "/gallery",
      label: t("my_inventory"),
      icon: "fa-store",
      description: t("manage_your_store_and_products"),
      color: "text-black bg-blue-50",
    },

    {
      to: "/profil",
      label: t("subscriptions"),
      icon: "fa-crown",
      description: t("manage_your_premium_subscriptions"),
      color: "text-black bg-yellow-50",
    },
    {
      to: "/reventes",
      label: t("reventes"),
      icon: "fa-handshake",
      description: t("your_product_reventes"),
      color: "text-black bg-purple-50",
    },
  ];

  if (user?.role === "admin") {
    links.unshift({
      to: "/admin/dashboard",
      label: t("administration"),
      icon: "fa-user-shield",
      description: t("access_admin_panel"),
      color: "text-white bg-red-600",
    });
  }

  return links;
});

const updateProfile = async () => {
  isLoading.value = true;
  try {
    await apiClient.post("/updateProfile", profileForm.value);
    authStore.user = { ...authStore.user, ...profileForm.value } as User;
    localStorage.setItem("user", JSON.stringify(authStore.user));
    toast.success("✅ " + t("profile_updated"));
  } catch (error: any) {
    if (error.response?.data?.message == "Unauthenticated.") {
      router.push("login");
    }
    toast.error(error.response?.data?.message || t("error_updating_profile"));
  } finally {
    isLoading.value = false;
  }
};

const updatePassword = async () => {
  isLoading.value = true;
  try {
    if (
      passwordForm.value.new_password !==
      passwordForm.value.confirm_new_password
    ) {
      toast.error("❌ " + t("passwords_dont_match"));
      return;
    }
    await apiClient.post("/updatePassword", passwordForm.value);
    toast.success("✅ " + t("password_updated"));
    passwordForm.value = {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    };
    passwordStrength.value = "";
  } catch (error: any) {
    if (error.response?.data?.message == "Unauthenticated.") {
      router.push("login");
    }
    toast.error(error.response?.data?.message || t("error_updating_password"));
  } finally {
    isLoading.value = false;
  }
};

const logout = () => {
  authStore.logout();
  router.push({ name: "login" });
};

const checkPasswordStrength = () => {
  const password = passwordForm.value.new_password;
  if (password.length === 0) {
    passwordStrength.value = "";
  } else if (
    password.length < 8 ||
    !/[A-Za-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    passwordStrength.value = "weak";
  } else if (!/[!@#$%^&*]/.test(password)) {
    passwordStrength.value = "medium";
  } else {
    passwordStrength.value = "strong";
  }
};

watch(() => passwordForm.value.new_password, checkPasswordStrength);
</script>

<template>
  <SeoHead
    :title="t('settings') + ' - ' + t('espace_cameroun')"
    :description="t('settings_seo_description')"
    :keywords="t('settings_seo_keywords')"
    url="https://espacecameroun.com/parametres"
    type="website"
  />

  <StructuredData
    type="webpage"
    :data="{
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: t('settings') + ' - ' + t('espace_cameroun'),
      description: t('settings_structured_description'),
      url: 'https://espacecameroun.com/parametres',
      mainEntity: {
        '@type': 'Person',
        name: user?.nom || t('user'),
      },
    }"
  />

  <Loader :isLoading="isLoading" />

  <div
    class="h-full overflow-y-scroll bg-gradient-to-br from-gray-50 to-gray-100 pb-20"
  >
    <!-- Header fixe -->
    <div
      class="fixed top-15 left-0 right-0 z-50 bg-white border-b shadow-sm px-4 py-3"
    >
      <div class="flex items-center justify-between">
        <button
          @click="$router.back()"
          class="p-2 text-gray-600 hover:text-black transition"
        >
          <i class="fas fa-arrow-left text-lg"></i>
        </button>

        <div class="text-center">
          <h1 class="text-lg font-bold text-gray-900">
            ⚙️ {{ t("settings") }}
          </h1>
          <p class="text-xs text-gray-500">
            {{ t("manage_account_and_preferences") }}
          </p>
        </div>

        <div class="w-8"></div>
      </div>
    </div>

    <div class="pt-30 px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Navigation desktop -->
        <div class="hidden lg:flex gap-6 mb-6">
          <div class="w-64 bg-white rounded-2xl shadow-sm p-4">
            <h2 class="text-lg font-bold text-gray-900 mb-4">
              {{ t("navigation") }}
            </h2>
            <nav class="space-y-2">
              <button
                v-for="section in [
                  { id: 'profile', label: t('profile'), icon: 'fa-user' },
                  { id: 'security', label: t('security'), icon: 'fa-lock' },
                  { id: 'links', label: t('other_options'), icon: 'fa-cog' },
                  { id: 'logout', label: t('logout'), icon: 'fa-sign-out-alt' },
                ]"
                :key="section.id"
                @click="
                  section.id === 'logout'
                    ? logout()
                    : (activeSection = section.id)
                "
                class="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                :class="{
                  'bg-primary text-white shadow-lg':
                    activeSection === section.id,
                  'text-gray-700 hover:bg-gray-100 hover:shadow-md':
                    activeSection !== section.id && section.id !== 'logout',
                  ' hover:bg-red-50':
                    section.id === 'logout' && activeSection !== 'logout',
                }"
              >
                <i
                  class="fas text-lg"
                  :class="[
                    section.icon,
                    activeSection === section.id ? 'text-white' : 'text-black',
                  ]"
                ></i>
                <span class="font-medium">{{ section.label }}</span>
              </button>
            </nav>
          </div>

          <!-- Contenu principal -->
          <div class="flex-1">
            <!-- Section Profil -->
            <Transition name="slide-fade">
              <section
                v-if="activeSection === 'profile'"
                class="bg-white rounded-2xl shadow-sm p-6"
              >
                <div class="flex items-center gap-3 mb-6">
                  <div
                    class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-user text-primary text-xl"></i>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-900">
                      {{ t("profile_information") }}
                    </h2>
                    <p class="text-sm text-gray-600">
                      {{ t("update_personal_information") }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- Formulaire -->
                  <div>
                    <form @submit.prevent="updateProfile" class="space-y-4">
                      <FormField
                        :label="t('full_name')"
                        icon="fa-user"
                        v-model="profileForm.nom"
                        type="text"
                        required
                        :placeholder="t('your_full_name')"
                      />
                      <FormField
                        :label="t('email_address')"
                        icon="fa-envelope"
                        v-model="profileForm.email"
                        type="email"
                        :placeholder="t('your_email')"
                      />
                      <FormField
                        :label="t('phone')"
                        icon="fa-phone"
                        v-model="profileForm.telephone"
                        type="tel"
                        required
                        :placeholder="t('your_phone_number')"
                      />
                      <FormField
                        :label="t('city')"
                        icon="fa-map-marker-alt"
                        v-model="profileForm.ville"
                        type="text"
                        required
                        :placeholder="t('your_city')"
                      />
                      <button
                        type="submit"
                        class="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                      >
                        <i class="fas fa-save mr-2"></i>
                        {{ t("save_changes") }}
                      </button>
                    </form>
                  </div>

                  <!-- Aperçu -->
                  <div
                    class="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-6 border border-primary/20"
                  >
                    <h3
                      class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
                    >
                      <i class="fas fa-eye text-primary"></i>
                      {{ t("profile_preview") }}
                    </h3>

                    <div
                      class="flex items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm"
                    >
                      <RouterLink v-if="user" :to="'/profil'" class="relative">
                        <img
                          v-if="user?.photo"
                          :src="storageUrl + user.photo"
                          :alt="t('profile_picture')"
                          class="w-16 h-16 rounded-full object-cover border-4 shadow-lg"
                        />
                        <div
                          v-else
                          class="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-white shadow-lg"
                        >
                          <i class="fas fa-user text-2xl"></i>
                        </div>
                      </RouterLink>
                      <div>
                        <p class="text-lg font-bold text-gray-900">
                          {{ profileForm.nom || t("name_not_defined") }}
                        </p>
                        <p class="text-sm text-gray-600">
                          {{ profileForm.email || t("email_not_defined") }}
                        </p>
                      </div>
                    </div>

                    <div class="space-y-3 text-sm">
                      <div
                        class="flex justify-between items-center p-3 bg-white rounded-lg"
                      >
                        <span class="text-gray-600 flex items-center gap-2">
                          <i class="fas fa-phone text-black"></i>
                          {{ t("phone") }}
                        </span>
                        <span class="font-semibold text-gray-900">{{
                          profileForm.telephone || t("not_defined")
                        }}</span>
                      </div>
                      <div
                        class="flex justify-between items-center p-3 bg-white rounded-lg"
                      >
                        <span class="text-gray-600 flex items-center gap-2">
                          <i class="fas fa-map-marker-alt text-black"></i>
                          {{ t("city") }}
                        </span>
                        <span class="font-semibold text-black">{{
                          profileForm.ville || t("not_defined")
                        }}</span>
                      </div>
                      <div
                        class="flex justify-between items-center p-3 bg-white rounded-lg"
                      >
                        <span class="text-black flex items-center gap-2">
                          <i class="fas fa-calendar text-black"></i>
                          {{ t("member_since") }}
                        </span>
                        <span class="font-semibold text-gray-900">{{
                          new Date(
                            user?.created_at || Date.now(),
                          ).toLocaleDateString("fr-FR")
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </Transition>

            <!-- Section Sécurité -->
            <Transition name="slide-fade">
              <section
                v-if="activeSection === 'security'"
                class="bg-white rounded-2xl shadow-sm p-6"
              >
                <div class="flex items-center gap-3 mb-6">
                  <div
                    class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-lock text-xl"></i>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-900">
                      {{ t("account_security") }}
                    </h2>
                    <p class="text-sm text-gray-600">
                      {{ t("change_your_password") }}
                    </p>
                  </div>
                </div>

                <form
                  @submit.prevent="updatePassword"
                  class="max-w-lg space-y-4"
                >
                  <FormField
                    :label="t('current_password')"
                    icon="fa-lock"
                    v-model="passwordForm.current_password"
                    type="password"
                    required
                    :placeholder="t('current_password')"
                  />

                  <FormField
                    :label="t('new_password')"
                    icon="fa-key"
                    v-model="passwordForm.new_password"
                    type="password"
                    required
                    :placeholder="t('new_password')"
                    @input="checkPasswordStrength"
                  />

                  <!-- Indicateur de force du mot de passe -->
                  <div
                    v-if="passwordStrength"
                    class="p-3 rounded-lg border"
                    :class="{
                      'bg-red-50 border-red-200': passwordStrength === 'weak',
                      'bg-yellow-50 border-yellow-200':
                        passwordStrength === 'medium',
                      'bg-green-50 border-green-200':
                        passwordStrength === 'strong',
                    }"
                  >
                    <div class="flex items-center justify-between text-sm">
                      <span
                        class="font-medium"
                        :class="{
                          'text-red-700': passwordStrength === 'weak',
                          'text-yellow-700': passwordStrength === 'medium',
                          'text-green-700': passwordStrength === 'strong',
                        }"
                      >
                        {{ t("password_strength") }}:
                        <strong>{{
                          passwordStrength === "weak"
                            ? t("weak")
                            : passwordStrength === "medium"
                              ? t("medium")
                              : t("strong")
                        }}</strong>
                      </span>
                      <div class="flex gap-1">
                        <div
                          class="w-3 h-1 rounded-full"
                          :class="{
                            'bg-red-500': passwordStrength === 'weak',
                            'bg-yellow-500': passwordStrength === 'medium',
                            'bg-green-500': passwordStrength === 'strong',
                          }"
                        ></div>
                        <div
                          class="w-3 h-1 rounded-full"
                          :class="{
                            'bg-red-300': passwordStrength === 'weak',
                            'bg-yellow-500': passwordStrength === 'medium',
                            'bg-green-500': passwordStrength === 'strong',
                          }"
                        ></div>
                        <div
                          class="w-3 h-1 rounded-full"
                          :class="{
                            'bg-red-300': passwordStrength !== 'strong',
                            'bg-green-500': passwordStrength === 'strong',
                          }"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <FormField
                    :label="t('confirm_password')"
                    icon="fa-lock"
                    v-model="passwordForm.confirm_new_password"
                    type="password"
                    required
                    :placeholder="t('confirm_password')"
                  />

                  <button
                    type="submit"
                    class="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <i class="fas fa-shield-alt mr-2"></i>
                    {{ t("update_password") }}
                  </button>
                </form>
              </section>
            </Transition>

            <!-- Section Autres options -->
            <Transition name="slide-fade">
              <section
                v-if="activeSection === 'links'"
                class="bg-white rounded-2xl shadow-sm p-6"
              >
                <div class="flex items-center gap-3 mb-6">
                  <div
                    class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-cog text-black text-xl"></i>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-900">
                      {{ t("other_options") }}
                    </h2>
                    <p class="text-sm text-gray-600">
                      {{ t("access_other_features") }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Sélecteur de langue comme un lien -->
                  <div
                    class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group cursor-pointer"
                  >
                    <div
                      class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
                    >
                      <i class="fas fa-globe"></i>
                    </div>
                    <div class="flex-1">
                      <h3
                        class="font-semibold text-gray-900 group-hover:text-black transition-colors"
                      >
                        {{ t("language") }}
                      </h3>
                      <p class="text-sm text-gray-600 mt-1">
                        {{ t("choose_preferred_language") }}
                      </p>
                      <div class="mt-2">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>

                  <RouterLink
                    v-for="link in settingsLinks"
                    :key="link.to"
                    :to="link.to"
                    class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 group"
                  >
                    <div
                      class="w-12 h-12 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
                      :class="link.color"
                    >
                      <i class="fas" :class="link.icon"></i>
                    </div>
                    <div class="flex-1">
                      <h3
                        class="font-semibold text-gray-900 group-hover:text-black transition-colors"
                      >
                        {{ link.label }}
                      </h3>
                      <p class="text-sm text-gray-600 mt-1">
                        {{ link.description }}
                      </p>
                    </div>
                    <i
                      class="fas fa-chevron-right text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all"
                    ></i>
                  </RouterLink>
                </div>
              </section>
            </Transition>
          </div>
        </div>

        <!-- Navigation mobile -->
        <div class="lg:hidden space-y-4">
          <!-- Tabs mobiles -->
          <div class="bg-white rounded-2xl shadow-sm p-4">
            <div class="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
              <button
                v-for="section in [
                  { id: 'profile', label: t('profile'), icon: 'fa-user' },
                  { id: 'security', label: t('security'), icon: 'fa-lock' },
                  { id: 'links', label: t('options'), icon: 'fa-cog' },
                ]"
                :key="section.id"
                @click="activeSection = section.id"
                class="flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all flex-1 min-w-0 justify-center"
                :class="{
                  'bg-primary text-white shadow-md':
                    activeSection === section.id,
                  'text-gray-600 bg-gray-50 hover:bg-gray-100':
                    activeSection !== section.id,
                }"
              >
                <i class="fas text-sm" :class="section.icon"></i>
                <span class="text-sm font-medium">{{ section.label }}</span>
              </button>
            </div>
          </div>

          <!-- Contenu mobile -->
          <div class="space-y-4">
            <!-- Section Profil Mobile -->
            <Transition name="slide-fade">
              <section
                v-if="activeSection === 'profile'"
                class="bg-white rounded-2xl shadow-sm p-5"
              >
                <div class="flex items-center gap-3 mb-6">
                  <div
                    class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-user text-primary"></i>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-gray-900">
                      {{ t("profile_information") }}
                    </h2>
                    <p class="text-xs text-gray-600">
                      {{ t("update_your_information") }}
                    </p>
                  </div>
                </div>

                <!-- Aperçu profil mobile -->
                <div
                  class="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl p-4 mb-6 border border-primary/20"
                >
                  <div class="flex items-center gap-3 mb-4">
                    <RouterLink v-if="user" :to="'/profil'" class="relative">
                      <img
                        v-if="user?.photo"
                        :src="storageUrl + user.photo"
                        :alt="t('profile_picture')"
                        class="w-12 h-12 rounded-full object-cover border-2 border-primary/40 shadow"
                      />
                      <div
                        v-else
                        class="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-white shadow"
                      >
                        <i class="fas fa-user"></i>
                      </div>
                    </RouterLink>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-gray-900 truncate">
                        {{ profileForm.nom || t("name_not_defined") }}
                      </p>
                      <p class="text-xs text-gray-600 truncate">
                        {{ profileForm.email || t("email_not_defined") }}
                      </p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-white rounded-lg p-2 text-center">
                      <div class="text-gray-600">{{ t("phone") }}</div>
                      <div class="font-semibold text-gray-900 truncate">
                        {{ profileForm.telephone || t("not_defined") }}
                      </div>
                    </div>
                    <div class="bg-white rounded-lg p-2 text-center">
                      <div class="text-gray-600">{{ t("city") }}</div>
                      <div class="font-semibold text-gray-900 truncate">
                        {{ profileForm.ville || t("not_defined") }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Formulaire profil mobile -->
                <form @submit.prevent="updateProfile" class="space-y-4">
                  <FormField
                    :label="t('full_name')"
                    icon="fa-user"
                    v-model="profileForm.nom"
                    type="text"
                    required
                    :placeholder="t('your_full_name')"
                  />
                  <FormField
                    :label="t('email_address')"
                    icon="fa-envelope"
                    v-model="profileForm.email"
                    type="email"
                    :placeholder="t('your_email')"
                  />
                  <FormField
                    :label="t('phone')"
                    icon="fa-phone"
                    v-model="profileForm.telephone"
                    type="tel"
                    required
                    :placeholder="t('your_phone_number')"
                  />
                  <FormField
                    :label="t('city')"
                    icon="fa-map-marker-alt"
                    v-model="profileForm.ville"
                    type="text"
                    required
                    :placeholder="t('your_city')"
                  />
                  <button
                    type="submit"
                    class="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200 active:scale-95 shadow-lg"
                  >
                    <i class="fas fa-save mr-2"></i>
                    {{ t("save") }}
                  </button>
                </form>
              </section>
            </Transition>

            <!-- Section Sécurité Mobile -->
            <Transition name="slide-fade">
              <section
                v-if="activeSection === 'security'"
                class="bg-white rounded-2xl shadow-sm p-5"
              >
                <div class="flex items-center gap-3 mb-6">
                  <div
                    class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-lock"></i>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-gray-900">
                      {{ t("account_security") }}
                    </h2>
                    <p class="text-xs text-gray-600">
                      {{ t("change_your_password") }}
                    </p>
                  </div>
                </div>

                <form @submit.prevent="updatePassword" class="space-y-4">
                  <FormField
                    :label="t('current_password')"
                    icon="fa-lock"
                    v-model="passwordForm.current_password"
                    type="password"
                    required
                    :placeholder="t('current_password')"
                  />

                  <FormField
                    :label="t('new_password')"
                    icon="fa-key"
                    v-model="passwordForm.new_password"
                    type="password"
                    required
                    :placeholder="t('new_password')"
                    @input="checkPasswordStrength"
                  />

                  <!-- Indicateur de force du mot de passe mobile -->
                  <div
                    v-if="passwordStrength"
                    class="p-3 rounded-lg border text-sm"
                    :class="{
                      'bg-red-50 border-red-200': passwordStrength === 'weak',
                      'bg-yellow-50 border-yellow-200':
                        passwordStrength === 'medium',
                      'bg-green-50 border-green-200':
                        passwordStrength === 'strong',
                    }"
                  >
                    <div class="flex items-center justify-between">
                      <span
                        class="font-medium"
                        :class="{
                          'text-red-700': passwordStrength === 'weak',
                          'text-yellow-700': passwordStrength === 'medium',
                          'text-black': passwordStrength === 'strong',
                        }"
                      >
                        {{
                          passwordStrength === "weak"
                            ? "🔴 " + t("weak")
                            : passwordStrength === "medium"
                              ? "🟡 " + t("medium")
                              : "🟢 " + t("strong")
                        }}
                      </span>
                      <div class="flex gap-1">
                        <div
                          class="w-2 h-2 rounded-full"
                          :class="{
                            'bg-red-500': passwordStrength === 'weak',
                            'bg-yellow-500': passwordStrength === 'medium',
                            'bg-green-500': passwordStrength === 'strong',
                          }"
                        ></div>
                        <div
                          class="w-2 h-2 rounded-full"
                          :class="{
                            'bg-red-300': passwordStrength === 'weak',
                            'bg-yellow-500': passwordStrength === 'medium',
                            'bg-green-500': passwordStrength === 'strong',
                          }"
                        ></div>
                        <div
                          class="w-2 h-2 rounded-full"
                          :class="{
                            'bg-red-300': passwordStrength !== 'strong',
                            'bg-green-500': passwordStrength === 'strong',
                          }"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <FormField
                    :label="t('confirm_password')"
                    icon="fa-lock"
                    v-model="passwordForm.confirm_new_password"
                    type="password"
                    required
                    :placeholder="t('confirm_password')"
                  />

                  <button
                    type="submit"
                    class="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200 active:scale-95 shadow-lg"
                  >
                    <i class="fas fa-shield-alt mr-2"></i>
                    {{ t("update") }}
                  </button>
                </form>
              </section>
            </Transition>

            <!-- Section Options Mobile -->
            <Transition name="slide-fade">
              <section
                v-if="activeSection === 'links'"
                class="bg-white rounded-2xl shadow-sm p-5"
              >
                <div class="flex items-center gap-3 mb-6">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                  >
                    <i class="fas fa-cog text-black"></i>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-gray-900">
                      {{ t("other_options") }}
                    </h2>
                    <p class="text-xs text-gray-600">
                      {{ t("access_features") }}
                    </p>
                  </div>
                </div>

                <div class="space-y-3">
                  <div
                    class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group cursor-pointer"
                  >
                    <div
                      class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
                    >
                      <i class="fas fa-globe"></i>
                    </div>
                    <div class="flex-1">
                      <h3
                        class="font-semibold text-gray-900 group-hover:text-black transition-colors"
                      >
                        {{ t("language") }}
                      </h3>
                      <p class="text-sm text-gray-600 mt-1">
                        {{ t("choose_preferred_language") }}
                      </p>
                      <div class="mt-2">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                  <RouterLink
                    v-for="link in settingsLinks"
                    :key="link.to"
                    :to="link.to"
                    class="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center text-sm"
                      :class="link.color"
                    >
                      <i class="fas" :class="link.icon"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-gray-900 text-sm">
                        {{ link.label }}
                      </h3>
                      <p class="text-xs text-gray-600 mt-1 truncate">
                        {{ link.description }}
                      </p>
                    </div>
                    <i class="fas fa-chevron-right text-gray-400 text-sm"></i>
                  </RouterLink>
                </div>
                <button
                  @click="logout"
                  class="w-full bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700 transition-all active:scale-95 shadow-lg flex items-center mt-6 justify-center gap-3"
                >
                  <i class="fas fa-sign-out-alt"></i>
                  <span>{{ t("logout") }}</span>
                </button>
              </section>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Cache la scrollbar sur mobile */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Amélioration du touch sur mobile */
button,
.router-link {
  -webkit-tap-highlight-color: transparent;
}

/* Optimisation des transitions pour mobile */
@media (max-width: 1024px) {
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition-duration: 0.2s;
  }
}

/* Meilleur espacement sur très petits écrans */
@media (max-width: 360px) {
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .p-5 {
    padding: 1.25rem;
  }

  .gap-3 {
    gap: 0.75rem;
  }
}
</style>
