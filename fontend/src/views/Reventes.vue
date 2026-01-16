<template>
    <!-- META TAGS SEO OPTIMISÉS POUR LES COLLABORATIONS -->
    <SeoHead :title="t('my_reventes') + ' - Espace Cameroun Marketplace'" :description="t('manage_revente_proposals')"
        keywords="revente produits, commerce, revente cameroun, partenariat commercial, réseau commerçants, marketplace revente, affaires cameroun, vente en revente, bayam sala, apacheur, buisness"
        image="/images/reventes-og.jpg" url="https://espacecameroun.com/reventes" type="website" />

    <StructuredData type="webpage" :data="{
        name: t('my_reventes') + ' - Espace Cameroun',
        description: t('revente_explanation'),
        url: 'https://espacecameroun.com/reventes'
    }" />

    <div class="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-green-50 py-2  pb-24 px-4 sm:px-6">
        <!-- <Loader :isLoading="reventeStore.isLoading" /> -->
        <div class="max-w-6xl mx-auto">
            <!-- En-tête -->
            <div class="text-center mb-2">
                <p class="text-gray-600 font-bold text-lg">
                    {{ t('manage_revente_proposals') }}
                </p>
            </div>

            <!-- Section éducative - Qu'est-ce qu'une revente ? -->
            <div class="mb-2">
                <button @click="reventeStore.toggleExplanation()"
                    class="bg-white border-2 text-[var(--espace-vert)] px-6 py-3 rounded-xl hover:bg-gray-100 transition-all font-semibold whitespace-nowrap">
                    <i class="fas fa-info-circle mr-2"></i>
                    {{ reventeStore.showExplanation ? t('hide_details') : t('how_it_works') }}
                </button>
            </div>

            <!-- Explication détaillée -->
            <div v-if="reventeStore.showExplanation" class="mt-6 pt-6 border-t border-green-400">
                <div class="flex flex-col lg:flex-row items-start lg:items-center gap-6 text-black">
                    <div class="flex-1">
                        <h2 class="text-md font-bold mb-3 flex items-center">
                            🤝 {{ t('reventes_on_espace_cameroun') }}
                        </h2>
                        <p class="text-black mb-4 leading-relaxed">
                            {{ t('revente_explanation') }}
                        </p>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div class="flex items-start gap-3">
                                <div
                                    class="w-6 h-6 bg-[var(--espace-or)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <i class="fas fa-store text-[var(--espace-vert)] text-xs"></i>
                                </div>
                                <div>
                                    <strong>{{ t('for_merchants') }}</strong>
                                    <p class="text-black">{{ t('extend_sales_network') }}</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <div
                                    class="w-6 h-6 bg-[var(--espace-or)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <i class="fas fa-users text-[var(--espace-vert)] text-xs"></i>
                                </div>
                                <div>
                                    <strong>{{ t('for_resellers') }}</strong>
                                    <p class="text-black">{{ t('sell_without_inventory') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="text-center">
                            <div
                                class="w-12 h-12 bg-[var(--espace-or)] rounded-full flex items-center justify-center mx-auto mb-3">
                                <span class="text-[var(--espace-vert)] font-bold">1</span>
                            </div>
                            <h3 class="font-semibold mb-2">{{ t('discovery') }}</h3>
                            <p class="text-black text-sm">
                                {{ t('discovery_description') }}
                            </p>
                        </div>
                        <div class="text-center">
                            <div
                                class="w-12 h-12 bg-[var(--espace-or)] rounded-full flex items-center justify-center mx-auto mb-3">
                                <span class="text-[var(--espace-vert)] font-bold">2</span>
                            </div>
                            <h3 class="font-semibold mb-2">{{ t('negotiation') }}</h3>
                            <p class="text-black text-sm">
                                {{ t('negotiation_description') }}
                            </p>
                        </div>
                        <div class="text-center">
                            <div
                                class="w-12 h-12 bg-[var(--espace-or)] rounded-full flex items-center justify-center mx-auto mb-3">
                                <span class="text-[var(--espace-vert)] font-bold">3</span>
                            </div>
                            <h3 class="font-semibold mb-2">{{ t('commission') }}</h3>
                            <p class="text-black text-sm">
                                {{ t('commission_description') }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-2 p-4 bg-white/10 rounded-xl">
                        <h4 class="font-semibold mb-2 flex items-center">
                            <i class="fas fa-star text-[var(--espace-or)] mr-2"></i>
                            {{ t('key_advantages') }}
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-check text-green-300"></i>
                                <span class="text-black">{{ t('no_initial_investment') }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-check text-green-300"></i>
                                <span class="text-black">{{ t('expand_product_catalog') }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-check text-green-300"></i>
                                <span class="text-black">{{ t('networking_with_merchants') }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-check text-green-300"></i>
                                <span class="text-black">{{ t('additional_income_no_stock') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Navigation par onglets -->
            <div class="bg-white rounded-2xl shadow-sm border p-2 mb-8">
                <div class="flex space-x-2 text-xs">
                    <button @click="reventeStore.setActiveTab('received')" :class="[
                        'flex-1 py-2 px-1 rounded-xl font-medium transition-all text-center',
                        reventeStore.activeTab === 'received'
                            ? 'bg-[var(--espace-vert)] text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                    ]">
                        {{ t('received_requests') }}
                        <span class="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                            {{ reventeStore.receivedReventesCount }}
                        </span>
                    </button>
                    <button @click="reventeStore.setActiveTab('sent')" :class="[
                        'flex-1 py-4  px-1 rounded-xl font-medium transition-all text-center',
                        reventeStore.activeTab === 'sent'
                            ? 'bg-[var(--espace-vert)] text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                    ]">
                        {{ t('sent_requests') }}
                        <span class="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                            {{ reventeStore.sentReventesCount }}
                        </span>
                    </button>
                </div>
            </div>

            <div class="space-y-4">
                <!-- Reventes reçues -->
                <div v-if="reventeStore.activeTab === 'received'">
                    <div v-if="reventeStore.hasReceivedReventes" class="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div v-for="revente in reventeStore.currentReventes" :key="revente.id"
                            class="max-w-90 bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-300">

                            <!-- En-tête compacte -->
                            <div class="flex items-start gap-3 mb-3">
                                <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    <img v-if="revente.produit?.photos?.[0]" :src="revente.produit.photos[0]"
                                        :alt="revente.produit.nom" class="w-full h-full object-cover">
                                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <i class="fas fa-image text-gray-400"></i>
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3 @click="reventeStore.viewProduit(revente.produit_id)"
                                        class="font-semibold text-gray-900 hover:text-[var(--espace-vert)] cursor-pointer transition-colors line-clamp-2 text-sm leading-tight mb-1">
                                        {{ revente.produit?.nom }}
                                    </h3>
                                    <div class="flex items-center gap-2">
                                        <span
                                            :class="['px-2 py-1 rounded-full text-xs font-medium', reventeStore.getStatusColor(revente.statut)]">
                                            <i :class="[reventeStore.getStatusIcon(revente.statut), 'mr-1']"></i>
                                            {{ reventeStore.getStatusText(revente.statut) }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations essentielles -->
                            <div class="space-y-2 mb-3">
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-600">{{ t('proposed_resell_price') }}</span>
                                    <span class="font-semibold text-[var(--espace-vert)]">
                                        {{ revente.prix_revente.toLocaleString() }} FCFA
                                    </span>
                                </div>
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-600">{{ t('reseller') }}</span>
                                    <span class="font-medium">{{ revente?.revendeur.nom }}</span>
                                </div>
                                <div class="flex justify-between items-center text-sm"
                                    v-if="revente.statut === 'en_attente'">
                                    <span class="text-gray-600">{{ t('received_on') }}</span>
                                    <span class="text-gray-500 text-xs">
                                        {{ new Date(revente.created_at).toLocaleDateString('fr-FR') }}
                                    </span>
                                </div>
                            </div>

                            <!-- Actions compactes -->
                            <div class="flex gap-2 pt-3 border-t border-gray-100">
                                <button v-if="revente.statut === 'en_attente'"
                                    @click="handleUpdateStatus(revente.id, 'valider')"
                                    class="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-all text-sm font-medium flex items-center justify-center gap-1">
                                    <i class="fas fa-check text-xs"></i>
                                    {{ t('accept') }}
                                </button>
                                <button v-if="revente.statut === 'en_attente'"
                                    @click="handleUpdateStatus(revente.id, 'refuser')"
                                    class="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-all text-sm font-medium flex items-center justify-center gap-1">
                                    <i class="fas fa-times text-xs"></i>
                                    {{ t('reject') }}
                                </button>
                                <button @click="reventeStore.viewProduit(revente.produit_id)"
                                    class="flex-1 border border-[var(--espace-vert)] text-[var(--espace-vert)] py-2 px-3 rounded-lg hover:bg-[var(--espace-vert)] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-1">
                                    <i class="fas fa-eye text-xs"></i>
                                    {{ t('view') }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- État vide optimisé -->
                    <div v-else class="text-center py-12">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-inbox text-gray-400 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('no_received_requests') }}</h3>
                        <p class="text-gray-600 text-sm max-w-xs mx-auto mb-4">
                            {{ t('received_requests_explanation') }}
                        </p>
                        <router-link to="/"
                            class="inline-flex items-center gap-2 bg-[var(--espace-vert)] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-medium">
                            <i class="fas fa-shopping-bag"></i>
                            {{ t('browse_products') }}
                        </router-link>
                    </div>
                </div>

                <!-- Reventes envoyées -->
                <div v-if="reventeStore.activeTab === 'sent'">
                    <div v-if="reventeStore.hasSentReventes" class="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div v-for="revente in reventeStore.currentReventes" :key="revente.id"
                            class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-300">

                            <!-- En-tête compacte -->
                            <div class="flex items-start gap-3 mb-3">
                                <div class="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    <img v-if="revente.produit?.photos?.[0]" :src="revente.produit.photos[0]"
                                        :alt="revente.produit.nom" class="w-full h-full object-cover">
                                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <i class="fas fa-image text-gray-400"></i>
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3 @click="reventeStore.viewProduit(revente.produit_id)"
                                        class="font-semibold text-gray-900 hover:text-[var(--espace-vert)] cursor-pointer transition-colors line-clamp-2 text-sm leading-tight mb-1">
                                        {{ revente.produit?.nom }}
                                    </h3>
                                    <div class="flex items-center gap-2">
                                        <span
                                            :class="['px-2 py-1 rounded-full text-xs font-medium', reventeStore.getStatusColor(revente.statut)]">
                                            <i :class="[reventeStore.getStatusIcon(revente.statut), 'mr-1']"></i>
                                            {{ reventeStore.getStatusText(revente.statut) }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations essentielles -->
                            <div class="space-y-2 mb-3">
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-600">{{ t('proposed_resell_price') }}</span>
                                    <span class="font-semibold text-[var(--espace-vert)]">
                                        {{ revente.prix_revente.toLocaleString() }} FCFA
                                    </span>
                                </div>
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-600">{{ t('send_date') }}</span>
                                    <span class="text-gray-500 text-xs">
                                        {{ new Date(revente.created_at).toLocaleDateString('fr-FR') }}
                                    </span>
                                </div>
                                <div class="flex justify-between items-center text-sm"
                                    v-if="revente.statut !== 'en_attente'">
                                    <span class="text-gray-600">{{ t('status_updated') }}</span>
                                    <span class="text-gray-500 text-xs">
                                        {{ new Date(revente.updated_at).toLocaleDateString('fr-FR') }}
                                    </span>
                                </div>
                            </div>

                            <!-- Actions compactes -->
                            <div class="pt-3 border-t border-gray-100">
                                <button @click="reventeStore.viewProduit(revente.produit_id)"
                                    class="w-full border border-[var(--espace-vert)] text-[var(--espace-vert)] py-2 px-3 rounded-lg hover:bg-[var(--espace-vert)] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-1">
                                    <i class="fas fa-eye text-xs"></i>
                                    {{ t('view_product') }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- État vide optimisé -->
                    <div v-else class="text-center py-12">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-paper-plane text-gray-400 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('no_sent_requests') }}</h3>
                        <p class="text-gray-600 text-sm max-w-xs mx-auto mb-4">
                            {{ t('sent_requests_explanation') }}
                        </p>
                        <router-link to="/"
                            class="inline-flex items-center gap-2 bg-[var(--espace-vert)] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-medium">
                            <i class="fas fa-plus"></i>
                            {{ t('propose_revente') }}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useReventeStore } from '../stores/revente';
import SeoHead from '../components/SeoHead.vue';
import StructuredData from '../components/StructuredData.vue';
import Loader from '../components/Loader.vue';
import { useI18n } from '../components/useI18n'

const { t } = useI18n();

// Store
const reventeStore = useReventeStore();

// Handler pour la mise à jour du statut
const handleUpdateStatus = async (reventeId: number, statut: string) => {
    try {
        await reventeStore.updateReventeStatus(reventeId, statut);
    } catch (error) {
        // L'erreur est déjà gérée dans le store
    }
};

// Initialisation
onMounted(async () => {
    await reventeStore.initializeReventes();
});
</script>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
    --espace-blanc: #ffffff;
    --espace-gris: #6b7280;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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
</style>