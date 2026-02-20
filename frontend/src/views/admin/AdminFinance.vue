<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-8">
      <router-link
        to="/admin/dashboard"
        class="text-gray-500 hover:text-[var(--espace-vert)] transition-colors mb-4 inline-block"
      >
        <i class="fas fa-arrow-left mr-2"></i> Retour au Dashboard
      </router-link>
      <h1 class="text-3xl font-bold text-gray-800">Rapports Financiers</h1>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="stats-card">
        <h3 class="text-gray-500 font-medium mb-2">Volume Total</h3>
        <p class="text-2xl font-bold text-gray-800">
          {{ formatCurrency(adminStore.financeStats.total_volume) }}
        </p>
      </div>
      <div class="stats-card">
        <h3 class="text-gray-500 font-medium mb-2">Commissions</h3>
        <p class="text-2xl font-bold text-green-600">
          {{ formatCurrency(adminStore.financeStats.total_commission) }}
        </p>
      </div>
      <div class="stats-card">
        <h3 class="text-gray-500 font-medium mb-2">
          Ventes Jetons (Plateforme)
        </h3>
        <p class="text-2xl font-bold text-blue-600">
          {{ formatCurrency(adminStore.financeStats.platform_sales) }}
        </p>
      </div>
      <div class="stats-card">
        <h3 class="text-gray-500 font-medium mb-2">Volume Marketplace</h3>
        <p class="text-2xl font-bold text-orange-600">
          {{ formatCurrency(adminStore.financeStats.marketplace_volume) }}
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
    >
      <div class="relative w-full md:w-96">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher par utilisateur ou référence..."
          class="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)] transition-all"
          @input="handleFilter"
        />
        <i
          class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        ></i>
      </div>
      <div class="flex gap-4">
        <select
          v-model="typeFilter"
          @change="handleFilter"
          class="bg-gray-50 border-none rounded-2xl px-6 py-3 focus:ring-2 focus:ring-[var(--espace-vert)]"
        >
          <option value="">Tous types</option>
          <option value="platform">Achat Jetons</option>
          <option value="marketplace">Marketplace</option>
        </select>
        <select
          v-model="statusFilter"
          @change="handleFilter"
          class="bg-gray-50 border-none rounded-2xl px-6 py-3 focus:ring-2 focus:ring-[var(--espace-vert)]"
        >
          <option value="">Tous statuts</option>
          <option value="confirmé">Confirmé</option>
          <option value="en_attente">En attente</option>
          <option value="echec">Échec</option>
        </select>
      </div>
    </div>

    <!-- Transactions Table -->
    <div
      class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 text-left">
            <th class="px-6 py-4 text-sm font-bold text-gray-500 uppercase">
              Date/Réf
            </th>
            <th class="px-6 py-4 text-sm font-bold text-gray-500 uppercase">
              Type
            </th>
            <th class="px-6 py-4 text-sm font-bold text-gray-500 uppercase">
              Acheteur
            </th>
            <th class="px-6 py-4 text-sm font-bold text-gray-500 uppercase">
              Vendeur
            </th>
            <th class="px-6 py-4 text-sm font-bold text-gray-500 uppercase">
              Montant
            </th>
            <th class="px-6 py-4 text-sm font-bold text-gray-500 uppercase">
              Statut
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="tx in adminStore.transactions"
            :key="tx.id"
            class="hover:bg-gray-50/50 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="font-bold text-gray-800">
                {{ new Date(tx.created_at).toLocaleDateString() }}
              </div>
              <div class="text-sm text-gray-400 font-mono">
                {{ tx.notchpay_reference || "N/A" }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 rounded-full text-[10px] font-bold uppercase border"
                :class="
                  tx.type === 'platform'
                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                    : 'bg-orange-50 text-orange-600 border-orange-100'
                "
              >
                {{ tx.type === "platform" ? "Jeton" : "Marketplace" }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-700">
                {{ tx.acheteur?.nom || "Inconnu" }}
              </div>
              <div class="text-sm text-gray-400">{{ tx.acheteur?.email }}</div>
            </td>
            <td class="px-6 py-4">
              <div v-if="tx.vendeur" class="text-sm font-medium text-gray-700">
                {{ tx.vendeur.nom }}
              </div>
              <div v-if="tx.vendeur" class="text-sm text-gray-400">
                {{ tx.vendeur.email }}
              </div>
              <div v-else class="text-sm text-gray-400 italic">Plateforme</div>
            </td>
            <td class="px-6 py-4">
              <div class="font-bold text-gray-800">
                {{ formatCurrency(tx.montant_total) }}
              </div>
              <div
                v-if="tx.commission_plateforme > 0"
                class="text-sm text-green-600"
              >
                Comm: {{ formatCurrency(tx.commission_plateforme) }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 rounded-full text-[10px] font-bold uppercase border"
                :class="{
                  'bg-green-50 text-green-600 border-green-100':
                    tx.statut === 'confirmé',
                  'bg-yellow-50 text-yellow-600 border-yellow-100':
                    tx.statut === 'en_attente',
                  'bg-red-50 text-red-600 border-red-100':
                    tx.statut === 'echec',
                }"
              >
                {{ tx.statut }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="adminStore.transactions.length === 0" class="p-12 text-center">
        <p class="text-gray-500">Aucune transaction trouvée.</p>
      </div>

      <!-- Pagination -->
      <div
        class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center"
      >
        <span class="text-sm text-gray-500"
          >Page {{ adminStore.pagination.transactions.current }} sur
          {{ adminStore.pagination.transactions.last }}</span
        >
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="adminStore.pagination.transactions.current === 1"
            class="px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all font-medium text-sm"
          >
            Précédent
          </button>
          <button
            @click="nextPage"
            :disabled="
              adminStore.pagination.transactions.current ===
              adminStore.pagination.transactions.last
            "
            class="px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all font-medium text-sm"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAdminStore } from "../../stores/admin";
import debounce from "lodash/debounce";

const adminStore = useAdminStore();
const search = ref("");
const typeFilter = ref("");
const statusFilter = ref("");

onMounted(() => {
  adminStore.fetchFinanceStats();
  adminStore.fetchTransactions();
});

const handleFilter = debounce(() => {
  adminStore.fetchTransactions(
    1,
    search.value,
    typeFilter.value,
    statusFilter.value,
  );
}, 500);

const nextPage = () => {
  adminStore.fetchTransactions(
    adminStore.pagination.transactions.current + 1,
    search.value,
    typeFilter.value,
    statusFilter.value,
  );
};

const prevPage = () => {
  adminStore.fetchTransactions(
    adminStore.pagination.transactions.current - 1,
    search.value,
    typeFilter.value,
    statusFilter.value,
  );
};

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
  }).format(Number(value));
};
</script>
