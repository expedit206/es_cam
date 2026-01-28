<template>
  <SeoHead v-bind="seoMeta" />
  <StructuredData
    :type="structuredData.type as any"
    :data="structuredData.data"
  />

  <div class="bg-gray-00 h-full pb- lg:pb-0">
    <header
      class="relative bg-gradient-to-br from-[#14532d] to-emerald-950 text-white overflow-hidden rounded-b-[em] lg:rounded-b-[rem] shadow-2xl"
    >
      <div class="absolute inset-0 z-0 overflow-hidden">
        <div
          class="absolute -top-24 -right-24 w-96 h-96 bg-yellow-200/30 rounded-full blur-[120px] opacity-10 animate-pulse"
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
                  class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-yellow-400 opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"
                ></span>
              </span>
              <span
                class="text-xs sm:text-sm font-semibold tracking-wide uppercase"
                >1ère Marketplace locale au Cameroun 🇨🇲</span
              >
            </div>

            <h1
              class="text-sm sm:text-2xl lg:text-2xl font-extrabold tracking-tight leading-[1.1] text-white"
            >
              Vendez et Achetez <br />
              <span
                class="text-base text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200"
              >
                en toute simplicité
              </span>
            </h1>

            <p
              class="text-sm sm:text-lg text-emerald-50/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Rejoignez la communauté de référence pour faire de bonnes affaires
              près de chez vous. Publiez gratuitement et discutez en direct avec
              vos acheteurs.
            </p>

            <div
              class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start text-md"
            >
              <RouterLink
                to="/gallery"
                class="group bg-yellow-400 text-emerald-900 px-3 py-2 rounded-2xl font-bold text-lg hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-500/20 active:scale-95 flex items-center justify-center gap-3 text-sm"
              >
                <i class="fas fa-plus-circle"></i>
                <span>Je veux vendre</span>
              </RouterLink>
              <RouterLink
                to="/market-place"
                class="group bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-2 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-3 text-sm"
              >
                <i class="fas fa-search"></i>
                <span>Je cherche un produit</span>
              </RouterLink>
            </div>

            <div class="pt-3 grid grid-cols-3 gap-4 border-t border-white/10">
              <div>
                <div class="font-bold text-md md:text-2xl text-yellow-400">
                  0 FCFA
                </div>
                <div class="text-xs text-emerald-300">Gratuit</div>
              </div>
              <div>
                <div class="font-bold text-md md:text-2xl text-yellow-400">
                  100%
                </div>
                <div class="text-xs text-emerald-300">Sécurisé</div>
              </div>
              <div>
                <div class="font-bold text-md md:text-2xl text-yellow-400">
                  24/7
                </div>
                <div class="text-xs text-emerald-300">Support Client</div>
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
                  class="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent"
                ></div>
                <!-- Tag au survol -->
                <div
                  class="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-900 px-4 py-1 rounded-full text-xs font-bold transform transition-all duration-300"
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
                  class="absolute inset-0 bg-gradient-to-t from-emerald-800/50 to-transparent"
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
                  <div class="text-sm font-bold">Électronique</div>
                  <div class="text-xs">À partir de 50.000 FCFA</div>
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
                  class="absolute inset-0 bg-gradient-to-t from-emerald-800/50 to-transparent"
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
                  <div class="text-sm font-bold">Accessoires</div>
                  <div class="text-xs">Styles tendance</div>
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
    <section class="pt-2 pb-3 bg-white border-t border-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex items-end justify-between mb-4">
          <div>
            <h2 class="text-lg md:text-lg font-bold text-gray-900">
              Nouveautés
            </h2>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">
              Dénichez les pépites fraîchement publiées
            </p>
          </div>
        </div>

        <ProductGrid
          :products="recentProducts"
          :is-loading="isLoading"
        >
          <template #empty>
            <div
              class="text-center py-8 text-gray-500 bg-gray-50 rounded-xl mt-4 border border-dashed border-gray-200"
            >
              <div class="text-4xl mb-3">📭</div>
              <p>Aucun produit pour le moment.</p>
              <RouterLink
                to="/gallery"
                class="text-[var(--espace-vert)] font-bold hover:underline mt-2 inline-block"
                >Soyez le premier à publier !</RouterLink
              >
            </div>
          </template>
        </ProductGrid>

        <div class="mt-1 md:mt-3 text-center">
          <RouterLink
            to="/market-place"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
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
            class="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2"
          >
            <i class="fas fa-layer-group text-[var(--espace-vert)]"></i>
            Parcourir par catégorie
          </h2>
          <RouterLink
            to="/categories"
            class="text-sm font-bold text-[var(--espace-vert)] hover:text-emerald-700 transition-colors flex items-center gap-1"
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
              class="w-full h-30 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-[var(--espace-vert)] group-hover:shadow-md transition-all duration-300 group-active:scale-95 overflow-hidden relative"
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
                class="text-2xl text-gray-400 group-hover:text-[var(--espace-vert)] group-hover:scale-110 transition-all duration-300"
              ></i>
            </div>
            <span
              class="text-xs font-semibold text-gray-600 group-hover:text-[var(--espace-vert)] text-center line-clamp-1 w-full transition-colors"
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
          class="absolute top-0 right-0 w-64 h-64 bg-[var(--espace-vert)] rounded-full opacity-30 -translate-y-1/2 translate-x-1/2 blur-3xl"
        ></div>

        <div
          class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          <div class="max-w-xl">
            <span
              class="inline-block px-3 py-1 rounded bg-white/10 text-xs font-bold mb-4 backdrop-blur-sm border border-white/5"
              >ASTUCE VENDEUR</span
            >
            <h3 class="text-xs sm:text-xl font-bold mb-3">
              Donnez une seconde vie à vos objets
            </h3>
            <p class="text-[var(--espace-vert)] text-xs">
              Transformez ce que vous n'utilisez plus en cash. C'est gratuit,
              rapide et local.
            </p>
          </div>
          <RouterLink
            to="/gallery"
            class="flex-shrink-0 bg-[var(--espace-or)] text-gray-900 px-8 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-gray-100 transition-all shadow-lg active:scale-95 text-md"
          >
            <i class="fas fa-camera text-md"></i>
            <span>Publier une annonce</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- BLOG / NEWS -->
    <section class="py-3 md:py-6 mb-5 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-sm sm:text-xl font-bold text-gray-900">
            Actualités & Conseils
          </h2>
          <RouterLink
            to="/blog"
            class="text-xs font-bold text-[var(--espace-vert)] hover:underline"
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
            class="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full border border-gray-100"
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
                class="absolute bottom-3 left-3 text-white text-[5px] font-semibold px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg border border-white/20"
              >
                {{ new Date(post.published_at).toLocaleDateString("fr-FR") }}
              </span>
            </RouterLink>
            <div class="px-2 py-2 flex flex-col flex-1">
              <h3
                class="font-bold text-gray-900 text-xs mb-1 line-clamp-2 group-hover:text-[var(--espace-vert)] transition-colors"
              >
                <RouterLink :to="`/blog/${post.slug}`">{{
                  post.title
                }}</RouterLink>
              </h3>
              <p
                class="text-xs text-gray-500 line-clamp-3 mb-1 flex-1 leading-relaxed"
              >
                {{
                  post.excerpt ||
                  "Découvrez cet article intéressant sur notre blog..."
                }}
              </p>
              <RouterLink
                :to="`/blog/${post.slug}`"
                class="text-[var(--espace-vert)] font-bold text-xs hover:underline mt-auto flex items-center justify-between gap-3"
              >
                Lire la suite
                <i
                  class="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"
                ></i>
              </RouterLink>
            </div>
          </article>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          Bientôt disponible.
        </div>
      </div>
    </section>

    <footer
      class="relative bg-emerald-950 text-gray-300 pt-16 pb-8 overflow-hidden"
    >
      <div
        class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"
      ></div>

      <div class="container mx-auto px-4 relative z-10">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          <div class="space-y-6">
            <RouterLink
              to="/"
              class="inline-block transition-transform hover:scale-105"
            >
              <img
                src="/src/assets/images/logo/logo_blanc.png"
                class="h-10 w-auto"
                alt="EspaceCameroun"
              />
            </RouterLink>
            <p class="text-sm leading-relaxed text-emerald-100/70">
              La marketplace n°1 au Cameroun. Nous connectons les vendeurs et
              acheteurs locaux en toute sécurité. Transformez vos objets en
              opportunités.
            </p>
            <div class="flex gap-4">
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-emerald-900 transition-all duration-300"
              >
                <i class="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-emerald-900 transition-all duration-300"
              >
                <i class="fab fa-whatsapp"></i>
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-emerald-900 transition-all duration-300"
              >
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h5
              class="text-white font-bold text-base mb-6 flex items-center gap-2"
            >
              <span class="w-6 h-1 bg-yellow-400 rounded-full"></span>
              Marketplace
            </h5>
            <ul class="space-y-4">
              <li>
                <RouterLink
                  to="/market-place"
                  class="text-sm hover:text-yellow-400 hover:translate-x-1 inline-block transition-all"
                >
                  Toutes les annonces</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  to="/categories"
                  class="text-sm hover:text-yellow-400 hover:translate-x-1 inline-block transition-all"
                >
                  Parcourir par ville</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  to="/gallery"
                  class="text-sm hover:text-yellow-400 hover:translate-x-1 inline-block transition-all"
                >
                  Publier une annonce</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  to="/aide"
                  class="text-sm hover:text-yellow-400 hover:translate-x-1 inline-block transition-all"
                >
                  Conseils de sécurité</RouterLink
                >
              </li>
            </ul>
          </div>

          <div>
            <h5
              class="text-white font-bold text-base mb-6 flex items-center gap-2"
            >
              <span class="w-6 h-1 bg-yellow-400 rounded-full"></span>
              Besoin d'aide ?
            </h5>
            <ul class="space-y-4">
              <li class="flex items-start gap-3 group">
                <i class="fas fa-headset text-yellow-400 mt-1"></i>
                <RouterLink
                  to="/contact"
                  class="text-sm group-hover:text-yellow-400 transition-colors"
                  >Support Client 24/7</RouterLink
                >
              </li>
              <li class="flex items-start gap-3 group">
                <i class="fas fa-envelope text-yellow-400 mt-1"></i>
                <a
                  href="mailto:contact@espacecameroun.com"
                  class="text-sm group-hover:text-yellow-400 transition-colors"
                  >contact@espacecameroun.com</a
                >
              </li>
              <li class="flex items-start gap-3 group">
                <i class="fas fa-map-marker-alt text-yellow-400 mt-1"></i>
                <span class="text-sm italic">Douala, Cameroun</span>
              </li>
            </ul>
          </div>

          <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h5 class="text-white font-bold text-sm mb-4">RESTEZ INFORMÉ</h5>
            <p class="text-xs text-emerald-100/60 mb-4">
              Recevez les meilleures pépites directement par email.
            </p>
            <form class="space-y-2" @submit.prevent>
              <input
                type="email"
                placeholder="Votre email"
                class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
              />
              <button
                class="w-full bg-yellow-400 text-emerald-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-300 transition-all"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        <div
          class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div
            class="flex flex-col md:flex-row items-center gap-4 text-xs text-emerald-100/50"
          >
            <p>
              &copy; {{ new Date().getFullYear() }} EspaceCameroun. Tous droits
              réservés.
            </p>
            <div class="hidden md:block w-1 h-1 bg-white/20 rounded-full"></div>
            <div class="flex gap-4">
              <RouterLink to="/politique-utilisation" class="hover:underline"
                >Conditions</RouterLink
              >
              <RouterLink
                to="/politique-confidentialite"
                class="hover:underline"
                >Confidentialité
              </RouterLink>
            </div>
          </div>

          <div
            class="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10"
          >
            <span
              class="text-xs font-medium tracking-widest text-emerald-100/80"
              >MADE BY mciagnessi@gmail.com</span
            >
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import SeoHead from "../components/SeoHead.vue";
import StructuredData from "../components/StructuredData.vue";
import ProductGrid from "../components/produits/ProductGrid.vue";
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
