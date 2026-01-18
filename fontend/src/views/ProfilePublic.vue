<template>
    <!-- Composants SEO -->
    <SeoHead :title="`${profile?.nom || t('profile')} - ${t('espace_cameroun')}`" :description="t('user_seo_description', {
        name: profile?.nom || t('user'),
        ville: profile?.ville || t('city_not_specified')
    })" :keywords="t('user_seo_keywords', {
            name: profile?.nom || t('user'),
            ville: profile?.ville || t('cameroon')
        })" url="https://espacecameroun.com/doc" type="profile" />

    <StructuredData type="webpage" :data="{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        'name': `${t('profile')} ${profile?.nom || t('user')}`,
        'description': `${t('profile')} ${t('user')} ${t('on')} ${t('espace_cameroun')}`,
        'url': 'https://espacecameroun.com/doc',
        'mainEntity': {
            '@type': 'Person',
            'name': profile?.nom,
            'description': t('user'),
            'image': profile?.photo ? `${getStorageUrl()}${profile.photo}` : undefined,
            'address': profile?.ville ? {
                '@type': 'PostalAddress',
                'addressLocality': profile.ville
            } : undefined,
            'telephone': profile?.telephone || undefined
        }
    }" />

    <div class="overflow-y-auto h-full bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4 sm:px-6">
        <div class="max-w-4xl mx-auto">
            <!-- Carte principale du profil -->
            <div class="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                <!-- Bannière de profil -->
                <div class="h-32 bg-gradient-to-r from-[var(--espace-vert)] to-[var(--espace-vert)] relative">
                    <div class="absolute inset-0 bg-black/10"></div>
                    <div class="absolute -bottom-16 left-8">
                        <div class="relative">
                            <!-- Photo de profil -->
                            <div class="w-32 h-32 bg-white rounded-2xl shadow-2xl p-2">
                                <div
                                    class="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <img v-if="profile?.photo" :src="`${getStorageUrl()}${profile.photo}`"
                                        :alt="t('profile_picture')" class="w-full h-full object-cover" />
                                    <i v-else class="fas fa-user text-gray-400 text-4xl"></i>
                                </div>
                            </div>

                            <!-- Badge Premium -->
                            <div v-if="profile?.premium"
                                class="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                <i class="fas fa-crown text-white text-sm"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contenu du profil -->
                <div class="pt-20 px-8 pb-8">
                    <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <!-- Informations principales -->
                        <div class="flex-1">
                            <!-- Nom et badges -->
                            <div class="flex flex-wrap items-center gap-3 mb-4">
                                <h1 class="text-3xl font-bold text-gray-900">{{ profile?.nom }}</h1>

                                <!-- Badge Premium -->
                                <span v-if="profile?.premium"
                                    class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-[var(--espace-vert)] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                    <i class="fas fa-crown"></i>
                                    {{ t('premium') }}
                                </span>

                                <!-- Badge Type -->
                                <span class="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                                    <i class="fas fa-user"></i>
                                    {{ t('user') }}
                                </span>
                            </div>

                            <!-- Informations de contact -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div class="flex items-center gap-3 text-gray-600">
                                    <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-map-marker-alt text-[var(--espace-vert)]"></i>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">{{ t('city') }}</p>
                                        <p class="font-medium">{{ profile?.ville || t('city_not_specified') }}</p>
                                    </div>
                                </div>

                                <div class="flex items-center gap-3 text-gray-600">
                                    <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-phone text-[var(--espace-vert)]"></i>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">{{ t('phone') }}</p>
                                        <p class="font-medium">{{ profile?.telephone || t('not_available') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col gap-3">
                            <button @click="goToChat"
                                class="flex items-center justify-center gap-2 bg-[var(--espace-vert)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--espace-vert)] transition-all shadow-lg hover:shadow-xl min-w-[160px]">
                                <i class="fas fa-comments"></i>
                                {{ t('start_chat') }}
                            </button>


                        </div>
                    </div>
                </div>
            </div>

            <!-- Sections supplémentaires -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- À propos -->
                <div class="bg-white rounded-2xl shadow-sm p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fas fa-info-circle text-[var(--espace-vert)]"></i>
                        {{ t('about') }}
                    </h3>
                    <div class="space-y-3 text-sm text-gray-600">
                        <p>
                            {{ t('profile_about_description') }}
                        </p>
                        <p v-if="profile?.premium && profile?.subscription_ends_at"
                            class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <i class="fas fa-crown text-yellow-500 mr-2"></i>
                            {{ t('premium_subscription_active') }}
                            <strong>{{ new Date(profile.subscription_ends_at).toLocaleDateString('fr-FR') }}</strong>
                        </p>
                    </div>
                </div>

            

                <!-- Statut du compte -->
                <div class="bg-white rounded-2xl shadow-sm p-6 mb-10">
                    <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fas fa-shield-alt text-blue-500"></i>
                        {{ t('account_status') }}
                    </h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">{{ t('account_type') }}:</span>
                            <span class="font-semibold text-blue-600">
                                {{ t('user') }}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">{{ t('status') }}:</span>
                            <span class="font-semibold text-[var(--espace-vert)]">{{ t('active') }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">{{ t('member_since') }}:</span>
                            <span class="font-semibold text-gray-900">
                                {{ new Date(profile?.created_at).toLocaleDateString('fr-FR') }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section statistiques produits/services -->
            <div v-if="profile?.produits_count > 0 || profile?.services_count > 0" class="mt-8">
                <div class="bg-white rounded-2xl shadow-sm p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <i class="fas fa-boxes text-[var(--espace-vert)]"></i>
                            {{ t('inventory') }}
                        </h3>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-50 p-4 rounded-xl text-center">
                            <p class="text-2xl font-bold text-[var(--espace-vert)]">{{ profile?.produits_count }}</p>
                            <p class="text-sm text-gray-600">{{ t('products') }}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-xl text-center">
                            <p class="text-2xl font-bold text-blue-600">{{ profile?.services_count }}</p>
                            <p class="text-sm text-gray-600">{{ t('services') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import apiClient from "../api/index";
import { useAuthStore } from "../stores/Auth";
import { useI18n } from '../components/useI18n';

import SeoHead from '../components/SeoHead.vue';
import StructuredData from '../components/StructuredData.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const profile = ref<any>(null);

const getStorageUrl = () => {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
        return "http://localhost:8000/storage/";
    }
    return "https://api.espacecameroun.com/storage/";
};

const fetchProfile = async () => {
    try {
        const response = await apiClient.get(`/profile/public/${route.params.id}`);
        profile.value = response.data;
    } catch (error: any) {
        if (error.response?.data?.message == 'Unauthenticated.') {
            router.push('login');
        }
        toast.error(t('error_loading_profile'));
        console.error(error);
    }
};

const goToChat = () => {
    if (!authStore.user) {
        toast.error(t('login_to_message'));
        return;
    }
    if (profile.value?.id) {
        router.push({ name: "messages", params: { receiverId: profile.value.id } });
    } else {
        toast.error(t('chat_access_error'));
    }
};



onMounted(() => {
    fetchProfile();
});
</script>

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

/* Effets de hover subtils */
.transform {
    transition: transform 0.2s ease;
}

.hover-lift:hover {
    transform: translateY(-2px);
}

/* Style de carte moderne */
.rounded-3xl {
    border-radius: 1.5rem;
}

.shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Amélioration de l'affichage mobile */
@media (max-width: 768px) {
    .text-sm .block {
        margin-top: 2px;
    }

    .space-y-3>p {
        line-height: 1.4;
    }
}
</style>