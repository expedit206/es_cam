<template>
  <div class="min-h-screen bg-gray-50 relative">
    <SeoHead
      :title="seoTitle"
      :description="seoDescription"
      :image="seoImage"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-96">
      <Loader :isLoading="true" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
        <i
          class="fas fa-exclamation-triangle text-yellow-500 text-3xl sm:text-4xl mb-4"
        ></i>
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Produit non trouvé
        </h2>
        <p class="text-gray-600 text-sm sm:text-base mb-6">{{ error }}</p>
        <button
          @click="$router.back()"
          class="bg-[var(--espace-vert)] text-white px-4 sm:px-6 py-2 sm:py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
        >
          Retour
        </button>
      </div>
    </div>

    <!-- Product Details -->
    <div
      v-else-if="produit"
      class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6"
    >
      <!-- Breadcrumb -->
      <nav
        class="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 overflow-x-auto hide-scrollbar"
      >
        <router-link
          to="/"
          class="hover:text-[var(--espace-vert)] whitespace-nowrap"
          >Accueil</router-link
        >
        <i class="fas fa-chevron-right text-xs flex-shrink-0"></i>
        <router-link
          to="/"
          class="hover:text-[var(--espace-vert)] whitespace-nowrap"
          >Produits</router-link
        >
        <i class="fas fa-chevron-right text-xs flex-shrink-0"></i>
        <span
          class="text-gray-900 whitespace-nowrap truncate max-w-[120px] sm:max-w-none"
          >{{ produit?.category?.name }}</span
        >
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <!-- Colonne principale -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-6">
          <!-- Galerie d'images -->
          <div
            class="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden image-container"
          >
            <div class="relative">
              <!-- Image principale -->
              <div class="aspect-[4/3] sm:aspect-[16/9] bg-gray-100">
                <img
                  :src="currentImage"
                  :alt="produit?.nom"
                  class="w-full h-full object-contain"
                />
              </div>

              <!-- Indicateurs de slide pour mobile -->
              <div
                v-if="produit?.photos && produit?.photos.length > 1"
                class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:hidden"
              >
                <div
                  v-for="(_, index) in produit?.photos"
                  :key="index"
                  class="w-1.5 h-1.5 rounded-full transition-all"
                  :class="
                    currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                  "
                ></div>
              </div>

              <!-- Navigation desktop -->
              <button
                v-if="
                  produit?.photos &&
                  produit?.photos.length > 1 &&
                  currentImageIndex > 0
                "
                @click="currentImageIndex--"
                class="hidden sm:flex absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full items-center justify-center transition-all"
              >
                <i class="fas fa-chevron-left text-sm"></i>
              </button>
              <button
                v-if="
                  produit?.photos &&
                  produit?.photos.length > 1 &&
                  currentImageIndex < produit?.photos.length - 1
                "
                @click="currentImageIndex++"
                class="hidden sm:flex absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full items-center justify-center transition-all"
              >
                <i class="fas fa-chevron-right text-sm"></i>
              </button>
            </div>

            <!-- Miniatures - Desktop -->
            <div
              v-if="produit?.photos && produit?.photos.length > 1"
              class="hidden sm:flex space-x-2 p-3 sm:p-4 overflow-x-auto"
            >
              <button
                v-for="(image, index) in produit?.photos"
                :key="index"
                @click="currentImageIndex = index"
                :class="[
                  'flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all',
                  currentImageIndex === index
                    ? 'border-[var(--espace-vert)]'
                    : 'border-transparent hover:border-gray-300',
                ]"
              >
                <img
                  :src="image"
                  :alt="`${produit?.nom} - Image ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          <!-- Informations détaillées -->
          <div
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <!-- EN-TÊTE : Nom + Badge -->
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 gap-2 sm:gap-0"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h1
                    class="text-lg sm:text-xl font-bold text-gray-900 leading-tight truncate"
                  >
                    {{ produit?.nom }}
                  </h1>
                  <!-- Badge promotion (MUTED) -->
                  <span
                    v-if="false && promotionActive"
                    class="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    <i class="fas fa-bolt text-[10px]"></i> PROMU
                  </span>
                </div>

                <!-- Stats interaction (MUTED PROPRIETARY STATS) -->
                <div
                  v-if="false && promotionActive"
                  class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-gray-600 text-xs sm:text-sm"
                >
                  <div class="flex items-center gap-1">
                    <i class="fas fa-mouse-pointer"></i>
                    <span>{{ produitCounts?.clics_count || 0 }} clics</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <i class="fas fa-heart"></i>
                    <span
                      >{{ produitCounts?.favorites_count || 0 }} favoris</span
                    >
                  </div>
                  <div class="flex items-center gap-1">
                    <i class="fas fa-comment-dots"></i>
                    <span
                      >{{ produitCounts?.contacts_count || 0 }} contacts</span
                    >
                  </div>
                  <div class="flex items-center gap-1">
                    <i class="fas fa-share-alt"></i>
                    <span
                      >{{ produitCounts?.partages_count || 0 }} partages</span
                    >
                  </div>
                </div>
              </div>

              <!-- Bouton promotion propriétaire -->
              <!-- <button ...>...</button> -->
            </div>

            <!-- NOTE, AVIS & STOCK -->
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6"
            >
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1">
                  <i
                    class="fas fa-star text-yellow-400 text-sm sm:text-base"
                  ></i>
                  <span class="font-semibold text-sm sm:text-base">{{
                    produit?.note_moyenne || "N/A"
                  }}</span>
                </div>
                <span class="text-gray-600 text-xs sm:text-sm"
                  >({{ produit?.nombre_avis }} avis)</span
                >
              </div>
              <div class="flex items-center gap-1 text-green-600 text-sm">
                <i class="fas fa-check-circle text-sm sm:text-base"></i>
                <span class="text-xs sm:text-sm capitalize">{{
                  produit?.quantite > 0 ? "En stock" : "Rupture de stock"
                }}</span>
              </div>
            </div>

            <!-- DESCRIPTION -->
            <div class="mb-4 sm:mb-6">
              <h3
                class="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3"
              >
                Description
              </h3>
              <p
                class="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line"
              >
                {{ produit?.description || "Aucune description disponible" }}
              </p>
            </div>

            <!-- CARACTÉRISTIQUES EN GRILLE -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4
                  class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2"
                >
                  Prix
                </h4>
                <p class="text-gray-700 text-sm sm:text-base font-bold">
                  {{ formatPrice(produit?.prix) }}
                </p>
              </div>
              <div>
                <h4
                  class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2"
                >
                  Stock disponible
                </h4>
                <p class="text-gray-700 text-sm sm:text-base">
                  {{ produit?.quantite }} unité(s)
                </p>
              </div>
              <div>
                <h4
                  class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2"
                >
                  Condition
                </h4>
                <p class="text-gray-700 text-sm sm:text-base capitalize">
                  {{ produit?.condition || "Non spécifiée" }}
                </p>
              </div>
              <div v-if="produit?.revendable">
                <h4
                  class="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2"
                >
                  Revendable
                </h4>
                <p class="text-green-600 text-sm sm:text-base">Oui</p>
              </div>
            </div>

            <!-- INFO RAPIDES -->
            <div
              class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 space-y-2 text-xs sm:text-sm"
            >
              <div class="flex items-center gap-2 text-gray-600">
                <i
                  class="fas fa-map-marker-alt text-[var(--espace-vert)] text-xs sm:text-sm"
                ></i>
                <span class="truncate">{{
                  produit?.ville || "Localisation non spécifiée"
                }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600">
                <i
                  class="fas fa-calendar text-[var(--espace-vert)] text-xs sm:text-sm"
                ></i>
                <span>Ajouté le {{ formatDate(produit?.created_at) }}</span>
              </div>
            </div>

            <!-- PERFORMANCE PROPRIÉTAIRE (MUTED) -->
            <div
              v-if="false && isProductOwner && promotionActive"
              class="mt-6 pt-6 border-t border-gray-200 space-y-4"
            >
              <h4 class="text-sm font-semibold text-gray-900 mb-3">
                Performance du produit
              </h4>

              <!-- Conversion -->
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600"
                    >Taux de conversion (clic → contact)</span
                  >
                  <span class="font-medium text-gray-900"
                    >{{ calculateConversionRate() }}%</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-green-500 h-2 rounded-full"
                    :style="{ width: calculateConversionRate() + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Promotion -->
              <div
                v-if="promotionActive"
                class="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200"
              >
                <div
                  class="flex justify-between items-center text-sm mb-2 flex-wrap gap-2"
                >
                  <div>
                    <span class="text-blue-700">Clics promotionnels:</span>
                    <span class="font-bold ml-1"
                      >{{ promotion?.used_clicks || 0 }}/{{
                        promotion?.total_clicks
                      }}</span
                    >
                  </div>
                  <div class="text-right">
                    <span class="text-blue-700">Coût total:</span>
                    <span class="font-bold ml-1"
                      >{{ promotion?.total_cost || 0 }} jetons</span
                    >
                  </div>
                </div>
                <div class="text-xs text-blue-600 flex flex-wrap gap-3">
                  Coût moyen par clic: {{ calculateAverageCPC() }} jetons
                  <span>Progression: {{ getPromotionProgress() }}%</span>
                </div>
                <!-- Barre de progression -->
                <div class="mt-2 w-full bg-blue-100 rounded-full h-1.5">
                  <div
                    class="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full"
                    :style="{ width: getPromotionProgress() + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4 sm:space-y-6">
          <!-- Actions et prix -->
          <div
            class="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-4"
          >
            <!-- Prix -->
            <div class="mb-4 sm:mb-6">
              <div class="flex items-baseline gap-2">
                <span class="text-2xl sm:text-3xl font-bold text-gray-900">{{
                  formatPrice(produit?.prix)
                }}</span>
                <span
                  v-if="false && promotionActive"
                  class="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full"
                >
                  <i class="fas fa-bolt mr-1"></i> Boosté
                </span>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="space-y-2 sm:space-y-3">
              <!-- Contacter le vendeur -->
              <router-link
                :to="`/messages/${produit?.user?.id}`"
                @click="contactSeller"
                class="w-full bg-[var(--espace-vert)] text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <i class="fas fa-comment-dots text-sm"></i>
                <span>Contacter le vendeur</span>
              </router-link>

              <!-- Favoris -->
              <button
                @click="toggleFavorite"
                :class="[
                  'w-full border py-2.5 sm:py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer',
                  isFavorited
                    ? 'border-[var(--espace-or)] bg-[var(--espace-or)]/5 text-[var(--espace-or)] hover:bg-[var(--espace-or)]/10'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                ]"
              >
                <i :class="isFavorited ? 'fas fa-heart' : 'far fa-heart'"></i>
                <span>{{
                  isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"
                }}</span>
              </button>

              <!-- Revente -->
              <button
                v-if="produit?.revendable"
                @click="openResaleModal"
                :class="[
                  'w-full border py-2.5 sm:py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer',
                  produit?.revendable && !revendu
                    ? 'border-[var(--espace-vert)] text-[var(--espace-vert)] hover:bg-[var(--espace-vert)]/5'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed',
                ]"
                :disabled="revendu"
              >
                <i class="fas fa-handshake"></i>
                <span v-if="revendu">Déjà revendu</span>
                <span v-else>Proposer une revente</span>
              </button>

              <!-- Partager -->
              <button
                @click="shareNative"
                class="w-full border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <i class="fas fa-share-alt"></i>
                <span>Partager</span>
              </button>
            </div>

            <!-- Section Promotion (propriétaire seulement) -->
            <!-- <div v-if="isProductOwner" class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200"> -->
            <!-- <div class="flex justify-between items-center mb-3">
                                <h3 class="text-sm font-semibold text-gray-900">Campagne PPC</h3>
                                <button @click="openPromotionModal"
                                    class="text-[var(--espace-vert)] text-sm hover:text-green-700 font-medium">
                                    {{ promotionActive ? 'Voir stats' : 'Démarrer' }}
                                </button>
                            </div> -->

            <!-- État de la promotion -->
            <!-- <div v-if="promotionActive"
                                class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mb-3">
                                <div class="space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600">Clics restants</span>
                                        <span class="font-bold text-green-700">{{ promotion?.remaining_clicks }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600">Clics générés</span>
                                        <span class="font-bold text-green-700">{{ promotion?.used_clicks }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600">Coût/clic</span>
                                        <span class="font-bold text-green-700">{{ promotion?.cost_per_click }}
                                            jetons</span>
                                    </div> -->

            <!-- Barre de progression -->
            <!-- <div class="mt-2">
                                        <div class="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Progression</span>
                                            <span>{{ getPromotionProgress() }}%</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-2">
                                            <div class="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                                                :style="{ width: getPromotionProgress() + '%' }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div> -->
            <!-- <div v-else
                                class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 text-center">
                                <div
                                    class="w-10 h-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <i class="fas fa-rocket text-purple-600"></i>
                                </div>
                                <p class="text-sm text-gray-700 mb-2 font-medium">Boostez vos ventes avec une campagne
                                    PPC</p>
                                <p class="text-xs text-gray-600 mb-3">Payez uniquement pour les clics réels</p>
                                <button @click="openPromotionModal"
                                    class="inline-flex items-center gap-1 text-purple-700 text-sm font-medium hover:text-purple-900">
                                    <i class="fas fa-plus text-xs"></i> Créer une campagne
                                </button>
                            </div> -->
            <!-- </div> -->

            <!-- Informations vendeur (Original) -->
            <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Vendeur</h3>
              <div class="flex items-center space-x-3">
                <img
                  :src="produit?.user?.photo || '/default-avatar.png'"
                  :alt="produit?.user?.nom"
                  class="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-200"
                />
                <div class="min-w-0 flex-1">
                  <h4 class="font-semibold text-gray-900 text-sm truncate">
                    {{ produit?.user?.nom }}
                  </h4>
                  <p class="text-gray-600 text-xs truncate">
                    Membre depuis
                    {{ formatMemberSince(produit?.user?.created_at) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- SECTION ADMIN : INFOS PARTENAIRE -->
            <div
              v-if="user?.role === 'admin' && produit?.commercant"
              class="mt-6 pt-6 border-t-2 border-[var(--espace-vert)] bg-green-50 p-4 rounded-lg -mx-0 sm:-mx-0"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold text-[var(--espace-vert)] mb-4"
              >
                <i class="fas fa-user-secret"></i> INFOS PARTENAIRE (ADMIN ONLY)
              </h3>

              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700"
              >
                <div>
                  <p class="text-xs text-gray-500 uppercase font-semibold">
                    Boutique
                  </p>
                  <p class="font-medium">
                    {{ produit.commercant.nom_boutique }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase font-semibold">
                    Responsable
                  </p>
                  <p class="font-medium">
                    {{ produit.commercant.nom_responsable }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase font-semibold">
                    Marché
                  </p>
                  <p class="font-medium">{{ produit.commercant.marche }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase font-semibold">
                    N° Boutique
                  </p>
                  <p
                    class="font-medium bg-white px-2 py-0.5 rounded border inline-block"
                  >
                    {{ produit.commercant.numero_boutique }}
                  </p>
                </div>
                <div
                  class="col-span-1 sm:col-span-2 mt-2 grid grid-cols-2 gap-3"
                >
                  <a
                    :href="`tel:${produit.commercant.telephone}`"
                    class="flex items-center justify-center gap-2 w-full bg-white border border-[var(--espace-vert)] text-[var(--espace-vert)] font-semibold py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-white transition-all shadow-sm"
                  >
                    <i class="fas fa-phone-alt"></i> Appeler
                  </a>
                  <a
                    :href="`https://wa.me/237${produit.commercant.telephone}`"
                    target="_blank"
                    class="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition-all shadow-sm"
                  >
                    <i class="fab fa-whatsapp text-lg"></i> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Avis des clients -->
          <ReviewsProduct
            :product-id="produit.id"
            :reviews-stats="reviewsStats"
          />
        </div>
      </div>

      <!-- Produits similaires -->
      <div v-if="similarProduits?.length > 0" class="mt-8 sm:mt-12">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h2 class="text-lg sm:text-2xl font-bold text-gray-900">
            Produits similaires
          </h2>
          <button
            class="text-[var(--espace-vert)] text-sm font-medium hover:text-green-700 flex items-center space-x-1"
          >
            <span>Tout voir</span>
            <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
        <div
          class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          <ProductCard
            v-for="similarProduit in similarProduits"
            :key="similarProduit?.id"
            :produit="similarProduit"
            @click="viewProduit(similarProduit)"
          />
        </div>
      </div>
    </div>

    <!-- Modal de promotion PPC -->
    <!-- MODAL DE PROMOTION SIMPLIFIÉ -->
    <div
      v-if="showPromotionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-bold text-gray-900">
                {{ promotionActive ? "Statistiques" : "Promouvoir ce produit" }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{
                  promotionActive
                    ? "Suivez les performances de votre campagne"
                    : "Coût fixe: 0.1 jetons par clic"
                }}
              </p>
            </div>
            <button
              @click="closePromotionModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        <div class="p-6">
          <!-- Si campagne active -->
          <div v-if="promotionActive" class="space-y-6">
            <!-- Statistiques simples -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <p class="text-xl font-bold text-blue-900">
                  {{ promotion?.used_clicks || 0 }}
                </p>
                <p class="text-sm text-blue-700">Clics utilisés</p>
              </div>
              <div class="bg-green-50 rounded-lg p-4 text-center">
                <p class="text-xl font-bold text-green-900">
                  {{ promotion?.remaining_clicks || 0 }}
                </p>
                <p class="text-sm text-green-700">Clics restants</p>
              </div>
            </div>

            <!-- Barre de progression -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Progression</span>
                <span class="font-bold text-gray-900"
                  >{{ getPromotionProgress() }}%</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  class="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
                  :style="{ width: getPromotionProgress() + '%' }"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>{{ promotion?.used_clicks || 0 }} clics</span>
                <span>{{ promotion?.total_clicks || 0 }} clics</span>
              </div>
            </div>

            <!-- Coût -->
            <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm text-gray-600">Coût total</p>
                  <p class="text-lg font-bold text-gray-900">
                    {{ promotion?.total_cost || 0 }} jetons
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ (promotion?.total_cost || 0) * 100 }} FCFA
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">Coût par clic</p>
                  <p class="text-lg font-bold text-gray-900">0.1 jetons</p>
                  <p class="text-xs text-gray-500">20 FCFA</p>
                </div>
              </div>
            </div>

            <!-- Bouton d'arrêt -->
            <button
              @click="stopPromotion"
              class="w-full px-4 py-3 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 font-medium transition-colors"
            >
              <i class="fas fa-stop-circle mr-2"></i> Arrêter la promotion
            </button>
          </div>

          <!-- Si pas de campagne active -->
          <div v-else class="space-y-6">
            <!-- Solde de jetons -->
            <div
              class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200"
            >
              <div class="flex justify-between items-center mb-3">
                <div>
                  <p class="text-sm text-gray-600">Votre solde</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ userTokens }} jetons
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ userTokens * 100 }} FCFA
                  </p>
                </div>
                <button
                  @click="openBuyTokensModal"
                  class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-sm font-medium"
                >
                  <i class="fas fa-coins mr-1"></i> Acheter
                </button>
              </div>
              <p class="text-xs text-gray-600">
                <i class="fas fa-info-circle mr-1"></i> Coût fixe: 0.1 jetons
                par clic (20 FCFA)
              </p>
            </div>

            <!-- Sélection du nombre de clics -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-4">
                Combien de clics souhaitez-vous acheter ?
              </h4>

              <!-- Options rapides -->
              <div class="grid grid-cols-3 gap-3 mb-4">
                <button
                  v-for="option in quickClicOptions"
                  :key="option.clicks"
                  @click="selectedClicks = option.clicks"
                  :class="[
                    'border rounded-lg p-3 text-center transition-all',
                    selectedClicks === option.clicks
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300',
                  ]"
                >
                  <p class="text-lg font-bold text-gray-900">
                    {{ option.clicks }}
                  </p>
                  <p class="text-xs text-gray-600">clics</p>
                </button>
              </div>

              <!-- Personnalisation -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ou personnalisez :
                </label>
                <div class="flex items-center">
                  <input
                    v-model.number="customClicks"
                    type="number"
                    min="10"
                    max="10000"
                    class="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Entrez un nombre"
                  />
                  <span
                    class="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg text-gray-600"
                  >
                    clics
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Minimum: 10 clics, Maximum: 10,000 clics
                </p>
              </div>
            </div>

            <!-- Résumé -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 class="font-semibold text-gray-900 mb-3">Résumé</h4>

              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Nombre de clics</span>
                  <span class="font-medium">{{ totalClicks }} clics</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Coût par clic</span>
                  <span class="font-medium">0.1 jetons</span>
                </div>
                <div class="border-t border-gray-300 pt-2 mt-2">
                  <div class="flex justify-between font-bold">
                    <span class="text-base">Coût total</span>
                    <span class="text-lg text-blue-600"
                      >{{ totalCost }} jetons</span
                    >
                  </div>
                  <p class="text-sm text-gray-500 text-right">
                    {{ totalCost * 100 }} FCFA
                  </p>
                </div>
                <div
                  class="flex justify-between font-bold mt-2 pt-2 border-t border-gray-300"
                >
                  <span>Nouveau solde</span>
                  <span
                    :class="[
                      userTokens - totalCost >= 0
                        ? 'text-green-600'
                        : 'text-red-600',
                    ]"
                  >
                    {{ userTokens - totalCost }} jetons
                  </span>
                </div>
              </div>

              <!-- Estimation -->
              <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700">
                  <i class="fas fa-lightbulb mr-2"></i>
                  Estimation: {{ totalClicks }} clics peuvent générer environ
                  <span class="font-bold"
                    >{{ Math.round(totalClicks * 0.05) }}-{{
                      Math.round(totalClicks * 0.1)
                    }}</span
                  >
                  contacts potentiels.
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3 pt-2">
              <button
                @click="closePromotionModal"
                class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
              >
                Annuler
              </button>
              <button
                @click="createPromotion"
                :disabled="!canAffordPromotion || totalClicks < 10"
                :class="[
                  'flex-1 px-4 py-3 text-white rounded-lg font-medium flex items-center justify-center',
                  canAffordPromotion && totalClicks >= 10
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gray-400 cursor-not-allowed',
                ]"
              >
                <i class="fas fa-rocket mr-2"></i>
                Démarrer
                <span class="ml-1">({{ totalCost }} jetons)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal pour ajouter des clics -->
    <div
      v-if="showAddClicks"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Ajouter des clics</h3>
          <button
            @click="showAddClicks = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre de clics supplémentaires
            </label>
            <input
              v-model.number="additionalClicks"
              type="number"
              min="10"
              max="500"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600">Coût supplémentaire</span>
              <span class="font-bold"
                >{{ additionalClicks * promotion?.cost_per_click }} jetons</span
              >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Nouveau total de clics</span>
              <span class="font-bold"
                >{{
                  (promotion?.total_clicks || 0) + additionalClicks
                }}
                clics</span
              >
            </div>
          </div>

          <div class="flex space-x-3">
            <button
              @click="showAddClicks = false"
              class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              @click="addMoreClicks"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour acheter des jetons -->
    <div
      v-if="showBuyTokensModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-coins text-yellow-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900">Acheter des jetons</h3>
          <p class="text-sm text-gray-600 mt-1">1 jeton = 100 FCFA</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="option in tokenOptions"
            :key="option.tokens"
            @click="selectedTokenOption = option"
            :class="[
              'border rounded-lg p-4 cursor-pointer transition-all',
              selectedTokenOption.tokens === option.tokens
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 hover:border-gray-300',
            ]"
          >
            <div class="flex justify-between items-center">
              <div>
                <p class="text-lg font-bold text-gray-900">
                  {{ option.tokens }} jetons
                </p>
                <p class="text-sm text-gray-600">
                  {{ option.tokens * 100 }} FCFA
                </p>
              </div>
              <div v-if="option.bonus" class="text-right">
                <p class="text-sm text-green-600 font-medium">
                  +{{ option.bonus }} bonus
                </p>
                <p class="text-xs text-gray-500">
                  Total: {{ option.tokens + option.bonus }} jetons
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <button
            @click="proceedToPayment"
            class="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 font-bold"
          >
            Payer {{ selectedTokenOption.price }} FCFA
          </button>
          <p class="text-xs text-gray-500 text-center mt-2">
            Vous recevrez
            {{ selectedTokenOption.tokens + (selectedTokenOption.bonus || 0) }}
            jetons
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de promotion -->
    <div
      v-if="showPromotionConfirmation"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg max-w-sm w-full p-6 text-center">
        <div
          class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-check text-green-600 text-xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Campagne lancée !
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          Votre campagne PPC est maintenant active. Vous serez débité uniquement
          lorsque des utilisateurs cliqueront sur votre produit.
        </p>
        <button
          @click="showPromotionConfirmation = false"
          class="w-full bg-[var(--espace-vert)] text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Compris
        </button>
      </div>
    </div>

    <!-- Modal pour proposer une revente (existant) -->
    <div
      v-if="showResaleModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <!-- Modal de revente -->
      <div
        v-if="showResaleModal"
        class="fixed top-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <!-- En-tête -->
          <div class="sticky top-0 bg-white border-b border-gray-200 p-6">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-bold text-gray-900">
                  Proposer une revente
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  Proposez un prix de revente pour ce produit
                </p>
              </div>
              <button
                @click="showResaleModal = false"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i class="fas fa-times text-lg"></i>
              </button>
            </div>
          </div>

          <!-- Contenu -->
          <div class="p-6">
            <!-- Informations produit -->
            <div class="flex gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
              <div
                class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
              >
                <img
                  v-if="produit?.photos?.[0]"
                  :src="produit.photos[0]"
                  :alt="produit.nom"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <i class="fas fa-image text-gray-300"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 text-sm mb-1 truncate">
                  {{ produit?.nom }}
                </h4>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-600">Prix original:</span>
                  <span class="text-sm font-semibold text-gray-900">{{
                    formatPrice(produit?.prix)
                  }}</span>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Vendue par: {{ produit?.user?.nom }}
                </div>
              </div>
            </div>

            <!-- Prix de revente -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Votre prix de revente proposé
              </label>

              <!-- Prix personnalisé -->
              <div class="relative">
                <div class="flex items-center">
                  <input
                    v-model.number="resalePrice"
                    type="number"
                    min="1"
                    :max="produit?.prix * 2"
                    step="100"
                    class="w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Entrez votre prix"
                    @input="validateResalePrice"
                  />
                  <span class="absolute right-3 text-gray-500">FCFA</span>
                </div>

                <!-- Plage de prix recommandée -->
                <div class="mt-2 text-xs text-gray-600 flex justify-between">
                  <span
                    >Minimum:
                    {{ formatPrice(Math.round(produit?.prix * 0.5)) }}</span
                  >
                  <span
                    >Maximum:
                    {{ formatPrice(Math.round(produit?.prix * 2)) }}</span
                  >
                </div>
              </div>

              <!-- Informations sur la marge -->
              <div
                v-if="resalePrice && produit?.prix"
                class="mt-4 p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-600">Marge potentielle</span>
                  <span
                    :class="[
                      'text-sm font-semibold',
                      resalePrice - produit.prix > 0
                        ? 'text-green-600'
                        : 'text-red-600',
                    ]"
                  >
                    {{ formatPrice(resalePrice - produit.prix) }}
                  </span>
                </div>
                <div class="text-xs text-gray-500">
                  <i class="fas fa-info-circle mr-1"></i>
                  Vous gardez la différence entre votre prix de vente et le prix
                  original
                </div>
              </div>
            </div>

            <!-- Comment ça marche -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-3">
                <i class="fas fa-info-circle text-blue-500"></i>
                <h4 class="font-medium text-gray-900">
                  Comment fonctionne la revente ?
                </h4>
              </div>
              <div class="space-y-3 text-sm">
                <div class="flex items-start gap-2">
                  <div
                    class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <span class="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <p class="text-gray-600">
                    Vous proposez un prix au vendeur pour revendre ce produit
                  </p>
                </div>
                <div class="flex items-start gap-2">
                  <div
                    class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <span class="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <p class="text-gray-600">
                    Le vendeur accepte ou refuse votre proposition
                  </p>
                </div>
                <div class="flex items-start gap-2">
                  <div
                    class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <span class="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <p class="text-gray-600">
                    Si accepté, vous pouvez vendre le produit à votre prix et
                    garder la différence
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div class="flex gap-3">
              <button
                @click="showResaleModal = false"
                class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                @click="submitResaleProposal"
                :disabled="
                  !resalePrice ||
                  isSubmittingResale ||
                  resalePrice < Math.round(produit?.prix * 0.5)
                "
                :class="[
                  'flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                  resalePrice &&
                  !isSubmittingResale &&
                  resalePrice >= Math.round(produit?.prix * 0.5)
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                ]"
              >
                <i v-if="isSubmittingResale" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-paper-plane"></i>
                {{ isSubmittingResale ? "Envoi..." : "Proposer" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de confirmation -->
      <div
        v-if="showConfirmationModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-xl max-w-sm w-full p-6 text-center">
          <div
            class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="fas fa-check text-green-600 text-xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Proposition envoyée !
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            Votre proposition de revente a été envoyée au vendeur. Vous serez
            notifié par email lorsqu'il y aura une réponse.
          </p>
          <div class="space-y-3">
            <button
              @click="showConfirmationModal = false"
              class="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Compris
            </button>
            <router-link
              to="/reventes"
              @click="showConfirmationModal = false"
              class="inline-block w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Voir mes propositions
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import SeoHead from "../../components/SeoHead.vue";
import Loader from "../../components/Loader.vue";
import ProductCard from "../../components/mesProduits/MesProductCard.vue";
import ReviewsProduct from "./ReviewsProduit.vue";
import { interactionService } from "../../utils/interaction";
import { useAuthStore } from "../../stores/Auth";
import apiClient from "../../api";
import urlHelper from "../../utils/urlHelper";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const user = computed(() => useAuthStore().user);

// États principaux
const produit = ref<any>(null);
const produitCounts = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const similarProduits = ref<any[]>([]);
const currentImageIndex = ref(0);
const isFavorited = ref(false);
const revendu = ref(false);

// États pour la promotion PPC
const showPromotionModal = ref(false);
const showPromotionConfirmation = ref(false);
const showAddClicks = ref(false);
const showBuyTokensModal = ref(false);
const promotion = ref<any>(null);
const promotionStats = ref<any[]>([]);

// États pour l'achat de jetons
const tokenOptions = ref([
  { tokens: 10, price: 1000, bonus: 0 },
  { tokens: 50, price: 5000, bonus: 5 },
  { tokens: 100, price: 10000, bonus: 15 },
  { tokens: 500, price: 50000, bonus: 100 },
]);
const selectedTokenOption = ref(tokenOptions.value[1]);

// Packages de clics pour les promotions

// Options rapides de clics
const quickClicOptions = ref([
  { clicks: 50 },
  { clicks: 100 },
  { clicks: 200 },
  { clicks: 500 },
  { clicks: 1000 },
  { clicks: 2000 },
]);

// Variables pour la promotion simplifiée
const selectedClicks = ref(100);
const customClicks = ref(100);
const COST_PER_CLICK = 0.1; // 0.1 jetons par clic

// Computed properties simplifiées
const userTokens = computed(() => user.value?.jetons || 0);

const totalClicks = computed(() => {
  return selectedClicks.value || customClicks.value;
});

const totalCost = computed(() => {
  return Math.round(totalClicks.value * COST_PER_CLICK * 100) / 100; // Arrondi à 2 décimales
});

const canAffordPromotion = computed(() => {
  return userTokens.value >= totalCost.value;
});

// Méthode createPromotion simplifiée
const createPromotion = async () => {
  if (totalClicks.value < 10) {
    toast.error("Minimum 10 clics requis");
    return;
  }

  if (!canAffordPromotion.value) {
    toast.error("Jetons insuffisants");
    openBuyTokensModal();
    return;
  }

  const promotionData = {
    produit_id: produit.value.id,
    total_clicks: totalClicks.value,
    // Pas besoin de cost_per_click, c'est fixe à 0.1
  };

  try {
    const response = await apiClient.post("/promotions/create", promotionData);

    if (response.data.success) {
      promotion.value = response.data.promotion;
      if (user.value) {
        user.value.jetons = response.data.remaining_tokens;
      }

      toast.success("Promotion lancée !");
      closePromotionModal();
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Erreur");
  }
};

// Méthode pour arrêter la promotion
const stopPromotion = async () => {
  if (!promotion.value?.id) return;

  if (!confirm("Êtes-vous sûr de vouloir arrêter cette promotion ?")) return;

  try {
    const response = await apiClient.post(
      `/promotions/${promotion.value.id}/stop`,
    );

    if (response.data.success) {
      promotion.value.status = "stopped";

      // Remboursement
      if (response.data.refunded_tokens && user.value) {
        user.value.jetons += response.data.refunded_tokens;
        toast.info(`${response.data.refunded_tokens} jetons remboursés`);
      }

      toast.success("Promotion arrêtée");
      closePromotionModal();
    }
  } catch (error: any) {
    toast.error("Erreur lors de l'arrêt" + error);
  }
};

// Méthode pour ouvrir le modal simplifié
const openPromotionModal = async () => {
  if (!isProductOwner.value) {
    toast.error("Seul le propriétaire peut gérer les promotions");
    return;
  }

  showPromotionModal.value = true;

  // Réinitialiser les valeurs
  selectedClicks.value = 100;
  customClicks.value = 100;
};

// Méthode pour fermer le modal
const closePromotionModal = () => {
  showPromotionModal.value = false;
};

// Calcul de progression simplifié
const getPromotionProgress = () => {
  if (!promotion.value) return 0;
  const total = promotion.value.total_clicks;
  const used = promotion.value.used_clicks;
  return Math.round((used / total) * 100);
};

const additionalClicks = ref(50);

// États pour la revente
const showResaleModal = ref(false);
const showConfirmationModal = ref(false);
const resalePrice = ref<number | null>(null);
const isSubmittingResale = ref(false);

// Computed properties
const currentImage = computed(() => {
  if (!produit.value?.photos) return "/default-product.jpg";
  return (
    produit.value?.photos[currentImageIndex.value] || produit.value?.photos[0]
  );
});

const seoImage = computed(() => {
  if (!produit.value?.photos || produit.value.photos.length === 0) return null;
  const photo = produit.value.photos[0];
  if (photo.startsWith("http")) return photo;
  return urlHelper.endpoints.storage.url(photo);
});

const seoTitle = computed(() => {
  return produit.value
    ? `${produit.value?.nom} - Produits | Espace Cameroun`
    : "Produit | Espace Cameroun";
});

const seoDescription = computed(() => {
  return (
    produit.value?.description?.substring(0, 160) ||
    "Découvrez ce produit de qualité sur Espace Cameroun"
  );
});

const isProductOwner = computed(() => {
  return user.value?.id === produit.value?.user_id;
});

const promotionActive = computed(() => {
  return promotion.value?.status === "active";
});

const jetons = computed(() => user.jetons || 0);

const reviewsStats = computed(() => ({
  average: produit.value?.note_moyenne || 0,
  total: produit.value?.nombre_avis || 0,
}));

// Méthodes utilitaires
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatMemberSince = (dateString: string) => {
  const year = new Date(dateString).getFullYear();
  return year;
};

// Enregistrer une vue (quand l'utilisateur arrive sur la page)
const recordView = async () => {
  if (!produit.value || !user) return;

  try {
    await interactionService.recordInteraction(
      produit.value.id,
      "produit",
      "clic",
      { duration: 0, source: "product_page" },
    );
    console.log('Interaction "clic" enregistrée pour la vue initiale');
  } catch (error) {
    console.error("Erreur enregistrement vue:", error);
  }
};

// Méthodes de données
const fetchProduitDetails = async () => {
  try {
    isLoading.value = true;
    const response = await apiClient.get(`/produits/${route.params.id}`);

    if (response.data.success) {
      produit.value = response.data.data.produit;
      similarProduits.value = response.data.data.similar_produits || [];

      // Charger les compteurs
      await fetchProduitCounts();

      // Vérifier si l'utilisateur a favorisé ce produit
      isFavorited.value = response.data.isFavorited;

      // Charger la promotion si propriétaire
      console.log(isProductOwner);

      if (isProductOwner.value) {
        fetchPromotion();
        fetchPromotionStats();
      }

      // Vérifier la revente
      checkExistingResaleProposal();
      recordView();
    } else {
      error.value = response.data.message;
    }
  } catch (err: any) {
    console.error("Erreur:", err);
    error.value =
      err.response?.data?.message || "Erreur lors du chargement du produit";
  } finally {
    isLoading.value = false;
  }
};

const fetchProduitCounts = async () => {
  if (!produit.value?.id) return;

  try {
    const response = await apiClient.get(
      `/produits/${produit.value.id}/counts`,
    );

    console.log(response.data);
    produitCounts.value = response.data.data;
  } catch (error) {
    console.error("Erreur chargement compteurs:", error);
  }
};

const fetchPromotion = async () => {
  if (!produit.value?.id || !isProductOwner.value) return;

  try {
    const response = await apiClient.get(
      `/promotions/active/${produit.value.id}`,
    );
    if (response.data.success && response.data.promotion) {
      promotion.value = response.data.promotion;
    } else {
      promotion.value = null;
    }
  } catch (error) {
    console.error("Erreur chargement promotion:", error);
    promotion.value = null;
  }
};

const fetchPromotionStats = async () => {
  if (!produit.value?.id || !promotion.value) return;

  try {
    const response = await apiClient.get(
      `/promotions/${promotion.value.id}/stats`,
    );
    if (response.data.success) {
      promotionStats.value = response.data.data;
    }
  } catch (error) {
    console.error("Erreur chargement stats promotion:", error);
  }
};

const checkExistingResaleProposal = async () => {
  if (!produit.value) return;

  try {
    const response = await apiClient.get(
      `/reventes/${produit.value.id}/status`,
    );
    revendu.value = response.data.revendu || false;
  } catch (err) {
    console.log("Erreur vérification revente:", err);
  }
};

// Méthode pour tracker un clic
const trackPromotionalClick = async () => {
  try {
    const response = await apiClient.post("/promotions/track-click", {
      produit_id: produit.value.id,
    });

    if (response.data.success) {
      // Mettre à jour les compteurs locaux
      if (promotion.value) {
        promotion.value.remaining_clicks = response.data.remaining_clicks;

        // Si plus de clics, désactiver
        if (response.data.remaining_clicks <= 0) {
          promotion.value.status = "completed";
          produit.value.is_promoted = false;
        }
      }
    }
  } catch (error) {
    console.error("Erreur tracking:", error);
  }
};

const addMoreClicks = async () => {
  if (!promotion.value?.id || additionalClicks.value < 10) {
    toast.error("Veuillez sélectionner au moins 10 clics supplémentaires");
    return;
  }

  const additionalCost =
    additionalClicks.value * promotion.value.cost_per_click;

  if (jetons.value < additionalCost) {
    toast.error("Jetons insuffisants");
    openBuyTokensModal();
    return;
  }

  try {
    const response = await apiClient.post(
      `/promotions/${promotion.value.id}/add-clicks`,
      {
        additional_clics: additionalClicks.value,
      },
    );

    if (response.data.success) {
      // Mettre à jour les jetons
      user.jetons -= additionalCost;

      // Mettre à jour la promotion
      promotion.value.total_clicks += additionalClicks.value;
      promotion.value.remaining_clicks += additionalClicks.value;
      promotion.value.total_cost += additionalCost;

      toast.success(`${additionalClicks.value} clics ajoutés à la campagne`);
      showAddClicks.value = false;
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Erreur");
  }
};

// Calculs de performance
const calculateConversionRate = () => {
  if (
    !produitCounts.value?.clics_count ||
    produitCounts.value.clics_count === 0
  )
    return 0;
  const rate =
    (produitCounts.value.contacts_count / produitCounts.value.clics_count) *
    100;
  return Math.min(rate, 100).toFixed(1);
};

const calculateAverageCPC = () => {
  if (!promotion.value?.used_clicks || promotion.value.used_clicks === 0)
    return 0;
  return (promotion.value.total_cost / promotion.value.used_clicks).toFixed(2);
};

// Méthodes d'achat de jetons
const openBuyTokensModal = () => {
  showBuyTokensModal.value = true;
  showPromotionModal.value = false;
};

const proceedToPayment = async () => {
  const paymentData = {
    tokens: selectedTokenOption.value.tokens,
    price: selectedTokenOption.value.price,
    bonus: selectedTokenOption.value.bonus || 0,
  };

  try {
    const response = await apiClient.post("/tokens/buy", paymentData);

    if (response.data.success) {
      // Mettre à jour les jetons
      user.jetons +=
        selectedTokenOption.value.tokens +
        (selectedTokenOption.value.bonus || 0);

      toast.success("Jetons achetés avec succès !");
      showBuyTokensModal.value = false;

      // Si l'utilisateur venait du modal de promotion, le rouvrir
      setTimeout(() => {
        openPromotionModal();
      }, 500);
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Erreur lors de l'achat");
  }
};

// Méthodes existantes (favoris, revente, partage)
const toggleFavorite = async () => {
  if (!user) {
    toast.error("Veuillez vous connecter");
    router.push("/login");
    return;
  }

  try {
    const response = await apiClient.post(
      `/produits/${produit.value.id}/favorite`,
    );

    if (response.data.success) {
      isFavorited.value = !isFavorited.value;

      // Enregistrer l'interaction
      await interactionService.recordInteraction(
        produit.value.id,
        "produit",
        "favori",
        {
          action: isFavorited.value ? "added" : "removed",
          timestamp: new Date().toISOString(),
        },
      );

      // Rafraîchir les compteurs
      await fetchProduitCounts();

      toast.success(
        isFavorited.value ? "Ajouté aux favoris" : "Retiré des favoris",
      );
    }
  } catch (error: any) {
    toast.error("Erreur lors de la mise à jour des favoris");
  }
};

const contactSeller = async () => {
  if (!user) {
    toast.error("Veuillez vous connecter");
    router.push("/login");
    return;
  }

  // Enregistrer l'interaction
  await interactionService.recordInteraction(
    produit.value.id,
    "produit",
    "contact",
    {
      type: "message_vendor",
      timestamp: new Date().toISOString(),
    },
  );

  // Rafraîchir les compteurs
  await fetchProduitCounts();
};

const shareNative = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: produit.value?.nom,
        text: `Découvrez "${produit.value?.nom}" - ${formatPrice(produit.value?.prix)} sur Espace Cameroun`,
        url: window.location.href,
      });

      // Enregistrer le partage
      await interactionService.recordInteraction(
        produit.value.id,
        "produit",
        "partage",
        {
          method: "native_share",
          timestamp: new Date().toISOString(),
        },
      );

      await fetchProduitCounts();
    } catch (err) {
      console.log("Partage annulé");
    }
  } else {
    // Fallback: copier le lien
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié dans le presse-papier");

    await interactionService.recordInteraction(
      produit.value.id,
      "produit",
      "partage",
      {
        method: "copy_link",
        timestamp: new Date().toISOString(),
      },
    );

    await fetchProduitCounts();
  }
};

const openResaleModal = async () => {
  if (!user) {
    toast.error("Veuillez vous connecter");
    router.push("/login");
    return;
  }

  if (user.id === produit.value?.user_id) {
    toast.error(
      "Vous ne pouvez pas proposer une revente de votre propre produit",
    );
    return;
  }

  if (!produit.value?.revendable) {
    toast.error("Ce produit n'est pas marqué comme revendable");
    return;
  }

  showResaleModal.value = true;
  resalePrice.value = Math.round(produit.value?.prix * 0.8);
};

const submitResaleProposal = async () => {
  if (!resalePrice.value || !produit.value) {
    toast.error("Veuillez entrer un prix de revente");
    return;
  }

  isSubmittingResale.value = true;

  try {
    const response = await apiClient.post(`/reventes/${produit.value.id}`, {
      prix_revente: resalePrice.value,
      produit_id: produit.value.id,
    });

    if (response.data.success) {
      showResaleModal.value = false;
      showConfirmationModal.value = true;
      revendu.value = true;
      toast.success("Proposition envoyée avec succès");
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erreur");
  } finally {
    isSubmittingResale.value = false;
  }
};

const viewProduit = (produit: any) => {
  router.push(`/produits/${produit.id}`);
};

watch(
  isProductOwner,
  (newValue) => {
    if (newValue) {
      fetchPromotion();
    }
  },
  { immediate: true },
); // immediate: true pour exécuter immédiatement

// Cycle de vie
onMounted(() => {
  fetchProduitDetails();
  fetchProduitCounts();

  // Polling pour les stats en temps réel (propriétaire seulement)
  if (isProductOwner.value) {
    const interval = setInterval(() => {
      if (promotionActive.value) {
        fetchPromotion();
      }
    }, 30000); // Toutes les 30 secondes

    onUnmounted(() => clearInterval(interval));
  }
});
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Ajustements responsive */
@media (max-width: 360px) {
  .text-xs {
    font-size: 0.7rem;
  }

  .px-3 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

/* Animation pour les modals */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Effet de survol pour les boutons */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* Animation pour la barre de progression */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

/* Style pour les badges de promotion */
.promotion-badge {
  box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
}

/* Style pour les statistiques */
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Gradient border pour les cartes promotionnelles */
.gradient-border {
  position: relative;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(to right, #8b5cf6, #3b82f6) border-box;
  border: 2px solid transparent;
}

/* Animation pour le chargement des images */
.image-loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .stat-card {
    padding: 0.75rem;
  }

  .promotion-badge {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
  }
}

/* Smooth transitions */
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Shadow hover effect */
.shadow-hover:hover {
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Custom scrollbar for modal */
.modal-scroll::-webkit-scrollbar {
  width: 6px;
}

.modal-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.modal-scroll::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
