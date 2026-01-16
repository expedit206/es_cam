<!-- HomePage.vue -->
<template>
    <SeoHead 
        title="Espace Cameroun - Marketplace Collaborative"
        description="Découvrez notre plateforme collaborative de produits et services au Cameroun. Échangez, vendez, achetez dans un espace dédié à la communauté."
        keywords="marketplace cameroun, produits cameroun, services cameroun, plateforme collaborative, communauté"
    />
    
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <!-- Hero Section -->
        <section class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    Bienvenue sur 
                    <span class="text-[var(--espace-vert)]">Espace Cameroun</span>
                </h1>
                
                <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                    La première plateforme collaborative dédiée à la mise en relation des 
                    <span class="font-semibold text-[var(--espace-vert)]">produits</span> et 
                    <span class="font-semibold text-[var(--espace-vert)]">services</span> 
                    au Cameroun.
                </p>
                
                <!-- Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <div class="bg-white p-6 rounded-xl shadow-sm">
                        <div class="text-3xl font-bold text-[var(--espace-vert)]">500+</div>
                        <div class="text-gray-600">Produits</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm">
                        <div class="text-3xl font-bold text-[var(--espace-vert)]">200+</div>
                        <div class="text-gray-600">Services</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm">
                        <div class="text-3xl font-bold text-[var(--espace-vert)]">50+</div>
                        <div class="text-gray-600">Catégories</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm">
                        <div class="text-3xl font-bold text-[var(--espace-vert)]">1000+</div>
                        <div class="text-gray-600">Membres</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Description du projet -->
        <section class="bg-white py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900 mb-6">
                            Notre Vision
                        </h2>
                        <p class="text-gray-600 mb-4">
                            Espace Cameroun est né d'une vision simple : créer un écosystème numérique 
                            où chaque camerounais peut découvrir, partager et échanger des produits 
                            et services de qualité.
                        </p>
                        <ul class="space-y-3">
                            <li class="flex items-start">
                                <i class="fas fa-check text-[var(--espace-vert)] mt-1 mr-3"></i>
                                <span>Plateforme 100% camerounaise</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-[var(--espace-vert)] mt-1 mr-3"></i>
                                <span>Focalisée sur l'économie locale</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-[var(--espace-vert)] mt-1 mr-3"></i>
                                <span>Interface intuitive et sécurisée</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="bg-gray-100 rounded-2xl p-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">
                            Comment ça marche ?
                        </h3>
                        <div class="space-y-6">
                            <div class="flex items-start">
                                <div class="bg-[var(--espace-vert)] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                                    1
                                </div>
                                <div>
                                    <h4 class="font-semibold">Parcourez</h4>
                                    <p class="text-gray-600 text-sm">Découvrez des produits et services par catégorie</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-[var(--espace-vert)] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                                    2
                                </div>
                                <div>
                                    <h4 class="font-semibold">Recherchez</h4>
                                    <p class="text-gray-600 text-sm">Utilisez nos filtres avancés pour trouver exactement ce que vous cherchez</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="bg-[var(--espace-vert)] text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                                    3
                                </div>
                                <div>
                                    <h4 class="font-semibold">Interagissez</h4>
                                    <p class="text-gray-600 text-sm">Contactez les vendeurs et service providers directement</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Call to Action -->
        <section class="py-16">
            <div class="max-w-4xl mx-auto px-4 text-center">
                <h2 class="text-3xl font-bold text-gray-900 mb-6">
                    Prêt à explorer notre marketplace ?
                </h2>
                <p class="text-gray-600 mb-8">
                    Découvrez dès maintenant notre vaste sélection de produits et services 
                    triés sur le volet pour vous.
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        @click="goToMarketplace('product')"
                        class="bg-[var(--espace-vert)] text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-3"
                    >
                        <i class="fas fa-box"></i>
                        Explorer les produits
                    </button>
                    
                    <button 
                        @click="goToMarketplace('service')"
                        class="bg-white text-[var(--espace-vert)] border border-[var(--espace-vert)] px-8 py-3 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-3"
                    >
                        <i class="fas fa-concierge-bell"></i>
                        Découvrir les services
                    </button>
                </div>
                
                <p class="text-gray-500 text-sm mt-6">
                    Vous pouvez aussi 
                    <a href="#" class="text-[var(--espace-vert)] hover:underline">vous inscrire</a> 
                    pour ajouter vos propres offres
                </p>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import SeoHead from '../components/SeoHead.vue';

const router = useRouter();

const goToMarketplace = (type: 'product' | 'service') => {
    // Stocker le type dans localStorage pour préférence utilisateur
    localStorage.setItem('preferredContentType', type);
    
    // Rediriger vers la marketplace avec le type présélectionné
    router.push('/marketplace');
};
</script>   