<template>
  <div class="h-full flex items-center justify-center p-4 overflow-y-scroll">
    <div
      class="relative w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 h-full"
    >
      <!-- Section Gauche - Barre Latérale (Desktop uniquement) -->
      <div
        class="hidden md:block space-y-6 md:space-y-8 text-center md:text-left pt-8"
      >
        <!-- Logo et Titre -->
        <div class="space-y-4">
          <div
            class="flex items-center justify-center md:justify-start space-x-3"
          >
            <div
              class="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-store text-white text-xl"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ t("platform_name") }}
            </h1>
          </div>
          <p class="text-xl text-gray-600 font-light">
            {{ t("platform_tagline") }}
          </p>
        </div>

        <!-- Sélecteur de langue pour desktop -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <i class="fas fa-globe text-blue-600 text-lg"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">
                {{ t("language_selector") }}
              </h3>
              <p class="text-sm text-gray-600">{{ t("choose_language") }}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      <!-- Section Mobile - Présentation -->
      <div class="relative md:hidden space-y-6 text-center">
        <!-- Logo et Titre -->
        <div class="space-y-4">
          <div class="flex items-center justify-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-store text-white text-lg"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ t("platform_name") }}
            </h1>
          </div>
          <p class="text-base text-gray-600 font-light">
            {{ t("platform_tagline") }}
          </p>
        </div>

        <!-- Sélecteur de langue pour mobile -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <i class="fas fa-globe text-blue-600 text-sm"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 text-sm">
                {{ t("language_selector") }}
              </h3>
              <p class="text-xs text-gray-600">{{ t("choose_language") }}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      <!-- Section Formulaire -->
      <div class="relative overflow-y-scrol">
        <div
          class="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 relative overflow-hidden"
        >
          <!-- Éléments décoratifs -->
          <div
            class="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full -translate-y-12 md:-translate-y-16 translate-x-12 md:translate-x-16"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full translate-y-10 md:translate-y-12 -translate-x-10 md:-translate-x-12"
          ></div>

          <div class="relative z-10">
            <!-- En-tête du formulaire -->
            <div class="text-center mb-6 md:mb-8">
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {{ t("register_title") }}
              </h2>
              <p class="text-gray-600 text-sm md:text-base">
                {{ t("register_subtitle") }}
              </p>
            </div>

            <!-- Formulaire d'inscription simplifié -->
            <form @submit.prevent="handleSubmit" class="space-y-5 md:space-y-6">
              <!-- Nom complet -->
              <FormField
                :label="t('full_name')"
                icon="fa-user"
                v-model="form.nom"
                type="text"
                required
                :placeholder="t('full_name')"
                :error="errors.nom"
                autocomplete="name"
                @blur="validateField('nom')"
                class="text-sm md:text-base"
              />

              <!-- Numéro de téléphone -->
              <FormField
                :label="t('phone_number')"
                icon="fa-phone"
                v-model="form.telephone"
                type="tel"
                required
                :placeholder="t('phone_number')"
                :error="errors.telephone"
                pattern="\+?[0-9]{8 ,12}"
                autocomplete="tel"
                @blur="validateField('telephone')"
                class="text-sm md:text-base"
              >
                <template #append>
                  <div class="flex space-x-1 ml-2">
                    <i class="fas fa-mobile-alt text-gray-400 text-base"></i>
                  </div>
                </template>
              </FormField>

              <!-- Mot de passe -->
              <div class="space-y-3">
                <div class="relative">
                  <FormField
                    :label="t('password')"
                    icon="fa-lock"
                    v-model="form.mot_de_passe"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    :placeholder="t('password_placeholder')"
                    :error="errors.mot_de_passe"
                    autocomplete="new-password"
                    @input="validatePassword"
                    class="text-sm md:text-base"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
                    @click="showPassword = !showPassword"
                    :aria-label="
                      showPassword
                        ? 'Masquer le mot de passe'
                        : 'Afficher le mot de passe'
                    "
                  >
                    <i
                      :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                      class="text-base"
                    ></i>
                  </button>
                </div>

                <!-- Indicateur de force du mot de passe -->
                <div v-if="form.mot_de_passe" class="space-y-2">
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>{{ t("password_strength") }}</span>
                    <span :class="passwordStrengthClass">{{
                      passwordStrengthLabel
                    }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1 md:h-1.5">
                    <div
                      class="h-1 md:h-1.5 rounded-full transition-all duration-300"
                      :class="passwordStrengthBarClass"
                      :style="{ width: `${passwordStrength}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Conditions avec liens -->
              <div
                class="bg-gray-50 rounded-xl p-3 md:p-4"
                :class="{ 'border-2 border-red-300': errors.terms }"
              >
                <label class="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="acceptTerms"
                    class="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-secondary"
                  />
                  <span class="text-xs md:text-sm text-gray-600">
                    {{ t("accept_terms") }}
                    <router-link
                      to="/politique-utilisation"
                      class="text-primary hover:underline font-medium"
                    >
                      {{ t("terms_of_use") }}
                    </router-link>
                    {{ t("and") }}
                    <router-link
                      to="/politique-confidentialite"
                      class="text-primary hover:underline font-medium"
                    >
                      {{ t("privacy_policy") }}
                    </router-link>
                  </span>
                </label>
                <p
                  v-if="errors.terms"
                  class="text-red-500 text-xs mt-2 flex items-center space-x-1"
                >
                  <i class="fas fa-exclamation-circle"></i>
                  <span>{{ t("terms_required") }}</span>
                </p>
              </div>

              <!-- Message d'erreur général -->
              <div
                v-if="Object.keys(errors).length > 0"
                class="bg-red-50 border border-red-200 rounded-xl p-3 md:p-4 animate-shake"
              >
                <div class="flex items-center space-x-2 text-red-700 text-sm">
                  <i class="fas fa-exclamation-triangle"></i>
                  <span>{{ t("fix_errors") }}</span>
                </div>
              </div>

              <!-- Bouton d'inscription -->
              <button
                type="submit"
                :disabled="!canSubmit || isLoading"
                class="w-full py-3 md:py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                <i
                  :class="[
                    isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-rocket',
                    'mr-2',
                  ]"
                ></i>
                {{ isLoading ? t("creating_account") : t("create_account") }}
              </button>
            </form>

            <!-- Séparateur -->
            <div class="relative my-6 md:my-8">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-xs md:text-sm">
                <span class="px-2 bg-white text-gray-500">{{
                  t("or_faster")
                }}</span>
              </div>
            </div>

            <!-- Connexion sociale -->
            <button
              @click="registerWithGoogle"
              :disabled="isGoogleLoading"
              class="w-full flex items-center justify-center space-x-2 md:space-x-3 bg-white border-2 border-gray-200 rounded-xl py-3 md:py-4 font-semibold text-gray-700 hover:border-gray-300 hover:shadow-md transition-all duration-300 text-sm md:text-base"
            >
              <i class="fab fa-google text-red-500 text-base md:text-lg"></i>
              <span>{{
                isGoogleLoading
                  ? t("google_redirect")
                  : t("continue_with_google")
              }}</span>
            </button>

            <!-- Lien de connexion -->
            <p
              class="text-center text-xs md:text-sm text-gray-600 mt-4 md:mt-6"
            >
              {{ t("already_member") }}
              <router-link
                to="/login"
                class="text-primary font-semibold hover:underline ml-1"
              >
                {{ t("login_here") }}
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../stores/Auth";
import FormField from "../../components/Form.vue";
import LanguageSwitcher from "../../components/LanguageSwitcher.vue";
import { useI18n } from "../../components/useI18n";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const authStore = useAuthStore();

// États réactifs
const form = ref({
  nom: "",
  telephone: "",
  mot_de_passe: "",
});

const showPassword = ref(false);
const isLoading = ref(false);
const isGoogleLoading = ref(false);
const acceptTerms = ref(false);

// Gestion des erreurs simplifiée
const errors = ref<Record<string, string>>({});

// Gestion persistante du code de parrainage
const storedReferralCode = ref<string>("");
const REFERRAL_STORAGE_KEY = "espace_referral_code";

// Charger le code de parrainage depuis l'URL ou localStorage
const loadReferralCode = () => {
  const urlCode = (route.query.code as string) || (route.params.code as string);
  if (urlCode && /^[A-Za-z0-9]{6,10}$/.test(urlCode)) {
    storedReferralCode.value = urlCode.toUpperCase();
    localStorage.setItem(REFERRAL_STORAGE_KEY, storedReferralCode.value);
    return;
  }
  const storedCode = localStorage.getItem(REFERRAL_STORAGE_KEY);
  if (storedCode && /^[A-Za-z0-9]{6,10}$/.test(storedCode)) {
    storedReferralCode.value = storedCode;
  }
};

// Nettoyer le code de parrainage après inscription
const clearReferralCode = () => {
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
  storedReferralCode.value = "";
};

// Computed properties
const hasReferralCode = computed(() => !!storedReferralCode.value);

const canSubmit = computed(() => {
  return (
    form.value.nom.length >= 2 &&
    /\+?[0-9]{9,12}/.test(form.value.telephone) &&
    form.value.mot_de_passe.length >= 8 &&
    acceptTerms.value &&
    Object.keys(errors.value).length === 0
  );
});

// Validation simplifiée
const validateField = (field: string) => {
  switch (field) {
    case "nom":
      if (!form.value.nom || form.value.nom.length < 2) {
        errors.value.nom = t("validation_min_length", { min: 2 });
      } else {
        delete errors.value.nom;
      }
      break;
    case "telephone":
      if (
        !form.value.telephone ||
        !/\+?[0-9]{9,12}/.test(form.value.telephone)
      ) {
        errors.value.telephone = t("validation_phone_invalid");
      } else {
        delete errors.value.telephone;
      }
      break;
  }
};

const validatePassword = () => {
  if (!form.value.mot_de_passe) {
    errors.value.mot_de_passe = t("validation_required");
  } else if (form.value.mot_de_passe.length < 8) {
    errors.value.mot_de_passe = t("validation_min_length", { min: 8 });
  } else {
    delete errors.value.mot_de_passe;
  }
};

// Force du mot de passe
const passwordStrength = computed(() => {
  let strength = 0;
  if (form.value.mot_de_passe.length >= 8) strength += 25;
  if (/\d/.test(form.value.mot_de_passe)) strength += 25;
  if (/[A-Z]/.test(form.value.mot_de_passe)) strength += 25;
  if (/[!@#$%^&*]/.test(form.value.mot_de_passe)) strength += 25;
  return strength;
});

const passwordStrengthLabel = computed(() => {
  if (passwordStrength.value < 50) return "weak";
  if (passwordStrength.value < 75) return "medium";
  return "strong";
});

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 50) return "text-red-500";
  if (passwordStrength.value < 75) return "text-yellow-500";
  return "text-green-500";
});

const passwordStrengthBarClass = computed(() => {
  if (passwordStrength.value < 50) return "bg-red-500";
  if (passwordStrength.value < 75) return "bg-yellow-500";
  return "bg-green-500";
});

// Soumission du formulaire
const handleSubmit = async () => {
  // Validation finale
  validateField("nom");
  validateField("telephone");
  validatePassword();

  if (!acceptTerms.value) {
    errors.value.terms = t("terms_required");
    toast.error(t("terms_required"));
    return;
  }

  if (Object.keys(errors.value).length > 0) {
    toast.error(t("fix_errors"));
    return;
  }

  isLoading.value = true;
  try {
    const registrationData = {
      ...form.value,
      parrain_code: storedReferralCode.value || undefined,
    };
    await authStore.register(registrationData);
    toast.success(t("account_created"));
    clearReferralCode();
    router.push("/");
  } catch (error: any) {
    console.error("Erreur inscription:", error);
    const message = error.response?.data?.message || t("registration_error");
    toast.error(message);

    // Gestion des erreurs de validation du backend
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors || {};
      Object.keys(validationErrors).forEach((key) => {
        errors.value[key] = validationErrors[key][0];
      });
    }
  } finally {
    isLoading.value = false;
  }
};

const host = window.location.hostname;

const registerWithGoogle = () => {
  isGoogleLoading.value = true;
  const baseUrl =
    host === "localhost" || host === "127.0.0.1"
      ? "http://localhost:8000"
      : "https://api.espacecameroun.com";
  const authUrl = new URL(`${baseUrl}/auth/google`);
  authUrl.searchParams.append("action", "register");
  if (storedReferralCode.value) {
    authUrl.searchParams.append("parrain_code", storedReferralCode.value);
  }
  toast.info(t("google_redirect"));
  window.location.href = authUrl.toString();
};

// Initialisation
onMounted(() => {
  loadReferralCode();
});
</script>

<style scoped>
/*
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
}
*/

@keyframes bounce-in {
  0% {
    transform: translate(-50%, -20px);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
