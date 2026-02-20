<!-- src/components/Loader.vue -->
<script setup lang="ts">
import { useI18n } from "./useI18n";

defineProps<{
  isLoading: boolean;
}>();

const { t } = useI18n();
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-[var(--espace-white)] bg-opacity-50 flex items-center justify-center z-50"
      :aria-label="t('loading')"
      role="status"
    >
      <div class="relative p-6">
        <img
          src="/src/assets/images/logo/logo_vert.png"
          :alt="t('espace_cameroun_logo')"
          class="h-20 w-20 object-contain animate-spin-pulse"
        />
        <div
          class="absolute inset-0 rounded-full border-4 border-[var(--espace-vert)] border-t-transparent animate-spin"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
:root {
  --espace-vert: #14532d;
  --espace-or: #facc15;
  --espace-blanc: #ffffff;
  --espace-gris: #6b7280;
}

.animate-spin-pulse {
  animation:
    spin 2s linear infinite,
    pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
