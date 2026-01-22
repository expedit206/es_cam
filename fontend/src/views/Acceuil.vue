<template>
    <SeoHead v-bind="seoMeta" />
    <StructuredData :type="(structuredData.type as any)" :data="structuredData.data" />

    <div class="bg-gray-50 min-h-screen pb-20 lg:pb-0">

        <!-- HEADER / HERO -->
        <header class="relative bg-gradient-to-br from-[var(--espace-vert)] to-emerald-900 text-white overflow-hidden rounded-b-[2.5rem] shadow-xl">
            <!-- Decorative Background -->
            <div class="absolute inset-0 z-0">
                <div class="absolute -top-24 -right-24 w-80 h-80 bg-[var(--espace-or)] rounded-full blur-[100px] opacity-20 animate-pulse-slow"></div>
                <div class="absolute top-1/2 -left-24 w-60 h-60 bg-emerald-400 rounded-full blur-[80px] opacity-10"></div>
            </div>

            <div class="container mx-auto px-4 pt-5 pb-8 lg:pt-10 lg:pb-12 relative z-10">
                <div class="max-w-4xl mx-auto text-center">
                    
                    <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-white/20 mb-6 shadow-sm ring-1 ring-white/10 animate-fade-in-down">
                        <span class="relative flex h-2 w-2">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--espace-or)] opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--espace-or)]"></span>
                        </span>
                        <span class="tracking-wide">1ère Marketplace locale au Cameroun 🇨🇲</span>
                    </div>

                    <h1 class="text-xl sm:text-xl lg:text-4xl font-black tracking-tight leading-tight mb-2 drop-shadow-sm animate-fade-in-up">
                        Vendez et Achetez <br class="hidden " />
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--espace-or)] to-yellow-200">
                            en toute simplicité
                        </span>
                    </h1>

                    <p class="text-xs sm:text-sm lg:text-md text-emerald-50 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-fade-in-up delay-100">
                        La plateforme de référence pour faire de bonnes affaires près de chez vous.
                        Publiez gratuitement et discutez en direct.
                    </p>

                    <div class="flex flex-col sm:flex-row gap-2 justify-center  mx-auto animate-fade-in-up delay-200">
                        <RouterLink to="/gallery"
                            class="group relative bg-[var(--espace-or)] text-emerald-900 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 flex items-center justify-center gap-2">
                            <i class="fas fa-plus-circle text-xl"></i>
                            <span>qu'avez vous a vendre ?</span>
                        </RouterLink>
                        <RouterLink to="/market-place"
                            class="group bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                             <i class="fas fa-search group-hover:scale-110 transition-transform"></i>
                            <span>trouvez le produit idéal</span>
                        </RouterLink>
                    </div>

                    <!-- Trust Stats -->
                    <div class="mt-4 grid grid-cols-3 gap-4  pt-2 animate-fade-in-up delay-300">
                        <div>
                            <div class="font-bold text-sm sm:text-lg text-[var(--espace-or)]">0 FCFA</div>
                            <div class="text-xs sm:text-sm text-emerald-200">Frais d'annonce</div>
                        </div>
                        <div>
                            <div class="font-bold text-sm sm:text-lg text-[var(--espace-or)]">100%</div>
                            <div class="text-xs sm:text-sm text-emerald-200">Local</div>
                        </div>
                        <div>
                            <div class="font-bold text-sm sm:text-lg text-[var(--espace-or)]">24/7</div>
                            <div class="text-xs sm:text-sm text-emerald-200">Disponible</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- CATEGORIES -->
        <section class="py-1 pt-8  lg:py-8 -mt-4 relative z-20">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <i class="fas fa-layer-group text-[var(--espace-vert)]"></i>
                        Parcourir par catégorie
                    </h2>
                    <RouterLink to="/categories" class="text-sm font-bold text-[var(--espace-vert)] hover:text-emerald-700 transition-colors flex items-center gap-1">
                        Tout voir <i class="fas fa-arrow-right text-xs"></i>
                    </RouterLink>
                </div>

                <!-- Skeleton -->
                <div v-if="isLoading" class="flex gap-4 overflow-hidden pb-2">
                     <div v-for="i in 6" :key="i" class="min-w-[5rem] h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>

                <!-- List -->
                <div v-else class="flex overflow-x-auto gap-4 pb-6 hide-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
                    <RouterLink v-for="cat in featuredCategories" :key="cat.id" :to="`/market-place?category=${cat.id}`"
                        class="snap-start flex flex-col items-center gap-2 min-w-[5.5rem] group cursor-pointer">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-[var(--espace-vert)] group-hover:shadow-md transition-all duration-300 group-active:scale-95">
                            <i :class="cat.icon || 'fas fa-tag'" class="text-2xl text-gray-400 group-hover:text-[var(--espace-vert)] group-hover:scale-110 transition-all duration-300"></i>
                        </div>
                        <span class="text-xs font-semibold text-gray-600 group-hover:text-[var(--espace-vert)] text-center line-clamp-1 w-full transition-colors">
                            {{ (cat as any).nom || (cat as any).name }}
                        </span>
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- RECENT PRODUCTS -->
        <section class="py-3 bg-white border-t border-gray-100">
            <div class="container mx-auto px-4">
                <div class="flex items-end justify-between mb-6">
                    <div>
                        <h2 class="text-xl sm:text-lg font-bold text-gray-900">Nouveautés</h2>
                        <p class="text-sm text-gray-500 mt-1">Dénichez les pépites fraîchement publiées</p>
                    </div>
                </div>

                <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-6">
                    <div v-for="i in 5" :key="i" class="bg-gray-100 rounded-xl aspect-[4/5] animate-pulse"></div>
                </div>

                <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-6">
                     <MesProductCard v-for="product in recentProducts" :key="product.id" :produit="product" :view-mode="'grid'" class="h-full" @click="viewProduct(product)" />
                </div>
                
                <div v-if="!isLoading && recentProducts.length === 0" class="text-center py-12 text-gray-500 bg-gray-50 rounded-xl mt-4 border border-dashed border-gray-200">
                    <div class="text-4xl mb-3">📭</div>
                    <p>Aucun produit pour le moment.</p>
                    <RouterLink to="/gallery" class="text-[var(--espace-vert)] font-bold hover:underline mt-2 inline-block">Soyez le premier à publier !</RouterLink>
                </div>

                <div class="mt-4 md:mt-6 text-center">
                    <RouterLink to="/market-place" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95">
                        <span>Voir tout les produits</span>
                        <i class="fas fa-arrow-right text-xs"></i>
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- CTA BANNER -->
        <section class="md:py-10 py-3  container mx-auto px-4">
            <div class="relative  rounded-3xl overflow-hidden p-6 sm:p-12 shadow-2xl bg-gray-200" >
                 <div class="absolute top-0 right-0 w-64 h-64 bg-[var(--espace-vert)] rounded-full opacity-30 -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                 
                 <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left ">
                     <div class="max-w-xl">
                         <span class="inline-block px-3 py-1 rounded bg-white/10 text-xs font-bold mb-4 backdrop-blur-sm border border-white/5 ">ASTUCE VENDEUR</span>
                         <h3 class="text-xs sm:text-xl font-bold  mb-3">Donnez une seconde vie à vos objets</h3>
                         <p class=" text-[var(--espace-vert)] text-xs">Transformez ce que vous n'utilisez plus en cash. C'est gratuit, rapide et local.</p>
                     </div>
                     <RouterLink to="/gallery" class="flex-shrink-0 bg-[var(--espace-or)] text-gray-900 px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-gray-100 transition-all shadow-lg active:scale-95 text-md">
                         <i class="fas fa-camera text-md"></i>
                         <span>Publier une annonce</span>
                     </RouterLink>
                 </div>
            </div>
        </section>

        <!-- BLOG / NEWS -->
        <section class="py-3 md:py-6 pb-3 bg-gray-50">
             <div class="container mx-auto px-4">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-sm sm:text-xl font-bold text-gray-900">Actualités & Conseils</h2>
                     <RouterLink to="/blog" class="text-xs font-bold text-[var(--espace-vert)] hover:underline">
                        Tout lire <i class="fas fa-chevron-right ml-1 text-xs"></i>
                    </RouterLink>
                </div>

                <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 gap-3">
                     <div v-for="i in 3" :key="i" class="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>

                <div v-else-if="latestPosts.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <article v-for="post in latestPosts" :key="post.id" class="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full border border-gray-100">
                        <RouterLink :to="`/blog/${post.slug}`" class="relative overflow-hidden h-40 bg-gray-100 cursor-pointer">
                            <img v-if="post.image" :src="post.image" :alt="post.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ">
                            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                                <i class="fas fa-newspaper text-xl"></i>
                            </div>
                            <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <span class="absolute bottom-3 left-3 text-white text-xs font-semibold px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg border border-white/20">
                                {{ new Date(post.published_at).toLocaleDateString('fr-FR') }}
                            </span>
                        </RouterLink>
                        <div class="px-2 py-2 flex flex-col flex-1">
                            <h3 class="font-bold text-gray-900 text-xs mb-1 line-clamp-2 group-hover:text-[var(--espace-vert)] transition-colors">
                                <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
                            </h3>
                            <p class="text-xs text-gray-500 line-clamp-3 mb-1 flex-1 leading-relaxed">{{ post.excerpt || 'Découvrez cet article intéressant sur notre blog...' }}</p>
                            <RouterLink :to="`/blog/${post.slug}`" class="text-[var(--espace-vert)] font-bold text-xs hover:underline mt-auto  flex items-center justify-between gap-3">
                                Lire la suite <i class="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                            </RouterLink>
                        </div>
                    </article>
                </div>
                 <div v-else class="text-center py-8 text-gray-500">
                    Bientôt disponible.
                </div>
             </div>
        </section>

        <!-- FOOTER -->
        <footer class="bg-gray-900 text-gray-300 py-12 lg:pb-8 border-t border-gray-800">
             <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                    <div class="col-span-1 md:col-span-1">
                        <div class="text-white text-xl font-bold mb-4 flex items-center gap-2">
                             <img src="/src/assets/images/logo/logo_blanc.png" class="h-8 w-auto" alt="EspaceCameroun">
                        </div>
                        <p class="text-sm leading-relaxed opacity-70">
                            La première marketplace faite par et pour les Camerounais. Achetez, vendez, et connectez-vous localement.
                        </p>
                    </div>
                    <div>
                         <h5 class="text-white font-bold text-sm mb-4 uppercase tracking-wider">Navigation</h5>
                        <ul class="text-sm space-y-3">
                            <li><RouterLink to="/market-place" class="hover:text-[var(--espace-or)] transition-colors">Explorer</RouterLink></li>
                            <li><RouterLink to="/categories" class="hover:text-[var(--espace-or)] transition-colors">Catégories</RouterLink></li>
                             <li><RouterLink to="/gallery" class="hover:text-[var(--espace-or)] transition-colors">Vendre</RouterLink></li>
                        </ul>
                    </div>
                     <div>
                        <h5 class="text-white font-bold text-sm mb-4 uppercase tracking-wider">Support</h5>
                        <ul class="text-sm space-y-3">
                            <li><RouterLink to="/aide" class="hover:text-[var(--espace-or)] transition-colors">Centre d'aide</RouterLink></li>
                             <li><RouterLink to="/contact" class="hover:text-[var(--espace-or)] transition-colors">Nous contacter</RouterLink></li>
                        </ul>
                    </div>
                     <div>
                        <h5 class="text-white font-bold text-sm mb-4 uppercase tracking-wider">Légal</h5>
                        <ul class="text-sm space-y-3">
                            <li><RouterLink to="/politique-utilisation" class="hover:text-[var(--espace-or)] transition-colors">Conditions d'utilisation</RouterLink></li>
                            <li><RouterLink to="/politique-confidentialite" class="hover:text-[var(--espace-or)] transition-colors">Confidentialité</RouterLink></li>
                        </ul>
                    </div>
                </div>
                 <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <p>&copy; {{ new Date().getFullYear() }} EspaceCameroun. Tous droits réservés.</p>
                     <p class="flex items-center gap-1">
                        Fait avec <i class="fas fa-heart text-red-500 animate-pulse"></i> au Cameroun 🇨🇲
                    </p>
                </div>
            </div>
        </footer>

    </div>
</template>

<script setup lang="ts">
import SeoHead from '../components/SeoHead.vue';
import StructuredData from '../components/StructuredData.vue';
import MesProductCard from '../components/mesProduits/MesProductCard.vue';
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

/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Animations */
@keyframes pulse-slow {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(1.1); }
}
.animate-pulse-slow {
    animation: pulse-slow 5s ease-in-out infinite;
}

@keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
}

@keyframes fade-in-down {
    0% { opacity: 0; transform: translateY(-20px); }
    100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down {
    animation: fade-in-down 0.8s ease-out forwards;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
</style>