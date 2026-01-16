<template>
    <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-modal-in">
            <!-- Header -->
            <div class="bg-gradient-to-r from-[var(--espace-vert)] to-[var(--espace-vert)] p-6 text-white">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-wallet text-xl"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold">{{ t('wallet_management') }}</h2>
                            <p class="text-white/90 text-sm">{{ t('wallet_management_description') }}</p>
                        </div>
                    </div>
                    <button @click="$emit('close')" class="text-white/80 hover:text-white transition-colors p-2">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>

            <!-- Contenu principal -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)] pb-24">
                <!-- Formulaire de création/édition -->
                <div v-if="isEditing" class="mb-8">
                    <div
                        class="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
                        <div class="flex items-center gap-3 mb-4">
                            <div :class="[
                                'w-10 h-10 rounded-full flex items-center justify-center text-white',
                                currentWallet.id ? 'bg-yellow-500' : 'bg-[(var(--espace-vert)]'
                            ]">
                                <i :class="currentWallet.id ? 'fas fa-edit' : 'fas fa-plus'"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900">
                                {{ currentWallet.id ? t('edit_wallet') : t('new_wallet') }}
                            </h3>
                        </div>

                        <form @submit.prevent="saveWallet" class="space-y-5">
                            <!-- Service de paiement -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <i class="fas fa-mobile-alt text-[var(--espace-vert)]"></i>
                                    {{ t('payment_service') }}
                                </label>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label v-for="service in paymentServices" :key="service.value" :class="[
                                        'relative border-2 rounded-xl p-4 cursor-pointer transition-all',
                                        currentWallet.payment_service === service.value
                                            ? 'border-[var(--espace-vert)] bg-green-50 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300'
                                    ]">
                                        <input type="radio" :value="service.value"
                                            v-model="currentWallet.payment_service" class="hidden">

                                        <div class="flex items-center gap-3">
                                            <img :src="service.logo" :alt="service.label"
                                                class="w-8 h-8 object-contain rounded-lg">
                                            <span class="font-semibold text-gray-700">{{ service.label }}</span>
                                        </div>

                                        <div v-if="currentWallet.payment_service === service.value"
                                            class="absolute -top-2 -right-2 w-5 h-5 bg-[var(--espace-vert)] rounded-full flex items-center justify-center">
                                            <i class="fas fa-check text-white text-xs"></i>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Numéro de téléphone -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <i class="fas fa-phone text-[var(--espace-vert)]"></i>
                                    {{ t('phone_number') }}
                                </label>
                                <input v-model="currentWallet.phone_number" type="tel"
                                    :placeholder="t('phone_placeholder')" required pattern="6[0-9]{8}"
                                    class="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[var(--espace-vert)] focus:ring-4 focus:ring-green-200 transition-all outline-none">
                                <p class="text-xs text-gray-500 mt-2">
                                    {{ t('phone_format_hint') }}
                                </p>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-3 pt-2">
                                <button type="submit" :disabled="loading" :class="[
                                    'flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 px-1',
                                    loading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[var(--espace-vert)] to-[var(--espace-vert)] text-white hover:shadow-lg'
                                ]">
                                    <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                                    {{ currentWallet.id ? t('update') : t('create_wallet') }}
                                </button>
                                <button @click="cancelEdit" type="button"
                                    class="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold">
                                    {{ t('cancel') }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Liste des portefeuilles -->
                <div v-if="wallets && wallets.length > 0" class="space-y-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold text-gray-900">{{ t('your_wallets') }}</h3>
                        <span class="text-sm text-gray-500">{{ t('wallet_count', { count: wallets.length }) }}</span>
                    </div>

                    <div v-for="wallet in wallets" :key="wallet.id || wallet.phone_number"
                        class="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-gray-200 transition-all shadow-sm hover:shadow-md">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <!-- Logo du service -->
                                <div :class="[
                                    'w-12 h-12 rounded-xl flex items-center justify-center',
                                    wallet.payment_service === 'ORANGE'
                                        ? 'bg-orange-100 border-2 border-orange-200'
                                        : 'bg-purple-100 border-2 border-purple-200'
                                ]">
                                    <img :src="getServiceLogo(wallet.payment_service)" :alt="wallet.payment_service"
                                        class="w-6 h-6 object-contain">
                                </div>

                                <!-- Informations -->
                                <div>
                                    <div class="flex items-center gap-3 mb-1">
                                        <span class="font-semibold text-gray-900 text-lg">
                                            {{ wallet.phone_number }}
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-600">
                                        {{ wallet.payment_service === 'ORANGE' ? t('orange_money') :
                                        t('mtn_mobile_money') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex items-center gap-2">
                                <button @click="editWallet(wallet)"
                                    class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all flex items-center justify-center"
                                    :title="t('edit')">
                                    <i class="fas fa-edit text-sm"></i>
                                </button>
                                <button @click="deleteWallet(wallet.id)"
                                    class="w-10 h-10 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center"
                                    :title="t('delete')">
                                    <i class="fas fa-trash text-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- État vide -->
                <div v-else-if="!isEditing" class="text-center py-12">
                    <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-wallet text-gray-400 text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ t('no_wallets') }}</h3>
                    <p class="text-gray-600 max-w-sm mx-auto mb-6">
                        {{ t('no_wallets_description') }}
                    </p>
                </div>

                <!-- Bouton d'ajout -->
                <button v-if="!isEditing" @click="addWallet"
                    class="w-full bg-gradient-to-r from-[var(--espace-vert)] to-[var(--espace-vert)] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3 mt-6">
                    <i class="fas fa-plus"></i>
                    {{ t('add_wallet') }}
                </button>

                <!-- Informations de sécurité -->
                <div class="mt-8 bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-shield-alt text-blue-500 text-lg mt-1"></i>
                        <div>
                            <h4 class="font-semibold text-blue-900 mb-2">{{ t('secure_payments') }}</h4>
                            <p class="text-blue-800 text-sm">
                                {{ t('secure_payments_description') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import apiClient from '../api/index';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useI18n } from '../components/useI18n';

const { t } = useI18n();

const router = useRouter();
const props = defineProps<{ show: boolean; wallets: any[] }>();
const emit = defineEmits(['close', 'refresh-wallets']);
const toast = useToast();
const authStore = useAuthStore();

const loading = ref(false);
const isEditing = ref(false);
const currentWallet = ref<{ id: number | null; phone_number: string; payment_service: string }>({
    id: null,
    phone_number: '',
    payment_service: ''
});

const paymentServices = [
    {
        value: 'ORANGE',
        label: t('orange_money'),
        logo: new URL('../assets/images/logo/orange.png', import.meta.url).href
    },
    {
        value: 'MTN',
        label: t('mtn_mobile_money'),
        logo: new URL('../assets/images/logo/mtn.jpg', import.meta.url).href
    },
];

const getServiceLogo = (service: string) => {
    const found = paymentServices.find(s => s.value === service);
    return found ? found.logo : '';
};

const addWallet = () => {
    if (!authStore.user) {
        toast.error(t('login_to_add_wallet'));
        return;
    }
    isEditing.value = true;
    currentWallet.value = { id: null, phone_number: '', payment_service: '' };
};

const editWallet = (wallet: any) => {
    if (!authStore.user) {
        toast.error(t('login_to_edit_wallet'));
        return;
    }
    isEditing.value = true;
    currentWallet.value = {
        id: wallet.id,
        phone_number: wallet.phone_number,
        payment_service: wallet.payment_service
    };
};

const cancelEdit = () => {
    isEditing.value = false;
    currentWallet.value = { id: null, phone_number: '', payment_service: '' };
};

const saveWallet = async () => {
    if (!authStore.user) {
        toast.error(t('login_to_save_wallet'));
        return;
    }

    const phonePattern = /^6[0-9]{8}$/;
    if (!phonePattern.test(currentWallet.value.phone_number)) {
        toast.error(t('invalid_phone_format'));
        return;
    }

    if (!currentWallet.value.payment_service) {
        toast.error(t('select_payment_service'));
        return;
    }

    loading.value = true;
    try {
        if (currentWallet.value.id) {
            await apiClient.put(`/wallets/${currentWallet.value.id}`, currentWallet.value);
            toast.success(t('wallet_updated'));
        } else {
            await apiClient.post('/wallets', currentWallet.value);
            toast.success(t('wallet_created'));
        }
        emit('refresh-wallets');
        cancelEdit();
    } catch (error: any) {
        if (error.response?.data?.message == 'Unauthenticated.') {
            router.push('login');
        }
        toast.error(error.response?.data?.message || t('save_error'));
        console.error('Erreur:', error);
    } finally {
        loading.value = false;
    }
};

const deleteWallet = async (walletId: number) => {
    if (!authStore.user) {
        toast.error(t('login_to_delete_wallet'));
        return;
    }

    if (!confirm(t('delete_wallet_confirmation'))) {
        return;
    }

    loading.value = true;
    try {
        await apiClient.delete(`/wallets/${walletId}`);
        toast.success(t('wallet_deleted'));
        emit('refresh-wallets');
    } catch (error: any) {
        if (error.response?.data?.message == 'Unauthenticated.') {
            router.push('login');
        }
        toast.error(error.response?.data?.message || t('delete_error'));
        console.error('Erreur:', error);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
@keyframes modal-in {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.animate-modal-in {
    animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Scrollbar personnalisée */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Amélioration des transitions */
.transition-all {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Effet de profondeur */
.shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>