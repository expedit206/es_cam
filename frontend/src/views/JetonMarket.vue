<template>
  <SeoHead v-bind="seoMeta" />
  <StructuredData :type="structuredData.type" :data="structuredData.data" />

  <div
    class="h-full overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 pb-24"
  >
    <Loader :isLoading="isLoading" />
    <!-- Header fixe -->
    <div
      class="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm px-4 py-1"
    >
      <div class="flex items-center justify-between">
        <button
          @click="$router.back()"
          class="p-2 text-gray-800 hover:text-primary"
        >
          <i class="fas fa-arrow-left text-lg"></i>
        </button>

        <div class="text-center">
          <h1 class="text-md md:text-lg font-bold text-black">
            {{ t("token_market") }}
          </h1>
          <p class="text-sm text-gray-500">
            {{ t("token_market_subtitle") }}
          </p>
        </div>

        <div class="w-8"></div>
      </div>
    </div>

    <!-- Section éducative élargie -->
    <div class="pt-16 px-4">
      <!-- Bannière principale -->
      <div
        class="relative overflow-hidden rounded-2xl p-5 text-primary mb-6 shadow-xl border-2 border-black"
      >
        <!-- En-tête -->
        <div class="flex items-center justify-between">
          <div class="flex items-start gap-3">
            <div
              class="bg-black/25 backdrop-blur-sm rounded-full p-2 flex items-center justify-center shadow-inner"
            >
              <i class="fas fa-gem text-black text-lg"></i>
            </div>
            <div>
              <h3 class="font-bold text-base tracking-wide mb-1">
                {{ t("espace_tokens") }}
              </h3>
              <p class="text-sm text-black/90">
                {{ t("digital_currency_description") }}
              </p>
            </div>
          </div>

          <button
            @click="showEducation = !showEducation"
            class="bg-white/10 hover:bg-black/20 rounded-full p-2 transition transform duration-200"
          >
            <i
              class="fas fa-chevron-down text-sm transition-transform duration-300"
              :class="{ 'rotate-180': showEducation }"
            ></i>
          </button>
        </div>

        <!-- Contenu dépliable -->
        <Transition name="fade">
          <div
            v-if="showEducation"
            class="mt-5 border-t border-white/20 pt-5 space-y-5 text-sm leading-relaxed"
          >
            <!-- Comment gagner -->
            <div>
              <h4 class="font-semibold text-primary mb-3 flex items-center">
                <i class="fas fa-coins mr-2 text-primary"></i>
                {{ t("how_to_earn_tokens") }}
              </h4>
              <ul class="space-y-2 px-2">
                <li class="flex items-start gap-2">
                  <div
                    class="rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <i class="fas fa-user-plus text-black text-sm"></i>
                  </div>
                  <span class="text-black">
                    {{ t("referral_system") }}
                  </span>
                </li>

                <li class="flex items-start gap-2">
                  <div
                    class="rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <i class="fas fa-calendar text-black text-sm"></i>
                  </div>
                  <span class="text-black">
                    {{ t("special_events") }}
                  </span>
                </li>
                <li class="flex items-start gap-2">
                  <div
                    class="rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <i class="fas fa-sync-alt text-black text-sm"></i>
                  </div>
                  <span class="text-black">
                    {{ t("secondary_market") }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- Utilisation -->
            <div>
              <h4 class="font-semibold text-primary mb-3 flex items-center">
                <i class="fas fa-rocket mr-2 text-primary"></i>
                {{ t("use_tokens_for") }}
              </h4>
              <ul class="space-y-2 px-2">
                <li class="text-black">
                  <i class="fas fa-bullhorn text-black mr-2"></i>
                  {{ t("boost_products") }}
                </li>
                <li class="text-black">
                  <i class="fas fa-chart-line text-black mr-2"></i>
                  {{ t("increase_visibility") }}
                </li>
                <li class="text-black">
                  <i class="fas fa-handshake mr-2"></i>
                  {{ t("develop_network") }}
                </li>
              </ul>
            </div>

            <!-- Marché des Jetons -->
            <div
              class="bg-white/10 backdrop-blur-md rounded-xl border border-white/10"
            >
              <h4 class="font-semibold text-primary mb-3 flex items-center">
                <i class="fas fa-chart-bar mr-2 text-primary"></i>
                {{ t("market_allows") }}
              </h4>
              <ul class="space-y-2 px-2">
                <li class="text-black">
                  <strong>{{ t("invest_growth") }}</strong>
                </li>
                <li class="text-black">
                  <strong>{{ t("monetize_tokens") }}</strong>
                </li>
                <li class="text-black">
                  <strong>{{ t("exchange_community") }}</strong>
                </li>
                <li class="text-black">
                  <strong>{{ t("optimize_strategy") }}</strong>
                </li>
              </ul>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Statistiques personnelles rapides -->
      <div
        v-if="user"
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4"
      >
        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-primary">
              {{ user.jetons || 0 }}
            </div>
            <div
              class="text-sm text-gray-600 flex items-center justify-center gap-1"
            >
              <i class="fas fa-coins text-yellow-500"></i>
              {{ t("my_tokens") }}
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold text-black">
              {{ userWallets.length }}
            </div>
            <div
              class="text-sm text-gray-600 flex items-center justify-center gap-1"
            >
              <i class="fas fa-wallet text-black/70"></i>
              {{ t("wallets") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des offres en grid -->
      <div
        v-if="offers.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4"
        @scroll.passive="handleScroll"
      >
        <div
          v-for="offer in filteredOffers"
          :key="offer.id"
          class="bg-white py-4 px-4 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-green-200"
        >
          <!-- En-tête avec photo et nom -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <router-link
                :to="getProfileRoute(offer)"
                class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer border-2 border-green-200"
              >
                <img
                  v-if="offer.user.photo"
                  :src="storageUrl + offer.user.photo"
                  :alt="t('profile_picture')"
                  class="w-full h-full object-cover"
                />
                <i v-else class="fas fa-user text-primary text-sm"></i>
              </router-link>
              <router-link
                :to="getProfileRoute(offer)"
                class="text-sm font-bold text-gray-800 truncate hover:text-primary hover:underline max-w-[100px]"
              >
                {{ offer.user.nom }}
              </router-link>
            </div>
            <span
              class="px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-black border border-green-200"
            >
              {{ offer.nombre_jetons }} <i class="fas fa-coins ml-1"></i>
            </span>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 flex items-center gap-1">
                <i class="fas fa-tag text-primary"></i>
                {{ t("unit_price") }}
              </span>
              <span class="font-bold text-primary"
                >{{ offer.prix_unitaire }} FCFA</span
              >
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 flex items-center gap-1">
                <i class="fas fa-receipt text-slate-500"></i>
                {{ t("total") }}
              </span>
              <span class="font-bold text-gray-900"
                >{{ formatPrice(offer.total_prix) }} FCFA</span
              >
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500 flex items-center gap-1">
                <i class="far fa-clock"></i>
                {{ t("published") }}
              </span>
              <span class="text-gray-500">{{
                formatDate(offer.date_creation)
              }}</span>
            </div>
          </div>

          <!-- Bouton d'achat -->
          <button
            @click="openPaymentModal(offer.id)"
            class="w-full border-2 text-primary px-3 py-3 rounded-xl font-bold shadow-lg hover:from-yellow-500 hover:to-yellow-600 hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <i class="fas fa-bolt"></i>
            {{ t("buy_now") }}
          </button>
        </div>

        <!-- Indicateur de chargement -->
        <div v-if="loading" class="col-span-full text-center py-8">
          <i class="fas fa-spinner fa-spin text-2xl text-primary"></i>
          <p class="text-gray-500 mt-2 text-sm">
            {{ t("loading_offers") }}
          </p>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="text-center py-12">
        <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-coins text-primary text-2xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">
            {{ t("no_offers") }}
          </h3>
          <p class="text-gray-600 text-sm mb-6">
            {{ t("market_empty") }}
          </p>
          <button
            @click="checkWalletsBeforeOffer"
            class="bg-gradient-to-r from-black to-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <i class="fas fa-plus mr-2"></i>
            {{ t("sell_my_tokens") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Barre d'actions fixe en bas -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-100"
    >
      <div class="flex items-center justify-around p-0 max-w-md mx-auto">
        <button
          @click="
            closeAllModals();
            showFilters = true;
          "
          class="flex flex-col items-center p-2 text-gray-600 hover:text-primary transition"
        >
          <i class="fas fa-filter text-lg mb-1"></i>
          <span class="text-sm">{{ t("filters") }}</span>
        </button>

        <button
          @click="refreshOffers"
          class="flex flex-col items-center p-2 text-gray-600 hover:text-primary transition"
          :class="{ 'text-primary': refreshing }"
        >
          <i
            class="fas fa-sync-alt text-lg mb-1"
            :class="{ 'fa-spin': refreshing }"
          ></i>
          <span class="text-sm">{{ t("refresh") }}</span>
        </button>

        <button
          @click="
            closeAllModals();
            showWalletManager = true;
          "
          class="flex flex-col items-center p-2 text-gray-600 hover:text-primary transition"
        >
          <i class="fas fa-wallet text-lg mb-1"></i>
          <span class="text-sm">{{ t("wallet") }}</span>
        </button>

        <button
          @click="checkWalletsBeforeOffer"
          class="flex flex-col items-center p-2 text-primary hover:text-primary transition"
        >
          <i class="fas fa-plus-circle text-lg mb-1"></i>
          <span class="text-sm">{{ t("sell") }}</span>
        </button>

        <button
          @click="showOfferManager = true"
          class="flex flex-col items-center p-2 text-gray-600 hover:text-primary transition"
        >
          <i class="fas fa-list text-lg mb-1"></i>
          <span class="text-sm">{{ t("my_offers") }}</span>
        </button>
      </div>
    </div>

    <!-- Modal Filtres -->
    <div
      v-if="showFilters"
      class="fixed inset-0 bg-black/50 flex items-center z-50"
    >
      <div class="bg-white w-full rounded-t-2xl p-6 animate-slide-up">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">
            {{ t("filter_offers") }}
          </h2>
          <button
            @click="showFilters = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-filter mr-2 text-primary"></i>
              {{ t("min_quantity") }}
            </label>
            <input
              v-model.number="filters.quantityMin"
              type="number"
              min="0"
              :placeholder="t('example_quantity')"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <button
            @click="applyFilters"
            class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary transition flex items-center justify-center gap-2"
          >
            <i class="fas fa-check"></i>
            {{ t("apply_filters") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Nouvelle Offre -->
    <div
      v-if="showOfferForm"
      class="fixed inset-0 bg-black/50 flex items-end z-150"
    >
      <div
        class="bg-white w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-900">
            <i class="fas fa-coins text-yellow-500 mr-2"></i>
            {{ t("sell_tokens") }}
          </h2>
          <button
            @click="showOfferForm = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <form @submit.prevent="submitOffer" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-coins text-yellow-500 mr-2"></i>
              {{ t("tokens_to_sell") }}
            </label>
            <input
              v-model.number="offerForm.nombre_jetons"
              type="number"
              min="1"
              :placeholder="t('example_quantity')"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p class="text-sm text-gray-500 mt-1">
              {{ t("available_tokens") }}
              <strong>{{ user?.jetons || 0 }}</strong>
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-primary mb-2">
              <i class="fas fa-tag text-primary mr-2"></i>
              {{ t("unit_price_cfa") }}
            </label>
            <input
              v-model.number="offerForm.prix_unitaire"
              type="number"
              min="1"
              :placeholder="t('example_price')"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-wallet text-black mr-2"></i>
              {{ t("receiving_wallet") }}
            </label>
            <select
              v-model="offerForm.wallet_id"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">{{ t("choose_wallet") }}</option>
              <option
                v-for="wallet in userWallets"
                :key="wallet.id"
                :value="wallet.id"
              >
                {{ wallet.phone_number }} ({{ wallet.payment_service }})
              </option>
            </select>
          </div>

          <!-- Résumé de l'offre -->
          <div
            class="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200"
          >
            <h4
              class="font-semibold text-gray-800 text-sm flex items-center gap-2"
            >
              <i class="fas fa-calculator text-primary"></i>
              {{ t("offer_summary") }}
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ t("total_sale") }}</span>
                <span class="font-semibold"
                  >{{ formatPrice(totalPrice) }} FCFA</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ t("commission") }}</span>
                <span class="font-semibold text-red-600"
                  >- {{ formatPrice(commission) }} FCFA</span
                >
              </div>
              <div class="flex justify-between border-t pt-2">
                <span class="font-semibold text-gray-800">{{
                  t("you_will_receive")
                }}</span>
                <span class="font-bold text-primary"
                  >{{ formatPrice(totalPrice - commission) }} FCFA</span
                >
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || offerForm.nombre_jetons > (user?.jetons || 0)"
            class="w-full bg-gradient-to-r from-black to-primary text-white py-3 rounded-lg font-semibold hover:from-primary hover:to-black disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-check"></i>
            {{ loading ? t("publishing") : t("publish_offer") }}
          </button>
        </form>
      </div>
    </div>

    <!-- Modal Paiement NOTCHPAY -->
    <div
      v-if="showPaymentModal"
      class="fixed inset-0 bg-black/50 flex items-end z-150"
    >
      <div class="bg-white w-full rounded-t-2xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-900">
            <i class="fas fa-shopping-cart text-primary mr-2"></i>
            {{ t("confirm_purchase") }}
          </h2>
          <button
            @click="showPaymentModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <form @submit.prevent="confirmPayment" class="space-y-4">
          <!-- Informations de l'offre -->
          <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 class="font-semibold text-blue-900 mb-3">
              {{ t("offer_details") }}
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-blue-700">{{ t("seller") }}</span>
                <span class="font-semibold">{{
                  selectedOffer?.user?.nom
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">{{ t("tokens_quantity") }}</span>
                <span class="font-semibold"
                  >{{ selectedOffer?.nombre_jetons }} jetons</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">{{ t("unit_price") }}</span>
                <span class="font-semibold"
                  >{{
                    formatPrice(selectedOffer?.prix_unitaire || 0)
                  }}
                  FCFA</span
                >
              </div>
              <div class="flex justify-between border-t pt-2">
                <span class="font-semibold text-blue-900">{{
                  t("total_amount")
                }}</span>
                <span class="text-lg font-bold text-primary"
                  >{{ formatPrice(selectedOfferTotal) }} FCFA</span
                >
              </div>
            </div>
          </div>

          <!-- Informations de paiement NOTCHPAY (remplace le select wallet) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-envelope text-primary mr-2"></i>
              {{ t("email_address") }} *
            </label>
            <input
              v-model="paymentDetails.email"
              type="email"
              :placeholder="t('email_placeholder')"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <!-- Sécurité NotchPay -->
          <div class="bg-green-50 border border-green-200 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <i class="fas fa-shield-alt text-green-600 text-lg"></i>
              <div>
                <h5 class="font-semibold text-green-900 text-sm">
                  {{ t("secure_payment") }}
                </h5>
                <p class="text-sm text-green-700">
                  {{ t("notchpay_redirection_message") }}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !canSubmitPayment"
            class="w-full bg-gradient-to-r from-black to-primary text-white py-3 rounded-lg font-semibold hover:from-primary hover:to-black disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-bolt"></i>
            {{ loading ? t("processing") : t("pay_now") }}
          </button>
        </form>
      </div>
    </div>

    <!-- Composants -->
    <WalletManager
      v-if="showWalletManager"
      :show="showWalletManager"
      :wallets="userWallets"
      @close="showWalletManager = false"
      @refresh-wallets="fetchUserWallets"
    />

    <OfferManager
      v-if="showOfferManager"
      :show="showOfferManager"
      :wallets="userWallets"
      :offers="userOffers"
      @close="showOfferManager = false"
      @refresh-offers="fetchOffers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiClient from "../api/index";
import { useToast } from "vue-toastification";
import Loader from "../components/Loader.vue";
import SeoHead from "../components/SeoHead.vue";
import StructuredData from "../components/StructuredData.vue";
import { useAuthStore } from "../stores/Auth";
import { useI18n } from "../components/useI18n";
import WalletManager from "../components/WalletManager.vue";
import OfferManager from "../components/OfferManager.vue";

const { t } = useI18n();

// Configuration
const getStorageBaseUrl = () => {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8000/storage/";
  }
  return "https://api.espacecameroun.com/storage/";
};

const getProfileRoute = (offer: any) => {
  return offer.user ?? `/profile/public/${offer.user_id}`;
};

// Métadonnées SEO
const seoMeta = computed(() => {
  return {
    title: t("token_market_title"),
    description: t("token_market_description"),
    keywords: t("token_market_keywords"),
    url: `${window.location.origin}${router.currentRoute.value.path}`,
    type: "website",
  };
});

// Données structurées
const structuredData = computed(() => {
  const offerItems = offers.value.slice(0, 10).map((offer) => ({
    "@type": "Offer",
    name: `${t("offer_of")} ${offer.nombre_jetons} ${t("tokens")}`,
    description: `${t("sale_of")} ${offer.nombre_jetons} ${t("espace_tokens")}`,
    price: offer.prix_unitaire,
    priceCurrency: "XAF",
    seller: {
      "@type": "Person",
      name: offer.user?.nom || t("seller"),
    },
  }));

  return {
    type: "webpage" as const,
    data: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: t("token_market"),
      description: t("token_market_description"),
      url: `${window.location.origin}${router.currentRoute.value.path}`,
      mainEntity:
        offerItems.length > 0
          ? {
              "@type": "ItemList",
              numberOfItems: offerItems.length,
              itemListElement: offerItems,
            }
          : undefined,
    },
  };
});

// Références
let user = computed(() => useAuthStore().user);
const storageUrl = computed(() => getStorageBaseUrl());
const router = useRouter();
const toast = useToast();

// États
const offers = ref<any[]>([]);
const userOffers = ref<any[]>([]);
const userWallets = ref<any[]>([]); // AJOUT: Pour la vente d'offres
const filters = ref({ quantityMin: "" });
const loading = ref(false);
const refreshing = ref(false);
const isLoading = ref(true);
const showEducation = ref(false);

// Modals
const showOfferForm = ref(false);
const showFilters = ref(false);
const showPaymentModal = ref(false);
const showWalletManager = ref(false);
const showOfferManager = ref(false);

// Formulaires
const offerForm = ref({
  nombre_jetons: 0,
  prix_unitaire: 0,
  wallet_id: "", // Pour la vente
});

const paymentDetails = ref({
  email: "",
});

const selectedOffer = ref<any>(null);
const selectedOfferTotal = ref(0);

// Computed
const filteredOffers = computed(() => {
  if (!filters.value.quantityMin) return offers.value;
  return offers.value.filter(
    (offer) => offer.nombre_jetons >= parseInt(filters.value.quantityMin, 10),
  );
});

const totalPrice = computed(
  () => offerForm.value.nombre_jetons * offerForm.value.prix_unitaire,
);
const commission = computed(() => Math.round(totalPrice.value * 0.1));
const netAmount = computed(() => totalPrice.value - commission.value);

const canSubmitOffer = computed(() => {
  return (
    offerForm.value.nombre_jetons > 0 &&
    offerForm.value.prix_unitaire > 0 &&
    offerForm.value.wallet_id &&
    (!user || offerForm.value.nombre_jetons <= (user.value?.jetons || 0))
  );
});

// Validation des champs NotchPay
const canSubmitPayment = computed(() => {
  return (
    paymentDetails.value.email &&
    selectedOffer.value &&
    isValidEmail(paymentDetails.value.email)
  );
});

// Méthodes utilitaires
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR").format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Méthodes principales
const closeAllModals = () => {
  showOfferForm.value = false;
  showFilters.value = false;
  showPaymentModal.value = false;
  showWalletManager.value = false;
  showOfferManager.value = false;
};

const refreshOffers = async () => {
  refreshing.value = true;
  offers.value = [];
  await fetchOffers();
  refreshing.value = false;
  toast.success(t("market_refreshed"));
};

const applyFilters = () => {
  showFilters.value = false;
  fetchOffers();
};

// Gestion du scroll
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  if (scrollTop + clientHeight >= scrollHeight - 100 && !loading.value) {
    fetchOffers();
  }
};

const fetchUserWallets = async () => {
  try {
    const response = await apiClient.get("/wallets");
    userWallets.value = response.data.data || [];
  } catch (error) {
    console.error("Erreur lors du chargement des portefeuilles:", error);
    userWallets.value = [];
  }
};

const fetchOffers = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    const params: any = {};
    if (filters.value.quantityMin) {
      params.quantity_min = filters.value.quantityMin;
    }

    const response = await apiClient.get("/jeton_market/offers", { params });
    offers.value = response.data.data || [];
  } catch (error: any) {
    console.error("Erreur lors du chargement des offres:", error);
    if (error.response?.status === 401) {
      router.push("/login");
    }
  } finally {
    loading.value = false;
    isLoading.value = false;
  }
};

const fetchUserOffers = async () => {
  if (!user) return;

  try {
    const response = await apiClient.get("/jeton_market/my-offers");
    userOffers.value = response.data.data || [];
  } catch (error: any) {
    console.error("Erreur lors du chargement des offres utilisateur:", error);
  }
};

const checkWalletsBeforeOffer = async () => {
  closeAllModals();

  if (!user) {
    toast.error(t("please_login_sell"));
    return;
  }

  await fetchUserWallets();

  if (userWallets.value.length === 0) {
    toast.info(t("create_wallet_first"));
    showWalletManager.value = true;
  } else {
    showOfferForm.value = true;
  }
};

const submitOffer = async () => {
  if (!user) {
    toast.error(t("please_login_sell"));
    return;
  }

  if (offerForm.value.nombre_jetons > (user.value?.jetons || 0)) {
    toast.error(t("not_enough_tokens"));
    return;
  }

  loading.value = true;
  try {
    console.log(offerForm.value);

    const response = await apiClient.post("/jeton_market/offer", {
      ...offerForm.value,
      total_price: totalPrice.value,
    });

    // Mettre à jour les jetons de l'utilisateur
    if (user) {
      user.value.jetons -= offerForm.value.nombre_jetons;
    }

    showOfferForm.value = false;
    toast.success(t("offer_published"));

    // Réinitialiser le formulaire
    offerForm.value = { nombre_jetons: 0, prix_unitaire: 0, wallet_id: "" };

    // Recharger les données
    fetchOffers();
    fetchUserOffers();
  } catch (error: any) {
    console.error("Erreur:", error);
    toast.error(error.response?.data?.message || t("offer_error"));
  } finally {
    loading.value = false;
  }
};

// ADAPTATION NOTCHPAY - Ouverture du modal de paiement
const openPaymentModal = async (offerId: number) => {
  if (!user) {
    await useAuthStore().checkAuth();
    user = useAuthStore().user;
    if (!user) {
      toast.error(t("please_login_buy"));
      return;
    }
  }

  const offer = offers.value.find((o) => o.id === offerId);
  if (offer) {
    selectedOffer.value = offer;
    selectedOfferTotal.value = offer.total_prix;

    // Pré-remplir les informations utilisateur pour NotchPay
    paymentDetails.value = {
      email: user.value?.email || "",
    };

    showPaymentModal.value = true;
  }
};

// ADAPTATION NOTCHPAY - Confirmation du paiement
const confirmPayment = async () => {
  if (!selectedOffer.value) {
    toast.error(t("select_offer"));
    return;
  }

  // Validation des champs NotchPay
  if (
    !paymentDetails.value.email ||
    !isValidEmail(paymentDetails.value.email)
  ) {
    toast.error(t("enter_valid_email"));
    return;
  }

  loading.value = true;
  try {
    // Appel API avec les données NotchPay
    const response = await apiClient.post(
      `/jeton/market/buy/${selectedOffer.value.id}`,
      {
        email: paymentDetails.value.email,
      },
    );

    // Vérifier la réponse et rediriger vers NotchPay
    if (response.data.redirect_url) {
      // Redirection automatique vers NotchPay
      window.location.href = response.data.redirect_url;

      // Le loading restera affiché pendant la redirection
      setTimeout(() => {
        loading.value = false;
        toast.info(t("complete_payment_in_new_tab"));
      }, 5000);
    } else {
      throw new Error("URL de redirection non reçue du serveur");
    }
  } catch (error: any) {
    loading.value = false;

    console.error("Erreur lors de l'achat:", error);

    // Gestion spécifique des erreurs
    if (error.response?.status === 401) {
      router.push("/login");
      return;
    }

    if (error.response?.status === 422) {
      // Erreur de validation
      const errors = error.response.data.errors;
      if (errors?.email) {
        toast.error(errors.email[0]);
      }
      if (errors?.name) {
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
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  isLoading.value = true;
  fetchOffers();
  if (user) {
    fetchUserWallets();
    fetchUserOffers();
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    max-height 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
