<template>
    <SeoHead :title="t('privacy_policy_title')" :description="t('privacy_policy_description')"
        :keywords="t('privacy_policy_keywords')" url="https://espacecameroun.com/politique-confidentialite"
        type="article" />

    <StructuredData type="webpage" :data="{
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': t('privacy_policy_title'),
        'description': t('privacy_policy_description'),
        'datePublished': '2024-01-01',
        'dateModified': updatedAt,
        'publisher': {
            '@type': 'Organization',
            'name': 'Espace Cameroun',
            'url': 'https://espacecameroun.com'
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': 'https://espacecameroun.com/politique-confidentialite'
        }
    }" />

    <div class="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-primary/5">
        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-primary to-primary-dark text-white py-16 shadow-lg">
            <div class="max-w-6xl mx-auto text-center px-6">
                <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-user-shield text-3xl text-white"></i>
                </div>
                <h1 class="text-4xl sm:text-5xl font-bold mb-4">{{ t('privacy_policy') }}</h1>
                <p class="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                    {{ t('welcome_message') }}
                </p>
                <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                    <div class="flex items-center gap-2 text-green-200">
                        <i class="fas fa-calendar-alt"></i>
                        <span>{{ t('last_updated') }} {{ updatedAt }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-green-200">
                        <i class="fas fa-clock"></i>
                        <span>{{ t('reading_time') }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Navigation rapide -->
        <nav class="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-40">
            <div class="max-w-6xl mx-auto px-6">
                <div class="flex overflow-x-auto py-4 gap-6 hide-scrollbar">
                    <a v-for="section in navigationSections" :key="section.id" :href="`#${section.id}`"
                        class="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        <i :class="section.icon" class="text-xs"></i>
                        {{ t(section.translationKey) }}
                    </a>
                </div>
            </div>
        </nav>

        <!-- Contenu principal -->
        <main class="max-w-4xl mx-auto px-6 py-12">
            <!-- Introduction -->
            <section id="introduction" class="mb-12">
                <div class="bg-white rounded-2xl shadow-sm p-8">
                    <h2 class="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                        <i class="fas fa-info-circle text-secondary"></i>
                        {{ t('introduction_title') }}
                    </h2>
                    <div class="prose prose-lg text-gray-700">
                        <p class="mb-4">
                            {{ t('intro_paragraph1') }}
                        </p>
                        <p class="mb-4">
                            {{ t('intro_paragraph2') }}
                        </p>
                        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                            <p class="text-blue-800 text-sm flex items-start gap-3">
                                <i class="fas fa-lightbulb text-blue-500 mt-1"></i>
                                <span>
                                    <strong>{{ t('important_note') }}</strong> {{ t('important_note_text') }}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Données collectées -->
            <section id="donnees-collectees" class="mb-12">
                <div class="bg-white rounded-2xl shadow-sm p-8">
                    <h2 class="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                        <i class="fas fa-database text-secondary"></i>
                        {{ t('data_collected_title') }}
                    </h2>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ t('information_you_provide') }}</h3>
                            <div class="space-y-3">
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-user text-green-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('account_info') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('account_info_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-store text-green-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('business_info') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('business_info_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-comments text-green-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('communications') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('communications_desc') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ t('automatically_collected') }}</h3>
                            <div class="space-y-3">
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-desktop text-blue-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('technical_data') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('technical_data_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-chart-line text-blue-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('usage_data') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('usage_data_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-coins text-blue-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('transaction_data') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('transaction_data_desc') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Utilisation des données -->
            <section id="utilisation-donnees" class="mb-12">
                <div class="bg-white rounded-2xl shadow-sm p-8">
                    <h2 class="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                        <i class="fas fa-cogs text-secondary"></i>
                        {{ t('data_usage_title') }}
                    </h2>

                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('primary_uses') }}</h3>
                            <div class="space-y-4">
                                <div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                    <i class="fas fa-user-check text-green-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('provide_services') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('provide_services_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                    <i class="fas fa-shield-alt text-blue-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('security_compliance') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('security_compliance_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                    <i class="fas fa-chart-bar text-purple-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('service_improvement') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('service_improvement_desc') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('secondary_uses') }}</h3>
                            <div class="space-y-4">
                                <div class="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                    <i class="fas fa-bullhorn text-yellow-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('communication') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('communication_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                    <i class="fas fa-exclamation-triangle text-red-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('problem_resolution') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('problem_resolution_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                                    <i class="fas fa-search text-indigo-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('personalization') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('personalization_desc') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Partage des données -->
            <section id="partage-donnees" class="mb-12">
                <div class="bg-white rounded-2xl shadow-sm p-8">
                    <h2 class="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                        <i class="fas fa-share-alt text-secondary"></i>
                        {{ t('data_sharing_title') }}
                    </h2>

                    <div class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-ban text-red-500 text-xl mt-1"></i>
                            <div>
                                <h3 class="font-semibold text-red-900 mb-2">{{ t('no_data_selling') }}</h3>
                                <p class="text-red-800">
                                    {{ t('no_data_selling_text') }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('when_we_share') }}</h3>
                            <div class="space-y-3">
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-user-friends text-green-600 mt-1"></i>
                                    <div>
                                        <strong>{{ t('with_consent') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('with_consent_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-gavel text-green-600 mt-1"></i>
                                    <div>
                                        <strong>{{ t('legal_requirements') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('legal_requirements_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-tools text-green-600 mt-1"></i>
                                    <div>
                                        <strong>{{ t('service_providers') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('service_providers_desc') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('sharing_protection') }}</h3>
                            <div class="space-y-3">
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-file-contract text-blue-600 mt-1"></i>
                                    <div>
                                        <strong>{{ t('strict_contracts') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('strict_contracts_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-eye-slash text-blue-600 mt-1"></i>
                                    <div>
                                        <strong>{{ t('data_minimization') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('data_minimization_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-shield-check text-blue-600 mt-1"></i>
                                    <div>
                                        <strong>{{ t('security_standards') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('security_standards_desc') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Sécurité -->
            <section id="securite" class="mb-12">
                <div class="bg-white rounded-2xl shadow-sm p-8">
                    <h2 class="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                        <i class="fas fa-lock text-secondary"></i>
                        {{ t('security_title') }}
                    </h2>

                    <div class="grid md:grid-cols-3 gap-6">
                        <div class="text-center p-4">
                            <div
                                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-lock text-green-600 text-2xl"></i>
                            </div>
                            <h3 class="font-semibold text-gray-900 mb-2">{{ t('encryption') }}</h3>
                            <p class="text-gray-600 text-sm">{{ t('encryption_desc') }}</p>
                        </div>
                        <div class="text-center p-4">
                            <div
                                class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-user-shield text-blue-600 text-2xl"></i>
                            </div>
                            <h3 class="font-semibold text-gray-900 mb-2">{{ t('access_control') }}</h3>
                            <p class="text-gray-600 text-sm">{{ t('access_control_desc') }}</p>
                        </div>
                        <div class="text-center p-4">
                            <div
                                class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-eye text-purple-600 text-2xl"></i>
                            </div>
                            <h3 class="font-semibold text-gray-900 mb-2">{{ t('monitoring') }}</h3>
                            <p class="text-gray-600 text-sm">{{ t('monitoring_desc') }}</p>
                        </div>
                    </div>

                    <div class="mt-8 bg-gray-50 rounded-xl p-6">
                        <h3 class="font-semibold text-gray-900 mb-3">{{ t('technical_measures') }}</h3>
                        <ul class="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                            <li class="flex items-center gap-2">
                                <i class="fas fa-check text-green-500"></i>
                                {{ t('https_tls') }}
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="fas fa-check text-green-500"></i>
                                {{ t('password_hashing') }}
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="fas fa-check text-green-500"></i>
                                {{ t('encrypted_backups') }}
                            </li>
                            <li class="flex items-center gap-2">
                                <i class="fas fa-check text-green-500"></i>
                                {{ t('ddos_protection') }}
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Vos droits -->
            <section id="vos-droits" class="mb-12">
                <div class="bg-white rounded-2xl shadow-sm p-8">
                    <h2 class="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                        <i class="fas fa-user-check text-secondary"></i>
                        {{ t('your_rights_title') }}
                    </h2>

                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('fundamental_rights') }}</h3>
                            <div class="space-y-4">
                                <div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                    <i class="fas fa-download text-green-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('access_right') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('access_right_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                    <i class="fas fa-edit text-blue-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('rectification_right') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('rectification_right_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                    <i class="fas fa-trash text-red-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('erasure_right') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('erasure_right_desc') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('additional_rights') }}</h3>
                            <div class="space-y-4">
                                <div class="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                    <i class="fas fa-pause-circle text-purple-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('objection_right') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('objection_right_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                    <i class="fas fa-exchange-alt text-yellow-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('portability_right') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('portability_right_desc') }}</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                                    <i class="fas fa-ban text-indigo-600 mt-1"></i>
                                    <div>
                                        <strong class="text-gray-900">{{ t('limitation_right') }}</strong>
                                        <p class="text-gray-600 text-sm">{{ t('limitation_right_desc') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 bg-gray-50 rounded-xl p-4">
                        <p class="text-sm text-gray-700">
                            <strong>{{ t('how_to_exercise') }}</strong> {{ t('contact_dpo') }}
                            <a href="mailto:espacecameroun@gmail.com"
                                class="text-primary hover:underline">espacecameroun@gmail.com</a>.
                            {{ t('response_time') }}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import SeoHead from '../components/SeoHead.vue';
import StructuredData from '../components/StructuredData.vue';
import { ref } from 'vue';
import { useI18n } from '../components/useI18n';

const { t } = useI18n();

const updatedAt = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

const navigationSections = [
    { id: 'introduction', translationKey: 'introduction', icon: 'fas fa-info-circle' },
    { id: 'donnees-collectees', translationKey: 'data_collected', icon: 'fas fa-database' },
    { id: 'utilisation-donnees', translationKey: 'data_usage', icon: 'fas fa-cogs' },
    { id: 'partage-donnees', translationKey: 'data_sharing', icon: 'fas fa-share-alt' },
    { id: 'securite', translationKey: 'security', icon: 'fas fa-lock' },
    { id: 'vos-droits', translationKey: 'your_rights', icon: 'fas fa-user-check' },
];
</script>

<style scoped>
/*
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
}
*/

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.prose {
    color: #374151;
    max-width: none;
}

.prose p {
    margin-bottom: 1em;
    line-height: 1.625;
}

/* Smooth scrolling */
html {
    scroll-behavior: smooth;
}

/* Animation pour les sections */
.fade-enter-active {
    transition: opacity 0.6s ease, transform 0.4s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}
</style>