<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 overflow-hidden animate-in fade-in duration-200"
    >
      <!-- Header avec input de recherche -->
      <div class="p-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <i class="fas fa-search text-gray-400"></i>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un article..."
            class="flex-1 bg-transparent outline-none text-lg text-gray-900 placeholder-gray-400"
            @input="handleSearch"
            @keydown.escape="closeModal"
            autofocus
          />
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 p-1"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Résultats ou état vide -->
      <div class="max-h-96 overflow-y-auto">
        <!-- Loading State -->
        <div v-if="blogStore.isSearching" class="p-6 text-center">
          <div class="flex justify-center mb-3">
            <div
              class="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"
            ></div>
          </div>
          <p class="text-sm text-gray-500">Recherche en cours...</p>
        </div>

        <!-- Résultats -->
        <div
          v-else-if="blogStore.searchResults.length > 0"
          class="divide-y divide-gray-100"
        >
          <router-link
            v-for="post in blogStore.searchResults"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            @click="closeModal"
            class="p-4 hover:bg-gray-50 transition-colors flex gap-4 group"
          >
            <!-- Image -->
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                <img
                  v-if="post.image"
                  :src="getImageUrl(post.image)"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-300"
                >
                  <i class="fas fa-image"></i>
                </div>
              </div>
            </div>

            <!-- Contenu -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                {{ post.title }}
              </h3>
              <p class="text-sm text-gray-600 line-clamp-2 mt-1">
                {{
                  post.excerpt ||
                  stripHtml(post.content).substring(0, 100) + "..."
                }}
              </p>
              <div class="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <span>{{ formatDate(post.published_at) }}</span>
                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{{ calculateReadTime(post.content) }} min</span>
              </div>
            </div>
          </router-link>
        </div>

        <!-- État vide -->
        <div
          v-else-if="searchQuery && !blogStore.isSearching"
          class="p-8 text-center"
        >
          <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-search text-gray-300 text-xl"></i>
          </div>
          <p class="text-gray-600">
            Aucun article trouvé pour "<span class="font-semibold">{{ searchQuery }}</span>"
          </p>
        </div>

        <!-- État initial -->
        <div v-else class="p-8 text-center">
          <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-pen text-gray-300 text-xl"></i>
          </div>
          <p class="text-gray-600">Commencez à taper pour rechercher un article</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useBlogStore } from "../../stores/blog";
import { debounce } from "../../utils/debounce";

const blogStore = useBlogStore();
const searchQuery = ref("");
const searchInput = ref<HTMLInputElement | null>(null);

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  blogStore.clearSearchResults();
  searchQuery.value = "";
  emit("close");
};

const handleSearch = debounce(async () => {
  if (searchQuery.value.trim()) {
    await blogStore.searchPosts(searchQuery.value);
  } else {
    blogStore.clearSearchResults();
  }
}, 300);

const getStorageBaseUrl = () => {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8000/storage/";
  }
  return "https://api.espacecameroun.com/storage/";
};

const storageUrl = getStorageBaseUrl();

const getImageUrl = (path: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return storageUrl + (path.startsWith("/") ? path.substring(1) : path);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const calculateReadTime = (content: string) => {
  const text = stripHtml(content);
  const wpm = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wpm) || 1;
};

const stripHtml = (html: string) => {
  if (!html) return "";
  let tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      // Focus l'input quand le modal s'ouvre
      await nextTick();
      searchInput.value?.focus();
    }
  }
);
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-in {
  animation: fade-in 0.2s ease-out;
}
</style>
