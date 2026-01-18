<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-8">
      <router-link to="/admin/dashboard" class="text-gray-500 hover:text-[var(--espace-vert)] transition-colors mb-4 inline-block">
        <i class="fas fa-arrow-left mr-2"></i> Retour au Dashboard
      </router-link>
      <h1 class="text-3xl font-bold text-gray-800">Gestion des Catégories</h1>
    </div>

    <!-- Quick Add Category -->
    <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Ajouter une catégorie</h2>
        <div class="flex flex-col md:flex-row gap-4">
            <input v-model="newCat.nom" type="text" placeholder="Nom de la catégorie" class="flex-grow px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]">
            <select v-model="newCat.type" class="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--espace-vert)]">
                <option value="product">Produit</option>
                <option value="service">Service</option>
            </select>
            <button @click="addCategory" class="px-8 py-3 bg-[var(--espace-vert)] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-green-500/20 transition-all">
                Ajouter
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Product Categories -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                <span>Catégories Produits</span>
                <span class="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full uppercase">{{ adminStore.categories.products.length }}</span>
            </h2>
            <div class="space-y-3">
                <div v-for="cat in adminStore.categories.products" :key="cat.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors">
                    <div class="font-medium text-gray-700">{{ cat.nom }}</div>
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button @click="editCategory(cat, 'product')" class="p-2 text-blue-600 hover:bg-white rounded-lg transition-all"><i class="fas fa-edit"></i></button>
                        <button @click="deleteCategory(cat.id, 'product')" class="p-2 text-red-600 hover:bg-white rounded-lg transition-all"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Service Categories -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                <span>Catégories Services</span>
                <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full uppercase">{{ adminStore.categories.services.length }}</span>
            </h2>
            <div class="space-y-3">
                <div v-for="cat in adminStore.categories.services" :key="cat.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors">
                    <div class="font-medium text-gray-700">{{ cat.nom }}</div>
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button @click="editCategory(cat, 'service')" class="p-2 text-blue-600 hover:bg-white rounded-lg transition-all"><i class="fas fa-edit"></i></button>
                        <button @click="deleteCategory(cat.id, 'service')" class="p-2 text-red-600 hover:bg-white rounded-lg transition-all"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../../stores/admin';

const adminStore = useAdminStore();
const newCat = ref({ nom: '', type: 'product' });

onMounted(() => {
    adminStore.fetchCategories();
});

const addCategory = async () => {
    if (!newCat.value.nom) return;
    try {
        await adminStore.createCategory(newCat.value.nom, newCat.value.type as 'product' | 'service');
        newCat.value.nom = '';
    } catch (e) {
        alert('Erreur lors de l\'ajout de la catégorie');
    }
};

const editCategory = async (cat: any, type: string) => {
    const newName = prompt('Nouveau nom pour la catégorie :', cat.nom);
    if (newName && newName !== cat.nom) {
        try {
            await adminStore.updateCategory(cat.id, newName, type as 'product' | 'service');
        } catch (e) {
            alert('Erreur lors de la modification');
        }
    }
};

const deleteCategory = async (id: string, type: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
        try {
            await adminStore.deleteCategory(id, type as 'product' | 'service');
        } catch (e) {
            alert('Erreur lors de la suppression');
        }
    }
};
</script>
