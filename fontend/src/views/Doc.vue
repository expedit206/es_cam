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
                        <RouterLink to="/publier"
                            class="bg-white text-[var(--espace-vert)] px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-100 transition-all shadow-md flex items-center justify-center gap-2">
                            <i class="fas fa-plus-circle"></i>
                            <span>Commencer à vendre</span>
                        </RouterLink>
                        <RouterLink to="/explorer"
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

        <section class="py-10 bg-white">
            <div class="container mx-auto px-4">
                <div class="flex items-end justify-between mb-8">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Parcourir par catégorie</h2>
                        <div class="h-1 w-12 bg-[var(--espace-or)] mt-1"></div>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <RouterLink v-for="cat in categories" :key="cat.id" :to="`/categorie/${cat.slug}`"
                        class="group bg-gray-50 rounded-xl p-4 text-center hover:bg-white hover:shadow-md border border-transparent hover:border-emerald-100 transition-all">
                        <div
                            class="w-12 h-12 mx-auto mb-3 rounded-full bg-white group-hover:bg-[var(--espace-vert)] transition-colors flex items-center justify-center shadow-sm">
                            <i :class="cat.icon" class="text-gray-600 group-hover:text-white text-lg"></i>
                        </div>
                        <div class="font-semibold text-sm text-gray-800">{{ cat.name }}</div>
                        <div class="text-[10px] uppercase tracking-wider text-gray-400 mt-1">{{ cat.count }} annonces
                        </div>
                    </RouterLink>
                </div>
            </div>
        </section>

        <section class="py-10 bg-gray-50">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Annonces récentes</h2>
                    <RouterLink to="/explorer" class="text-sm font-bold text-[var(--espace-vert)] hover:underline">
                        Tout voir <i class="fas fa-chevron-right ml-1 text-xs"></i>
                    </RouterLink>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    <div v-for="i in 10" :key="i"
                        class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">

                        <div class="relative aspect-square bg-gray-200 overflow-hidden">
                            <div
                                class="absolute top-2 left-2 bg-[var(--espace-vert)] text-white text-[10px] px-2 py-0.5 rounded font-bold z-10">
                                Neuf
                            </div>
                            <button
                                class="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
                                <i class="far fa-heart"></i>
                            </button>
                            <div
                                class="w-full h-full group-hover:scale-105 transition-transform duration-500 bg-gray-300">
                            </div>
                        </div>

                        <div class="p-3">
                            <div class="text-[var(--espace-vert)] font-bold text-base mb-1">
                                25 000 <span class="text-xs">FCFA</span>
                            </div>
                            <h3 class="text-sm font-medium text-gray-800 truncate mb-2">
                                iPhone 12 Pro Max - État propre
                            </h3>

                            <div class="flex items-center text-[10px] text-gray-400 mb-3">
                                <i class="fas fa-map-marker-alt mr-1"></i>
                                <span>Douala, Akwa</span>
                            </div>

                            <button
                                class="w-full border border-[var(--espace-vert)] text-[var(--espace-vert)] hover:bg-[var(--espace-vert)] hover:text-white py-2 rounded-lg text-xs font-bold transition-colors">
                                Contacter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-12 bg-white border-y border-gray-100">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="flex items-center gap-4">
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-emerald-100 text-[var(--espace-vert)] rounded-full flex items-center justify-center font-bold">
                            1</div>
                        <div>
                            <h4 class="font-bold text-gray-900">Publiez</h4>
                            <p class="text-sm text-gray-500">Ajoutez vos photos et prix en 30s.</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-emerald-100 text-[var(--espace-vert)] rounded-full flex items-center justify-center font-bold">
                            2</div>
                        <div>
                            <h4 class="font-bold text-gray-900">Discutez</h4>
                            <p class="text-sm text-gray-500">Échangez via le chat sécurisé.</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="flex-shrink-0 w-12 h-12 bg-emerald-100 text-[var(--espace-vert)] rounded-full flex items-center justify-center font-bold">
                            3</div>
                        <div>
                            <h4 class="font-bold text-gray-900">Vendez</h4>
                            <p class="text-sm text-gray-500">Concluez l'affaire en main propre.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <footer class="bg-gray-900 text-gray-300 py-10">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div class="col-span-2 md:col-span-1">
                        <div class="text-white text-xl font-bold mb-4">EspaceCameroun</div>
                        <p class="text-xs leading-relaxed">La marketplace locale pour acheter et vendre en toute
                            confiance au Cameroun.</p>
                    </div>
                    <div>
                        <h5 class="text-white font-bold text-sm mb-4">Liens utiles</h5>
                        <ul class="text-xs space-y-2">
                            <li><a href="#" class="hover:text-[var(--espace-or)]">Aide & Contact</a></li>
                            <li><a href="#" class="hover:text-[var(--espace-or)]">Règles de sécurité</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="text-white font-bold text-sm mb-4">Légal</h5>
                        <ul class="text-xs space-y-2">
                            <li><a href="#" class="hover:text-[var(--espace-or)]">CGU / CGV</a></li>
                            <li><a href="#" class="hover:text-[var(--espace-or)]">Confidentialité</a></li>
                        </ul>
                    </div>
                    <div>
                        <RouterLink to="/publier"
                            class="bg-[var(--espace-or)] text-black px-4 py-2 rounded font-bold text-xs inline-block">
                            Publier une annonce
                        </RouterLink>
                    </div>
                </div>
                <div class="border-t border-gray-800 pt-6 text-center text-[10px] uppercase tracking-widest">
                    &copy; 2026 EspaceCameroun. Fait au 🇨🇲
                </div>
            </div>
        </footer>

    </div>
</template>

<script setup lang="ts">
import SeoHead from '../components/SeoHead.vue';
import StructuredData from '../components/StructuredData.vue';
import { ref } from 'vue';
import { useI18n } from '../components/useI18n';
const { t } = useI18n();

const isMobileMenuOpen = ref(false);

// Données
const categories = ref([
    { id: 1, name: 'Téléphones', slug: 'telephones', icon: 'fas fa-mobile-alt', count: '1.2k' },
    { id: 2, name: 'Mode', slug: 'mode', icon: 'fas fa-tshirt', count: '2.4k' },
    { id: 3, name: 'Électronique', slug: 'electronique', icon: 'fas fa-laptop', count: '850' },
  
    { id: 6, name: 'Services', slug: 'services', icon: 'fas fa-tools', count: '680' },
]);

const sellers = ref([
    { id: 1, name: 'Marie Fashion', location: 'Douala', rating: '4.9', description: 'Spécialiste en mode africaine et vêtements traditionnels.' },
    { id: 2, name: 'Tech Store', location: 'Yaoundé', rating: '4.8', description: 'Électronique et accessoires high-tech à prix compétitifs.' },
    { id: 3, name: 'Artisanat Direct', location: 'Bafoussam', rating: '5.0', description: 'Artisanat local et produits faits main authentiques.' },
    { id: 4, name: 'Auto Express', location: 'Douala', rating: '4.7', description: 'Pièces automobiles et accessoires de qualité.' },
]);

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

/* Line clamp pour les descriptions */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Améliorations pour mobile */
@media (max-width: 640px) {
    .text-6xl {
        font-size: 2.5rem;
    }

    .text-5xl {
        font-size: 2rem;
    }

    .text-4xl {
        font-size: 1.75rem;
    }
}

/* Smooth scrolling */
html {
    scroll-behavior: smooth;
}

/* Amélioration des ombres portées */
.shadow-xl {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.hover\:shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Animations pour le bouton flottant */
@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
    }
}

.fixed {
    animation: pulse 2s infinite;
}
</style>