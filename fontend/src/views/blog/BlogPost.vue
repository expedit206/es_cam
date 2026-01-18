<template>
    <div class="bg-gray-50 min-h-screen pb-12">
        <div v-if="blogStore.isLoading && !blogStore.currentPost" class="h-screen flex items-center justify-center">
             <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--espace-vert)]"></div>
        </div>

        <article v-else-if="post" class="max-w-4xl mx-auto bg-white shadow-sm min-h-screen sm:my-8 sm:rounded-xl overflow-hidden">
             <!-- Cover Image -->
            <div v-if="post.image" class="w-full h-64 md:h-96 relative">
                 <img :src="post.image" :alt="post.title" class="w-full h-full object-cover">
                 <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 <div class="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
                     <div class="container mx-auto">
                        <h1 class="text-3xl md:text-5xl font-bold mb-4 leading-tight">{{ post.title }}</h1>
                        <div class="flex items-center gap-4 text-sm md:text-base opacity-90">
                            <div class="flex items-center gap-2">
                                <img v-if="post.author.photo" :src="post.author.photo" class="w-8 h-8 rounded-full border-2 border-white">
                                <span class="font-medium">{{ post.author.nom }}</span>
                            </div>
                            <span>&bull;</span>
                            <span>{{ formatDate(post.published_at) }}</span>
                             <span>&bull;</span>
                             <span><i class="far fa-eye mr-1"></i> {{ post.views_count }} vues</span>
                        </div>
                     </div>
                 </div>
            </div>
            
            <!-- Fallback header if no image -->
            <div v-else class="bg-[var(--espace-vert)] text-white p-10 py-16">
                 <h1 class="text-3xl md:text-5xl font-bold mb-4 leading-tight">{{ post.title }}</h1>
                 <div class="flex items-center gap-4 text-sm md:text-base opacity-90">
                    <span class="font-medium">Par {{ post.author.nom }}</span>
                    <span>&bull;</span>
                    <span>{{ formatDate(post.published_at) }}</span>
                 </div>
            </div>

            <!-- Content -->
            <div class="p-6 md:p-10 lg:p-12">
                <!-- Excerpt -->
                <div v-if="post.excerpt" class="text-xl text-gray-600 font-serif leading-relaxed mb-8 border-l-4 border-[var(--espace-vert)] pl-4 italic">
                    {{ post.excerpt }}
                </div>
                
                <!-- Main Body -->
                <div class="prose prose-lg max-w-none prose-green text-gray-800" v-html="post.content"></div>
                
                <div class="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                    <router-link to="/blog" class="text-[var(--espace-vert)] font-bold hover:underline flex items-center gap-2">
                        <i class="fas fa-arrow-left"></i> Retour au blog
                    </router-link>
                    
                    <!-- Share buttons could go here -->
                </div>
            </div>
        </article>

        <div v-else class="text-center py-20">
            <h2 class="text-2xl font-bold text-gray-700">Article non trouvé</h2>
            <router-link to="/blog" class="block mt-4 text-[var(--espace-vert)] hover:underline">Retourner au blog</router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBlogStore } from '../../stores/blog';
import SeoHead from '../../components/SeoHead.vue';

const route = useRoute();
const blogStore = useBlogStore();

const post = computed(() => blogStore.currentPost);

onMounted(async () => {
    const slug = route.params.slug as string;
    if (slug) {
        await blogStore.fetchPostBySlug(slug);
    }
});

watch(() => route.params.slug, async (newSlug) => {
    if(newSlug) {
        await blogStore.fetchPostBySlug(newSlug as string);
    }
});

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
</script>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
}

/* Custom Prose overrides */
.prose img {
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
