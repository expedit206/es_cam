<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <!-- Header -->
    <div class="bg-white shadow-sm mb-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-900">Mes Favoris</h1>
        <p class="mt-2 text-gray-600">Retrouvez tous vos articles et services préférés</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Tabs -->
      <div class="flex space-x-1 rounded-xl bg-blue-900/5 p-1 mb-8 w-fit mx-auto sm:mx-0">
        <button
          @click="activeTab = 'products'"
          :class="[
            'w-32 rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200',
            activeTab === 'products'
              ? 'bg-white text-[var(--espace-vert)] shadow'
              : 'text-gray-600 hover:bg-white/[0.12] hover:text-[var(--espace-vert)]'
          ]"
        >
          <i class="fas fa-box mr-2"></i>Produits ({{ products.length }})
        </button>
        <button
          @click="activeTab = 'services'"
          :class="[
            'w-32 rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200',
            activeTab === 'services'
              ? 'bg-white text-[var(--espace-vert)] shadow'
              : 'text-gray-600 hover:bg-white/[0.12] hover:text-[var(--espace-vert)]'
          ]"
        >
          <i class="fas fa-tools mr-2"></i>Services ({{ services.length }})
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--espace-vert)]"></div>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Products Grid -->
        <div v-if="activeTab === 'products'" class="animate-fade-in-up">
          <div v-if="products.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div class="mb-4 text-gray-300">
              <i class="fas fa-heart-broken text-6xl"></i>
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun produit favori</h3>
            <p class="text-gray-500 mb-6">Vous n'avez pas encore ajouté de produits à vos favoris.</p>
            <router-link to="/market-place" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--espace-vert)] hover:bg-green-800 transition-colors">
              Découvrir la boutique
            </router-link>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="product in products" :key="product.id" 
                class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
                
                <!-- Badge Promo -->
                <div v-if="product.promotion_price" class="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                    PROMO
                </div>

                <!-- Delete Button -->
                <button @click.prevent="removeFavorite(product.id, 'product')" 
                    class="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm text-red-500 hover:text-red-600 transition-all transform hover:scale-110"
                    title="Retirer des favoris">
                    <i class="fas fa-heart"></i>
                </button>

                <!-- Image -->
                <router-link :to="'/produits/' + product.id" class="relative pt-[100%] overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                        :src="getImageUrl(product.photos)" 
                        :alt="product.nom"
                        class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        @error="handleImageError"
                    >
                </router-link>

                <!-- Content -->
                <div class="p-4 flex flex-col flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-xs font-medium text-[var(--espace-vert)] bg-green-50 px-2 py-1 rounded-md">
                            {{ product.category?.name || 'Divers' }}
                        </span>
                        <div class="flex items-center text-xs text-gray-500">
                           <i class="fas fa-map-marker-alt mr-1"></i> {{ product.user?.ville || 'Cameroun' }}
                        </div>
                    </div>

                    <router-link :to="'/produits/' + product.id" class="block">
                        <h3 class="text-gray-900 font-semibold text-lg mb-1 line-clamp-1 group-hover:text-[var(--espace-vert)] transition-colors">
                            {{ product.nom }}
                        </h3>
                    </router-link>

                    <p class="text-gray-500 text-sm line-clamp-2 mb-3 flex-1">{{ product.description }}</p>

                    <div class="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div class="flex flex-col">
                            <span v-if="product.promotion_price" class="text-xs text-gray-400 line-through">
                                {{ formatPrice(product.prix) }}
                            </span>
                            <span class="text-lg font-bold text-[var(--espace-vert)]">
                                {{ formatPrice(product.promotion_price || product.prix) }}
                            </span>
                        </div>
                        <router-link :to="'/produits/' + product.id" class="text-gray-400 hover:text-[var(--espace-vert)] transition-colors">
                            <i class="fas fa-eye"></i>
                        </router-link>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <!-- Services Grid -->
        <div v-if="activeTab === 'services'" class="animate-fade-in-up">
           <div v-if="services.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div class="mb-4 text-gray-300">
              <i class="fas fa-heart-broken text-6xl"></i>
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun service favori</h3>
            <p class="text-gray-500 mb-6">Vous n'avez pas encore ajouté de services à vos favoris.</p>
            <router-link to="/market-place" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--espace-vert)] hover:bg-green-800 transition-colors">
              Trouver un service
            </router-link>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="service in services" :key="service.id" 
                class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
                
                 <!-- Delete Button -->
                <button @click.prevent="removeFavorite(service.id, 'service')" 
                    class="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm text-red-500 hover:text-red-600 transition-all transform hover:scale-110"
                    title="Retirer des favoris">
                    <i class="fas fa-heart"></i>
                </button>

                 <!-- Image -->
                 <router-link :to="'/services/' + service.id" class="relative pt-[60%] overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                        :src="getImageUrl(service.images)" 
                        :alt="service.titre"
                        class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        @error="handleImageError"
                    >
                     <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <span class="text-white text-xs font-bold px-2 py-1 bg-[var(--espace-or)] rounded text-[var(--espace-vert)]">
                            {{ service.category?.name || 'Service' }}
                        </span>
                     </div>
                </router-link>

                <div class="p-4 flex flex-col flex-1">
                    <router-link :to="'/services/' + service.id" class="block">
                        <h3 class="text-gray-900 font-semibold text-lg mb-2 line-clamp-1 group-hover:text-[var(--espace-vert)] transition-colors">
                            {{ service.titre }}
                        </h3>
                    </router-link>

                    <p class="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">{{ service.description }}</p>

                    <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                <img v-if="service.user?.photo" :src="getStorageUrl(service.user.photo)" class="w-full h-full object-cover">
                                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                                    {{ service.user?.nom?.charAt(0) || 'U' }}
                                </div>
                            </div>
                            <span class="text-xs font-medium text-gray-700 truncate max-w-[100px]">{{ service.user?.nom || 'Prestataire' }}</span>
                        </div>
                         <div class="text-[var(--espace-vert)] font-bold text-sm">
                            {{ formatPrice(service.prix) }}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/index';
// @ts-ignore
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const loading = ref(true);
const activeTab = ref('products'); // 'products' or 'services'
const products = ref<any[]>([]);
const services = ref<any[]>([]);

const getStorageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const host = window.location.hostname;
    const baseUrl = (host === "localhost" || host === "127.0.0.1") 
        ? "http://localhost:8000/storage/" 
        : "https://api.espacecameroun.com/storage/";
    return baseUrl + path;
};

const getImageUrl = (images: any) => {
    if (Array.isArray(images) && images.length > 0) {
        return getStorageUrl(images[0]);
    } else if (typeof images === 'string') {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) && parsed.length > 0 ? getStorageUrl(parsed[0]) : '/placeholder.jpg';
    }
    return '/placeholder.jpg';
};

const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    if (target) target.src = "/placeholder.jpg";
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
};

const fetchFavorites = async () => {
    loading.value = true;
    try {
        const response = await apiClient.get('/favorites');
        if (response.data.success) {
            products.value = response.data.data.products;
            services.value = response.data.data.services;
            
            // Si pas de produits mais des services, changer l'onglet par défaut
            if (products.value.length === 0 && services.value.length > 0) {
                activeTab.value = 'services';
            }
        }
    } catch (error) {
        console.error('Erreur chargement favoris:', error);
        toast.error("Impossible de charger vos favoris");
    } finally {
        loading.value = false;
    }
};

const removeFavorite = async (id: number, type: 'product' | 'service') => {
    try {
        if (type === 'product') {
            await apiClient.post(`/produits/${id}/favorite`);
            products.value = products.value.filter(p => p.id !== id);
            toast.success("Produit retiré des favoris");
        } else {
            await apiClient.post(`/services/${id}/favorite`); // Assurez-vous que cette route existe pour les services
            services.value = services.value.filter(s => s.id !== id);
            toast.success("Service retiré des favoris");
        }
    } catch (error) {
        console.error('Erreur supression favori:', error);
        toast.error("Erreur lors de la mise à jour");
    }
};

onMounted(() => {
    fetchFavorites();
});
</script>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
