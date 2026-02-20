<template>
  <div class="flex items-center justify-between px-4 sm:px-0">
    <!-- Bouton Précédent -->
    <div class="flex flex-1 justify-start">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        :class="[
          'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200',
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900',
        ]"
      >
        <i class="fas fa-chevron-left mr-2 text-sm"></i>
        Précédent
      </button>
    </div>

    <!-- Pages - Visible sur desktop -->
    <div class="hidden md:flex">
      <div class="flex rounded-md shadow-sm">
        <!-- Première page -->
        <button
          v-if="showFirstPage"
          @click="goToPage(1)"
          :class="[
            'inline-flex items-center px-4 py-2 text-sm font-medium border transition-all duration-200',
            currentPage === 1
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
          ]"
        >
          1
        </button>

        <!-- Points de suspension après la première page -->
        <span
          v-if="showLeftEllipsis"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 border border-gray-300 bg-white"
        >
          ...
        </span>

        <!-- Pages du milieu -->
        <button
          v-for="page in middlePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'inline-flex items-center px-4 py-2 text-sm font-medium border transition-all duration-200',
            currentPage === page
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </button>

        <!-- Points de suspension avant la dernière page -->
        <span
          v-if="showRightEllipsis"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 border border-gray-300 bg-white"
        >
          ...
        </span>

        <!-- Dernière page -->
        <button
          v-if="showLastPage"
          @click="goToPage(totalPages)"
          :class="[
            'inline-flex items-center px-4 py-2 text-sm font-medium border transition-all duration-200',
            currentPage === totalPages
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
          ]"
        >
          {{ totalPages }}
        </button>
      </div>
    </div>

    <!-- Info mobile -->
    <div class="flex md:hidden">
      <span class="text-sm text-gray-700">
        Page {{ currentPage }} sur {{ totalPages }}
      </span>
    </div>

    <!-- Bouton Suivant -->
    <div class="flex flex-1 justify-end">
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        :class="[
          'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200',
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900',
        ]"
      >
        Suivant
        <i class="fas fa-chevron-right ml-2 text-sm"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";

interface Props {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 5,
});

const emit = defineEmits<{
  "page-change": [page: number];
}>();

// Calcul des pages à afficher
const middlePages = computed(() => {
  const pages = [];
  const half = Math.floor(props.maxVisiblePages / 2);

  let start = Math.max(1, props.currentPage - half);
  let end = Math.min(props.totalPages, start + props.maxVisiblePages - 1);

  // Ajuster le début si on est près de la fin
  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(1, end - props.maxVisiblePages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Affichage conditionnel des éléments
const showFirstPage = computed(() => {
  return middlePages.value[0] > 1;
});

const showLastPage = computed(() => {
  return middlePages.value[middlePages.value.length - 1] < props.totalPages;
});

const showLeftEllipsis = computed(() => {
  return middlePages.value[0] > 2;
});

const showRightEllipsis = computed(() => {
  return middlePages.value[middlePages.value.length - 1] < props.totalPages - 1;
});

// Navigation
const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("page-change", page);
  }
};

// Navigation au clavier
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      goToPage(props.currentPage - 1);
      break;
    case "ArrowRight":
      event.preventDefault();
      goToPage(props.currentPage + 1);
      break;
    case "Home":
      event.preventDefault();
      goToPage(1);
      break;
    case "End":
      event.preventDefault();
      goToPage(props.totalPages);
      break;
  }
};

// Écouter les événements clavier
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
/* Animation pour le changement de page */
button {
  transition: all 0.2s ease-in-out;
}

/* Focus visible pour l'accessibilité */
button:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Effet de scale au survol */
button:not(:disabled):hover {
  transform: translateY(-1px);
}
</style>
