<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from '../components/useI18n';
import apiClient  from '../api/index';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const form = ref({
    password: '',
    password_confirmation: '',
});
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const token = ref('');
const email = ref('');

onMounted(() => {
    token.value = route.query.token as string;
    email.value = route.query.email as string;

    if (!token.value || !email.value) {
        toast.error('Lien de réinitialisation invalide');
        router.push('/login');
    }
});

const resetPassword = async () => {
    try {
        isLoading.value = true;

        await apiClient.post('/password/reset', {
            token: token.value,
            email: email.value,
            password: form.value.password,
            password_confirmation: form.value.password_confirmation,
        });

        toast.success(t('password_reset_success'));
        router.push('/login');

    } catch (error: any) {
        console.error('Erreur réinitialisation:', error);
        const message = error.response?.data?.message || t('password_reset_error');
        toast.error(message);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div class="text-center">
                <h1 class="text-2xl font-bold text-gray-900">{{ t('reset_password') }}</h1>
                <p class="text-gray-600 text-sm mt-2">{{ t('reset_password_instructions') }}</p>
            </div>

            <form @submit.prevent="resetPassword" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ t('new_password') }}
                    </label>
                    <div class="relative">
                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--espace-vert)] focus:border-transparent" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ t('confirm_password') }}
                    </label>
                    <div class="relative">
                        <input v-model="form.password_confirmation" :type="showConfirmPassword ? 'text' : 'password'"
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--espace-vert)] focus:border-transparent" />
                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </button>
                    </div>
                </div>

                <button type="submit" :disabled="isLoading"
                    class="w-full bg-[var(--espace-vert)] text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                    {{ isLoading ? t('resetting') : t('reset_button') }}
                </button>
            </form>
        </div>
    </div>
</template>