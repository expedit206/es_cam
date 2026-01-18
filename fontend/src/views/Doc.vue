<template>
    <SeoHead v-bind="seoMeta" />
    <StructuredData :type="structuredData.type" :data="structuredData.data" />

    <div class="bg-gray-50 min-h-screen">

        <header class="relative bg-gradient-to-r from-[var(--espace-vert)] to-emerald-800 text-white overflow-hidden">
            <div class="absolute inset-0 opacity-10 pointer-events-none">
                <div
                    class="absolute top-0 right-0 w-64 h-64 bg-[var(--espace-or)] rounded-full -translate-y-32 translate-x-32">
                </div>
                <div
                    class="absolute bottom-0 left-0 w-96 h-96 bg-[var(--espace-or)] rounded-full translate-y-48 -translate-x-48">
                </div>
            </div>

            <div class="container mx-auto px-4 py-10 lg:py-16 relative z-10">
                <div class="max-w-5xl mx-auto text-center">

                    <div class="mb-4">
                        <span
                            class="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide">
                            🇨🇲 Espace Cameroun
                        </span>
                    </div>

                    <h1 class="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                        Vendez et achetez directement
                        <span class="text-[var(--espace-or)] lg:inline-block"> entre Camerounais</span>
                    </h1>

                    <p class="text-base sm:text-lg lg:text-xl opacity-90 max-w-2xl mx-auto mb-8">
                        Publiez vos annonces en quelques secondes et discutez directement avec les acheteurs.
                    </p>

                    <div class="flex flex-col sm:row gap-3 justify-center mb-10">
                        <RouterLink to="/gallery"
                            class="bg-white text-[var(--espace-vert)] px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-100 transition-all shadow-md flex items-center justify-center gap-2">
                            <i class="fas fa-plus-circle"></i>
                            <span>Commencer à vendre</span>
                        </RouterLink>
                        <RouterLink to="/market-place"
                            class="border border-white px-6 py-3 rounded-lg font-bold text-base hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <i class="fas fa-search"></i>
                            <span>Explorer le marché</span>
                        </RouterLink>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        <div class="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div class="text-lg lg:text-xl font-bold">0 FCFA</div>
                            <div class="text-xs opacity-80">Aucun frais</div>
                        </div>
                        <div class="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div class="text-lg lg:text-xl font-bold">30s</div>
                            <div class="text-xs opacity-80">Publication</div>
                        </div>
                        <div class="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-3">
                            <i class="fas fa-comments text-lg mb-1"></i>
                            <div class="text-xs opacity-80">Chat direct</div>
                        </div>
                        <div class="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-3">
                            <i class="fas fa-shield-alt text-lg mb-1"></i>
                            <div class="text-xs opacity-80">Sécurisé</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- CATEGORIES -->
        <section class="py-10 bg-white">
            <div class="container mx-auto px-4">
                <div class="flex items-end justify-between mb-8">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Parcourir par catégorie</h2>
                        <div class="h-1 w-12 bg-[var(--espace-or)] mt-1"></div>
                    </div>
                     <RouterLink to="/categories" class="text-sm font-bold text-[var(--espace-vert)] hover:underline">
                        Tout voir <i class="fas fa-chevron-right ml-1 text-xs"></i>
                    </RouterLink>
                </div>

                <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                     <div v-for="i in 6" :key="i" class="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
                </div>

                <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <RouterLink v-for="cat in featuredCategories" :key="cat.id" :to="`/market-place?category=${cat.id}`"
                        class="group bg-gray-50 rounded-xl p-4 text-center hover:bg-white hover:shadow-md border border-transparent hover:border-emerald-100 transition-all flex flex-col items-center justify-center h-full">
                        <div
                            class="w-12 h-12 mb-3 rounded-full bg-white group-hover:bg-[var(--espace-vert)] transition-colors flex items-center justify-center shadow-sm">
                            <i :class="cat.icon || 'fas fa-tag'" class="text-gray-600 group-hover:text-white text-lg"></i>
                        </div>
                        <div class="font-semibold text-sm text-gray-800 line-clamp-1">{{ cat.nom }}</div>
                         <!-- count not always available in model yet, hidden for now -->
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- PRODUITS RECENTS -->
        <section class="py-10 bg-gray-50">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Produits récents</h2>
                    <RouterLink to="/market-place" class="text-sm font-bold text-[var(--espace-vert)] hover:underline">
                        Tout voir <i class="fas fa-chevron-right ml-1 text-xs"></i>
                    </RouterLink>
                </div>

                 <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <div v-for="i in 5" :key="i" class="bg-white rounded-xl h-64 animate-pulse"></div>
                </div>

                <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                     <MesProductCard v-for="product in recentProducts" :key="product.id" :produit="product" view-mode="grid" @click="viewProduct(product)" />
                </div>
                
                 <div v-if="!isLoading && recentProducts.length === 0" class="text-center py-8 text-gray-500">
                    Aucun produit pour le moment. Soyez le premier à publier !
                </div>
            </div>
        </section>
        
        <!-- SERVICES -->
         <section class="py-10 bg-white">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Services disponibles</h2>
                    <RouterLink to="/market-place?type=service" class="text-sm font-bold text-[var(--espace-vert)] hover:underline">
                        Explorer les services <i class="fas fa-chevron-right ml-1 text-xs"></i>
                    </RouterLink>
                </div>

                 <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div v-for="i in 4" :key="i" class="bg-gray-100 rounded-xl h-48 animate-pulse"></div>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    <ServiceCard v-for="service in recentServices" :key="service.id" :service="service" view-mode="grid" @click="viewService(service)" />
                </div>

                <div v-if="!isLoading && recentServices.length === 0" class="text-center py-8 text-gray-500">
                    Aucun service disponible.
                </div>
            </div>
        </section>

        <!-- BLOG -->
        <section class="py-10 bg-gray-50 border-t border-gray-100">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Actualités & Conseils</h2>
                    <RouterLink to="/blog" class="text-sm font-bold text-[var(--espace-vert)] hover:underline">
                        Visiter le blog <i class="fas fa-chevron-right ml-1 text-xs"></i>
                    </RouterLink>
                </div>

                <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div v-for="i in 3" :key="i" class="bg-white rounded-lg h-64 animate-pulse"></div>
                </div>

                <div v-else-if="latestPosts.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <article v-for="post in latestPosts" :key="post.id" class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 flex flex-col h-full group">
                        <RouterLink :to="`/blog/${post.slug}`" class="relative overflow-hidden h-40 bg-gray-200 block">
                            <img v-if="post.image" :src="post.image" :alt="post.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                                <i class="fas fa-newspaper text-3xl"></i>
                            </div>
                        </RouterLink>
                        <div class="p-4 flex flex-col flex-1">
                            <div class="text-xs text-gray-500 mb-2">{{ new Date(post.published_at).toLocaleDateString('fr-FR') }}</div>
                            <h3 class="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[var(--espace-vert)] transition-colors">
                                <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
                            </h3>
                            <p class="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">{{ post.excerpt || 'Lire la suite...' }}</p>
                            <RouterLink :to="`/blog/${post.slug}`" class="text-[var(--espace-vert)] font-semibold text-sm hover:underline mt-auto">
                                Lire l'article
                            </RouterLink>
                        </div>
                    </article>
                </div>

                <div v-else class="text-center py-8 text-gray-500">
                    Bientôt disponible.
                </div>
            </div>
        </section>

        <section class="py-12 bg-gray-50 border-t border-gray-100">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div class="flex flex-col md:flex-row items-center gap-4 p-6 bg-white rounded-2xl shadow-sm">
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-emerald-100 text-[var(--espace-vert)] rounded-full flex items-center justify-center font-bold text-xl">
                            1</div>
                        <div>
                            <h4 class="font-bold text-gray-900 text-lg">Publiez</h4>
                            <p class="text-sm text-gray-500 mt-1">Ajoutez vos photos et prix en 30s.</p>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row items-center gap-4 p-6 bg-white rounded-2xl shadow-sm">
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-emerald-100 text-[var(--espace-vert)] rounded-full flex items-center justify-center font-bold text-xl">
                            2</div>
                        <div>
                            <h4 class="font-bold text-gray-900 text-lg">Discutez</h4>
                            <p class="text-sm text-gray-500 mt-1">Échangez via le chat sécurisé.</p>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row items-center gap-4 p-6 bg-white rounded-2xl shadow-sm">
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-emerald-100 text-[var(--espace-vert)] rounded-full flex items-center justify-center font-bold text-xl">
                            3</div>
                        <div>
                            <h4 class="font-bold text-gray-900 text-lg">Vendez</h4>
                            <p class="text-sm text-gray-500 mt-1">Concluez l'affaire en main propre.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

       <!-- Footer déjà propre, on le garde tel quel ou on l'améliore un peu -->
        <footer class="bg-gray-900 text-gray-300 py-10 mt-auto">
             <div class="container mx-auto px-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div class="col-span-2 md:col-span-1">
                        <div class="text-white text-xl font-bold mb-4 flex items-center gap-2">
                             <img src="/src/assets/images/logo/logo_blanc.png" class="h-8" alt="Logo">
                             <span>EspaceCameroun</span>
                        </div>
                        <p class="text-sm leading-relaxed opacity-80">La marketplace locale pour acheter et vendre en toute
                            confiance au Cameroun.</p>
                    </div>
                    <div>
                        <h5 class="text-white font-bold text-sm mb-4 uppercase tracking-wider">Liens utiles</h5>
                        <ul class="text-sm space-y-2">
                            <li><RouterLink to="/aide" class="hover:text-[var(--espace-or)] transition-colors">Aide & Contact</RouterLink></li>
                            <li><RouterLink to="/doc" class="hover:text-[var(--espace-or)] transition-colors">À propos</RouterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="text-white font-bold text-sm mb-4 uppercase tracking-wider">Légal</h5>
                        <ul class="text-sm space-y-2">
                            <li><RouterLink to="/politique-utilisation" class="hover:text-[var(--espace-or)] transition-colors">CGU / CGV</RouterLink></li>
                            <li><RouterLink to="/politique-confidentialite" class="hover:text-[var(--espace-or)] transition-colors">Confidentialité</RouterLink></li>
                        </ul>
                    </div>
                    <div>
                        <RouterLink to="/gallery"
                            class="bg-[var(--espace-or)] text-black px-6 py-3 rounded-lg font-bold text-sm inline-block hover:brightness-110 transition-all shadow-lg shadow-yellow-500/20">
                            Publier une annonce
                        </RouterLink>
                    </div>
                </div>
                <div class="border-t border-gray-800 pt-6 text-center text-xs text-gray-500 uppercase tracking-widest">
                    &copy; {{ new Date().getFullYear() }} EspaceCameroun. Fait avec ❤️ au 🇨🇲
                </div>
            </div>
        </footer>

    </div>
</template>

<script setup lang="ts">
import SeoHead from '../components/SeoHead.vue';
import StructuredData from '../components/StructuredData.vue';
import MesProductCard from '../components/mesProduits/MesProductCard.vue';
import ServiceCard from '../components/mesServices/MesServiceCard.vue';
import { ref, onMounted, computed } from 'vue';
import { useMarketplaceStore } from '../stores/marketplace';
import { useBlogStore } from '../stores/blog';
import { useRouter } from 'vue-router';
import { useI18n } from '../components/useI18n';

const { t } = useI18n();
const marketplaceStore = useMarketplaceStore();
const blogStore = useBlogStore();
const router = useRouter();

const isLoading = ref(true);

const recentProducts = computed(() => marketplaceStore.products.slice(0, 10)); // Take 10 most recent
const recentServices = computed(() => marketplaceStore.services.slice(0, 4));
const featuredCategories = computed(() => marketplaceStore.categories.slice(0, 12)); // Take first 12
const latestPosts = computed(() => blogStore.posts.slice(0, 3));

onMounted(async () => {
    isLoading.value = true;
    try {
        await Promise.all([
            marketplaceStore.fetchMarketplaceData(),
            blogStore.fetchPosts()
        ]);
    } catch (e) {
        console.error("Error loading home data", e);
    } finally {
        isLoading.value = false;
    }
});

const viewProduct = (product: any) => {
    router.push(`/produits/${product.id}`);
};

const viewService = (service: any) => {
    router.push(`/services/${service.id}`);
};

// SEO
const seoMeta = ref({
    title: 'EspaceCameroun - Marketplace locale au Cameroun',
    description: 'Vendez et achetez directement entre Camerounais. Publiez gratuitement vos annonces et discutez via notre chat intégré.',
    keywords: 'marketplace cameroun, vendre cameroun, acheter cameroun, petites annonces',
});

const structuredData = ref({
    type: 'website',
    data: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "EspaceCameroun",
        "description": "Marketplace locale au Cameroun",
        "url": "https://espacecameroun.com"
    }
});
</script>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
}

/* Animations améliorées */
.hover\:scale-105 {
    transition: transform 0.3s ease;
}

.hover\:-translate-y-2 {
    transition: transform 0.3s ease;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>