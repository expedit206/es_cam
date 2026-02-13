<template>
  <SeoHead v-bind="seoMeta" />
  <StructuredData
    :type="structuredData.type as any"
    :data="structuredData.data"
  />

  <div class="h-full pb- lg:pb-0 bg-background">
    <header
      class="relative bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden rounded-b-[3rem] lg:rounded-b-[4rem] shadow-2xl"
    >
      <div class="absolute inset-0 z-0 overflow-hidden">
        <div
          class="absolute -top-24 -right-24 w-96 h-96 bg-secondary/30 rounded-full blur-[120px] opacity-10 animate-pulse"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500 rounded-full blur-[100px] opacity-10"
        ></div>
      </div>

      <div class="container mx-auto px-4 py-2 lg:py-4 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          <div class="text-center lg:text-left space-y-2 animate-fade-in-left">
            <div
              class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-inner"
            >
              <span class="flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-secondary opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2 w-2 bg-secondary"
                ></span>
              </span>
              <span
                class="text-xs sm:text-sm font-semibold tracking-wide uppercase font-heading"
                >1ère Marketplace locale au Cameroun 🇨🇲</span
              >
            </div>

            <h1
              class="text-sm sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-[1.1] text-white font-heading"
            >
              Vendez et Achetez <br />
              <span
                class="text-base sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200"
              >
                entre particuliers
              </span>
            </h1>

            <p
              class="text-sm sm:text-lg text-emerald-50/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light font-body"
            >
              La communauté de confiance pour faire de bonnes affaires au
              Cameroun. Postez votre annonce en 2 minutes ou dénichez la perle
              rare.
            </p>

            <!-- BARRE DE RECHERCHE + BOUTONS ACTION -->
            <div class="space-y-4">
              <!-- Barre de recherche intégrée -->
              <div
                class="relative max-w-lg bg-surface p-1.5 rounded-2xl shadow-xl flex items-center transform transition-transform focus-within:scale-105"
              >
                <i class="fas fa-search text-gray-400 ml-3 text-lg"></i>
                <input
                  type="text"
                  placeholder="Que recherchez-vous ? (ex: iPhone, Robe...)"
                  class="flex-1 w-full bg-transparent border-none focus:ring-0 text-foreground placeholder-gray-400 font-medium px-3 py-2 font-body"
                  @keyup.enter="router.push('/market-place')"
                />
                <RouterLink
                  to="/market-place"
                  class="bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-primary-light transition-colors font-heading"
                >
                  Trouver
                </RouterLink>
              </div>

              <!-- Action Rapide Vendeur -->
              <div class="flex items-center gap-3 pt-1">
                <span class="text-emerald-100 text-sm font-medium font-body"
                  >Ou voulez-vous vendre ?</span
                >
                <RouterLink
                  to="/gallery"
                  class="inline-flex items-center gap-2 bg-secondary text-primary-dark px-4 py-1.5 rounded-full font-bold text-xs hover:bg-yellow-300 transition-all shadow-lg active:scale-95 font-heading"
                >
                  <i class="fas fa-plus-circle"></i>
                  <span>Déposer une annonce</span>
                </RouterLink>
              </div>
            </div>

            <!-- TRUST SIGNALS C2C -->
            <div class="pt-4 grid grid-cols-3 gap-2 border-t border-white/10">
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5 mb-1">
                  <i class="fas fa-check-circle text-secondary text-sm"></i>
                  <span class="font-bold text-sm text-white font-heading"
                    >Vérifié</span
                  >
                </div>
                <div
                  class="text-[10px] text-emerald-200 leading-tight font-body"
                >
                  Profils vendeurs & acheteurs
                </div>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5 mb-1">
                  <i class="fas fa-comments text-secondary text-sm"></i>
                  <span class="font-bold text-sm text-white font-heading"
                    >Direct</span
                  >
                </div>
                <div
                  class="text-[10px] text-emerald-200 leading-tight font-body"
                >
                  Chat sécurisé intégré
                </div>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5 mb-1">
                  <i
                    class="fas fa-hand-holding-heart text-secondary text-sm"
                  ></i>
                  <span class="font-bold text-sm text-white font-heading"
                    >Gratuit</span
                  >
                </div>
                <div
                  class="text-[10px] text-emerald-200 leading-tight font-body"
                >
                  0% de commission
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION AVEC ANIMATION PARALLAX MOUSE-OVER -->
          <div class="hidden lg:block relative animate-fade-in-right">
            <div
              class="relative z-20 grid grid-cols-2 gap-4 p-4 perspective-1000"
              @mousemove="handleMouseMove"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
              ref="parallaxContainer"
            >
              <!-- Image principale (réagit au survol) -->
              <div
                class="col-span-2 relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20 transition-transform duration-300 ease-out cursor-pointer"
                :style="{
                  transform: `translate3d(${parallax.x * 5}px, ${parallax.y * 5}px, 20px) rotate3d(${-parallax.y * 0.1}, ${parallax.x * 0.1}, 0, 2deg)`,
                  zIndex: isHovered ? 30 : 20,
                  filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
                }"
                @mouseenter="setActiveImage('main')"
              >
                <img
                  src="../assets/images/market.jpg"
                  alt="Shopping au Cameroun"
                  class="w-full h-[280px] object-cover transition-transform duration-700"
                  :style="{
                    transform:
                      isHovered && activeImage === 'main'
                        ? 'scale(1.05)'
                        : 'scale(1)',
                  }"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent"
                ></div>
                <!-- Tag au survol -->
                <div
                  class="absolute top-4 right-4 bg-gradient-to-r from-secondary to-amber-500 text-primary-dark px-4 py-1 rounded-full text-xs font-bold transform transition-all duration-300 font-heading"
                  :style="{
                    opacity: isHovered && activeImage === 'main' ? 1 : 0,
                    transform:
                      isHovered && activeImage === 'main'
                        ? 'translateY(0)'
                        : 'translateY(-10px)',
                  }"
                >
                  Produits tendance
                </div>
              </div>

              <!-- Image secondaire gauche -->
              <div
                class="relative overflow-hidden rounded-2xl shadow-lg border-2 border-white/10 transition-all duration-300 ease-out cursor-pointer"
                :style="{
                  transform: `translate3d(${parallax.x * 3}px, ${parallax.y * 3}px, 15px)`,
                  zIndex: isHovered && activeImage === 'left' ? 25 : 10,
                }"
                @mouseenter="setActiveImage('left')"
              >
                <img
                  src="../assets/images/ordinateur.jpg"
                  alt="Ordinateurs et technologie"
                  class="w-full h-[200px] object-cover transition-transform duration-500"
                  :style="{
                    transform:
                      isHovered && activeImage === 'left'
                        ? 'scale(1.08)'
                        : 'scale(1)',
                  }"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent"
                ></div>
                <!-- Overlay texte -->
                <div
                  class="absolute bottom-4 left-4 text-white transition-all duration-300"
                  :style="{
                    opacity: isHovered && activeImage === 'left' ? 1 : 0.8,
                    transform:
                      isHovered && activeImage === 'left'
                        ? 'translateY(0)'
                        : 'translateY(5px)',
                  }"
                >
                  <div class="text-sm font-bold font-heading">Électronique</div>
                  <div class="text-xs font-body">À partir de 50.000 FCFA</div>
                </div>
              </div>

              <!-- Image secondaire droite -->
              <div
                class="relative overflow-hidden rounded-2xl shadow-lg border-2 border-white/10 transition-all duration-300 ease-out cursor-pointer"
                :style="{
                  transform: `translate3d(${parallax.x * 2}px, ${parallax.y * 2}px, 10px)`,
                  zIndex: isHovered && activeImage === 'right' ? 25 : 5,
                }"
                @mouseenter="setActiveImage('right')"
              >
                <img
                  src="../assets/images/montre.jpg"
                  alt="Montres et accessoires"
                  class="w-full h-[200px] object-cover transition-transform duration-500"
                  :style="{
                    transform:
                      isHovered && activeImage === 'right'
                        ? 'scale(1.08)'
                        : 'scale(1)',
                  }"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent"
                ></div>
                <!-- Overlay texte -->
                <div
                  class="absolute bottom-4 left-4 text-white transition-all duration-300"
                  :style="{
                    opacity: isHovered && activeImage === 'right' ? 1 : 0.8,
                    transform:
                      isHovered && activeImage === 'right'
                        ? 'translateY(0)'
                        : 'translateY(5px)',
                  }"
                >
                  <div class="text-sm font-bold font-heading">Accessoires</div>
                  <div class="text-xs font-body">Styles tendance</div>
                </div>
              </div>

              <!-- Effet de lumière au survol -->
              <div
                class="absolute inset-0 pointer-events-none transition-opacity duration-300"
                :style="{
                  opacity: isHovered ? 0.3 : 0,
                  background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(250, 204, 21, 0.3) 0%, transparent 50%)`,
                }"
              ></div>
            </div>
          </div>
          <!-- FIN SECTION ANIMATION -->
        </div>
      </div>
    </header>

    <!-- RECENT PRODUCTS -->
    <section class="pt-2 pb-3 bg-surface border-t border-border">
      <div class="container mx-auto px-4">
        <div class="flex items-end justify-between mb-4">
          <div>
            <h2
              class="text-lg md:text-lg font-bold text-foreground font-heading"
            >
              Nouveautés
            </h2>
            <p class="text-xs sm:text-sm text-foreground-muted mt-1 font-body">
              Dénichez les pépites fraîchement publiées
            </p>
          </div>
        </div>

        <ProductGrid :products="recentProducts" :is-loading="isLoading">
          <template #empty>
            <div
              class="text-center py-8 text-foreground-muted bg-background rounded-xl mt-4 border border-dashed border-border"
            >
              <div class="text-4xl mb-3">📭</div>
              <p>Aucun produit pour le moment.</p>
              <RouterLink
                to="/gallery"
                class="text-primary font-bold hover:underline mt-2 inline-block"
                >Soyez le premier à publier !</RouterLink
              >
            </div>
          </template>
        </ProductGrid>

        <div class="mt-1 md:mt-3 text-center">
          <RouterLink
            to="/market-place"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface border border-border shadow-sm text-foreground-muted font-bold hover:bg-surface-hover hover:border-gray-300 transition-all active:scale-95"
          >
            <span>explorer les produits</span>
            <i class="fas fa-arrow-right text-xs"></i>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Reste du code inchangé... -->
    <!-- CATEGORIES -->
    <section class="py-1 pt-8 lg:py-8 -mt-4 relative z-20">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-6">
          <h2
            class="text-lg sm:text-2xl font-bold text-foreground flex items-center gap-2 font-heading"
          >
            <i class="fas fa-layer-group text-primary"></i>
            Parcourir par catégorie
          </h2>
          <RouterLink
            to="/categories"
            class="text-sm font-bold text-primary hover:text-primary-light transition-colors flex items-center gap-1 font-heading"
          >
            Tout voir <i class="fas fa-arrow-right text-xs"></i>
          </RouterLink>
        </div>

        <!-- Skeleton -->
        <div
          v-if="isLoading"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 pb-6"
        >
          <div
            v-for="i in 12"
            :key="i"
            class="h-24 bg-gray-200 rounded-xl animate-pulse"
          ></div>
        </div>
        <!-- List -->
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 pb-4"
        >
          <RouterLink
            v-for="cat in featuredCategories"
            :key="cat.id"
            :to="`/market-place?category=${cat.id}`"
            class="snap-start flex flex-col items-center gap-2 min-w-[5.5rem] group cursor-pointer"
          >
            <div
              class="w-full h-30 rounded-2xl bg-surface shadow-sm border border-border flex items-center justify-center group-hover:border-primary group-hover:shadow-md transition-all duration-300 group-active:scale-95 overflow-hidden relative"
            >
              <img
                v-if="cat.image"
                :src="cat.image"
                :alt="cat.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <i
                v-else
                :class="cat.icon || 'fas fa-tag'"
                class="text-2xl text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all duration-300"
              ></i>
            </div>
            <span
              class="text-xs font-semibold text-foreground-muted group-hover:text-primary text-center line-clamp-1 w-full transition-colors font-body"
            >
              {{ (cat as any).nom || (cat as any).name }}
            </span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section class="md:py-10 py-3 container mx-auto px-4">
      <div
        class="relative rounded-3xl overflow-hidden p-6 sm:p-12 shadow-2xl bg-gray-200"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full opacity-30 -translate-y-1/2 translate-x-1/2 blur-3xl"
        ></div>

        <div
          class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          <div class="max-w-xl">
            <span
              class="inline-block px-3 py-1 rounded bg-white/10 text-xs font-bold mb-4 backdrop-blur-sm border border-white/5 font-heading"
              >ASTUCE VENDEUR</span
            >
            <h3 class="text-xs sm:text-xl font-bold mb-3 font-heading">
              Donnez une seconde vie à vos objets
            </h3>
            <p class="text-primary text-xs font-body">
              Transformez ce que vous n'utilisez plus en cash. C'est gratuit,
              rapide et local.
            </p>
          </div>
          <RouterLink
            to="/gallery"
            class="flex-shrink-0 bg-secondary text-primary-dark px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-surface transition-all shadow-lg active:scale-95 text-md font-heading"
          >
            <i class="fas fa-camera text-md"></i>
            <span>Publier une annonce</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- BLOG / NEWS -->
    <section class="py-3 md:py-6 mb-5 bg-background">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-sm sm:text-xl font-bold text-foreground font-heading">
            Actualités & Conseils
          </h2>
          <RouterLink
            to="/blog"
            class="text-xs font-bold text-primary hover:underline font-heading"
          >
            Tout lire <i class="fas fa-chevron-right ml-1 text-xs"></i>
          </RouterLink>
        </div>

        <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div
            v-for="i in 3"
            :key="i"
            class="h-64 bg-gray-200 rounded-xl animate-pulse"
          ></div>
        </div>

        <div
          v-else-if="latestPosts.length > 0"
          class="grid grid-cols-2 md:grid-cols-5 gap-3"
        >
          <article
            v-for="post in latestPosts"
            :key="post.id"
            class="group bg-surface rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full border border-border"
          >
            <RouterLink
              :to="`/blog/${post.slug}`"
              class="relative overflow-hidden h-40 bg-gray-100 cursor-pointer"
            >
              <img
                v-if="post.image"
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-300"
              >
                <i class="fas fa-newspaper text-xl"></i>
              </div>
              <div
                class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"
              ></div>
              <span
                class="absolute bottom-3 left-3 text-white text-[5px] font-semibold px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg border border-white/20 font-body"
              >
                {{ new Date(post.published_at).toLocaleDateString("fr-FR") }}
              </span>
            </RouterLink>
            <div class="px-2 py-2 flex flex-col flex-1">
              <h3
                class="font-bold text-foreground text-xs mb-1 line-clamp-2 group-hover:text-primary transition-colors font-heading"
              >
                <RouterLink :to="`/blog/${post.slug}`">{{
                  post.title
                }}</RouterLink>
              </h3>
              <p
                class="text-xs text-foreground-muted line-clamp-3 mb-1 flex-1 leading-relaxed font-body"
              >
                {{
                  post.excerpt ||
                  "Découvrez cet article intéressant sur notre blog..."
                }}
              </p>
              <RouterLink
                :to="`/blog/${post.slug}`"
                class="text-primary font-bold text-xs hover:underline mt-auto flex items-center justify-between gap-3 font-heading"
              >
                Lire la suite
                <i
                  class="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"
                ></i>
              </RouterLink>
            </div>
          </article>
        </div>
        <div v-else class="text-center py-8 text-foreground-muted">
          Bientôt disponible.
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import SeoHead from "../components/SeoHead.vue";
import StructuredData from "../components/StructuredData.vue";
import ProductGrid from "../components/produits/ProductGrid.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted, computed, reactive } from "vue";
import { useMarketplaceStore } from "../stores/marketplace";
import { useBlogStore } from "../stores/blog";
import { useRouter } from "vue-router";
import { useI18n } from "../components/useI18n";

const { t } = useI18n();
const marketplaceStore = useMarketplaceStore();
const blogStore = useBlogStore();
const router = useRouter();

const isLoading = ref(true);
const parallaxContainer = ref<HTMLElement | null>(null);

// États pour l'animation parallax
const isHovered = ref(false);
const activeImage = ref<string | null>(null);
const mousePosition = reactive({ x: 0, y: 0 });
const parallax = reactive({ x: 0, y: 0 });

const recentProducts = computed(() => marketplaceStore.products.slice(0, 10));
const featuredCategories = computed(() =>
  marketplaceStore.categories.slice(0, 12),
);
const latestPosts = computed(() => blogStore.posts.slice(0, 3));

// Gestion de la souris pour l'effet parallax
const handleMouseMove = (event: MouseEvent) => {
  if (!parallaxContainer.value) return;

  const rect = parallaxContainer.value.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

  mousePosition.x = event.clientX - rect.left;
  mousePosition.y = event.clientY - rect.top;

  // Appliquer un easing pour un mouvement plus fluide
  parallax.x += (x - parallax.x) * 0.1;
  parallax.y += (y - parallax.y) * 0.1;
};

const handleMouseEnter = () => {
  isHovered.value = true;
};

const handleMouseLeave = () => {
  isHovered.value = false;
  activeImage.value = null;

  // Réinitialiser progressivement l'effet parallax
  const resetParallax = () => {
    parallax.x *= 0.9;
    parallax.y *= 0.9;

    if (Math.abs(parallax.x) > 0.01 || Math.abs(parallax.y) > 0.01) {
      requestAnimationFrame(resetParallax);
    } else {
      parallax.x = 0;
      parallax.y = 0;
    }
  };

  resetParallax();
};

const setActiveImage = (image: string) => {
  activeImage.value = image;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      marketplaceStore.fetchMarketplaceData(),
      blogStore.fetchPosts(),
    ]);
  } catch (e) {
    console.error("Error loading home data", e);
  } finally {
    isLoading.value = false;
  }
});

const viewProduct = (product: any) => {
  router.push(`/produits/${product.id}`);
};

// SEO
const seoMeta = ref({
  title: "EspaceCameroun - Marketplace locale au Cameroun",
  description:
    "Vendez et achetez directement entre Camerounais. Publiez gratuitement vos annonces et discutez via notre chat intégré.",
  keywords:
    "marketplace cameroun, vendre cameroun, acheter cameroun, petites annonces",
});

const structuredData = ref({
  type: "website",
  data: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EspaceCameroun",
    description: "Marketplace locale au Cameroun",
    url: "https://espacecameroun.com",
  },
});
</script>

<style scoped>
:root {
  --espace-vert: #14532d;
  --espace-or: #facc15;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Animations */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
}
.animate-pulse-slow {
  animation: pulse-slow 5s ease-in-out infinite;
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
}

@keyframes fade-in-left {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-fade-in-left {
  animation: fade-in-left 0.8s ease-out forwards;
}

@keyframes fade-in-right {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-fade-in-right {
  animation: fade-in-right 0.8s ease-out forwards;
}

/* Animation pour l'effet perspective 3D */
.perspective-1000 {
  perspective: 1000px;
}

/* Effets de transition améliorés */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Amélioration du rendu 3D */
.transform-3d {
  transform-style: preserve-3d;
}

/* Effet de brillance au survol */
.hover-glow {
  box-shadow: 0 0 20px rgba(250, 204, 21, 0.3);
}

/* Délais d'animation */
.delay-100 {
  animation-delay: 0.1s;
}
.delay-200 {
  animation-delay: 0.2s;
}
.delay-300 {
  animation-delay: 0.3s;
}

/* Correction pour les images dans la grille */
.w-35 {
  width: 8.5rem;
}

@media (max-width: 640px) {
  .w-35 {
    width: 4.5rem;
    height: 4.5rem;
  }
}

/* Amélioration du contraste pour les textes sur fond sombre */
.text-emerald-50\/80 {
  color: rgba(236, 253, 245, 0.8);
}

/* Effet de relief pour les cartes */
.shadow-xl {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Transition plus fluide pour les effets de survol */
.group-hover\:scale-110 {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation pour le curseur de la souris */
@keyframes cursor-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: cursor-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
