<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../api/index';
import Loader from '../components/Loader.vue';
import ProductCard from '../components/produits/ProductCard.vue';
import { useProductStore } from '../stores/product';
import { useAuthStore } from '../stores/Auth';
import SeoHead from '../components/SeoHead.vue';
import StructuredData from '../components/StructuredData.vue';
import { useI18n } from '../components/useI18n';
import { Product } from "../components/types/index";

const { t } = useI18n();
const ProductStore = useProductStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

// Données structurées pour le commerçant
const structuredData = computed(() => {
    if (!commerçant.value) return null;

    return {
        type: 'local_business' as const,
        data: {
            name: commerçant.value.nom,
            description: t('merchant_structured_description', { ville: commerçant.value.ville }),
            url: `${'https://espacecameroun.com'}${route.path}`,
            address: {
                "@type": "PostalAddress",
                "addressLocality": commerçant.value.ville,
                "addressCountry": "CM"
            },
            rating: {
                "@type": "AggregateRating",
                "ratingValue": averageRating.value,
                "ratingCount": voteCount.value,
                "bestRating": "5",
                "worstRating": "1"
            },
            numberOfEmployees: {
                "@type": "QuantitativeValue",
                "value": "1"
            }
        }
    };
});

// Fonction pour l'URL de base dynamique
const getBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000/storage/';
    } else {
        return 'https://api.espacecameroun.com/storage/';
    }
};

const isLoading = ref(false);
const commerçant = ref<any>(null);
const userRating = ref<number | null>(null);
const averageRating = ref<number>(0);
const voteCount = ref<number>(0);
const showModal = ref(false);
const activeTab = ref('products');
//type products


// let commerçantProduits = ref<any[]>([])

let commerçantProduits = ref<Product[]>([])
const logoUrl = computed(() => {
    if (!commerçant.value?.logo) return null;
    return `${getBaseUrl()}${commerçant.value.logo}`;
});

const fetchCommerçantDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiClient.get(`/commercant/${route.params.commercantId}`);
        console.log(response.data);
        
        commerçant.value = response.data.commercant;
        commerçantProduits.value =  commerçant.value.produits
        console.log(commerçantProduits.value)

        // const 
        averageRating.value = response.data.average_rating || 0;
        voteCount.value = response.data.vote_count || 0;
    } catch (error) {
        toast.error(t('error_loading_merchant'));
    } finally {
        isLoading.value = false;
    }
};

const submitRating = async () => {
    if (userRating.value === null || userRating.value < 1 || userRating.value > 5) {
        toast.error(t('rating_validation_error'));
        return;
    }

    try {
        const response = await apiClient.post(`/commercant/${route.params.commercantId}/rate`, {
            rating: userRating.value,
        });

        averageRating.value = response.data.average_rating || 0;
        toast.success(t('rating_thanks'));
        userRating.value = null;
        showModal.value = false;
        voteCount.value = response.data.vote_count || voteCount.value + 1;
    } catch (error: any) {
        if (error.response?.data?.message == 'Unauthenticated.') {
            router.push('login')
        }
        toast.error(error.response?.data?.message || t('rating_error'));
    }
};

const goToChat = () => {
    if (!authStore.user) {
        toast.error(t('login_to_message'))
        return
    }
    if (commerçant.value.id) {
        router.push({ name: "messages", params: { receiverId: commerçant.value.user_id } });
    }
};

const openRatingModal = () => {
    showModal.value = true;
};



const getRatingPercentage = (star: number) => {
    if (star <= Math.floor(averageRating.value)) return '100%';
    if (star === Math.ceil(averageRating.value) && averageRating.value % 1 !== 0) {
        return `${(averageRating.value % 1) * 100}%`;
    }
    return '0%';
};

const seoMeta = computed(() => {
    const commerçantName = commerçant.value?.nom || t('merchant_default_name');
    const commerçantVille = commerçant.value?.ville || t('cameroon');
    const produitCount = commerçantProduits.value.length;
    const rating = Number(averageRating.value).toFixed(1);

    return {
        title: t('merchant_seo_title', { name: commerçantName }),
        description: t('merchant_seo_description', {
            name: commerçantName,
            count: produitCount,
            ville: commerçantVille,
            rating: rating
        }),
        keywords: t('merchant_seo_keywords', { name: commerçantName, ville: commerçantVille }),
        image: logoUrl.value || `${'https://espacecameroun.com'}/images/og-image.jpg`,
        url: `${'https://espacecameroun.com'}${route.path}`,
        type: 'profile'
    };
});

onMounted(async () => {
    fetchCommerçantDetails();
});
</script>

<template>
    <SeoHead v-bind="seoMeta" />

    <!-- Structured Data -->
    <StructuredData v-if="structuredData" :type="structuredData.type" :data="structuredData.data" />
    <Loader :isLoading="isLoading" />

    <div class="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-green-50">
        <!-- Header avec bannière -->
        <div class="relative bg-white shadow-sm">
            <!-- Bannière du commerçant -->
            <div class="h-48 bg-gradient-to-r from-[var(--espace-vert)] to-green-700 relative">
                <div class="absolute inset-0 bg-black/10"></div>
            </div>

            <!-- Section profil -->
            <div class="relative -mt-20 px-4 sm:px-6 lg:px-8">
                <div class="max-w-7xl mx-auto">
                    <div class="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                            <!-- Logo du commerçant -->
                            <div class="relative -mt-24 lg:-mt-28">
                                <div class="w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-2xl shadow-lg p-2">
                                    <div
                                        class="w-full h-full bg-gradient-to-br from-[var(--espace-vert)] to-green-600 rounded-xl flex items-center justify-center overflow-hidden">
                                        <img v-if="logoUrl" :src="logoUrl" :alt="t('merchant_logo_alt')"
                                            class="w-full h-full object-cover">
                                        <img v-else-if="commerçant?.photo_url" :src="commerçant.photo_url"
                                            :alt="t('merchant_photo_alt')" class="w-full h-full object-cover">
                                        <i v-else class="fas fa-store text-4xl text-white"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations principales -->
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div class="flex-1">
                                        <h1 class="text-2xl lg:text-3xl font-bold text-[var(--espace-vert)] mb-2">
                                            {{ commerçant?.nom || t('merchant') }}
                                        </h1>
                                        <div class="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                                            <div class="flex items-center gap-1">
                                                <i class="fas fa-map-marker-alt text-[var(--espace-vert)]"></i>
                                                <span>{{ commerçant?.ville || t('city_not_specified') }}</span>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <i class="fas fa-calendar-alt text-[var(--espace-vert)]"></i>
                                                <span>{{ t('registered_since') }} {{ commerçant ? new
                                                    Date(commerçant.created_at).toLocaleDateString('fr-FR', {
                                                        month:
                                                            'long', year: 'numeric'
                                                    }) : '' }}</span>
                                            </div>
                                        </div>

                                        <!-- Note et statistiques -->
                                        <div class="flex flex-wrap items-center gap-6">
                                            <div class="flex items-center gap-3">
                                                <div class="flex items-center gap-1">
                                                    <span v-for="star in 5" :key="star"
                                                        class="relative text-yellow-400 w-5 h-5">
                                                        <i class="far fa-star absolute left-0 top-0"></i>
                                                        <i class="fas fa-star absolute left-0 top-0 overflow-hidden"
                                                            :style="{ width: getRatingPercentage(star) }"></i>
                                                    </span>
                                                </div>
                                                <div>
                                                    <span class="font-semibold text-gray-900">{{
                                                        Number(averageRating).toFixed(1) }}</span>
                                                    <span class="text-gray-500 text-sm ml-1">({{ voteCount }}
                                                        {{ t('reviews') }})</span>
                                                </div>
                                            </div>

                                            <div class="flex items-center gap-4 text-sm text-gray-600">
                                                <span class="flex items-center gap-1">
                                                    <i class="fas fa-box text-[var(--espace-vert)]"></i>
                                                    {{ commerçantProduits.length }} {{ t('products') }}
                                                </span>
                                                <span v-if="commerçant?.revenus" class="flex items-center gap-1">
                                                    <i class="fas fa-chart-line text-[var(--espace-vert)]"></i>
                                                    {{ commerçant.revenus.toLocaleString() }} FCFA
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Actions -->
                                    <div class="flex flex-col sm:flex-row lg:flex-col gap-3">
                                        <button @click="goToChat"
                                            class="flex items-center justify-center gap-2 bg-[var(--espace-vert)] text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all font-medium shadow-sm">
                                            <i class="fas fa-comment"></i>
                                            <span>{{ t('contact') }}</span>
                                        </button>
                                        <button @click="openRatingModal"
                                            class="flex items-center justify-center gap-2 border border-[var(--espace-or)] text-[var(--espace-vert)] px-6 py-3 rounded-xl hover:bg-[var(--espace-or)] hover:text-white transition-all font-medium">
                                            <i class="fas fa-star"></i>
                                            <span>{{ t('rate') }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation par onglets -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8">
                    <button @click="activeTab = 'products'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'products'
                            ? 'border-[var(--espace-vert)] text-[var(--espace-vert)]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        <i class="fas fa-box mr-2"></i>
                        {{ t('products') }} ({{ commerçantProduits.length }})
                    </button>
                    <button @click="activeTab = 'about'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'about'
                            ? 'border-[var(--espace-vert)] text-[var(--espace-vert)]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        <i class="fas fa-info-circle mr-2"></i>
                        {{ t('about') }}
                    </button>
                    <button @click="activeTab = 'reviews'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'reviews'
                            ? 'border-[var(--espace-vert)] text-[var(--espace-vert)]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    ]">
                        <i class="fas fa-star mr-2"></i>
                        {{ t('reviews') }} ({{ voteCount }})
                    </button>
                </nav>
            </div>

            <!-- Contenu des onglets -->
            <div class="py-8 mb-12">
                <!-- Onglet Produits -->
                <div v-if="activeTab === 'products'" class="space-y-6">
                    <div v-if="commerçantProduits?.length > 0">
                        <h2 class="text-2xl font-bold text-[var(--espace-vert)] mb-6">{{ t('product_catalog') }}</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <ProductCard v-for="produit in commerçantProduits" :key="produit.id" :produit="produit"
                                class="transform hover:scale-105 transition-transform duration-200" />
                        </div>
                    </div>
                    <div v-else class="text-center py-12">
                        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-box-open text-gray-400 text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('no_products_available') }}</h3>
                        <p class="text-gray-600">{{ t('no_products_message') }}</p>
                    </div>
                </div>

                <!-- Onglet À propos -->
                <div v-if="activeTab === 'about'" class="space-y-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Informations de contact -->
                        <div class="bg-white rounded-2xl shadow-sm border p-6">
                            <h3 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">{{ t('contact_info') }}
                            </h3>
                            <div class="space-y-3">
                                <div class="flex items-center gap-3 text-gray-600">
                                    <i class="fas fa-envelope text-[var(--espace-vert)] w-5"></i>
                                    <span>{{ commerçant?.email || t('not_available') }}</span>
                                </div>
                                <div v-if="commerçant?.telephone" class="flex items-center gap-3 text-gray-600">
                                    <i class="fas fa-phone text-[var(--espace-vert)] w-5"></i>
                                    <span>{{ commerçant.telephone }}</span>
                                </div>
                                <div class="flex items-center gap-3 text-gray-600">
                                    <i class="fas fa-map-marker-alt text-[var(--espace-vert)] w-5"></i>
                                    <span>{{ commerçant?.ville || t('city_not_specified') }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Statistiques -->
                        <div class="bg-white rounded-2xl shadow-sm border p-6">
                            <h3 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">{{ t('statistics') }}</h3>
                            <div class="space-y-4">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">{{ t('online_products') }}</span>
                                    <span class="font-semibold text-[var(--espace-vert)]">{{ commerçantProduits.length
                                    }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">{{ t('average_rating') }}</span>
                                    <span class="font-semibold text-[var(--espace-vert)]">{{
                                        Number(averageRating).toFixed(1) }}/5</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">{{ t('review_count') }}</span>
                                    <span class="font-semibold text-[var(--espace-vert)]">{{ voteCount }}</span>
                                </div>
                                <div v-if="commerçant?.revenus" class="flex justify-between items-center">
                                    <span class="text-gray-600">{{ t('revenue') }}</span>
                                    <span class="font-semibold text-[var(--espace-or)]">{{
                                        commerçant.revenus.toLocaleString() }} FCFA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Onglet Avis -->
                <div v-if="activeTab === 'reviews'" class="space-y-6">
                    <div class="bg-white rounded-2xl shadow-sm border p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-semibold text-[var(--espace-vert)]">{{ t('customer_reviews') }}</h3>
                            <button @click="openRatingModal"
                                class="bg-[var(--espace-vert)] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                                <i class="fas fa-star mr-2"></i>
                                {{ t('give_review') }}
                            </button>
                        </div>

                        <!-- Résumé des notes -->
                        <div class="flex items-center gap-8 mb-6">
                            <div class="text-center">
                                <div class="text-4xl font-bold text-[var(--espace-vert)] mb-1">{{
                                    Number(averageRating).toFixed(1) }}</div>
                                <div class="flex items-center justify-center gap-1 mb-1">
                                    <span v-for="star in 5" :key="star" class="relative text-yellow-400 w-4 h-4">
                                        <i class="far fa-star absolute left-0 top-0"></i>
                                        <i class="fas fa-star absolute left-0 top-0 overflow-hidden"
                                            :style="{ width: getRatingPercentage(star) }"></i>
                                    </span>
                                </div>
                                <div class="text-sm text-gray-600">{{ voteCount }} {{ t('reviews') }}</div>
                            </div>
                        </div>

                        <!-- Message si aucun avis -->
                        <div v-if="voteCount === 0" class="text-center py-8">
                            <div
                                class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-star text-gray-400"></i>
                            </div>
                            <h4 class="text-lg font-medium text-[var(--espace-vert)] mb-2">{{ t('no_reviews_yet') }}
                            </h4>
                            <p class="text-gray-600 mb-4">{{ t('be_first_to_rate') }}</p>
                            <button @click="openRatingModal"
                                class="bg-[var(--espace-vert)] text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium">
                                {{ t('give_review') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de notation -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-[var(--espace-vert)]">{{ t('rate_merchant') }}</h2>
                <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-lg"></i>
                </button>
            </div>

            <div class="space-y-4">
                <div class="text-center">
                    <div class="flex justify-center gap-1 mb-4">
                        <span v-for="star in 5" :key="star" @click="userRating = star"
                            class="cursor-pointer text-2xl transition-transform hover:scale-110"
                            :class="star <= (userRating || 0) ? 'text-yellow-400' : 'text-gray-300'">
                            <i class="fas fa-star"></i>
                        </span>
                    </div>
                    <p class="text-sm text-gray-600">{{ t('select_rating') }}</p>
                </div>

                <div class="flex gap-3 pt-4">
                    <button @click="showModal = false"
                        class="flex-1 border border-[var(--espace-or)] text-[var(--espace-vert)] py-3 rounded-xl hover:bg-[var(--espace-or)] hover:text-white transition-colors font-medium">
                        {{ t('cancel') }}
                    </button>
                    <button @click="submitRating" :disabled="!userRating"
                        class="flex-1 bg-[var(--espace-vert)] text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ t('submit') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
    --espace-blanc: #ffffff;
    --espace-gris: #6b7280;
}

/* Animations douces */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Amélioration du scroll */
.overflow-y-scroll {
    scroll-behavior: smooth;
}

/* Effets de hover subtils */
.transform {
    transition: transform 0.2s ease;
}
</style>