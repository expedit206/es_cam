<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/Auth";
import apiClient from "../api/index";
import { useI18n } from "./useI18n";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const user = ref();
const jeton = ref();

watch(
  () => authStore.user,
  () => {
    user.value = authStore.user;
    // fetchJetons
  },
);

// // Initialisation au montage
onMounted(() => {});
</script>

<template>
  <div
    v-if="authStore.user"
    class="lg:hidden flex justify-end z-150 flex items-center gap-2 rounded-full px-4 pt-1"
  >
    <i class="fas fa-coins text-[var(--espace-or)] text-lg"></i>
    <span class="text-sm font-semibold text-[var(--espace-vert)]">
      <router-link to="/jeton-history">
        {{ t("tokens") }} :
        <span class="text-gray-800" v-if="user">{{ user.jetons }}</span>
      </router-link>
    </span>
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
  font-family: "Poppins", sans-serif;
}
</style>
