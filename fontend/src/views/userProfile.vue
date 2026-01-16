<template>
  <div class="p-6 space-y-6">
    <!-- Informations Personnelles -->
    <section class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ t('personal_information') }}
        </h2>
        <button v-if="!editProfile" @click="editProfile = true"
          class="text-[var(--espace-vert)] hover:text-green-700 transition-colors flex items-center space-x-2 text-sm">
          <i class="fas fa-edit"></i>
          <span>{{ t('edit') }}</span>
        </button>
      </div>

      <!-- Affichage des informations -->
      <div v-if="!editProfile" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('full_name') }}
            </label>
            <p class="text-gray-900 font-medium">{{ user?.nom }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('phone') }}
            </label>
            <p class="text-gray-900 font-medium">{{ user?.telephone || t('not_provided') }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('birth_date') }}
            </label>
            <p class="text-gray-900 font-medium">{{ user?.date_naissance ? formatDate(user.date_naissance) :
              t('not_provided') }}</p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('email') }}
            </label>
            <p class="text-gray-900 font-medium">
              {{ user?.email || t('not_provided') }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('city') }}
            </label>
            <p class="text-gray-900 font-medium">{{ user?.ville || t('not_provided') }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              {{ t('neighborhood') }}
            </label>
            <p class="text-gray-900 font-medium">{{ user?.quartier || t('not_provided') }}</p>
          </div>
        </div>
      </div>

      <!-- Formulaire d'édition -->
      <form v-else @submit.prevent="updateProfile" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label for="nom" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('full_name') }} *
              </label>
              <input v-model="profileForm.nom" id="nom" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] focus:border-transparent"
                :placeholder="t('full_name_placeholder')" />
            </div>
            <div>
              <label for="telephone" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('phone') }}
              </label>
              <input v-model="profileForm.telephone" id="telephone" type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] focus:border-transparent"
                :placeholder="t('phone_placeholder')" />
            </div>
            <div>
              <label for="date_naissance" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('birth_date') }}
              </label>
              <input v-model="profileForm.date_naissance" id="date_naissance" type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] focus:border-transparent" />
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('email') }}
              </label>
              <input v-model="profileForm.email" id="email" type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] focus:border-transparent"
                :placeholder="t('email_placeholder')" />
            </div>
            <div>
              <label for="ville" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('city') }}
              </label>
              <input v-model="profileForm.ville" id="ville" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] focus:border-transparent"
                :placeholder="t('city_placeholder')" />
            </div>
            <div>
              <label for="quartier" class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('neighborhood') }}
              </label>
              <input v-model="profileForm.quartier" id="quartier" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] focus:border-transparent"
                :placeholder="t('neighborhood_placeholder')" />
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button type="submit" :disabled="loadingProfile" :class="[
            'flex-1 bg-[var(--espace-vert)] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2',
            loadingProfile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
          ]">
            <i v-if="loadingProfile" class="fas fa-spinner fa-spin"></i>
            <span>{{ loadingProfile ? t('saving') : t('save') }}</span>
          </button>
          <button @click="editProfile = false" type="button"
            class="flex-1 bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors">
            {{ t('cancel') }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api/index';
import { useRouter } from 'vue-router';
import { useI18n } from '../components/useI18n';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// Props
const props = defineProps<{
  user: any;
}>();

// Émits
const emit = defineEmits(['updated']);

// États
const editProfile = ref(false);
const loadingProfile = ref(false);

// Formulaires
const profileForm = ref({
  nom: props.user?.nom || '',
  telephone: props.user?.telephone || '',
  email: props.user?.email || '',
  ville: props.user?.ville || '',
  quartier: props.user?.quartier || '',
  date_naissance: props.user?.date_naissance || '',
});

// Méthodes
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const updateProfile = async () => {
  loadingProfile.value = true;
  try {
    const response = await apiClient.post('/updateProfile', profileForm.value);
    if (props.user) {
      Object.assign(props.user, response.data.user);
    }
    authStore.user = response.data.user;
    editProfile.value = false;
    emit('updated', response.data.user);
    toast.success(t('profile_updated'));
  } catch (error: any) {
    if (error.response?.data?.message === 'Unauthenticated.') {
      router.push('/login');
    }
    toast.error(error.response?.data?.message || t('update_error'));
  } finally {
    loadingProfile.value = false;
  }
};

// Watchers
watch(() => props.user, (newUser) => {
  profileForm.value = {
    nom: newUser?.nom || '',
    telephone: newUser?.telephone || '',
    email: newUser?.email || '',
    ville: newUser?.ville || '',
    quartier: newUser?.quartier || '',
    date_naissance: newUser?.date_naissance || '',
  };
}, { immediate: true });
</script>