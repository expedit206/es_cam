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
          class="bg-primary text-white px-4 sm:px-6 py-2 sm:py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base"
        >
          Retour
        </button>
      </div>
    </div>

    <!-- details -->
    <div
      v-else-if="produit"
      class="max-w-7xl mx-auto px-3 py-4 lg:px-4 lg:py-8"
    >
      <!-- Breadcrumb -->
      <nav
        class="flex items-center space-x-2 text-sm sm:text-sm text-gray-500 mb-3 sm:mb-4 overflow-x-auto hide-scrollbar"
      >
        <router-link to="/" class="hover:text-primary whitespace-nowrap"
          >Accueil</router-link
        >
        <i class="fas fa-chevron-right text-sm"></i>
        <router-link to="/produits" class="hover:text-primary whitespace-nowrap"
          >Produits</router-link
        >
        <i class="fas fa-chevron-right text-sm"></i>
        <span class="text-gray-700 truncate">{{ produit.category?.name }}</span>
      </nav>

      <!-- Main product grid -->
      <div class="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <!-- Left column: Gallery -->
        <div class="lg:col-span-7">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Thumbnails (vertical on desktop, horizontal on mobile) -->
            <div
              v-if="produit.photos && produit.photos.length > 1"
              class="order-2 lg:order-1 lg:w-24 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto hide-scrollbar"
            >
              <button
                v-for="(image, idx) in produit.photos"
                :key="idx"
                @click="currentImageIndex = idx"
                class="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-md overflow-hidden border-2 transition"
                :class="
                  currentImageIndex === idx
                    ? 'border-primary'
                    : 'border-transparent hover:border-gray-300'
                "
              >
                <img
                  :src="image"
                  :alt="`${produit.nom} ${idx + 1}`"
                  class="w-full h-full object-cover"
                />
              </button>
            </div>

            <!-- Main image -->
            <div
              class="order-1 lg:order-2 flex-1 relative bg-white rounded-xl border border-gray-200 overflow-hidden group"
            >
              <div
                class="aspect-square lg:aspect-[4/5] flex items-center justify-center bg-gray-50 relative"
              >
                <img
                  :src="currentImage"
                  :alt="produit.nom"
                  class="max-h-full max-w-full object-contain"
                />

                <!-- Overlay Actions (Top Right) -->
                <div class="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    @click.stop="toggleFavorite"
                    class="w-10 h-10 rounded-full bg-white/90 shadow-md backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-gray-700 hover:text-red-500"
                  >
                    <i
                      :class="[
                        isFavorited ? 'fas text-red-500' : 'far',
                        'fa-heart text-xl',
                      ]"
                    ></i>
                  </button>
                  <button
                    @click.stop="shareNative"
                    class="w-10 h-10 rounded-full bg-white/90 shadow-md backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-gray-700 hover:text-blue-500"
                  >
                    <i class="fas fa-share-alt text-lg"></i>
                  </button>
                </div>

                <!-- Overlay Features (Bottom Left) -->
                <div
                  class="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-none"
                >
                  <span
                    v-if="produit.condition"
                    class="px-2.5 py-1 rounded-md bg-black/60 shadow-sm backdrop-blur-md text-white text-sm font-semibold capitalize"
                  >
                    {{ produit.condition }}
                  </span>
                  <span
                    v-if="produit.quantite"
                    class="px-2.5 py-1 rounded-md bg-black/60 shadow-sm backdrop-blur-md text-white text-sm font-semibold"
                  >
                    {{ produit.quantite }} disp.
                  </span>
                  <span
                    v-if="produit.ville"
                    class="px-2.5 py-1 rounded-md bg-black/60 shadow-sm backdrop-blur-md text-white text-sm font-semibold"
                  >
                    <i class="fas fa-map-marker-alt mr-1"></i
                    >{{ produit.ville }}
                  </span>
                  <span
                    v-if="produit.revendable"
                    class="px-2.5 py-1 rounded-md bg-green-600/90 shadow-sm backdrop-blur-md text-white text-sm font-semibold"
                  >
                    Revente OK
                  </span>
                </div>
              </div>
              <!-- Navigation arrows (desktop) -->
              <button
                v-if="
                  produit.photos &&
                  produit.photos.length > 1 &&
                  currentImageIndex > 0
                "
                @click="currentImageIndex--"
                class="absolute left-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-10 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors z-10"
              >
                <i class="fas fa-chevron-left text-gray-700"></i>
              </button>
              <button
                v-if="
                  produit.photos &&
                  produit.photos.length > 1 &&
                  currentImageIndex < produit.photos.length - 1
                "
                @click="currentImageIndex++"
                class="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-10 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors z-10"
              >
                <i class="fas fa-chevron-right text-gray-700"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Right column: Product info + buy box -->
        <div class="lg:col-span-5 mt-6 lg:mt-0">
          <div
            class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-5"
          >
            <!-- Title & badges -->
            <div>
              <!-- Seller Dashboard (Visible only to owner) -->
              <div
                v-if="isProductOwner"
                class="mb-3 sm:mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4"
              >
                <div class="flex items-center justify-between">
                  <h3
                    class="text-sm font-bold text-blue-900 flex items-center gap-2"
                  >
                    <i class="fas fa-cog"></i> Gérer mon produit
                  </h3>

                  <div class="relative">
                    <button
                      @click.stop="showOwnerMenu = !showOwnerMenu"
                      class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </button>

                    <!-- Dropdown Menu -->
                    <div
                      v-if="showOwnerMenu"
                      v-click-outside="() => (showOwnerMenu = false)"
                      class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1 overflow-hidden"
                    >
                      <button
                        @click="editProduct"
                        class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <i class="fas fa-edit text-blue-500 w-5"></i> Modifier
                      </button>
                      <button
                        @click="confirmDelete"
                        class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <i class="fas fa-trash-alt w-5"></i> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h1
                class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900"
              >
                {{ produit.nom }}
              </h1>
              <div class="flex items-center flex-wrap gap-3 mt-2">
                <!-- Rating -->
                <div class="flex items-center gap-1">
                  <span class="text-sm font-medium text-gray-700">{{
                    produit.note_moyenne || "N/A"
                  }}</span>
                  <div class="flex items-center">
                    <i
                      v-for="i in 5"
                      :key="i"
                      class="fas fa-star text-sm"
                      :class="
                        i <= (produit.note_moyenne || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-200'
                      "
                    ></i>
                  </div>
                </div>
                <span class="text-sm text-gray-500"
                  >({{ produit.nombre_avis }} avis)</span
                >
                <!-- Stock badge -->
                <span
                  class="ml-auto text-sm font-medium"
                  :class="
                    produit.quantite > 0 ? 'text-green-600' : 'text-red-600'
                  "
                >
                  <i class="fas fa-circle text-[8px] mr-1 align-middle"></i>
                  {{ produit.quantite > 0 ? "En stock" : "Rupture" }}
                </span>
              </div>
            </div>

            <!-- <h2 class="text-lg font-bold text-gray-900 mb-4">Description</h2> -->
            <div
              class="prose prose-sm max-w-none text-gray-700"
              v-html="produit.description || 'Aucune description fournie.'"
            ></div>

            <!-- Price -->
            <div class="border-t border-gray-100 pt-4">
              <div class="flex items-baseline gap-2">
                <span class="text-2xl sm:text-3xl font-bold text-gray-900">{{
                  formatPrice(produit.prix)
                }}</span>
                <span
                  v-if="promotionActive"
                  class="bg-purple-100 text-purple-700 text-sm font-semibold px-2 py-1 rounded-full"
                >
                  <i class="fas fa-bolt mr-1"></i> Boosté
                </span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="space-y-3">
              <router-link
                :to="`/messages/${produit.user?.id}`"
                @click="contactSeller"
                class="w-full flex items-center justify-center gap-2 bg-primary !text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                <i class="fas fa-comment-dots"></i>
                Contacter le vendeur
              </router-link>

              <button
                v-if="produit.revendable && !revendu"
                @click="openResaleModal"
                class="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 transition"
              >
                <i class="fas fa-handshake"></i>
                Proposer une revente
              </button>
            </div>

            <!-- Seller info -->
            <div class="border-t border-gray-100 pt-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Vendeur</h3>
              <div class="flex items-center gap-3">
                <img
                  :src="produit.user?.photo || '/default-avatar.png'"
                  alt=""
                  class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border"
                />
                <div class="flex-1">
                  <p class="font-medium">{{ produit.user?.nom }}</p>
                  <p class="text-sm text-gray-500">
                    Membre depuis
                    {{ formatMemberSince(produit.user?.created_at) }}
                  </p>
                </div>
                <router-link
                  :to="`/profile/${produit.user?.id}`"
                  class="text-primary text-sm hover:underline"
                >
                  Voir
                </router-link>
              </div>
            </div>

            <!-- Admin merchant details (if admin) -->
            <div
              v-if="user?.role === 'admin' && produit.commercant"
              class="border-t border-gray-100 pt-4 bg-blue-50 p-4 rounded-lg"
            >
              <h3
                class="text-sm font-bold text-blue-800 mb-2 flex items-center gap-1"
              >
                <i class="fas fa-store-alt"></i> Infos partenaire (admin)
              </h3>
              <dl class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt class="text-blue-600">Boutique</dt>
                  <dd class="font-medium">
                    {{ produit.commercant.nom_boutique }}
                  </dd>
                </div>
                <div>
                  <dt class="text-blue-600">Responsable</dt>
                  <dd>{{ produit.commercant.nom_responsable }}</dd>
                </div>
                <div>
                  <dt class="text-blue-600">Marché</dt>
                  <dd>{{ produit.commercant.marche }}</dd>
                </div>
                <div>
                  <dt class="text-blue-600">N° boutique</dt>
                  <dd>{{ produit.commercant.numero_boutique }}</dd>
                </div>
              </dl>
              <div class="flex gap-2 mt-3">
                <a
                  :href="`tel:${produit.commercant.telephone}`"
                  class="flex-1 text-center bg-white border border-blue-300 text-blue-700 py-1.5 rounded-lg text-sm hover:bg-blue-50"
                >
                  <i class="fas fa-phone-alt mr-1"></i> Appeler
                </a>
                <a
                  :href="`https://wa.me/${produit.commercant.telephone}`"
                  target="_blank"
                  class="flex-1 text-center bg-green-500 text-white py-1.5 rounded-lg text-sm hover:bg-green-600"
                >
                  <i class="fab fa-whatsapp mr-1"></i> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Similar products -->
      <div v-if="similarProduits?.length > 0" class="mt-12">
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
          Produits similaires
        </h2>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4"
        >
          <ProductCard
            v-for="p in similarProduits"
            :key="p.id"
            :produit="p"
            @click="viewProduit(p)"
          />
        </div>
      </div>

      <!-- Reviews -->
      <div class="mt-12">
        <ReviewsProduct
          :product-id="produit.id"
          :reviews-stats="reviewsStats"
        />
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
              <div class="flex justify-between text-sm text-gray-500 mt-1">
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
                  <p class="text-sm text-gray-500">
                    {{ (promotion?.total_cost || 0) * 100 }} FCFA
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">Coût par clic</p>
                  <p class="text-lg font-bold text-gray-900">0.1 jetons</p>
                  <p class="text-sm text-gray-500">20 FCFA</p>
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
                  <p class="text-sm text-gray-500">
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
              <p class="text-sm text-gray-600">
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
                  <p class="text-sm text-gray-600">clics</p>
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
                <p class="text-sm text-gray-500 mt-1">
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
                <p class="text-sm text-gray-500">
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
          <p class="text-sm text-gray-500 text-center mt-2">
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
          class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
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
                  <span class="text-sm text-gray-600">Prix original:</span>
                  <span class="text-sm font-semibold text-gray-900">{{
                    formatPrice(produit?.prix)
                  }}</span>
                </div>
                <div class="text-sm text-gray-500 mt-1">
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
                <div class="mt-2 text-sm text-gray-600 flex justify-between">
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
                <div class="text-sm text-gray-500">
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
                    <span class="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <p class="text-gray-600">
                    Vous proposez un prix au vendeur pour revendre ce produit
                  </p>
                </div>
                <div class="flex items-start gap-2">
                  <div
                    class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <span class="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <p class="text-gray-600">
                    Le vendeur accepte ou refuse votre proposition
                  </p>
                </div>
                <div class="flex items-start gap-2">
                  <div
                    class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <span class="text-blue-600 text-sm font-bold">3</span>
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
import { useProductModalStore } from "../../stores/productModalStore";
import apiClient from "../../api";
import urlHelper from "../../utils/urlHelper";
import { useAuthGuard } from "../../composables/useAuthGuard";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { checkAuth, user } = useAuthGuard();
const showOwnerMenu = ref(false); // State for dropdown menu

// Click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = function (event: any) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el: any) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
};

const store = useProductModalStore();

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

const jetons = computed(() => user.value?.jetons || 0);

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
      isFavorited.value = response.data.data.isFavorited;

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
  if (!checkAuth("Connectez-vous pour ajouter ce produit à vos favoris"))
    return;

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
  if (!checkAuth("Connectez-vous pour discuter avec le vendeur")) return;

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
  if (!checkAuth("Connectez-vous pour proposer une revente")) return;

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

const editProduct = () => {
  store.openModal(produit.value);
};

const confirmDelete = async () => {
  if (
    confirm(
      "Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.",
    )
  ) {
    try {
      isLoading.value = true;
      const response = await apiClient.delete(
        `/user/produits/${produit.value.id}`,
      );
      if (response.data.success) {
        toast.success("Produit supprimé avec succès");
        router.push("/gallery");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la suppression",
      );
      isLoading.value = false;
    }
  }
};

watch(
  isProductOwner,
  (newValue) => {
    if (newValue) {
      fetchPromotion();
    }
  },
  { immediate: true },
);

// Listen for updates from modal
watch(
  () => store.updatedProduct,
  (newProduct) => {
    if (newProduct && produit.value && newProduct.id === produit.value.id) {
      produit.value = { ...produit.value, ...newProduct };
      toast.success("Produit mis à jour");
    }
  },
);

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
  .text-sm {
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
