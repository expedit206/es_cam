<template>
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6"
  >
    <div
      class="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-modal-in max-h-[95vh] overflow-y-auto"
    >
      <!-- HEADER AVEC NAVIGATION -->
      <div
        class="bg-gradient-to-r from-[var(--espace-vert)] to-[var(--espace-vert)] p-8 text-white relative"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          :aria-label="t('close')"
        >
          <i class="fas fa-times text-2xl"></i>
        </button>

        <div class="text-center">
          <div
            class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-crown text-3xl text-yellow-300"></i>
          </div>
          <h2 class="text-4xl font-bold mb-3">🚀 {{ t("go_premium") }}</h2>
          <p class="text-lg text-white/90 max-w-2xl mx-auto">
            {{ t("premium_description") }}
          </p>
        </div>

        <!-- Indicateur de progression -->
        <div class="flex justify-center mt-6">
          <div class="flex items-center space-x-4">
            <div
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all',
                !selectedPlan
                  ? 'bg-white text-[var(--espace-vert)] shadow-lg scale-110'
                  : 'bg-white/20 text-white',
              ]"
            >
              1
            </div>
            <div class="w-8 h-0.5 bg-white/30"></div>
            <div
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all',
                selectedPlan
                  ? 'bg-white text-[var(--espace-vert)] shadow-lg scale-110'
                  : 'bg-white/20 text-white',
              ]"
            >
              2
            </div>
          </div>
        </div>
      </div>

      <div class="p-8">
        <!-- Étape 1 : Choix du pack -->
        <div v-if="!selectedPlan">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              {{ t("choose_your_plan") }}
            </h3>
            <p class="text-gray-600">{{ t("select_best_offer") }}</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <!-- GRATUIT -->
            <div
              class="border-2 border-gray-200 bg-white rounded-2xl p-6 flex flex-col transition-all hover:border-gray-300"
            >
              <div class="flex-1">
                <div class="text-center mb-6">
                  <h3 class="text-xl font-bold text-gray-800 mb-2">
                    {{ t("free") }}
                  </h3>
                  <div class="text-3xl font-extrabold text-gray-900 mb-1">
                    0 FCFA
                  </div>
                  <p class="text-sm text-gray-500">{{ t("to_start") }}</p>
                </div>

                <ul class="space-y-3 text-sm">
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span>{{ t("max_products", { count: 50 }) }}</span>
                  </li>
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span>{{ t("max_reventes", { count: 30 }) }}</span>
                  </li>
                  <li class="flex items-start gap-3 text-gray-400">
                    <i class="fas fa-times text-red-400 mt-1 flex-shrink-0"></i>
                    <span>{{ t("detailed_statistics") }}</span>
                  </li>
                  <li class="flex items-start gap-3 text-gray-400">
                    <i class="fas fa-times text-red-400 mt-1 flex-shrink-0"></i>
                    <span>{{ t("premium_badge") }}</span>
                  </li>
                  <li class="flex items-start gap-3 text-gray-400">
                    <i class="fas fa-times text-red-400 mt-1 flex-shrink-0"></i>
                    <span>{{ t("priority_position") }}</span>
                  </li>
                </ul>
              </div>
              <button
                disabled
                class="mt-6 w-full py-3 rounded-xl bg-gray-200 text-gray-500 font-semibold cursor-not-allowed"
              >
                {{ t("current_plan") }}
              </button>
            </div>

            <!-- PREMIUM MENSUEL -->
            <div
              class="relative border-2 border-[var(--espace-vert)] bg-gradient-to-br from-[var(--espace-vert)]/5 to-green-50 rounded-2xl p-6 flex flex-col transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span
                  class="bg-[var(--espace-vert)] text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg"
                >
                  ⭐ {{ t("popular") }}
                </span>
              </div>

              <div class="flex-1">
                <div class="text-center mb-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    {{ t("premium_monthly") }}
                  </h3>
                  <div
                    class="text-3xl font-extrabold text-[var(--espace-vert)] mb-1"
                  >
                    5 000 FCFA
                  </div>
                  <p class="text-sm text-gray-600">{{ t("per_month") }}</p>
                </div>

                <ul class="space-y-3 text-sm">
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span
                      ><strong>{{ t("unlimited_products") }}</strong></span
                    >
                  </li>
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span
                      ><strong>{{ t("unlimited_reventes") }}</strong></span
                    >
                  </li>
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span
                      ><strong>{{ t("free_tokens_monthly") }}</strong></span
                    >
                  </li>
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span>{{ t("detailed_statistics") }}</span>
                  </li>
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span>{{ t("exclusive_premium_badge") }}</span>
                  </li>
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span>{{ t("priority_position") }}</span>
                  </li>
                </ul>
              </div>
              <button
                @click="selectPlan('monthly')"
                class="mt-6 w-full py-3 rounded-xl bg-[var(--espace-vert)] text-white font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
              >
                {{ t("choose_this_plan") }}
              </button>
            </div>

            <!-- PREMIUM ANNUEL -->
            <div
              class="relative border-2 border-[var(--espace-or)] bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 flex flex-col transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div
                class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-full flex justify-center"
              >
                <span
                  class="bg-[var(--espace-or)] text-[var(--espace-vert)] text-sm font-bold px-2 py-0 rounded-full shadow-lg"
                >
                  💰 {{ t("economical") }}
                </span>
              </div>

              <div class="flex-1">
                <div class="text-center mb-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    {{ t("premium_yearly") }}
                  </h3>
                  <div
                    class="text-3xl font-extrabold text-[var(--espace-or)] mb-1"
                  >
                    50 000 FCFA
                  </div>
                  <p class="text-sm text-gray-600">
                    <span class="line-through text-gray-400">60 000 FCFA</span>
                    <span class="text-[var(--espace-vert)] font-bold ml-2">{{
                      t("save_percentage", {
                        percentage: 16,
                      })
                    }}</span>
                  </p>
                </div>

                <ul class="space-y-3 text-sm">
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span
                      ><strong>{{ t("unlimited_products") }}</strong></span
                    >
                  </li>
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span
                      ><strong>{{ t("unlimited_reventes") }}</strong></span
                    >
                  </li>
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span
                      ><strong>{{ t("free_tokens_yearly") }}</strong></span
                    >
                  </li>
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span>{{ t("advanced_statistics") }}</span>
                  </li>
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span>{{ t("exclusive_premium_badge") }}</span>
                  </li>
                  <li class="flex items-start gap-3 text-gray-700">
                    <i
                      class="fas fa-check text-green-500 mt-1 flex-shrink-0"
                    ></i>
                    <span>{{ t("maximum_priority_position") }}</span>
                  </li>
                </ul>
              </div>
              <button
                @click="selectPlan('yearly')"
                class="mt-6 w-full py-3 rounded-xl bg-[var(--espace-or)] text-[var(--espace-vert)] font-bold hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
              >
                {{ t("choose_this_plan") }}
              </button>
            </div>
          </div>

          <!-- Section avantages -->
          <div class="mt-12 bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 class="text-2xl font-bold text-center text-gray-900 mb-6">
              🎯 {{ t("why_go_premium") }}
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 bg-[var(--espace-vert)] rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-chart-line text-white text-lg"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">
                    {{ t("increase_sales") }}
                  </h4>
                  <p class="text-gray-600 text-sm">
                    {{ t("increase_sales_description") }}
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 bg-[var(--espace-or)] rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <i class="fas fa-users text-[var(--espace-vert)] text-lg"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">
                    {{ t("grow_network") }}
                  </h4>
                  <p class="text-gray-600 text-sm">
                    {{ t("grow_network_description") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Étape 2 : Formulaire de paiement -->
        <div v-else class="max-w-3xl mx-auto">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Récapitulatif -->
            <div class="lg:w-2/5">
              <div
                class="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-4"
              >
                <h3 class="text-xl font-bold text-gray-900 mb-4">
                  {{ t("your_selection") }}
                </h3>

                <div
                  :class="[
                    'rounded-xl p-4 mb-4 border-2',
                    selectedPlan === 'monthly'
                      ? 'bg-green-50 border-[var(--espace-vert)]'
                      : 'bg-yellow-50 border-[var(--espace-or)]',
                  ]"
                >
                  <div class="flex items-center gap-3 mb-3">
                    <div
                      :class="[
                        'w-10 h-10 rounded-full flex items-center justify-center text-white',
                        selectedPlan === 'monthly'
                          ? 'bg-[var(--espace-vert)]'
                          : 'bg-[var(--espace-or)]',
                      ]"
                    >
                      <i class="fas fa-crown"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-gray-900">
                        {{
                          selectedPlan === "monthly"
                            ? t("premium_monthly")
                            : t("premium_yearly")
                        }}
                      </h4>
                      <p class="text-sm text-gray-600">
                        {{
                          selectedPlan === "monthly"
                            ? t("monthly_renewal")
                            : t("economical_year")
                        }}
                      </p>
                    </div>
                  </div>

                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600"
                        >{{ t("subscription") }}:</span
                      >
                      <span class="font-semibold">
                        {{
                          selectedPlan === "monthly"
                            ? "5 000 FCFA"
                            : "50 000 FCFA"
                        }}
                      </span>
                    </div>
                    <div class="flex justify-between text-[var(--espace-vert)]">
                      <span>{{ t("free_tokens") }}:</span>
                      <span class="font-semibold">
                        {{
                          selectedPlan === "monthly"
                            ? t("tokens_per_month")
                            : t("tokens_per_year")
                        }}
                      </span>
                    </div>
                    <div class="flex justify-between text-[var(--espace-vert)]">
                      <span>{{ t("fees") }}:</span>
                      <span class="font-semibold">
                        {{ t("free") }}
                      </span>
                    </div>
                    <div class="border-t pt-2">
                      <div class="flex justify-between font-bold text-lg">
                        <span>{{ t("total") }}:</span>
                        <span>
                          {{
                            selectedPlan === "monthly"
                              ? "5 000 FCFA"
                              : "50 000 FCFA"
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h5
                    class="font-semibold text-blue-900 mb-2 flex items-center gap-2"
                  >
                    <i class="fas fa-gift text-blue-600"></i>
                    {{ t("included_with_subscription") }}
                  </h5>
                  <ul class="text-sm text-blue-800 space-y-1">
                    <li class="flex items-center gap-2">
                      <i class="fas fa-check text-blue-500 text-sm"></i>
                      {{ t("priority_support") }}
                    </li>
                    <li class="flex items-center gap-2">
                      <i class="fas fa-check text-blue-500 text-sm"></i>
                      {{ t("free_updates") }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Formulaire de paiement NOTCHPAY -->
            <div class="lg:w-3/5">
              <div class="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ t("secure_payment") }}
                </h3>
                <p class="text-gray-600 mb-6">
                  {{ t("finalize_subscription") }}
                </p>

                <form @submit.prevent="confirmUpgrade" class="space-y-6">
                  <!-- Email (OBLIGATOIRE pour NotchPay) -->
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      <i
                        class="fas fa-envelope text-[var(--espace-vert)] mr-2"
                      ></i>
                      {{ t("email_address") }}
                    </label>
                    <input
                      v-model="email"
                      type="email"
                      :placeholder="t('email_placeholder')"
                      :class="[
                        'w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all',
                        emailError
                          ? 'border-red-500 bg-red-50 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[var(--espace-vert)] focus:ring-green-700',
                      ]"
                      @input="validateForm"
                    />
                    <p
                      v-if="emailError"
                      class="text-red-600 text-sm mt-2 flex items-center gap-2"
                    >
                      <i class="fas fa-exclamation-circle"></i>
                      {{ t("enter_valid_email") }}
                    </p>
                  </div>

                  <!-- Informations de paiement -->
                  <div
                    class="bg-green-50 rounded-xl p-4 border border-green-200"
                  >
                    <div class="flex items-center gap-3 mb-3">
                      <div
                        class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                      >
                        <i class="fas fa-shield-alt text-green-600"></i>
                      </div>
                      <div>
                        <h4 class="font-semibold text-green-900">
                          {{ t("secure_redirection") }}
                        </h4>
                        <p class="text-sm text-green-700">
                          {{ t("notchpay_redirection_message") }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="space-y-4 pt-4">
                    <button
                      type="submit"
                      :disabled="!isFormValid || isLoading"
                      :class="[
                        'w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3',
                        !isFormValid || isLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[var(--espace-vert)] to-[var(--espace-vert)] text-white hover:shadow-xl hover:scale-105',
                      ]"
                    >
                      <template v-if="isLoading">
                        <i class="fas fa-spinner fa-spin"></i>
                        {{ t("processing_payment") }}
                      </template>
                      <template v-else>
                        <i class="fas fa-lock"></i>
                        {{ t("pay_now") }}
                      </template>
                    </button>

                    <button
                      type="button"
                      @click="selectedPlan = ''"
                      class="w-full text-center text-gray-600 hover:text-[var(--espace-vert)] transition-colors py-3 flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-arrow-left"></i>
                      {{ t("back_to_plans") }}
                    </button>
                  </div>

                  <!-- Sécurité -->
                  <div class="text-center pt-4 border-t border-gray-200">
                    <p
                      class="text-sm text-gray-500 flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-shield-alt text-green-500"></i>
                      {{ t("secure_payment_via_notchpay") }}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay de chargement -->
  <div
    v-if="isLoading"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]"
  >
    <div class="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
      <div
        class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <i class="fas fa-spinner fa-spin text-green-600 text-2xl"></i>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">
        {{ t("processing_payment") }}
      </h3>
      <p class="text-gray-600">{{ t("redirecting_to_notchpay") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import apiClient from "../api/index";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/Auth";
import { useRouter } from "vue-router";
import { useI18n } from "./useI18n";

const { t } = useI18n();
const user = useAuthStore().user;
const router = useRouter();
// const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close", "upgraded"]);
const toast = useToast();

const selectedPlan = ref("");
const email = ref("");
const phoneNumber = ref("");
const emailError = ref(false);
const nameError = ref(false);
const isLoading = ref(false);

// Computed properties
const isFormValid = computed(() => {
  return (
    email.value &&
    isValidEmail(email.value) &&
    !emailError.value &&
    !nameError.value
  );
});

// Methods
const closeModal = () => {
  router.back();
  setTimeout(() => {
    resetForm();
  }, 300);
};

const resetForm = () => {
  selectedPlan.value = "";
  email.value = "";
  phoneNumber.value = "";
  emailError.value = false;
  nameError.value = false;
  isLoading.value = false;
};

const selectPlan = (plan: string) => {
  selectedPlan.value = plan;
  resetValidation();

  // Pré-remplir avec les données utilisateur
  if (user) {
    email.value = user.email || "";
  }
};

const validateForm = () => {
  emailError.value = !email.value || !isValidEmail(email.value);
};

const resetValidation = () => {
  emailError.value = false;
  nameError.value = false;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const confirmUpgrade = async () => {
  // Validation finale
  validateForm();

  if (!isFormValid.value) {
    toast.error(t("check_form_information"));
    return;
  }

  isLoading.value = true;

  try {
    // Utilisation de votre apiClient configuré pour CORS
    const response = await apiClient.post("/upgrade-to-premium", {
      subscription_type: selectedPlan.value,
      email: email.value,
    });

    // Vérifier si la réponse contient une URL de redirection
    if (response.data.redirect_url || response.data.authorization_url) {
      const redirectUrl =
        response.data.redirect_url || response.data.authorization_url;

      // Redirection automatique vers NotchPay
      window.location.href = redirectUrl;

      // Le loading restera affiché pendant la redirection
      // Si la redirection échoue, on arrête le loading après un timeout
      setTimeout(() => {
        isLoading.value = false;
      }, 5000);
    } else {
      throw new Error("URL de redirection non reçue du serveur");
    }
  } catch (error: any) {
    console.error("Erreur lors du paiement:", error);
    isLoading.value = false;

    // Gestion des erreurs spécifiques
    if (error.response?.status === 401) {
      toast.error(t("authentication_required"));
      router.push("/login");
      return;
    }

    if (error.response?.status === 422) {
      // Erreur de validation
      const errors = error.response.data.errors;
      if (errors?.email) {
        emailError.value = true;
        toast.error(errors.email[0]);
      }
      if (errors?.name) {
        nameError.value = true;
        toast.error(errors.name[0]);
      }
      return;
    }

    // Erreur générique
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      t("payment_initialization_error");
    toast.error(errorMessage);
  }
};
</script>

<style scoped>
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Scrollbar personnalisée */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Amélioration des transitions */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Effet de profondeur */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>
