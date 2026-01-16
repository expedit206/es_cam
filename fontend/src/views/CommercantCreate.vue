<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../api/index';
import emailjs from '@emailjs/browser';
import SeoHead from '../components/SeoHead.vue';
import StructuredData from '../components/StructuredData.vue';
import { useI18n } from '../components/useI18n';

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

// Données du formulaire
const commerçant = ref({
    nom: '',
    ville: '',
    email: '',
    telephone: '',
    photo: null as File | null,
});
const isLoading = ref(false);
const errors = ref<{ [key: string]: string }>({});

// Gestion de l'upload de la photo
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        commerçant.value.photo = target.files[0];
    }
};

const sendVerificationEmail = async (email: string, code: string) => {
    try {
        await emailjs.send("service_1snmf7w", "template_4mjsqph", {
            to_name: email,
            code: code,
        });
        toast.success(t('verification_code_sent'));
    } catch (error) {
        toast.error(t('email_send_error'));
    }
};

// Soumettre le formulaire
const submitForm = async () => {
    isLoading.value = true;
    errors.value = {};

    try {
        const formData = new FormData();
        formData.append('nom', commerçant.value.nom);
        formData.append('ville', commerçant.value.ville);
        formData.append('email', commerçant.value.email);
        formData.append('telephone', commerçant.value.telephone);
        if (commerçant.value.photo) {
            formData.append('photo', commerçant.value.photo);
        }

        const response = await apiClient.post('/commercants', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        await sendVerificationEmail(response.data.commercant.email, response.data.verification_code);

        router.push('/profil');
    } catch (error: any) {
        if (error.response?.data?.message == 'Unauthenticated.') {
            router.push('login')
        }

        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        } else {
            toast.error(t('merchant_creation_error'));
        }
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <SeoHead :title="t('become_merchant') + ' - Espace Cameroun Marketplace'"
        :description="t('merchant_creation_description')"
        keywords="devenir commerçant cameroun, créer boutique en ligne, vente produits cameroun, marketplace camerounaise, entrepreneuriat digital, ecommerce cameroun, inscription commerçant"
        image="/images/commercant-creation-og.jpg" url="https://espacecameroun.com/creer-commercant" type="website" />

    <StructuredData type="service" :data="{
        name: t('merchant_account_creation'),
        description: t('merchant_registration_service')
    }" />

    <div class="overflow-y-scroll bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-2xl">
            <!-- Titre -->
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6 font-poppins">
                <i class="fas fa-store mr-2 text-[var(--espace-or)]"></i> {{ t('create_merchant') }}
            </h1>

            <!-- Formulaire -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <form @submit.prevent="submitForm" class="space-y-6">
                    <!-- Nom -->
                    <div>
                        <label for="nom" class="block text-sm font-medium text-[var(--espace-vert)]">
                            {{ t('name') }} *
                        </label>
                        <input v-model="commerçant.nom" id="nom" type="text"
                            class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                            :placeholder="t('merchant_name_placeholder')" required />
                        <span v-if="errors.nom" class="text-red-500 text-xs">{{ errors.nom }}</span>
                    </div>

                    <!-- Ville -->
                    <div>
                        <label for="ville" class="block text-sm font-medium text-[var(--espace-vert)]">
                            {{ t('city') }} *
                        </label>
                        <input v-model="commerçant.ville" id="ville" type="text"
                            class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                            :placeholder="t('city_placeholder')" required />
                        <span v-if="errors.ville" class="text-red-500 text-xs">{{ errors.ville }}</span>
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-[var(--espace-vert)]">
                            {{ t('email') }}
                        </label>
                        <input v-model="commerçant.email" id="email" type="email"
                            class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                            placeholder="email@exemple.com" />
                        <span v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</span>
                    </div>

                    <!-- Téléphone -->
                    <div>
                        <label for="telephone" class="block text-sm font-medium text-[var(--espace-vert)]">
                            {{ t('phone') }}
                        </label>
                        <input v-model="commerçant.telephone" id="telephone" type="tel"
                            class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                            :placeholder="t('phone_placeholder')" />
                        <span v-if="errors.telephone" class="text-red-500 text-xs">{{ errors.telephone }}</span>
                    </div>

                    <!-- Photo -->
                    <div>
                        <label for="photo" class="block text-sm font-medium text-[var(--espace-vert)]">
                            {{ t('profile_picture') }} ({{ t('optional') }})
                        </label>
                        <input id="photo" type="file" @change="handleFileChange"
                            class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                            accept="image/*" />
                        <span v-if="errors.photo" class="text-red-500 text-xs">{{ errors.photo }}</span>
                    </div>

                    <!-- Bouton de soumission -->
                    <div>
                        <button type="submit" :disabled="isLoading"
                            class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-white transition disabled:opacity-50">
                            <span v-if="isLoading">
                                <i class="fas fa-spinner animate-spin mr-2"></i> {{ t('creating_in_progress') }}
                            </span>
                            <span v-else>
                                <i class="fas fa-plus mr-2"></i> {{ t('create_merchant_button') }}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
    --espace-blanc: #ffffff;
    --espace-gris: #6b7280;
}

.font-poppins {
    font-family: 'Poppins', sans-serif;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 640px) {
    .container {
        padding: 0 1rem;
    }
}
</style>