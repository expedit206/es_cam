<template>
    <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[100vh] overflow-hidden pb-24">
            <!-- En-tête simple -->
            <div class="bg-[var(--espace-vert)] p-6 text-white">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-tags"></i>
                        </div>
                        <div>
                            <h2 class="text-xl font-bold">{{ t('offer_management') }}</h2>
                            <p class="text-white/80 text-sm">{{ t('offer_management_subtitle') }}</p>
                        </div>
                    </div>
                    <button @click="$emit('close')" class="text-white/80 hover:text-white transition-colors p-2">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>

            <div class="flex flex-col h-[calc(90vh-120px)] overflow-y-auto mb-24">
                <!-- Contenu principal -->
                <div class="flex-1 overflow-y-aut p-6">
                    <!-- Statistiques discrètes -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                            <div class="text-2xl font-bold text-[var(--espace-vert)]">{{ offers.length }}</div>
                            <div class="text-sm text-gray-600">{{ t('active_offers') }}</div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                            <div class="text-2xl font-bold text-[var(--espace-vert)]">{{ totalJetons }}</div>
                            <div class="text-sm text-gray-600">{{ t('total_tokens') }}</div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                            <div class="text-2xl font-bold text-[var(--espace-vert)]">{{ uniqueWallets }}</div>
                            <div class="text-sm text-gray-600">{{ t('wallets') }}</div>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                            <div class="text-2xl font-bold text-[var(--espace-vert)]">{{ averagePrice }} FCFA</div>
                            <div class="text-sm text-gray-600">{{ t('average_price') }}</div>
                        </div>
                    </div>

                    <!-- Liste des offres -->
                    <div class="space-y-4">
                        <div v-if="offers.length > 0">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('your_current_offers') }}</h3>

                            <div class="space-y-3">
                                <div v-for="offer in offers" :key="offer.id"
                                    class="bg-white rounded-lg border border-gray-200 p-4 hover:border-[var(--espace-vert)] transition-all duration-200">
                                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                        <!-- Informations de l'offre -->
                                        <div class="flex-1">
                                            <div class="flex items-center gap-3 mb-2">
                                                <div
                                                    class="w-12 h-12 bg-[var(--espace-vert)] rounded-lg flex items-center justify-center text-white font-bold">
                                                    {{ offer.nombre_jetons }}
                                                </div>
                                                <div class="flex-1">
                                                    <div class="flex items-center gap-2 mb-1">
                                                        <span class="font-bold text-gray-900">
                                                            {{ offer.nombre_jetons }} {{ t('tokens') }}
                                                        </span>
                                                        <span class="text-gray-400">•</span>
                                                        <span class="font-semibold text-[var(--espace-vert)]">
                                                            {{ offer.total_prix?.toLocaleString() }} FCFA
                                                        </span>
                                                    </div>
                                                    <div
                                                        class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                        <span>{{ t('unit_price') }} : {{ offer.prix_unitaire }}
                                                            FCFA</span>
                                                        <span>{{ offer.wallet?.payment_service }}</span>
                                                        <span>{{ offer.wallet?.phone_number }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Actions -->
                                        <div class="flex items-center gap-2">
                                            <button @click="editOffer(offer)"
                                                class="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                                <i class="fas fa-edit"></i>
                                                <span class="text-sm">{{ t('edit') }}</span>
                                            </button>
                                            <button @click="deleteOffer(offer.id)"
                                                class="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                                                <i class="fas fa-trash"></i>
                                                <span class="text-sm">{{ t('delete') }}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- État vide -->
                        <div v-else class="text-center py-12">
                            <div
                                class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-tags text-gray-400"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('no_offers_created') }}</h3>
                            <p class="text-gray-600 mb-6">{{ t('create_first_offer') }}</p>
                            <button @click="addOffer"
                                class="bg-[var(--espace-vert)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                <i class="fas fa-plus mr-2"></i>
                                {{ t('create_offer') }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Formulaire fixe en bas -->
                <div v-if="isEditing" class="border-t border-gray-200 bg-white p-6 overflow-y-auto h-full pb-8">
                    <div class="max-w-2xl mx-auto">
                        <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <div class="flex items-center gap-3 mb-4">
                                <div
                                    class="w-8 h-8 bg-[var(--espace-vert)] rounded-full flex items-center justify-center text-white">
                                    <i class="fas fa-edit text-sm"></i>
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900">
                                        {{ currentOffer.id ? t('edit_offer') : t('new_offer') }}
                                    </h3>
                                </div>
                            </div>

                            <form @submit.prevent="saveOffer" class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Quantité de jetons -->
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                                            {{ t('token_quantity') }}
                                        </label>
                                        <input v-model.number="currentOffer.nombre_jetons" type="number" min="1"
                                            :placeholder="t('quantity_placeholder')"
                                            class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--espace-vert)] focus:ring-1 focus:ring-[var(--espace-vert)] transition-colors">
                                    </div>

                                    <!-- Prix unitaire -->
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                                            {{ t('unit_price_fcfa') }}
                                        </label>
                                        <input v-model.number="currentOffer.prix_unitaire" type="number" min="1"
                                            :placeholder="t('price_placeholder')"
                                            class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--espace-vert)] focus:ring-1 focus:ring-[var(--espace-vert)] transition-colors">
                                    </div>
                                </div>

                                <!-- Portefeuille -->
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        {{ t('receiving_wallet') }}
                                    </label>
                                    <select v-model="currentOffer.wallet_id" required
                                        class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-[var(--espace-vert)] focus:ring-1 focus:ring-[var(--espace-vert)] transition-colors">
                                        <option value="" disabled>{{ t('select_wallet') }}</option>
                                        <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
                                            {{ wallet.phone_number }} ({{ wallet.payment_service }})
                                        </option>
                                    </select>
                                </div>

                                <!-- Récapitulatif -->
                                <div v-if="currentOffer.nombre_jetons > 0 && currentOffer.prix_unitaire > 0"
                                    class="bg-white rounded-lg p-4 border border-[var(--espace-vert)]">
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-600">{{ t('estimated_total') }} :</span>
                                        <span class="font-bold text-[var(--espace-vert)]">
                                            {{ (currentOffer.nombre_jetons *
                                            currentOffer.prix_unitaire).toLocaleString() }} FCFA
                                        </span>
                                    </div>
                                </div>

                                <!-- Boutons d'action -->
                                <div class="flex gap-3 pt-2 pb-8">
                                    <button type="submit" :disabled="loading"
                                        class="flex-1 bg-[var(--espace-vert)] text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                        <template v-if="!loading">
                                            <i class="fas fa-save"></i>
                                            {{ currentOffer.id ? t('update') : t('create_offer_button') }}
                                        </template>
                                        <template v-else>
                                            <div
                                                class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent">
                                            </div>
                                            {{ t('processing') }}
                                        </template>
                                    </button>
                                    <button @click="cancelEdit" type="button"
                                        class="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors">
                                        {{ t('cancel') }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Bouton d'ajout fixe en bas -->
                <div v-else class="border-t border-gray-200 bg-white p-2 mb-24 sm:mb-8">
                    <div class="max-w-2xl mx-auto">
                        <button @click="addOffer" type="button"
                            class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                            <i class="fas fa-plus"></i>
                            {{ t('new_token_offer') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue';
import apiClient from '../api/index';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/Auth';
import { useI18n } from '../components/useI18n';

const { t } = useI18n();
const props = defineProps<{
    show: boolean;
    offers: any[];
    wallets: any[];
}>();

const emit = defineEmits(['close', 'refresh-offers']);
const toast = useToast();
const loading = ref(false);

// Données réactives
const offers = ref<any[]>([...props.offers]);
const isEditing = ref(false);
const currentOffer = ref<{
    id: number | null;
    nombre_jetons: number;
    prix_unitaire: number;
    description: string;
    wallet_id: string | number;
}>({
    id: null,
    nombre_jetons: 0,
    prix_unitaire: 0,
    description: '',
    wallet_id: ''
});

// Computed properties pour les statistiques
const totalJetons = computed(() => {
    return offers.value.reduce((sum, offer) => sum + offer.nombre_jetons, 0);
});

const uniqueWallets = computed(() => {
    const walletIds = new Set(offers.value.map(offer => offer.wallet_id));
    return walletIds.size;
});

const averagePrice = computed(() => {
    if (offers.value.length === 0) return 0;
    const total = offers.value.reduce((sum, offer) => parseFloat(sum) + parseFloat(offer.prix_unitaire), 0);
    return Math.round(total / offers.value.length);
});

// Synchronisation des offres
watch(() => props.offers, (newVal) => {
    offers.value = [...newVal];
}, { deep: true });

// Vérification d'authentification
const checkAuth = () => {
    if (!useAuthStore().user) {
        toast.error(t('login_to_manage_offers'));
        return false;
    }
    return true;
};

// Méthodes
const addOffer = () => {
    if (!checkAuth()) return;
    isEditing.value = true;
    currentOffer.value = {
        id: null,
        nombre_jetons: 10,
        prix_unitaire: 100,
        description: '',
        wallet_id: props.wallets[0]?.id || ''
    };
};

const editOffer = (offer: any) => {
    if (!checkAuth()) return;
    isEditing.value = true;
    currentOffer.value = {
        id: offer.id,
        nombre_jetons: offer.nombre_jetons,
        prix_unitaire: offer.prix_unitaire,
        description: offer.description || '',
        wallet_id: offer.wallet_id
    };
};

const cancelEdit = () => {
    isEditing.value = false;
    currentOffer.value = {
        id: null,
        nombre_jetons: 0,
        prix_unitaire: 0,
        description: '',
        wallet_id: ''
    };
};

const saveOffer = async () => {
    if (!checkAuth()) return;

    loading.value = true;
    try {
        if (currentOffer.value.id) {
            // Modification
            await apiClient.put(`/jeton_market/updateOffer/${currentOffer.value.id}`, currentOffer.value);
            toast.success(t('offer_updated_success'));

            // Mise à jour locale
            const index = offers.value.findIndex(o => o.id === currentOffer.value.id);
            if (index !== -1) {
                offers.value[index] = { ...offers.value[index], ...currentOffer.value };
            }
        } else {
            // Création
            const response = await apiClient.post('/jeton_market/offer', currentOffer.value);
            toast.success(t('offer_created_success'));

            // Ajout local
            offers.value.push(response.data);
        }

        emit('refresh-offers');
        cancelEdit();
    } catch (error: any) {
        toast.error(error.response?.data?.message || t('offer_save_error'));
        console.error('Erreur:', error);
    } finally {
        loading.value = false;
    }
};

const deleteOffer = async (offerId: number) => {
    if (!checkAuth()) return;

    if (confirm(t('confirm_delete_offer'))) {
        loading.value = true;
        try {
            await apiClient.delete(`/jeton_market/deleteOffer/${offerId}`);
            toast.success(t('offer_deleted_success'));

            // Suppression locale
            offers.value = offers.value.filter(o => o.id !== offerId);
            emit('refresh-offers');
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('offer_delete_error'));
            console.error('Erreur:', error);
        } finally {
            loading.value = false;
        }
    }
};
</script>

<style scoped>
/* Style minimal pour le scroll */
.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>