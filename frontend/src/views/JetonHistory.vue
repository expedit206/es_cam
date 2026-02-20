<template>
  <SeoHead v-bind="transactionStore.seoMeta" />
  <StructuredData
    :type="transactionStore.structuredData.type"
    :data="transactionStore.structuredData.data"
  />

  <div
    class="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4 sm:px-6"
  >
    <div class="max-w-6xl mx-auto">
      <!-- En-tête -->
      <header class="text-center mb-8">
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {{ t("transaction_history") }}
        </h1>
        <p class="text-gray-600 text-sm md:text-lg">
          {{ t("transaction_history_subtitle") }}
        </p>
      </header>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <div class="bg-white rounded-2xl shadow-sm border p-2 text-center">
          <div class="text-sm font-bold text-primary mb-1">
            {{ transactionStore.totalTransactions }}
          </div>
          <div class="text-sm text-gray-600">
            {{ t("total_transactions") }}
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border p-2 text-center">
          <div class="text-sm font-bold text-green-600 mb-1">
            {{ transactionStore.successfulTransactions }}
          </div>
          <div class="text-sm text-gray-600">
            {{ t("successful_transactions") }}
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border p-2 text-center">
          <div class="text-sm font-bold text-blue-600 mb-1">
            {{ transactionStore.totalJetonsAchetes }}
          </div>
          <div class="text-sm text-gray-600">
            {{ t("tokens_purchased") }}
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border p-2 text-center">
          <div class="text-sm font-bold text-secondary mb-1">
            {{ transactionStore.totalJetonsVendus }}
          </div>
          <div class="text-sm text-gray-600">
            {{ t("tokens_sold") }}
          </div>
        </div>
      </div>

      <!-- Actions globales -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mt-5 mb-4">
        <router-link
          to="/acheter-jetons"
          class="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
        >
          <i class="fas fa-shopping-cart"></i>
          {{ t("buy_tokens") }}
        </router-link>
      </div>

      <!-- Filtres -->
      <div class="bg-white rounded-2xl shadow-sm border p-4 mb-2">
        <div class="flex flex-wrap gap-2 items-center">
          <!-- Filtre par type -->
          <div class="border-b-1 pb-2 w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t("transaction_origin") }}
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="type in transactionStore.typeFilters"
                :key="type.value"
                @click="transactionStore.setActiveTypeFilter(type.value)"
                :class="[
                  'px-2 py-1 rounded-lg text-sm font-medium transition-all',
                  transactionStore.activeTypeFilter === type.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                ]"
              >
                {{ type.label }}
              </button>
            </div>
          </div>

          <!-- Filtre par statut -->
          <div class="border-b-1 pb-2 w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t("status") }}
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="filter in transactionStore.statusFilters"
                :key="filter.value"
                @click="transactionStore.setActiveStatusFilter(filter.value)"
                :class="[
                  'px-2 py-1 rounded-lg text-sm font-medium transition-all',
                  transactionStore.activeStatusFilter === filter.value
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                ]"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>

          <!-- Filtre par rôle -->
          <div class="">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t("type") }}
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="role in transactionStore.roleFilters"
                :key="role.value"
                @click="transactionStore.setActiveRoleFilter(role.value)"
                :class="[
                  'px-2 py-1 rounded-lg text-sm font-medium transition-all',
                  transactionStore.activeRoleFilter === role.value
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                ]"
              >
                {{ role.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des transactions -->
      <div
        v-if="transactionStore.filteredTransactions.length > 0"
        class="space-y-3 overflow-y-scroll h-[90vh]"
      >
        <div
          v-for="transaction in transactionStore.filteredTransactions"
          :key="transaction.id"
          class="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-all duration-300 hover-lift"
        >
          <!-- En-tête de la transaction -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm',
                  transactionStore.getTransactionTypeIcon(transaction.type)
                    .bgColor,
                ]"
              >
                <i
                  :class="
                    transactionStore.getTransactionTypeIcon(transaction.type)
                      .icon
                  "
                  class="text-sm"
                ></i>
              </div>
              <div>
                <h3 class="text-sm md:text-lg font-semibold text-gray-900">
                  {{ transactionStore.getTransactionTitle(transaction) }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ transactionStore.formatDate(transaction.created_at) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <div
                class="text-sm font-bold"
                :class="transactionStore.getAmountColor(transaction)"
              >
                {{ transactionStore.formatPrice(transaction.montant_total) }}
                FCFA
              </div>
            </div>
          </div>

          <!-- Détails de la transaction -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-4"
          >
            <!-- Prix unitaire -->
            <div
              class="bg-gray-50 rounded-lg p-1 flex justify-between items-center text-sm"
            >
              <div class="text-gray-600">{{ t("unit_price") }}</div>
              <div class="font-semibold text-gray-900">
                {{ transactionStore.formatPrice(transaction.prix_unitaire) }}
                FCFA
              </div>
            </div>

            <!-- Montant net (pour vendeur) -->
            <div
              v-if="transactionStore.isVendeur(transaction)"
              class="bg-green-50 rounded-lg p-1 flex justify-between items-center text-sm"
            >
              <div class="text-green-700">{{ t("net_amount") }}</div>
              <div class="font-semibold text-green-900">
                {{
                  transactionStore.formatPrice(
                    transaction.montant_net_vendeur || 0,
                  )
                }}
                FCFA
              </div>
            </div>

            <!-- Commission (pour vendeur) -->
            <div
              v-if="transactionStore.isVendeur(transaction)"
              class="bg-orange-50 rounded-lg p-1 flex justify-between items-center text-sm"
            >
              <div class="text-orange-700">{{ t("commission") }}</div>
              <div class="font-semibold text-orange-900">
                -{{
                  transactionStore.formatPrice(
                    transaction.commission_plateforme || 0,
                  )
                }}
                FCFA
              </div>
            </div>

            <!-- Référence -->
            <div
              class="bg-gray-50 rounded-lg p-1 flex justify-between items-center gap-2"
            >
              <div class="text-sm text-gray-600">{{ t("reference") }}</div>
              <div class="font-mono text-sm text-gray-900 truncate">
                {{ transaction.notchpay_reference }}
              </div>
            </div>
          </div>

          <!-- Informations des parties -->
          <div class="flex flex-wrap items-center gap-4 text-sm mb-3">
            <!-- Statut -->
            <span
              :class="[
                'px-2 py-1 rounded-full font-medium border flex items-center gap-1',
                transactionStore.getStatusColor(transaction.statut),
              ]"
            >
              <i
                :class="transactionStore.getStatusIcon(transaction.statut)"
              ></i>
              {{ transactionStore.getStatusText(transaction.statut) }}
            </span>

            <!-- Partie adverse -->
            <span
              v-if="
                transactionStore.isAcheteur(transaction) && transaction.vendeur
              "
              class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200"
            >
              <i class="fas fa-user mr-1"></i>
              {{ t("seller") }}: {{ transaction.vendeur.nom }}
            </span>

            <span
              v-if="
                transactionStore.isVendeur(transaction) && transaction.acheteur
              "
              class="px-2 py-1 bg-green-100 text-green-700 rounded-full border border-green-200"
            >
              <i class="fas fa-user mr-1"></i>
              {{ t("buyer") }}: {{ transaction.acheteur.nom }}
            </span>
          </div>

          <!-- Actions -->
          <div
            class="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-200"
          >
            <!-- Vérification statut -->
            <button
              v-if="transaction.statut === 'pending'"
              @click="handleCheckStatus(transaction)"
              :disabled="transaction.checkingStatus"
              class="flex items-center gap-2 text-primary border-primary border-2 px-4 py-2 rounded-lg hover:bg-blue-300 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i
                :class="[
                  'fas',
                  transaction.checkingStatus
                    ? 'fa-spinner fa-spin'
                    : 'fa-sync-alt',
                ]"
              ></i>
              {{
                transaction.checkingStatus ? t("checking") : t("check_status")
              }}
            </button>

            <!-- Acheter à nouveau (seulement pour achats plateforme réussis) -->
            <button
              v-if="
                transactionStore.isAcheteur(transaction) &&
                transaction.type === 'platform' &&
                transaction.statut === 'complete'
              "
              @click="transactionStore.redoPlatformPurchase(transaction)"
              class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all text-sm"
            >
              <i class="fas fa-redo"></i>
              {{ t("buy_again") }}
            </button>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="text-center py-16">
        <div class="bg-white rounded-2xl p-8 shadow-sm border">
          <div
            class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <i class="fas fa-receipt text-gray-400 text-3xl"></i>
          </div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3">
            {{ t("no_transactions") }}
          </h3>
          <p class="text-gray-600 max-w-md mx-auto mb-6">
            {{ t("no_transactions_description") }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <router-link
              to="/acheter-jetons"
              class="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
            >
              <i class="fas fa-shopping-cart"></i>
              {{ t("buy_tokens") }}
            </router-link>
            <!-- <router-link to="/jetonMarket"
                            class="border-2 border-[var(--espace-vert)] text-[var(--espace-vert)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--espace-vert)] hover:text-white transition-all flex items-center justify-center gap-2">
                            <i class="fas fa-coins"></i>
                            {{ t('token_market') }}
                        </router-link> -->
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="transactionStore.filteredTransactions.length > 0"
        class="flex justify-center mt-8"
      >
        <div class="bg-white rounded-2xl shadow-sm border px-6 py-3">
          <div class="flex items-center gap-4 text-sm">
            <button
              @click="transactionStore.loadPreviousPage"
              :disabled="transactionStore.currentPage === 1"
              :class="[
                'px-4 py-2 rounded-lg transition-all',
                transactionStore.currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              <i class="fas fa-chevron-left mr-2"></i>
              {{ t("previous") }}
            </button>

            <span class="text-gray-600">
              {{ t("page") }} {{ transactionStore.currentPage }} {{ t("of") }}
              {{ transactionStore.totalPages }}
            </span>

            <button
              @click="transactionStore.loadNextPage"
              :disabled="
                transactionStore.currentPage === transactionStore.totalPages
              "
              :class="[
                'px-4 py-2 rounded-lg transition-all',
                transactionStore.currentPage === transactionStore.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ t("next") }}
              <i class="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useTransactionHistoryStore } from "../stores/jetonsHistory";
import SeoHead from "../components/SeoHead.vue";
import StructuredData from "../components/StructuredData.vue";
import { useI18n } from "../components/useI18n";

const { t } = useI18n();
const route = useRoute();
const transactionStore = useTransactionHistoryStore();

// Handler pour la vérification du statut
const handleCheckStatus = async (transaction: any) => {
  try {
    await transactionStore.checkTransactionStatus(transaction);
  } catch (error) {
    // L'erreur est déjà gérée dans le store
  }
};

// Watchers et lifecycle
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.payment || newQuery.reference) {
      transactionStore.handleUrlParams();
    }
  },
);

onMounted(async () => {
  setTimeout(() => {
    transactionStore.handleUrlParams();
  }, 500);

  await transactionStore.initializeTransactions();
});
</script>

<style scoped>
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>
