<!-- components/produits/ReviewsProduct.vue -->
<template>
    <div class="bg-slate-100 overflow-y-auto h-[15rem] rounded-xl shadow-sm border border-gray-200 p-3 py-1 ">

        <!-- Résumé des notes -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <!-- Note moyenne -->
            <div class="text-center">
                <div class="text-md text-sm sm:text-lg font-bold text-gray-900">{{ reviewsStats.average }} ({{
                    reviewsStats.total }})</div>
                <div class="flex items-center justify-center space-x-1 ">
                    <i v-for="star in 5" :key="star" :class="[
                        'fas fa-star text-[8px]',
                        star <= Math.round(reviewsStats.average) ? 'text-yellow-400' : 'text-gray-300'
                    ]"></i>
                </div>
            </div>
        </div>

        <!-- Formulaire d'avis (si connecté et n'a pas encore donné d'avis) -->
        <div v-if="userStore.user?.id && !userHasReviewed" class="mb-2  px-4 rounded-lg">
            <FormReview :product-id="productId" @review-submitted="handleReviewSubmitted" />
        </div>

        <!-- Liste des avis -->
        <div v-if="reviews.length > 0" class="space-y-2">
            <div v-for="review in reviews" :key="review.id" class="border-b border-gray-100 pb-2 last:border-0">
                <div class="flex items-start space-x-3">
                    <img :src="review.user?.photo || '/default-avatar.png'" :alt="review.user?.nom"
                        class="w-10 h-10 rounded-full object-cover">
                    <div class="flex-1">
                        <div class="flex flex-col  justify-center mb-0 text-sm">
                            <h4 class="font-semibold text-gray-900 text-xs">{{ review.user?.nom }}</h4>
                            <div class="flex items-center space-x-1">
                                <i v-for="star in 5" :key="star" :class="[
                                    'fas fa-star text-[7px]',
                                    star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                ]"></i>
                            </div>
                        </div>
                        <p class="text-gray-700  mb-1 text-xs">{{ review.comment }}</p>
                        <span class="text-xs text-gray-500">{{ formatDate(review.created_at) }}</span>

                        <!-- Réponse du vendeur -->
                        <div v-if="review.provider_response"
                            class="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-reply text-green-500 mt-1"></i>
                                <div>
                                    <h5 class="font-semibold text-green-800 mb-1">Réponse du vendeur</h5>
                                    <p class="text-green-700 leading-relaxed">{{ review.provider_response }}</p>
                                    <span class="text-xs text-green-600 mt-1 block">
                                        {{ formatDate(review.responded_at) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- État vide -->
        <div v-else class="text-center py-8">
            <i class="fas fa-comment text-gray-300 text-4xl mb-3"></i>
            <p class="text-gray-600">Aucun avis pour le moment</p>
            <p class="text-gray-500 text-sm mt-1">Soyez le premier à donner votre avis !</p>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > pagination.per_page" class="flex justify-center mt-6">
            <Pagination :current-page="pagination.current_page" :total-pages="pagination.last_page"
                @page-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import apiClient from '../../api/index';
import FormReview from './FormReview.vue';
import Pagination from '../../components/Pagination.vue';
import { useAuthStore } from '../../stores/Auth';

interface Props {
    productId: string;
    reviewsStats: {
        average: number;
        total: number;
    };
}

const props = defineProps<Props>();

// Stores
const userStore = useAuthStore();

// États
const reviews = ref<any[]>([]);
const isLoading = ref(false);
const userHasReviewed = ref(false);
const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
});

// Computed
const reviewsStats = ref(props.reviewsStats);

// Méthodes
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const fetchReviews = async (page = 1) => {
    try {
        isLoading.value = true;
        const response = await apiClient.get(`/produits/${props.productId}/getReviews`, {
            params: { page }
        });

        if (response.data.success) {
            console.log(response.data.data.reviews.data);

            reviews.value = response.data.data.reviews.data;
            pagination.value = {
                current_page: response.data.data.reviews.data.current_page,
                last_page: response.data.data.reviews.data.last_page,
                per_page: response.data.data.reviews.data.per_page,
                total: response.data.data.reviews.data.total
            };

        }
    } catch (err) {
        console.error('Erreur lors du chargement des avis:', err);
    } finally {
        isLoading.value = false;
    }
};

const handlePageChange = (page: number) => {
    fetchReviews(page);
};

const handleReviewSubmitted = () => {
    userHasReviewed.value = true;
    fetchReviews(1); // Recharger les avis
};

const checkUserReview = async () => {
    if (!userStore.user?.id) return;

    try {
        // Vérifier si l'utilisateur a déjà laissé un avis
        const response = await apiClient.get(`/produits/${props.productId}/getReviews`);
        const userReview = response.data.data.reviews.data.find(
            (review: any) => review.user_id === userStore.user?.id
        );
        userHasReviewed.value = !!userReview;
    } catch (err) {
        console.error('Erreur lors de la vérification de l\'avis utilisateur:', err);
    }
};

// Cycle de vie
onMounted(() => {
    fetchReviews();
    checkUserReview();
});

// Watcher pour recharger quand le produit change
watch(() => props.productId, () => {
    fetchReviews();
    
});
</script>