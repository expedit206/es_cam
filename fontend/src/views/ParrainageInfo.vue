<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/index';
import { useToast } from 'vue-toastification';
import StructuredData from '../components/StructuredData.vue';
import SeoHead from '../components/SeoHead.vue';
import { useI18n } from '../components/useI18n';

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

// Données réactives
const niveaux = ref<any[]>([]);

// Palette de couleurs harmonieuses pour les niveaux
const levelColors = [
    'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200',
    'bg-gradient-to-r from-green-50 to-green-100 border-green-200',
    'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200',
    'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200',
    'bg-gradient-to-r from-red-50 to-red-100 border-red-200',
    'bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200'
];

// Récupérer les données des niveaux
const fetchNiveaux = async () => {
    try {
        const response = await apiClient.get('/parrainages/niveaux');
        niveaux.value = response.data.niveaux;
    } catch (error) {
        toast.error(t('levels_fetch_error'));
        console.error(error);
    }
};

// Retour à la page précédente
const goBack = () => {
    router.go(-1);
};

// Initialisation au montage
onMounted(() => {
    fetchNiveaux();
});
</script>

<template>
    <!-- Composants SEO -->
    <SeoHead :title="t('referral_info_seo_title')" :description="t('referral_info_seo_description')"
        :keywords="t('referral_info_seo_keywords')" url="https://espacecameroun.com/parrainage/info" type="website" />

    <StructuredData type="webpage" :data="{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': t('referral_info_seo_title'),
        'description': t('referral_info_seo_description'),
        'url': 'https://espacecameroun.com/parrainage/info',
        'mainEntity': {
            '@type': 'ItemList',
            'numberOfItems': niveaux.length,
            'itemListElement': niveaux.map((niveau, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'item': {
                    '@type': 'Product',
                    'name': niveau.nom,
                    'description': `${t('levels_rewards')} ${niveau.nom} - ${niveau.filleuls_requis} ${t('merchants_required')}`,
                    'offers': {
                        '@type': 'Offer',
                        'price': niveau.jetons_bonus,
                        'priceCurrency': 'JETON'
                    }
                }
            }))
        }
    }" />

    <div class="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4 sm:px-6">
        <div class="max-w-4xl mx-auto">
            <!-- En-tête -->
            <div class="text-center mb-8">
                <div
                    class="w-20 h-20 bg-gradient-to-r from-green-700 to-[var(--espace-vert)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-gift text-white text-2xl"></i>
                </div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    {{ t('referral_info_title') }}
                </h1>
                <p class="text-gray-600 text-lg">
                    {{ t('referral_info_subtitle') }}
                </p>
            </div>

            <!-- Bouton de retour -->
            <button @click="goBack"
                class="mb-8 flex items-center text-[var(--espace-vert)] hover:text-green-700 font-medium transition-colors">
                <i class="fas fa-arrow-left mr-2"></i>
                {{ t('back_to_dashboard') }}
            </button>

            <!-- Introduction -->
            <div class="bg-white rounded-2xl shadow-sm border p-6 mb-8">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-question-circle text-blue-600 text-xl"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-gray-900 mb-3">{{ t('what_is_referral') }}</h2>
                        <p class="text-gray-600 leading-relaxed">
                            {{ t('referral_description') }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Fonctionnement -->
            <div class="bg-white rounded-2xl shadow-sm border p-6 mb-8">
                <h2 class="text-xl font-bold text-gray-900 mb-6 text-center">{{ t('how_it_works') }}</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div
                                class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-1">{{ t('step_create_code') }}</h3>
                                <p class="text-gray-600 text-sm">{{ t('step_create_code_desc') }}</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div
                                class="w-8 h-8 bg-[var(--espace-vert)] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-1">{{ t('step_share') }}</h3>
                                <p class="text-gray-600 text-sm">{{ t('step_share_desc') }}</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div
                                class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-1">{{ t('step_refer_merchants') }}</h3>
                                <p class="text-gray-600 text-sm">{{ t('step_refer_merchants_desc') }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div
                                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                4
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-1">{{ t('step_level_up') }}</h3>
                                <p class="text-gray-600 text-sm">{{ t('step_level_up_desc') }}</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div
                                class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                5
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-1">{{ t('step_earn_bonus') }}</h3>
                                <p class="text-gray-600 text-sm">{{ t('step_earn_bonus_desc') }}</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div
                                class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                6
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-1">{{ t('step_track_progress') }}</h3>
                                <p class="text-gray-600 text-sm">{{ t('step_track_progress_desc') }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Note importante -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div class="flex items-start">
                        <i class="fas fa-lightbulb text-yellow-500 mt-1 mr-3"></i>
                        <div>
                            <h4 class="font-semibold text-yellow-800 mb-1">{{ t('important_note') }}</h4>
                            <p class="text-yellow-700 text-sm">
                                {{ t('note_content') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Liste des niveaux -->
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">{{ t('levels_rewards') }}</h2>

                <div class="space-y-6">
                    <div v-for="(niveau, index) in niveaux" :key="niveau.id" :class="[
                        'rounded-2xl border p-6 transition-all hover:shadow-md',
                        levelColors[index % levelColors.length]
                    ]">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <!-- En-tête du niveau -->
                            <div class="flex items-center space-x-4 mb-4 lg:mb-0">
                                <div
                                    class="w-16 h-16 bg-white rounded-xl border flex items-center justify-center text-2xl">
                                    {{ niveau.emoji }}
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold text-gray-900">{{ niveau.nom }}</h3>
                                    <p class="text-gray-600 text-sm">
                                        {{ niveau.filleuls_requis }} {{ t('merchants_required') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Récompenses -->
                            <div class="space-y-3">
                                <!-- Bonus en jetons -->
                                <div class="bg-white rounded-xl p-4 border">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center space-x-2">
                                            <i class="fas fa-coins text-yellow-500"></i>
                                            <span class="font-semibold text-gray-700">{{ t('level_bonus') }}</span>
                                        </div>
                                        <div class="text-lg font-bold text-[var(--espace-vert)]">
                                            +{{ niveau.jetons_bonus }} {{ t('tokens') }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Avantages -->
                                <div v-if="niveau.avantages.length" class="bg-white rounded-xl p-4 border">
                                    <h4 class="font-semibold text-gray-700 mb-2 flex items-center">
                                        <i class="fas fa-star text-purple-500 mr-2"></i>
                                        {{ t('exclusive_advantages') }}
                                    </h4>
                                    <ul class="space-y-1">
                                        <li v-for="avantage in niveau.avantages" :key="avantage"
                                            class="flex items-center text-sm text-gray-600">
                                            <i class="fas fa-check text-[var(--espace-vert)] mr-2 text-xs"></i>
                                            {{ avantage }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- Note cumulative -->
                        <div class="mt-4 pt-4 border-t border-gray-200">
                            <p class="text-xs text-gray-500 italic">
                                <i class="fas fa-info-circle mr-1"></i>
                                {{ t('cumulative_note') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA Final -->
            <div class="bg-gradient-to-r from-green-700 to-[var(--espace-vert)] rounded-2xl p-8 text-white text-center">
                <h3 class="text-2xl font-bold mb-3">{{ t('ready_to_start') }}</h3>
                <p class="text-green-100 mb-6 text-lg">
                    {{ t('cta_description') }}
                </p>
                <button @click="goBack"
                    class="bg-white text-[var(--espace-vert)] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                    {{ t('create_referral_code') }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
.overflow-scroll {
    scroll-behavior: smooth;
}

/* Effets de hover subtils */
.hover-lift {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
</style>