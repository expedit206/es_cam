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

                <!-- Video Player -->
                <div v-if="post.video" class="mb-10">
                    <video :src="post.video" controls class="w-full rounded-lg shadow-lg"></video>
                </div>
                
                <!-- Main Body -->
                <div class="prose prose-lg max-w-none prose-green text-gray-800" v-html="post.content"></div>
                
                <!-- Likes & Share -->
                <div class="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div class="flex items-center gap-4">
                        <button 
                            @click="toggleLike" 
                            class="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                            :class="isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                            :disabled="likeLoading"
                        >
                            <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'" class="text-xl"></i>
                            <span class="font-bold">{{ likesCount }}</span>
                        </button>
                        
                        <a href="#comments" class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                            <i class="far fa-comment text-xl"></i>
                            <span class="font-bold">{{ commentsCount }}</span>
                        </a>
                    </div>
                
                    <router-link to="/blog" class="text-[var(--espace-vert)] font-bold hover:underline flex items-center gap-2">
                        <i class="fas fa-arrow-left"></i> Retour au blog
                    </router-link>
                </div>

                <!-- Comments Section -->
                <div id="comments" class="mt-16">
                    <h3 class="text-2xl font-bold text-gray-800 mb-8">Commentaires ({{ commentsCount }})</h3>

                    <!-- Comment Form -->
                    <div v-if="authStore.user" class="mb-10 bg-gray-50 p-6 rounded-xl">
                        <div class="flex items-start gap-4">
                            <img :src="userAvatar" class="w-10 h-10 rounded-full object-cover">
                            <div class="flex-1">
                                <textarea 
                                    v-model="newComment" 
                                    rows="3" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none bg-white font-sans"
                                    placeholder="Ajouter un commentaire..."
                                ></textarea>
                                <div class="flex justify-end mt-2">
                                    <button 
                                        @click="submitComment" 
                                        :disabled="!newComment.trim() || submittingComment"
                                        class="bg-[var(--espace-vert)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0f3d21] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {{ submittingComment ? 'Envoi...' : 'Commenter' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="mb-10 bg-gray-50 p-6 rounded-xl text-center">
                        <p class="text-gray-600 mb-4">Connectez-vous pour participer à la discussion</p>
                        <router-link to="/login" class="inline-block bg-[var(--espace-vert)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0f3d21] transition-colors">
                            Se connecter
                        </router-link>
                    </div>

                    <!-- Comments List -->
                    <div class="space-y-6">
                        <div v-for="comment in comments" :key="comment.id" class="flex gap-4">
                            <img 
                                :src="comment.user?.photo ? storageUrl + comment.user.photo : '/placeholder-avatar.png'" 
                                class="w-10 h-10 rounded-full object-cover bg-gray-200 flex-shrink-0"
                            >
                            <div class="flex-1">
                                <div class="bg-gray-50 p-4 rounded-xl rounded-tl-none">
                                    <div class="flex items-center justify-between mb-2">
                                        <h4 class="font-bold text-gray-900">{{ comment.user?.nom || 'Utilisateur' }}</h4>
                                        <span class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</span>
                                    </div>
                                    <p class="text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div v-if="comments.length < commentsCount" class="text-center mt-6">
                            <button @click="loadMoreComments" class="text-[var(--espace-vert)] font-semibold hover:underline">
                                Voir plus de commentaires
                            </button>
                        </div>

                        <div v-if="comments.length === 0" class="text-center py-8 text-gray-500 italic">
                            Soyez le premier à commenter !
                        </div>
                    </div>
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
import { onMounted, computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useBlogStore } from '../../stores/blog';
import { useAuthStore } from '../../stores/Auth';
import apiClient from '../../api/index';
// @ts-ignore
const storageUrl = import.meta.env.VITE_STORAGE_URL;

const route = useRoute();
const blogStore = useBlogStore();
const authStore = useAuthStore();

const post = computed(() => blogStore.currentPost);
const userAvatar = computed(() => authStore.user?.photo ? storageUrl + authStore.user.photo : '/placeholder-avatar.png');

const isLiked = ref(false);
const likesCount = ref(0);
const likeLoading = ref(false);

const comments = ref<any[]>([]);
const commentsCount = ref(0);
const newComment = ref('');
const submittingComment = ref(false);
const commentsPage = ref(1);

onMounted(async () => {
    const slug = route.params.slug as string;
    if (slug) {
        await blogStore.fetchPostBySlug(slug);
        if (post.value) {
            isLiked.value = post.value.is_liked || false;
            likesCount.value = post.value.likes_count || 0;
            commentsCount.value = post.value.comments_count || 0;
            fetchComments(slug);
        }
    }
});

watch(() => route.params.slug, async (newSlug) => {
    if(newSlug) {
        await blogStore.fetchPostBySlug(newSlug as string);
        if (post.value) {
            isLiked.value = post.value.is_liked || false;
            likesCount.value = post.value.likes_count || 0;
            commentsCount.value = post.value.comments_count || 0;
            comments.value = [];
            fetchComments(newSlug as string);
        }
    }
});

const fetchComments = async (slug: string, page = 1) => {
    try {
        const response = await apiClient.get(`/blog/posts/${slug}/comments?page=${page}`);
        if (page === 1) {
            comments.value = response.data.data.data;
        } else {
            comments.value = [...comments.value, ...response.data.data.data];
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
};

const loadMoreComments = () => {
    commentsPage.value++;
    fetchComments(route.params.slug as string, commentsPage.value);
};

const toggleLike = async () => {
    if (!authStore.user) return alert('Veuillez vous connecter pour aimer cet article');
    if (likeLoading.value || !post.value) return;

    likeLoading.value = true;
    try {
        const response = await apiClient.post(`/blog/posts/${post.value.slug}/like`);
        isLiked.value = response.data.liked;
        likesCount.value = response.data.likes_count;
    } catch (error) {
        console.error('Error liking post:', error);
    } finally {
        likeLoading.value = false;
    }
};

const submitComment = async () => {
    if (!authStore.user) return;
    if (!newComment.value.trim() || !post.value) return;

    submittingComment.value = true;
    try {
        const response = await apiClient.post(`/blog/posts/${post.value.slug}/comments`, {
            content: newComment.value
        });
        
        comments.value.unshift(response.data.data);
        commentsCount.value++;
        newComment.value = '';
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Erreur lors de l\'envoi du commentaire');
    } finally {
        submittingComment.value = false;
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
