<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
  >
    <!-- Section image avec ratio 4/3 -->
    <div class="relative aspect-[4/3] bg-gray-200"></div>

    <!-- Contenu -->
    <div class="p-3 space-y-3">
      <!-- Titre -->
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>

      <!-- Note et étoiles -->
      <div class="flex items-center gap-2">
        <div class="flex gap-1">
          <div
            v-for="i in 5"
            :key="i"
            class="w-2 h-2 bg-gray-200 rounded-full"
          ></div>
        </div>
        <div class="h-2 bg-gray-200 rounded w-8"></div>
      </div>

      <!-- Description -->
      <div class="space-y-1">
        <div class="h-2 bg-gray-200 rounded w-full"></div>
        <div class="h-2 bg-gray-200 rounded w-5/6"></div>
      </div>

      <!-- Compétences (tags) -->
      <div class="flex gap-1">
        <div class="w-10 h-3 bg-gray-200 rounded"></div>
        <div class="w-12 h-3 bg-gray-200 rounded"></div>
        <div class="w-8 h-3 bg-gray-200 rounded"></div>
      </div>

      <!-- Catégorie et expérience -->
      <div class="flex items-center justify-between pt-1">
        <div class="w-16 h-3 bg-gray-200 rounded-full"></div>
        <div class="w-12 h-2 bg-gray-200 rounded"></div>
      </div>

      <!-- Localisation -->
      <div class="flex items-center gap-1 pt-1">
        <div class="w-2 h-2 bg-gray-200 rounded-full"></div>
        <div class="w-20 h-2 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Skeleton loader component for Service Card
</script>

<style scoped>
/* Optional specific styles if needed */
</style>
