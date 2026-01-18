<template>
    <div class="bg-gray-50 min-h-screen pb-12">
        <!-- Header -->
        <div class="bg-[var(--espace-vert)] text-white py-12">
            <div class="container mx-auto px-4 text-center">
                <h1 class="text-3xl md:text-4xl font-bold mb-4">Blog EspaceCameroun</h1>
                <p class="text-lg opacity-90 max-w-2xl mx-auto">
                    Conseils, astuces et actualités pour mieux vendre et acheter au Cameroun.
                </p>
            </div>
        </div>

        <!-- Content -->
        <div class="container mx-auto px-4 py-8">
            <div v-if="blogStore.isLoading && !blogStore.posts.length" class="space-y-4">
               <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow p-4 animate-pulse h-48"></div>
            </div>

            <div v-else-if="blogStore.posts.length > 0">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <article v-for="post in blogStore.posts" :key="post.id" 
                        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col h-full">
                        
                        <!-- Image -->
                        <div class="h-48 bg-gray-200 relative overflow-hidden group">
                           <router-link :to="`/blog/${post.slug}`">
                                <img v-if="post.image" :src="post.image" :alt="post.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                    <i class="fas fa-newspaper text-4xl"></i>
                                </div>
                           </router-link>
                        </div>

                        <!-- Body -->
                        <div class="p-5 flex-1 flex flex-col">
                            <div class="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                <i class="far fa-calendar-alt"></i>
                                <span>{{ formatDate(post.published_at) }}</span>
                            </div>
                            
                            <h2 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-[var(--espace-vert)]">
                                <router-link :to="`/blog/${post.slug}`">
                                    {{ post.title }}
                                </router-link>
                            </h2>
                            
                            <p class="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                {{ post.excerpt || stripHtml(post.content).substring(0, 100) + '...' }}
                            </p>
                            
                            <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div class="flex items-center gap-2">
                                    <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                         <img v-if="post.author.photo" :src="post.author.photo" class="w-full h-full object-cover">
                                         <div v-else class="w-full h-full flex items-center justify-center bg-[var(--espace-vert)] text-white text-xs font-bold">
                                            {{ post.author.nom.charAt(0) }}
                                         </div>
                                    </div>
                                    <span class="text-xs font-medium text-gray-700">{{ post.author.nom }}</span>
                                </div>
                                <router-link :to="`/blog/${post.slug}`" class="text-[var(--espace-vert)] text-sm font-semibold hover:underline">
                                    Lire la suite
                                </router-link>
                            </div>
                        </div>
                    </article>
                </div>
                
                <!-- Pagination -->
                <div v-if="blogStore.pagination.lastPage > 1" class="mt-8 flex justify-center">
                    <div class="flex gap-2">
                        <button 
                            @click="changePage(blogStore.pagination.currentPage - 1)"
                            :disabled="blogStore.pagination.currentPage === 1"
                            class="px-4 py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50">
                            Précédent
                        </button>
                        <span class="px-4 py-2">Page {{ blogStore.pagination.currentPage }} / {{ blogStore.pagination.lastPage }}</span>
                         <button 
                            @click="changePage(blogStore.pagination.currentPage + 1)"
                            :disabled="blogStore.pagination.currentPage === blogStore.pagination.lastPage"
                            class="px-4 py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50">
                            Suivant
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-20">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-feather text-gray-400 text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Aucun article pour le moment</h3>
                <p class="text-gray-500">Revenez bientôt pour découvrir nos nouveaux articles.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBlogStore } from '../../stores/blog';

const blogStore = useBlogStore();

onMounted(async () => {
    await blogStore.fetchPosts();
});

const changePage = (page: number) => {
    if (page >= 1 && page <= blogStore.pagination.lastPage) {
        blogStore.fetchPosts(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const stripHtml = (html: string) => {
   let tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
};
</script>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
}
</style>
