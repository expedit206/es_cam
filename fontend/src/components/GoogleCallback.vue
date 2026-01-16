<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api/index';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    // Extract token and user from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');
    const error = urlParams.get('error');

    if (error) {
      throw new Error(decodeURIComponent(error));
    }

    if (!token || !user) {
      throw new Error('Token ou données utilisateur manquants');
    }

    // Store token and user in authStore
    authStore.token = token;
    authStore.user = JSON.parse(decodeURIComponent(user));
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    toast.success('Bienvenue sur Espace Cameroun !');
    router.push({ name: 'home' });
  } catch (error: any) {
    toast.error(error.message || 'Erreur lors de la connexion avec Google');
    console.error(error);
    router.push('/login');
  }
});
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="text-center">
      <i class="fas fa-spinner fa-spin text-3xl text-[var(--espace-vert)]"></i>
      <p class="mt-4 text-[var(--espace-gris)]">Redirection en cours...</p>
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
</style>