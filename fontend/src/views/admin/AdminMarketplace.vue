<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-8">
      <router-link to="/admin/dashboard" class="text-gray-500 hover:text-[var(--espace-vert)] transition-colors mb-4 inline-block">
        <i class="fas fa-arrow-left mr-2"></i> Retour au Dashboard
      </router-link>
      <h1 class="text-3xl font-bold text-gray-800">Gestion Marketplace</h1>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 mb-8">
      <button 
        @click="activeTab = 'products'" 
        class="tab-btn"
        :class="activeTab === 'products' ? 'active' : ''"
      >
        <i class="fas fa-box mr-2"></i> Produits
      </button>
      <button 
        @click="activeTab = 'services'" 
        class="tab-btn"
        :class="activeTab === 'services' ? 'active' : ''"
      >
        <i class="fas fa-concierge-bell mr-2"></i> Services
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="relative w-full md:w-96">
        <input 
          v-model="search" 
          type="text" 
          :placeholder="activeTab === 'products' ? 'Rechercher un produit...' : 'Rechercher un service...'" 
          class="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)] transition-all"
          @input="handleSearch"
        >
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
    </div>

    <!-- Content Table -->
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 text-left">
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Article</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Propriétaire</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Catégorie</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <template v-if="activeTab === 'products'">
            <tr v-for="item in adminStore.products" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img v-if="item.photos && item.photos[0]" :src="item.photos[0]" class="w-full h-full object-cover">
                    <i v-else class="fas fa-image text-gray-300 m-auto flex h-full"></i>
                  </div>
                  <div>
                    <div class="font-bold text-gray-800 line-clamp-1">{{ item.nom }}</div>
                    <div class="text-xs text-[var(--espace-vert)] font-bold">{{ item.prix }} XAF</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-700">{{ item.user?.nom }}</div>
                <div class="text-xs text-gray-400">{{ item.user?.email }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ item.category?.nom }}</td>
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-1 rounded-full text-[10px] font-bold uppercase border"
                  :class="item.est_actif ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'"
                >
                  {{ item.est_actif ? 'En ligne' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="toggleStatus(item.id)" class="p-2 text-gray-400 hover:text-orange-600 transition-colors" :title="item.est_actif ? 'Désactiver' : 'Activer'">
                    <i class="fas" :class="item.est_actif ? 'fa-eye-slash' : 'fa-eye'"></i>
                  </button>
                  <button @click="deleteItem(item.id)" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="item in adminStore.services" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img v-if="item.images && item.images[0]" :src="item.images[0]" class="w-full h-full object-cover">
                    <i v-else class="fas fa-concierge-bell text-gray-300 m-auto flex h-full items-center justify-center"></i>
                  </div>
                  <div>
                    <div class="font-bold text-gray-800 line-clamp-1">{{ item.titre }}</div>
                    <div class="text-xs text-gray-400">{{ item.ville }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-700">{{ item.user?.nom }}</div>
                <div class="text-xs text-gray-400">{{ item.user?.email }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ item.category?.nom }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <span 
                  
                  class="px-2 py-1 rounded-full text-[10px] font-bold uppercase border"
                  :class="item.disponibilite === 'disponible' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'"
                >
                  {{ item.disponibilite }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="toggleStatus(item.id)" class="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                    <i class="fas fa-sync-alt"></i>
                  </button>
                  <button @click="deleteItem(item.id)" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="(activeTab === 'products' ? adminStore.products.length : adminStore.services.length) === 0" class="p-12 text-center">
        <p class="text-gray-500">Aucun élément trouvé.</p>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span class="text-sm text-gray-500">
          Page {{ activeTab === 'products' ? adminStore.pagination.products.current : adminStore.pagination.services.current }} 
          sur {{ activeTab === 'products' ? adminStore.pagination.products.last : adminStore.pagination.services.last }}
        </span>
        <div class="flex gap-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all font-medium text-sm"
          >
            Précédent
          </button>
          <button 
            @click="nextPage" 
            :disabled="currentPage === lastPage"
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
import { ref, onMounted, watch, computed } from 'vue';
import { useAdminStore } from '../../stores/admin';
import debounce from 'lodash/debounce';

const adminStore = useAdminStore();
const activeTab = ref('products');
const search = ref('');

const currentPage = computed(() => 
  activeTab.value === 'products' ? adminStore.pagination.products.current : adminStore.pagination.services.current
);

const lastPage = computed(() => 
  activeTab.value === 'products' ? adminStore.pagination.products.last : adminStore.pagination.services.last
);

onMounted(() => {
  fetchData();
});

watch(activeTab, () => {
    search.value = '';
    fetchData();
});

const fetchData = (page = 1) => {
  if (activeTab.value === 'products') {
    adminStore.fetchProducts(page, search.value);
  } else {
    adminStore.fetchServices(page, search.value);
  }
};

const handleSearch = debounce(() => {
  fetchData();
}, 500);

const toggleStatus = async (id: string) => {
    if (activeTab.value === 'products') {
        await adminStore.toggleProductStatus(id);
    } else {
        await adminStore.toggleServiceStatus(id);
    }
};

const deleteItem = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet article ? Cette action est définitive.')) {
        if (activeTab.value === 'products') {
            await adminStore.deleteProduct(id);
        } else {
            await adminStore.deleteService(id);
        }
    }
};

const nextPage = () => {
  fetchData(currentPage.value + 1);
};

const prevPage = () => {
  fetchData(currentPage.value - 1);
};
</script>

<!-- <style scoped>
.tab-btn {
  @apply px-6 py-3 rounded-2xl bg-white text-gray-500 font-bold transition-all border border-transparent shadow-sm hover:shadow-md;
}
.tab-btn.active {
  @apply bg-[var(--espace-vert)] text-white shadow-lg shadow-green-500/20;
}
</style> -->
