<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Tableau de Bord Admin</h1>
        <p class="text-gray-600">
          Bienvenue, voici l'état actuel de votre plateforme.
        </p>
      </div>
      <div class="flex gap-4">
        <button
          @click="adminStore.fetchStats()"
          class="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-all text-[var(--espace-vert)]"
        >
          <i
            class="fas fa-sync-alt"
            :class="{ 'animate-spin': adminStore.isLoading }"
          ></i>
        </button>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <!-- Utilisateurs -->
      <div class="stats-card group">
        <div class="flex items-center justify-between mb-4">
          <div
            class="p-4 bg-blue-100 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform"
          >
            <i class="fas fa-users text-2xl"></i>
          </div>
          <span
            class="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full"
            >+{{ adminStore.stats.users.today }}</span
          >
        </div>
        <h3 class="text-gray-500 font-medium">Utilisateurs Totaux</h3>
        <p class="text-3xl font-bold text-gray-800">
          {{ adminStore.stats.users.total }}
        </p>
        <div class="mt-4 text-sm text-gray-500">
          <span class="font-bold text-blue-600">{{
            adminStore.stats.users.premium
          }}</span>
          membres premium
        </div>
      </div>

      <!-- Produits -->
      <div class="stats-card group">
        <div class="flex items-center justify-between mb-4">
          <div
            class="p-4 bg-orange-100 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform"
          >
            <i class="fas fa-box text-2xl"></i>
          </div>
          <span
            class="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full"
            >Actifs</span
          >
        </div>
        <h3 class="text-gray-500 font-medium">Articles en vente</h3>
        <p class="text-3xl font-bold text-gray-800">
          {{ adminStore.stats.marketplace.products_total }}
        </p>
        <div class="mt-4 text-sm text-gray-500">
          <span class="font-bold text-orange-600">{{
            adminStore.stats.marketplace.services_total
          }}</span>
          services proposés
        </div>
      </div>

      <!-- Revenus -->
      <div class="stats-card group">
        <div class="flex items-center justify-between mb-4">
          <div
            class="p-4 bg-green-100 rounded-2xl text-green-600 group-hover:scale-110 transition-transform"
          >
            <i class="fas fa-wallet text-2xl"></i>
          </div>
        </div>
        <h3 class="text-gray-500 font-medium">Liquidité Totale</h3>
        <p class="text-3xl font-bold text-gray-800">
          {{ formatCurrency(adminStore.stats.finance.total_solde) }}
        </p>
        <div class="mt-4 text-sm text-gray-500">
          <span class="font-bold text-green-600">{{
            adminStore.stats.finance.total_jetons
          }}</span>
          jetons en circulation
        </div>
      </div>

      <!-- Reventes -->
      <div class="stats-card group">
        <div class="flex items-center justify-between mb-4">
          <div
            class="p-4 bg-purple-100 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform"
          >
            <i class="fas fa-handshake text-2xl"></i>
          </div>
          <span
            v-if="adminStore.stats.marketplace.pending_reventes > 0"
            class="flex h-3 w-3 relative"
          >
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-3 w-3 bg-red-500"
            ></span>
          </span>
        </div>
        <h3 class="text-gray-500 font-medium">Reventes en attente</h3>
        <p class="text-3xl font-bold text-gray-800">
          {{ adminStore.stats.marketplace.pending_reventes }}
        </p>
        <div class="mt-4 text-sm text-gray-500">
          À valider par les propriétaires
        </div>
      </div>
    </div>

    <!-- Quick Actions & Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2
          class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"
        >
          <i class="fas fa-bolt text-yellow-500"></i> Actions Rapides
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <router-link to="/admin/users" class="action-btn">
            <i class="fas fa-user-shield"></i> Gérer Utilisateurs
          </router-link>
          <router-link to="/admin/marketplace" class="action-btn">
            <i class="fas fa-store"></i> Gérer Marketplace
          </router-link>
          <router-link to="/admin/categories" class="action-btn">
            <i class="fas fa-tags"></i> Gérer Catégories
          </router-link>
          <router-link to="/admin/finance" class="action-btn">
            <i class="fas fa-chart-line"></i> Rapports Financiers
          </router-link>
          <router-link to="/admin/blog" class="action-btn">
            <i class="fas fa-newspaper"></i> Gérer le Blog
          </router-link>
          <router-link to="/admin/partenaires" class="action-btn">
            <i class="fas fa-handshake"></i> Gérer les Partenaires
          </router-link>
          <router-link
            to="/admin/broadcast"
            class="action-btn col-span-2 justify-center bg-blue-50 text-blue-700 hover:shadow-blue-200"
          >
            <i class="fas fa-bullhorn"></i> Diffuser un Message (Tous)
          </router-link>
        </div>
      </div>

      <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-gray-800 mb-6">Plateforme Health</h2>
        <div class="space-y-6">
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-600"
                >Taux d'utilisateurs Premium</span
              >
              <span class="text-sm font-bold text-blue-600"
                >{{ premiumRate }}%</span
              >
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full shadow-sm shadow-blue-200"
                :style="{ width: premiumRate + '%' }"
              ></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-600"
                >Activité Marketplace (Produits vs Services)</span
              >
              <span class="text-sm font-bold text-orange-600"
                >{{ productsRatio }}%</span
              >
            </div>
            <div
              class="w-full bg-orange-100 rounded-full h-2 overflow-hidden flex"
            >
              <div
                class="bg-orange-600 h-2 rounded-l-full shadow-sm"
                :style="{ width: productsRatio + '%' }"
              ></div>
              <div
                class="bg-orange-300 h-2"
                :style="{ width: 100 - productsRatio + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useAdminStore } from "../../stores/admin";

const adminStore = useAdminStore();

onMounted(() => {
  adminStore.fetchStats();
});

const premiumRate = computed(() => {
  if (adminStore.stats.users.total === 0) return 0;
  return Math.round(
    (adminStore.stats.users.premium / adminStore.stats.users.total) * 100,
  );
});

const productsRatio = computed(() => {
  const totalItems =
    adminStore.stats.marketplace.products_total +
    adminStore.stats.marketplace.services_total;
  if (totalItems === 0) return 100;
  return Math.round(
    (adminStore.stats.marketplace.products_total / totalItems) * 100,
  );
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
  }).format(value);
};
</script>
<!-- 
<style scoped>
.stats-card {
  @apply bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-green-500/5 hover:-translate-y-1 transition-all duration-300;
}

.action-btn {
  @apply flex items-center gap-3 p-4 bg-gray-50 rounded-2xl text-gray-700 font-medium hover:bg-gradient-to-r hover:from-[var(--espace-vert)] hover:to-green-500 hover:text-white transition-all duration-300 shadow-sm border border-gray-100 hover:border-transparent hover:shadow-lg hover:shadow-green-500/20;
}

.action-btn i {
  @apply text-xl;
}
</style> -->
