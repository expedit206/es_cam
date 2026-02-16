<template>
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Hero compact -->
    <div class="border-b border-gray-100 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div class="max-w-3xl">
          <span class="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
            Blog Espace Cameroun
          </span>
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Explorez, apprenez et <br class="hidden sm:block">
            <span class="text-primary">vendez mieux</span>
          </h1>
          <p class="text-sm text-gray-600 mt-3 max-w-2xl leading-relaxed">
            Actualités, conseils d'experts et guides pour booster votre activité.
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <!-- Loading State -->
      <div v-if="blogStore.isLoading && !blogStore.posts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="bg-white border border-gray-100 rounded-lg p-3 h-64 animate-pulse">
          <div class="w-full h-32 bg-gray-100 rounded-md mb-3"></div>
          <div class="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-100 rounded w-full mb-1"></div>
          <div class="h-3 bg-gray-100 rounded w-2/3"></div>
        </div>
      </div>

      <div v-else-if="blogStore.posts.length > 0">
        <!-- Featured Post Compact -->
        <section v-if="featuredPost" class="mb-6">
          <article class="bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 transition-colors">
            <div class="grid md:grid-cols-2">
              <!-- Image -->
              <router-link :to="`/blog/${featuredPost.slug}`" class="block h-48 md:h-auto bg-gray-100">
                <img 
                  v-if="featuredPost.image" 
                  :src="getImageUrl(featuredPost.image)" 
                  class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                  <i class="fas fa-image text-3xl"></i>
                </div>
              </router-link>
              
              <!-- Content -->
              <div class="p-5">
                <div class="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span>{{ formatDate(featuredPost.published_at) }}</span>
                  <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{{ calculateReadTime(featuredPost.content) }} min</span>
                  <span class="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">Une</span>
                </div>
                
                <h2 class="text-lg font-bold text-gray-900 mb-2 leading-snug">
                  <router-link :to="`/blog/${featuredPost.slug}`" class="hover:text-primary">
                    {{ featuredPost.title }}
                  </router-link>
                </h2>
                
                <p class="text-xs text-gray-600 line-clamp-2 mb-3">
                  {{ featuredPost.excerpt || stripHtml(featuredPost.content).substring(0, 120) + '...' }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                      <img v-if="featuredPost.author.photo" :src="getImageUrl(featuredPost.author.photo)" class="w-full h-full object-cover">
                      <div v-else class="w-full h-full flex items-center justify-center bg-gray-700 text-white text-[10px] font-bold">
                        {{ featuredPost.author.nom.charAt(0) }}
                      </div>
                    </div>
                    <span class="text-xs font-medium text-gray-700">{{ featuredPost.author.nom }}</span>
                  </div>
                  <router-link :to="`/blog/${featuredPost.slug}`" class="text-primary text-xs font-medium hover:underline">
                    Lire →
                  </router-link>
                </div>
              </div>
            </div>
          </article>
        </section>

        <!-- Grid Posts Compact -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article v-for="post in gridPosts" :key="post.id" 
            class="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 transition-all">
            
            <!-- Image -->
            <router-link :to="`/blog/${post.slug}`" class="block h-36 bg-gray-100 relative overflow-hidden">
              <img 
                v-if="post.image" 
                :src="getImageUrl(post.image)" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                <i class="fas fa-newspaper text-2xl"></i>
              </div>
              <span v-if="post.video" class="absolute bottom-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                <i class="fas fa-play text-[8px] text-primary ml-0.5"></i>
              </span>
            </router-link>
            
            <!-- Content -->
            <div class="p-3">
              <div class="flex items-center gap-2 text-[10px] text-gray-500 mb-1">
                <span>{{ formatDateShort(post.published_at) }}</span>
                <span class="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
                <span>{{ calculateReadTime(post.content) }} min</span>
              </div>
              
              <h3 class="text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">
                <router-link :to="`/blog/${post.slug}`" class="hover:text-primary">
                  {{ post.title }}
                </router-link>
              </h3>
              
              <p class="text-[11px] text-gray-600 line-clamp-2 mb-2">
                {{ post.excerpt || stripHtml(post.content).substring(0, 80) + '...' }}
              </p>
              
              <div class="flex items-center justify-between mt-1">
                <div class="flex items-center gap-1">
                  <div class="w-4 h-4 rounded-full bg-gray-200 overflow-hidden">
                    <img v-if="post.author.photo" :src="getImageUrl(post.author.photo)" class="w-full h-full object-cover">
                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-600 text-white text-[6px] font-bold">
                      {{ post.author.nom.charAt(0) }}
                    </div>
                  </div>
                  <span class="text-[10px] text-gray-600 truncate max-w-[80px]">{{ post.author.nom }}</span>
                </div>
                <span class="text-[10px] text-primary font-medium transition-opacity">
                  Lire →
                </span>
              </div>
            </div>
          </article>
        </div>

        <!-- Pagination Compact -->
        <div v-if="blogStore.pagination.lastPage > 1" class="mt-8 flex justify-center">
          <div class="inline-flex items-center gap-1 p-1 bg-gray-50 rounded-lg border border-gray-100">
            <button 
              @click="changePage(blogStore.pagination.currentPage - 1)"
              :disabled="blogStore.pagination.currentPage === 1"
              class="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-600 hover:bg-white disabled:opacity-30"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <span class="text-xs text-gray-600 px-2">
              {{ blogStore.pagination.currentPage }} / {{ blogStore.pagination.lastPage }}
            </span>
            
            <button 
              @click="changePage(blogStore.pagination.currentPage + 1)"
              :disabled="blogStore.pagination.currentPage === blogStore.pagination.lastPage"
              class="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-600 hover:bg-white disabled:opacity-30"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State Compact -->
      <div v-else class="text-center py-12 max-w-md mx-auto">
        <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <i class="fas fa-newspaper text-gray-300"></i>
        </div>
        <h3 class="text-sm font-bold text-gray-900 mb-1">Aucun article pour le moment</h3>
        <p class="text-xs text-gray-500">Revenez bientôt pour découvrir nos actualités.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useBlogStore } from "../../stores/blog";

const blogStore = useBlogStore();

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

const featuredPost = computed(() => {
  return blogStore.posts.length > 0 && blogStore.pagination.currentPage === 1 
    ? blogStore.posts[0] 
    : null;
});

const gridPosts = computed(() => {
  if (blogStore.posts.length > 0 && blogStore.pagination.currentPage === 1) {
    return blogStore.posts.slice(1);
  }
  return blogStore.posts;
});

onMounted(async () => {
  await blogStore.fetchPosts();
});

const changePage = async (page: number) => {
  if (page >= 1 && page <= blogStore.pagination.lastPage) {
    await blogStore.fetchPosts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { 
    day: "numeric", 
    month: "short", 
    year: "numeric" 
  });
};

const formatDateShort = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
  
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff < 7) return `Il y a ${diff} jours`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
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
</script>