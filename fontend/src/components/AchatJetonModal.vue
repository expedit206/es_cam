<template>
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-in">
            <!-- En-tête avec dégradé -->
            <div class="bg-gradient-to-r from-[var(--espace-vert)] to-green-600 p-6 text-white ">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold flex items-center gap-2">
                            <i class="fas fa-coins"></i>
                            {{ t('buy_tokens') }}
                        </h2>
                        <p class="text-green-100 text-sm mt-1">{{ t('recharge_your_account') }}</p>
                    </div>
                    <button @click="router.back()" class="text-white/80 hover:text-white transition-colors">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>

            <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <!-- Tarif -->
                <div
                    class="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-100">
                    <div class="flex items-center justify-center gap-2 text-sm text-gray-600 mb-1">
                        <i class="fas fa-tag text-green-600"></i>
                        <span>{{ t('current_rate') }}</span>
                    </div>
                    <div class="text-2xl font-bold text-[var(--espace-vert)]">{{ t('token_price_display') }}</div>
                </div>

                <!-- Sélection rapide -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <i class="fas fa-bolt text-[var(--espace-or)]"></i>
                        {{ t('quick_quantity') }}
                    </label>
                    <div class="grid grid-cols-4 gap-2">
                        <button v-for="preset in presetQuantities" :key="preset" type="button"
                            @click="setQuantity(preset)" :class="[
                                'rounded-xl py-3 font-semibold transition-all duration-200 border-2 text-sm',
                                jetonQuantity === preset
                                    ? 'bg-[var(--espace-vert)] text-white border-[var(--espace-vert)] shadow-lg scale-105'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-[var(--espace-vert)] hover:text-[var(--espace-vert)] hover:shadow-md',
                            ]">
                            {{ preset }}
                        </button>
                    </div>
                </div>

                <!-- Quantité personnalisée -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <i class="fas fa-edit text-blue-600"></i>
                        {{ t('custom_quantity') }}
                        <span class="text-xs text-gray-500 font-normal">({{ t('min') }} 10)</span>
                    </label>
                    <div class="relative">
                        <input id="jetonQuantity" v-model.number="jetonQuantity" type="number" min="10"
                            :placeholder="t('quantity_placeholder')" @input="onQuantityInput"
                            class="w-full rounded-xl border-2 border-gray-200 px-4 py-4 pr-12 focus:outline-none focus:border-[var(--espace-vert)] focus:ring-2 focus:ring-[var(--espace-vert)]/20 transition-all" />
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <i class="fas fa-coins"></i>
                        </div>
                    </div>
                </div>

                <!-- Informations de contact -->
                <div class="space-y-4">
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <i class="fas fa-envelope text-blue-600"></i>
                            {{ t('email') }}
                            <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <input id="email" v-model="email" type="email" :placeholder="t('email_placeholder')"
                                @input="validateEmail" :class="[
                                    'w-full rounded-xl border-2 px-4 py-4 pl-12 focus:outline-none focus:ring-2 transition-all',
                                    emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-[var(--espace-vert)] focus:ring-[var(--espace-vert)]/20',
                                ]" />
                            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <i class="fas fa-envelope"></i>
                            </div>
                        </div>
                        <p v-if="emailError" class="text-xs text-red-600 mt-2 flex items-center gap-1">
                            <i class="fas fa-exclamation-circle"></i>
                            {{ t('invalid_email') }}
                        </p>
                    </div>

                 

                </div>

                <!-- Récapitulatif -->
                <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600">{{ t('token_quantity') }}</span>
                        <span class="font-semibold text-gray-900">{{ jetonQuantity }} {{ t('tokens') }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">{{ t('total_amount') }}</span>
                        <span class="text-xl font-bold text-[var(--espace-vert)]">{{ montant.toLocaleString() }}
                            FCFA</span>
                    </div>
                </div>

                <!-- Informations de paiement -->
                <div class="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <div class="flex items-start gap-3">
                        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                            <i class="fas fa-info text-white text-xs"></i>
                        </div>
                        <div class="flex-1">
                            <p class="text-sm text-blue-800 font-medium">
                                {{ t('notchpay_info') }}
                            </p>
                            <p class="text-xs text-blue-600 mt-1">
                                {{ t('notchpay_redirect') }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Bouton d'achat -->
                <button @click="initiatePurchase" :disabled="!isFormValid || loading"
                    class="w-full bg-gradient-to-r from-[var(--espace-vert)] to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-3">
                    <template v-if="!loading">
                        <i class="fas fa-credit-card"></i>
                        {{ t('pay_with_notchpay') }}
                    </template>
                    <template v-else>
                        <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        {{ t('preparing_payment') }}
                    </template>
                </button>

                <!-- Lien annuler -->
                <button @click="router.back()"
                    class="w-full text-center text-gray-500 hover:text-[var(--espace-vert)] transition-colors duration-200 text-sm font-medium py-2">
                    <i class="fas fa-arrow-left mr-2"></i>
                    {{ t('cancel') }}
                </button>
            </div>
        </div>
    </div>

   
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import apiClient from "../api/index";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/Auth";
import { useI18n } from '../components/useI18n';
import { useRouter } from "vue-router";
defineProps<{
    isOpen: boolean;
}>();


const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const user = authStore.user;
const emit = defineEmits(["close", "purchased"]);

const toast = useToast();

// Données du formulaire
const jetonQuantity = ref<number>(10);
const email = ref<string>("");
const name = ref<string>("");
const phoneNumber = ref<string>("");
const montant = ref<number>(jetonQuantity.value * 100);
const loading = ref(false);
const showRedirectModal = ref(false);

// États d'erreur
const emailError = ref(false);
const nameError = ref(false);
const phoneError = ref(false);

// Données de redirection
const paymentData = ref<any>(null);

const presetQuantities = [10, 20, 50, 100];

const isFormValid = computed(() => {
    return (
        jetonQuantity.value >= 10 &&
        email.value.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) 
    );
});

const updateMontant = () => {
    montant.value = jetonQuantity.value * 100;
};

const setQuantity = (qty: number) => {
    jetonQuantity.value = qty;
    updateMontant();
};

const onQuantityInput = () => {
    updateMontant();
};

const validateEmail = () => {
    emailError.value = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
};




const initiatePurchase = async () => {
    // Validation finale
    validateEmail();

    if (!isFormValid.value) {
        toast.error(t('fill_all_fields_correctly'));
        return;
    }

    loading.value = true;

    try {
        const response = await apiClient.post("/jeton/purchase/platform", {
            jeton_quantity: jetonQuantity.value,
            email: email.value,
            name: name.value,
            phone: phoneNumber.value
        });

        paymentData.value = response.data;

        // Afficher le modal de redirection
        if (paymentData.value?.redirect_url) {
            // Ouvrir dans un nouvel onglet ou rediriger
            // window.open(paymentData.value.redirect_url);
            window.location.href = paymentData.value.redirect_url;

            // Stocker les informations pour le callback
            if (paymentData.value.transaction_id) {
                localStorage.setItem('pending_transaction', paymentData.value.transaction_id);
            }

            // Fermer les modals
            emit('close');

        }
        toast.success(t('payment_initialized'));

    } catch (error: any) {
        console.error('Erreur lors de l\'initialisation du paiement:', error);

        if (error.response?.data?.error) {
            toast.error(error.response.data.error);
        } else {
            toast.error(t('payment_init_error'));
        }
    } finally {
        loading.value = false;
    }
};

// const redirectToPayment = () => {
//     if (paymentData.value?.redirect_url) {
//         // Ouvrir dans un nouvel onglet ou rediriger
//         window.open(paymentData.value.redirect_url, '_blank');

//         // Stocker les informations pour le callback
//         if (paymentData.value.transaction_id) {
//             localStorage.setItem('pending_transaction', paymentData.value.transaction_id);
//         }

//         // Fermer les modals
//         showRedirectModal.value = false;
//         emit('close');

//         toast.info(t('complete_payment_in_browser'));
//     }
// };

// Remplir automatiquement les informations utilisateur si connecté
onMounted(() => {
    if (user) {
        email.value = user.email || "";
        name.value =  user.nom || "";
        phoneNumber.value = user.telephone || "";
    }
});

// Watchers
watch(phoneNumber, () => {
    validatePhoneNumber();
});

watch(email, () => {
    validateEmail();
});

watch(name, () => {
    validateName();
});
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
    animation: modal-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrollbar personnalisée */
.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
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
</style>