<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-8">
      <router-link to="/admin/dashboard" class="text-gray-500 hover:text-[var(--espace-vert)] transition-colors mb-4 inline-block">
        <i class="fas fa-arrow-left mr-2"></i> Retour au Dashboard
      </router-link>
      <h1 class="text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="relative w-full md:w-96">
        <input 
          v-model="search" 
          type="text" 
          placeholder="Rechercher par nom, email ou téléphone..." 
          class="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)] transition-all"
          @input="handleSearch"
        >
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
      <div class="flex gap-4">
        <select v-model="roleFilter" class="bg-gray-50 border-none rounded-2xl px-6 py-3 focus:ring-2 focus:ring-[var(--espace-vert)]">
          <option value="">Tous les rôles</option>
          <option value="user">Utilisateurs</option>
          <option value="admin">Administrateurs</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 text-left">
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Utilisateur</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rôle</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Premium</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ville</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in adminStore.users" :key="user.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden border border-gray-100">
                  <img v-if="user.photo" :src="user.photo" class="w-full h-full object-cover">
                  <span v-else>{{ user.nom.charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                  <div class="font-bold text-gray-800">{{ user.nom }}</div>
                  <div class="text-xs text-gray-400 italic">Inscrit le {{ new Date(user.created_at).toLocaleDateString() }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-600">{{ user.email }}</div>
              <div class="text-sm text-gray-400">{{ user.telephone }}</div>
            </td>
            <td class="px-6 py-4">
              <span 
                class="text-[10px] font-bold px-2 py-1 rounded-full border"
                :class="user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'"
              >
                {{ user.role.toUpperCase() }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div v-if="user.premium" class="text-yellow-500">
                <i class="fas fa-crown"></i>
              </div>
              <div v-else class="text-gray-300">
                <i class="fas fa-user"></i>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ user.ville || 'Non précisée' }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button @click="toggleRole(user)" class="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Changer le rôle">
                  <i class="fas fa-exchange-alt"></i>
                </button>
                <button @click="deleteUser(user.id)" class="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Supprimer">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="adminStore.users.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-search text-gray-300 text-2xl"></i>
        </div>
        <p class="text-gray-500">Aucun utilisateur trouvé.</p>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span class="text-sm text-gray-500">Page {{ adminStore.pagination.users.current }} sur {{ adminStore.pagination.users.last }}</span>
        <div class="flex gap-2">
          <button 
            @click="prevPage" 
            :disabled="adminStore.pagination.users.current === 1"
            class="px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all font-medium text-sm"
          >
            Précédent
          </button>
          <button 
            @click="nextPage" 
            :disabled="adminStore.pagination.users.current === adminStore.pagination.users.last"
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
import { ref, onMounted, watch } from 'vue';
import { useAdminStore } from '../../stores/admin';
import debounce from 'lodash/debounce';

const adminStore = useAdminStore();
const search = ref('');
const roleFilter = ref('');

onMounted(() => {
  adminStore.fetchUsers();
});

const handleSearch = debounce(() => {
  adminStore.fetchUsers(1, search.value);
}, 500);

watch(roleFilter, () => {
    // This could be improved if backend supported role filter
    adminStore.fetchUsers(1, search.value);
});

const toggleRole = async (user: any) => {
  const newRole = user.role === 'admin' ? 'user' : 'admin';
  if (confirm(`Voulez-vous vraiment passer ${user.nom} au rôle ${newRole} ?`)) {
    try {
        await adminStore.updateUserRole(user.id, newRole);
    } catch (e) {
        alert('Erreur lors du changement de rôle');
    }
  }
};

const deleteUser = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
    try {
        await adminStore.deleteUser(id);
    } catch (e) {
        alert('Erreur lors de la suppression');
    }
  }
};

const nextPage = () => {
  adminStore.fetchUsers(adminStore.pagination.users.current + 1, search.value);
};

const prevPage = () => {
  adminStore.fetchUsers(adminStore.pagination.users.current - 1, search.value);
};
</script>

<style scoped>
</style>
