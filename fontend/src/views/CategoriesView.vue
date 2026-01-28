<template>
  <div class="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 md:mb-12 animate-fade-in">
        <h1 class="text-2xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">
          Explorez nos <span class="text-[var(--espace-vert)]">Catégories</span>
        </h1>
        <p class="text-sm text-gray-600 max-w-2xl mx-auto">
          Trouvez exactement ce que vous cherchez en parcourant nos sélections de produits locaux soigneusement classés.
        </p>
      </div>

  

      <!-- Categories Grid -->
      <div v-if="marketplaceStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="i in 8" :key="i" class="h-64 bg-white rounded-3xl animate-pulse shadow-sm border border-gray-100"></div>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div 
          v-for="category in marketplaceStore.categories" 
          :key="category.id"
          @click="selectCategory(category.id)"
          class="group relative h-40 md:h-72 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
        >
          <!-- Category Image -->
          <div class="absolute inset-0 bg-gray-200">
            <img 
              v-if="category.image" 
              :src="category.image" 
              :alt="category.name"
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
              <i :class="[category.icon, 'text-6xl text-[var(--espace-vert)] opacity-20']"></i>
            </div>
          </div>

          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <!-- Content -->
          <div class="absolute bottom-0 left-0 right-0 px-6 py-2 text-white text-center">
            <div class="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
               <span class="inline-block p-2 rounded-full backdrop-blur-md mb-0">
                 <i :class="[category.icon, 'text-xl']"></i>
               </span>
            </div>
            <h3 class="text-md px-1 md:text-2xl font-bold mb-1 font-heading bg-white/40 w-full rounded-full ">{{ category.name }}</h3>
            <p class="text-xs md:text-xl text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-500">
              Voir tout dans cette catégorie
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!marketplaceStore.isLoading && marketplaceStore.categories.length === 0" class="text-center py-20">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-tags text-gray-400 text-3xl"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Aucune catégorie trouvée</h3>
        <p class="text-gray-500">Nous n'avons pas encore de catégories dans cette section.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMarketplaceStore } from '../stores/marketplace';

const router = useRouter();
const marketplaceStore = useMarketplaceStore();

onMounted(async () => {
  await marketplaceStore.fetchCategories();
});

const setContentType = async (type: 'product' | 'service') => {
  await marketplaceStore.setContentType(type);
};

const selectCategory = async (categoryId: string) => {
  await marketplaceStore.setActiveCategory(categoryId);
  router.push('/market-place');
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
