<template>
    <SeoHead :title="t('terms_of_use_title')" :description="t('terms_of_use_description')"
        :keywords="t('terms_of_use_keywords')" url="https://espacecameroun.com/politique-utilisation" type="article" />

    <StructuredData type="webpage" :data="{
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': t('terms_of_use_title'),
        'description': t('terms_of_use_description'),
        'datePublished': '2024-01-01',
        'dateModified': lastUpdate,
        'publisher': {
            '@type': 'Organization',
            'name': t('espace_cameroun'),
            'url': 'https://espacecameroun.com'
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': 'https://espacecameroun.com/politique-utilisation'
        }
    }" />

    <div class="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
            <!-- En-tête simplifié -->
            <div class="text-center mb-12">
                <h1 class="text-3xl font-bold text-[var(--espace-vert)] mb-4">
                    {{ t('terms_of_use') }}
                </h1>
                <p class="text-gray-600">
                    {{ t('terms_of_use_subtitle') }}
                </p>
                <div class="flex justify-center gap-4 mt-4 text-sm text-gray-500">
                    <span>{{ t('last_update') }} : {{ lastUpdate }}</span>
                </div>
            </div>

            <!-- Navigation minimaliste -->
            <div class="flex overflow-x-auto gap-2 mb-8 pb-2 hide-scrollbar">
                <button v-for="section in mainSections" :key="section.id" @click="scrollToSection(section.id)"
                    class="flex-shrink-0 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-[var(--espace-vert)] hover:text-[var(--espace-vert)] transition-colors">
                    {{ t(section.titleKey) }}
                </button>
            </div>

            <!-- Contenu principal -->
            <div class="space-y-6">
                <!-- Introduction -->
                <section id="introduction" class="bg-white rounded-xl shadow-sm border p-6">
                    <h2 class="text-xl font-bold text-[var(--espace-vert)] mb-4">{{ t('introduction') }}</h2>
                    <div class="text-gray-700 space-y-3">
                        <p>
                            {{ t('welcome_to') }} <strong>{{ t('espace_cameroun') }}</strong>, {{
                                t('introduction_description') }}
                        </p>
                    </div>
                </section>

                <!-- Règles de conduite -->
                <section id="conduct" class="bg-white rounded-xl shadow-sm border p-6">
                    <h2 class="text-xl font-bold text-[var(--espace-vert)] mb-4">{{ t('conduct_rules') }}</h2>
                    <div class="space-y-4">
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-2">{{ t('allowed_behavior') }}</h3>
                            <ul class="text-sm text-gray-600 space-y-1 ml-4">
                                <li>• {{ t('mutual_respect') }}</li>
                                <li>• {{ t('accurate_descriptions') }}</li>
                                <li>• {{ t('honor_commitments') }}</li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-2">{{ t('prohibited_behavior') }}</h3>
                            <ul class="text-sm text-gray-600 space-y-1 ml-4">
                                <li>• {{ t('harassment_intimidation') }}</li>
                                <li>• {{ t('illegal_products') }}</li>
                                <li>• {{ t('misleading_advertising') }}</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <!-- Transactions -->
                <section id="transactions" class="bg-white rounded-xl shadow-sm border p-6">
                    <h2 class="text-xl font-bold text-[var(--espace-vert)] mb-4">{{ t('transactions_payments') }}</h2>
                    <div class="space-y-3 text-gray-700">
                        <p><strong>{{ t('tokens') }}:</strong> {{ t('token_value') }}</p>
                        <p><strong>{{ t('security') }}:</strong> {{ t('secure_transactions') }}</p>
                        <p><strong>{{ t('responsibility') }}:</strong> {{ t('transaction_responsibility') }}</p>
                    </div>
                </section>

                <!-- Comptes et responsabilités -->
                <section id="accounts" class="bg-white rounded-xl shadow-sm border p-6">
                    <h2 class="text-xl font-bold text-[var(--espace-vert)] mb-4">{{ t('accounts_responsibilities') }}
                    </h2>
                    <div class="space-y-3 text-gray-700">
                        <p><strong>{{ t('registration') }}:</strong> {{ t('registration_requirements') }}</p>
                        <p><strong>{{ t('security') }}:</strong> {{ t('account_security') }}</p>
                        <p><strong>{{ t('content') }}:</strong> {{ t('content_responsibility') }}</p>
                    </div>
                </section>

                <!-- Propriété intellectuelle -->
                <section id="intellectual-property" class="bg-white rounded-xl shadow-sm border p-6">
                    <h2 class="text-xl font-bold text-[var(--espace-vert)] mb-4">{{ t('intellectual_property') }}</h2>
                    <div class="space-y-3 text-gray-700">
                        <p>{{ t('platform_protected') }}</p>
                        <p>{{ t('content_license') }}</p>
                    </div>
                </section>

                <!-- Confidentialité -->
                <section id="privacy" class="bg-white rounded-xl shadow-sm border p-6">
                    <h2 class="text-xl font-bold text-[var(--espace-vert)] mb-4">{{ t('privacy') }}</h2>
                    <div class="space-y-3 text-gray-700">
                        <p>{{ t('data_protection') }}</p>
                        <p>{{ t('data_collection') }}</p>
                    </div>
                </section>

                <!-- Résiliation -->
                <section id="termination" class="bg-white rounded-xl shadow-sm border p-6">
                    <h2 class="text-xl font-bold text-[var(--espace-vert)] mb-4">{{ t('termination') }}</h2>
                    <div class="space-y-3 text-gray-700">
                        <p>{{ t('account_closure') }}</p>
                        <p>{{ t('account_suspension') }}</p>
                    </div>
                </section>

                <!-- Contact -->
                <section id="contact" class="bg-white rounded-xl shadow-sm border p-6">
                    <h2 class="text-xl font-bold text-[var(--espace-vert)] mb-4">{{ t('contact') }}</h2>
                    <div class="space-y-2 text-gray-700">
                        <p>📧 espacecameroun@gmail.com</p>
                        <p>⏰ {{ t('response_time') }}</p>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from '../components/useI18n';

import SeoHead from '../components/SeoHead.vue';
import StructuredData from '../components/StructuredData.vue';

const { t } = useI18n();
const toast = useToast();
const lastUpdate = ref('10 octobre 2025');

// Sections principales avec clés de traduction
const mainSections = [
    { id: 'introduction', titleKey: 'introduction' },
    { id: 'conduct', titleKey: 'conduct_rules_short' },
    { id: 'transactions', titleKey: 'payments_short' },
    { id: 'accounts', titleKey: 'accounts_short' },
    { id: 'intellectual-property', titleKey: 'property_short' },
    { id: 'privacy', titleKey: 'privacy_short' },
    { id: 'termination', titleKey: 'termination_short' },
    { id: 'contact', titleKey: 'contact' }
];

const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

const acceptTerms = () => {
    toast.success(t('terms_accepted'));
};
</script>

<style scoped>
.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Amélioration de la lisibilité */
section {
    scroll-margin-top: 20px;
}

/* Responsive */
@media (max-width: 640px) {
    .text-3xl {
        font-size: 1.5rem;
    }

    .text-xl {
        font-size: 1.25rem;
    }
}
</style>