<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../stores/Auth";
import FormField from "../../components/Form.vue";
import { useI18n } from "../../components/useI18n";
import { Capacitor } from "@capacitor/core";
import { urlHelper } from "../../utils";
import apiClient from "../../api";
import emailjs from "../../utils/emailjsConfig";

const { t } = useI18n();

const credentials = ref({
  login: "",
  mot_de_passe: "",
});

const errors = ref<{
  login?: string;
  mot_de_passe?: string;
}>({});

const isLoading = ref(false);
const showPassword = ref(false);
const showForgotPassword = ref(false);
const forgotPasswordEmail = ref("");
const isSendingReset = ref(false);

const router = useRouter();
const route = useRoute();
const toast = useToast();
const authStore = useAuthStore();

// const isNative = Capacitor.isNativePlatform();

// Méthode Google seulement pour le web
const loginWithGoogle = () => {
  const url = new URL(`${urlHelper.getBaseUrl()}/auth/google`);
  window.location.href = url.toString();
};

const login = async () => {
  try {
    isLoading.value = true;
    toast.info(t("logging_in"), { timeout: 2000 });
    await authStore.login({
      login: credentials.value.login,
      mot_de_passe: credentials.value.mot_de_passe,
    });
    toast.success(t("login_success"));
    const redirectPath = route.query.redirect as string;
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.push({ name: "home" });
    }
  } catch (error: any) {
    console.error("Erreur lors de la connexion:", error);
    const message = error.response?.data?.message || t("login_error");
    toast.error(message);
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    }
  } finally {
    isLoading.value = false;
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleForgotPassword = () => {
  showForgotPassword.value = !showForgotPassword.value;
  forgotPasswordEmail.value = "";
};

const sendPasswordReset = async () => {
  if (!forgotPasswordEmail.value.trim()) {
    toast.error(t("email_required"));
    return;
  }

  if (!isValidEmail(forgotPasswordEmail.value)) {
    toast.error(t("email_invalid"));
    return;
  }

  try {
    isSendingReset.value = true;

    // 1. Demander un token au backend
    const response = await apiClient.post("/password/generate-token", {
      email: forgotPasswordEmail.value,
    });

    const token = response.data.token;

    // 2. Construire le lien de réinitialisation
    const resetLink = `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(forgotPasswordEmail.value)}`;

    // 3. Utiliser EmailJS avec le template de réinitialisation
    const templateParams = {
      email: forgotPasswordEmail.value,
      reset_link: resetLink,
    };
    console.log(emailjs.templates.PASSWORD_RESET);
    const result = await emailjs.send(
      emailjs.templates.PASSWORD_RESET, // ou 'password_reset' directement
      templateParams,
    );

    console.log("result" + { result });
    toast.success(t("reset_email_sent"));
    showForgotPassword.value = false;
    forgotPasswordEmail.value = "";
  } catch (error: any) {
    console.error("Erreur réinitialisation:", error);
    const message = error.response?.data?.message || t("reset_email_error");
    toast.error(message);
  } finally {
    isSendingReset.value = false;
  }
};

// Génère un token de réinitialisation simulé
const generateResetToken = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Validation d'email simple
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

onMounted(() => {
  const error = route.query.error as string;
  if (error) {
    toast.error(decodeURIComponent(error));
  }
  if (authStore.user) {
    toast.info(t("already_logged_in"));
    router.push({ name: "home" });
  }
});
</script>

<template>
  <div
    class="overflow-y-scroll min-h-full flex justify-center w-full py-5 pb-24"
  >
    <div
      class="max-w-md rounded-3xl shadow-0xl border-0 border-white/20 p-8 space-y-8 pb-24 block"
    >
      <!-- En-tête avec logo -->
      <div class="text-center space-y-4">
        <div class="flex justify-center">
          <img
            src="/src/assets/images/logo/LOGO_vert_all.png"
            alt=""
            class="w-1/2"
          />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ t("login_title") }}
          </h1>
          <p class="text-gray-600 text-sm">
            {{ t("login_subtitle") }}
          </p>
        </div>
      </div>

      <!-- Connexion Google - SEULEMENT SUR WEB -->
      <button
        @click="loginWithGoogle"
        class="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-4 font-semibold text-gray-700 hover:border-gray-300 hover:shadow-md transition-all duration-300"
      >
        <i class="fab fa-google text-red-500 text-lg"></i>
        <span class="text-base">
          {{ t("continue_with_google") }}
        </span>
      </button>

      <!-- Séparateur -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-white px-3 text-gray-500">{{ t("or_faster") }}</span>
        </div>
      </div>

      <!-- Formulaire classique -->
      <form @submit.prevent="login" class="space-y-6">
        <!-- Champ login -->
        <FormField
          :label="t('auth_phone_number')"
          icon="fa-phone"
          v-model="credentials.login"
          type="text"
          required
          :placeholder="t('auth_phone_number')"
          :error="errors.login"
          autocomplete="tel"
        />

        <!-- Champ mot de passe avec œil -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">
              {{ t("password") }}
            </label>
            <button
              type="button"
              @click="toggleForgotPassword"
              class="text-sm text-primary hover:underline font-medium transition-colors"
            >
              {{ t("forgot_password") }}
            </button>
          </div>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="credentials.mot_de_passe"
              required
              :placeholder="t('password')"
              :class="[
                'w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                errors.mot_de_passe
                  ? 'border-red-500 focus:ring-red-500'
                  : 'focus:ring-primary',
              ]"
              autocomplete="current-password"
            />
            <!-- Icône cadenas -->
            <div
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <i class="fas fa-lock"></i>
            </div>
            <!-- Bouton œil -->
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              :aria-label="
                showPassword
                  ? 'Masquer le mot de passe'
                  : 'Afficher le mot de passe'
              "
            >
              <i
                :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                class="text-lg"
              ></i>
            </button>
          </div>
          <!-- Message d'erreur -->
          <p
            v-if="errors.mot_de_passe"
            class="text-red-500 text-sm mt-1 flex items-center gap-1"
          >
            <i class="fas fa-exclamation-circle"></i>
            {{ errors.mot_de_passe }}
          </p>
        </div>

        <!-- Bouton de connexion -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <div class="flex items-center justify-center gap-2">
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-sign-in-alt"></i>
            <span class="text-base">
              {{ isLoading ? t("logging_in") : t("login_button") }}
            </span>
          </div>
        </button>
      </form>

      <!-- Modal Mot de passe oublié -->
      <div
        v-if="showForgotPassword"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ t("forgot_password") }}
            </h3>
            <button
              @click="toggleForgotPassword"
              class="text-gray-500 hover:text-gray-700"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>

          <p class="text-sm text-gray-600">
            {{ t("forgot_password_instructions") }}
          </p>

          <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700">{{
              t("email_address")
            }}</label>
            <input
              v-model="forgotPasswordEmail"
              type="email"
              :placeholder="t('email_placeholder')"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="toggleForgotPassword"
              class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              {{ t("cancel") }}
            </button>
            <button
              @click="sendPasswordReset"
              :disabled="isSendingReset || !forgotPasswordEmail.trim()"
              class="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center justify-center gap-2">
                <i v-if="isSendingReset" class="fas fa-spinner fa-spin"></i>
                <span>{{
                  isSendingReset ? t("sending") : t("send_reset_link")
                }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Liens supplémentaires -->
      <div class="space-y-4 text-center pb-6">
        <!-- Lien inscription -->
        <p class="text-sm text-gray-600">
          {{ t("no_account") }}
          <router-link
            to="/register"
            class="text-primary font-semibold hover:underline ml-1"
          >
            {{ t("signup_here") }}
          </router-link>
        </p>

        <!-- Lien vers home sans connexion -->
        <p class="text-sm text-gray-600">
          {{ t("visitor_access") }}
          <router-link
            to="/home"
            class="text-primary font-semibold hover:underline ml-1"
          >
            {{ t("visitor") }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animation pour le focus */
input:focus {
  outline: none;
  /* box-shadow: 0 0 0 3px theme("colors.primary / 10%"); */
  box-shadow: 0 0 0 3px rgba(20, 83, 45, 0.1);
}

/* Transition douce pour tous les éléments interactifs */
button,
input,
a {
  transition: all 0.2s ease-in-out;
}

/* Animation pour le modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
