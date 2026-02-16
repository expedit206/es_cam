<template>
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Progress Bar fine -->
    <div class="fixed top-0 left-0 w-full h-0.5 z-50 bg-gray-100">
      <div
        class="h-full bg-primary transition-all duration-150"
        :style="{ width: scrollProgress + '%' }"
      ></div>
    </div>

    <!-- Loading State compact -->
    <div
      v-if="blogStore.isLoading && !blogStore.currentPost"
      class="h-screen flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-2">
        <div
          class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"
        ></div>
        <p class="text-xs text-gray-500">Chargement...</p>
      </div>
    </div>

    <template v-else-if="post">
      <!-- Header compact -->
      <header class="pt-16 pb-8 md:pt-20 md:pb-12 border-b border-gray-100">
        <div class="max-w-4xl mx-auto px-4">
          <!-- Breadcrumbs minimal -->
          <nav class="flex items-center gap-1.5 text-[11px] text-gray-400 mb-6">
            <router-link to="/accueil" class="hover:text-primary"
              >Accueil</router-link
            >
            <i class="fas fa-chevron-right text-[8px]"></i>
            <router-link to="/blog" class="hover:text-primary"
              >Blog</router-link
            >
            <i class="fas fa-chevron-right text-[8px]"></i>
            <span class="text-gray-700 truncate max-w-[200px]">{{
              post.title
            }}</span>
          </nav>

          <!-- Title -->
          <h1
            class="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4"
          >
            {{ post.title }}
          </h1>

          <!-- Author & Meta compact -->
          <div
            class="flex items-center justify-between gap-4 pb-4 border-b border-gray-50"
          >
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img
                  v-if="post.author.photo"
                  :src="getImageUrl(post.author.photo)"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gray-700 text-white text-xs font-bold"
                >
                  {{ post.author.nom.charAt(0) }}
                </div>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-900">
                  {{ post.author.nom }}
                </p>
                <p class="text-[9px] text-gray-500">Auteur vérifié</p>
              </div>
            </div>

            <div class="flex items-center gap-3 text-[11px] text-gray-500">
              <span class="flex items-center gap-1">
                <i class="far fa-calendar text-[10px]"></i>
                {{ formatDateShort(post.published_at) }}
              </span>
              <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span class="flex items-center gap-1">
                <i class="far fa-clock text-[10px]"></i>
                {{ calculateReadTime(post.content) }} min
              </span>
              <span class="hidden sm:flex items-center gap-1">
                <i class="far fa-eye text-[10px]"></i>
                {{ post.views_count }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Image compact -->
      <div v-if="post.image" class="max-w-6xl mx-auto px-4 mt-6">
        <div class="relative aspect-video rounded-xl overflow-hidden shadow-lg">
          <img
            :src="getImageUrl(post.image)"
            :alt="post.title"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Article Content -->
      <main class="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <!-- Excerpt -->
        <div
          v-if="post.excerpt"
          class="text-base md:text-lg text-gray-600 font-medium leading-relaxed mb-8 italic border-l-3 border-primary pl-4"
        >
          {{ post.excerpt }}
        </div>

        <!-- Video -->
        <div
          v-if="post.video"
          class="mb-8 rounded-xl overflow-hidden shadow-lg aspect-video"
        >
          <video
            :src="post.video"
            controls
            class="w-full h-full object-contain"
          ></video>
        </div>

        <!-- Content -->
        <div
          class="article-body prose prose-sm md:prose-base max-w-none"
          v-html="post.content"
        ></div>

        <!-- Interaction bar compact -->
        <div
          class="mt-12 py-4 border-y border-gray-100 flex items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <button
              @click="toggleLike"
              :disabled="likeLoading"
              class="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all"
              :class="
                isLiked
                  ? 'bg-red-50 text-red-500'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              "
            >
              <i
                :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"
                class="text-sm"
              ></i>
              <span class="font-semibold">{{ likesCount }}</span>
            </button>

            <div
              class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-sm"
            >
              <i class="far fa-comment"></i>
              <span class="font-semibold">{{ commentsCount }}</span>
            </div>
          </div>

          <!-- Share buttons minimal -->
          <div class="flex items-center gap-1">
            <span class="text-[10px] text-gray-400 mr-1">Partager</span>
            <button
              class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all"
            >
              <i class="fab fa-facebook-f text-xs"></i>
            </button>
            <button
              class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
            >
              <i class="fab fa-whatsapp text-xs"></i>
            </button>
            <button
              @click="copyLink"
              class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all"
            >
              <i class="fas fa-link text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Back link -->
        <div class="mt-8">
          <router-link
            to="/blog"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary"
          >
            <i class="fas fa-arrow-left text-[10px]"></i>
            Retour aux articles
          </router-link>
        </div>

        <!-- Comments Section compact -->
        <section id="comments" class="mt-12">
          <h3
            class="text-base font-bold text-gray-900 mb-6 flex items-center gap-2"
          >
            <i class="far fa-comments text-primary"></i>
            Commentaires ({{ commentsCount }})
          </h3>

          <!-- Comment Form compact -->
          <div
            v-if="authStore.user"
            class="mb-8 bg-white border border-gray-100 rounded-xl p-4"
          >
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full overflow-hidden shrink-0">
                <img :src="userAvatar" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <textarea
                  v-model="newComment"
                  rows="2"
                  class="w-full bg-gray-50 border-0 rounded-lg p-3 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-primary outline-none resize-none"
                  placeholder="Votre commentaire..."
                ></textarea>
                <div class="flex justify-end mt-2">
                  <button
                    @click="submitComment"
                    :disabled="!newComment.trim() || submittingComment"
                    class="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
                  >
                    {{ submittingComment ? "..." : "Publier" }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="mb-8 bg-gray-50 p-6 rounded-xl text-center border border-dashed border-gray-200"
          >
            <p class="text-xs text-gray-500 mb-3">
              Connectez-vous pour commenter
            </p>
            <router-link
              to="/login"
              class="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-medium inline-block"
            >
              Se connecter
            </router-link>
          </div>

          <!-- Comments List compact -->
          <div class="space-y-6">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="flex flex-col gap-4"
            >
              <div class="flex gap-3">
                <div
                  class="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-100"
                >
                  <img
                    :src="
                      comment.user?.photo
                        ? getImageUrl(comment.user.photo)
                        : '/placeholder-avatar.png'
                    "
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <h4 class="text-xs font-bold text-gray-900">
                      {{ comment.user?.nom || "Anonyme" }}
                    </h4>
                    <span class="text-[9px] text-gray-400">{{
                      formatDateCompact(comment.created_at)
                    }}</span>
                  </div>
                  <div class="bg-gray-50 p-3 rounded-xl text-xs text-gray-700">
                    {{ comment.content }}
                  </div>
                  <div class="flex items-center gap-4 mt-1.5 ml-1">
                    <button
                      class="text-[9px] font-medium text-gray-400 hover:text-primary"
                    >
                      Utile
                    </button>
                    <button
                      @click="toggleReply(comment.id)"
                      class="text-[9px] font-medium text-gray-400 hover:text-primary"
                    >
                      {{ replyingTo === comment.id ? "Annuler" : "Répondre" }}
                    </button>
                  </div>

                  <!-- Reply Form inline -->
                  <div
                    v-if="replyingTo === comment.id"
                    class="mt-3 pl-4 border-l-2 border-gray-100"
                  >
                    <textarea
                      v-model="replyContent"
                      rows="2"
                      class="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs placeholder:text-gray-400 focus:ring-1 focus:ring-primary outline-none resize-none"
                      :placeholder="'Répondre à ' + comment.user?.nom + '...'"
                    ></textarea>
                    <div class="flex justify-end mt-2">
                      <button
                        @click="submitComment(comment.id)"
                        :disabled="!replyContent.trim() || submittingComment"
                        class="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
                      >
                        Répondre
                      </button>
                    </div>
                  </div>

                  <!-- Nested Replies -->
                  <div
                    v-if="comment.replies && comment.replies.length > 0"
                    class="mt-4 space-y-4 pl-4 border-l-2 border-gray-50"
                  >
                    <div
                      v-for="reply in comment.replies"
                      :key="reply.id"
                      class="flex gap-3"
                    >
                      <div
                        class="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-100"
                      >
                        <img
                          :src="
                            reply.user?.photo
                              ? getImageUrl(reply.user.photo)
                              : '/placeholder-avatar.png'
                          "
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div class="flex-1">
                        <div
                          class="flex items-center justify-between gap-2 mb-1"
                        >
                          <h4 class="text-[11px] font-bold text-gray-900">
                            {{ reply.user?.nom || "Anonyme" }}
                          </h4>
                          <span class="text-[8px] text-gray-400">{{
                            formatDateCompact(reply.created_at)
                          }}</span>
                        </div>
                        <div
                          class="bg-gray-50/50 p-2.5 rounded-xl text-[11px] text-gray-700"
                        >
                          {{ reply.content }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="comments.length < commentsCount"
              class="text-center pt-4"
            >
              <button
                @click="loadMoreComments"
                class="text-xs text-gray-500 hover:text-primary"
              >
                Voir plus de commentaires ↓
              </button>
            </div>

            <div
              v-if="comments.length === 0"
              class="text-center py-8 bg-gray-50 rounded-xl"
            >
              <p class="text-xs text-gray-400 italic">
                Soyez le premier à commenter
              </p>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer CTA compact -->
      <section class="bg-gray-900 py-12 md:py-16">
        <div class="max-w-5xl mx-auto px-4 text-center">
          <h2 class="text-lg md:text-2xl font-bold text-white mb-3">
            Prêt à booster votre commerce ?
          </h2>
          <p class="text-xs text-gray-400 mb-6 max-w-md mx-auto">
            Rejoignez des milliers de vendeurs sur Espace Cameroun
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <router-link
              to="/market-place"
              class="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:scale-105 transition-all"
            >
              Découvrir la Marketplace
            </router-link>
            <router-link
              to="/aide"
              class="bg-white/10 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
            >
              Guide du vendeur
            </router-link>
          </div>
        </div>
      </section>
    </template>

    <!-- 404 compact -->
    <div v-else class="h-screen flex items-center justify-center p-4">
      <div class="text-center">
        <div
          class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-exclamation-triangle text-red-400 text-xl"></i>
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-1">
          Article introuvable
        </h2>
        <p class="text-xs text-gray-500 mb-4 max-w-xs">
          Il a peut-être été déplacé ou supprimé
        </p>
        <router-link
          to="/blog"
          class="bg-primary text-white px-4 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1"
        >
          <i class="fas fa-arrow-left"></i> Retour au blog
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch, ref, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useBlogStore } from "../../stores/blog";
import { useAuthStore } from "../../stores/Auth";
import apiClient from "../../api/index";

const route = useRoute();
const blogStore = useBlogStore();
const authStore = useAuthStore();

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

const post = computed(() => blogStore.currentPost);
const userAvatar = computed(() =>
  authStore.user?.photo
    ? getImageUrl(authStore.user.photo)
    : "/placeholder-avatar.png",
);

const isLiked = ref(false);
const likesCount = ref(0);
const likeLoading = ref(false);

const comments = ref<any[]>([]);
const commentsCount = ref(0);
const newComment = ref("");
const replyingTo = ref<number | null>(null);
const replyContent = ref("");
const submittingComment = ref(false);
const commentsPage = ref(1);

const scrollProgress = ref(0);

const handleScroll = () => {
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.pageYOffset / totalHeight) * 100;
  scrollProgress.value = Math.min(100, Math.max(0, progress));
};

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
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

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      scrollProgress.value = 0;
      await blogStore.fetchPostBySlug(newSlug as string);
      if (post.value) {
        isLiked.value = post.value.is_liked || false;
        likesCount.value = post.value.likes_count || 0;
        commentsCount.value = post.value.comments_count || 0;
        comments.value = [];
        fetchComments(newSlug as string);
      }
    }
  },
);

const fetchComments = async (slug: string, page = 1) => {
  try {
    const response = await apiClient.get(
      `/blog/posts/${slug}/comments?page=${page}`,
    );
    if (page === 1) {
      comments.value = response.data.data.data;
    } else {
      comments.value = [...comments.value, ...response.data.data.data];
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

const loadMoreComments = () => {
  commentsPage.value++;
  fetchComments(route.params.slug as string, commentsPage.value);
};

const toggleLike = async () => {
  if (!authStore.user) return alert("Veuillez vous connecter");
  if (likeLoading.value || !post.value) return;

  likeLoading.value = true;
  try {
    const response = await apiClient.post(
      `/blog/posts/${post.value.slug}/like`,
    );
    isLiked.value = response.data.liked;
    likesCount.value = response.data.likes_count;
  } catch (error) {
    console.error("Error liking post:", error);
  } finally {
    likeLoading.value = false;
  }
};

const submitComment = async (parentId: number | null = null) => {
  if (!authStore.user || !post.value) return;

  const content = parentId ? replyContent.value : newComment.value;
  if (!content.trim()) return;

  submittingComment.value = true;
  try {
    const response = await apiClient.post(
      `/blog/posts/${post.value.slug}/comments`,
      {
        content: content,
        parent_id: parentId,
      },
    );

    if (parentId) {
      const parentComment = comments.value.find((c) => c.id === parentId);
      if (parentComment) {
        if (!parentComment.replies) parentComment.replies = [];
        parentComment.replies.push(response.data.data);
      }
      replyContent.value = "";
      replyingTo.value = null;
    } else {
      comments.value.unshift({ ...response.data.data, replies: [] });
      newComment.value = "";
    }
    commentsCount.value++;
  } catch (error) {
    console.error("Error submitting comment:", error);
    alert("Erreur lors de l'envoi");
  } finally {
    submittingComment.value = false;
  }
};

const toggleReply = (commentId: number) => {
  if (!authStore.user) return alert("Veuillez vous connecter pour répondre");
  replyingTo.value = replyingTo.value === commentId ? null : commentId;
  replyContent.value = "";
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

const formatDateCompact = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

const calculateReadTime = (content: string) => {
  if (!content) return 1;
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

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  alert("Lien copié !");
};
</script>

<style scoped>
@reference "../../assets/css/main.css";

.article-body :deep(h2) {
  @apply text-xl font-bold text-gray-900 mt-8 mb-4;
}

.article-body :deep(h3) {
  @apply text-lg font-bold text-gray-900 mt-6 mb-3;
}

.article-body :deep(p) {
  @apply text-sm text-gray-700 mb-5 leading-relaxed;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  @apply text-sm text-gray-700 mb-5 pl-4;
}

.article-body :deep(li) {
  @apply mb-1;
}

.article-body :deep(blockquote) {
  @apply border-l-3 border-primary bg-primary/5 p-4 rounded-lg text-gray-700 italic mb-5;
}

.article-body :deep(img) {
  @apply rounded-lg my-6 mx-auto;
}

.article-body :deep(a) {
  @apply text-primary hover:underline;
}
</style>
