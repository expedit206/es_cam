<template>
  <SeoHead v-bind="seoMeta" />
  <StructuredData
    :type="structuredData.type as any"
    :data="structuredData.data"
  />

  <div class="h-full overflow-y-auto py-2 sm:py-4 px-2 sm:px-4 pb-8">
    <Loader :isLoading="catalogStore.isLoading" />
    <div class="max-w-7xl mx-auto">
      <!-- En-tête ultra compact -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <div
            class="w-6 h-6 bg-[var(--espace-vert)] rounded flex items-center justify-center"
          >
            <i class="fas fa-store text-white text-xs"></i>
          </div>
          <h1 class="text-base font-bold text-gray-900">
            {{ t("my_catalog") }}
          </h1>
        </div>

        <button
          v-if="catalogStore.activeTab === 'products'"
          @click="openProductModal"
          class="bg-[var(--espace-vert)] text-white px-2 py-1.5 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1 text-xs"
        >
          <i class="fas fa-plus text-xs"></i>
          <span class="hidden xs:inline">{{ t("new_product") }}</span>
        </button>

        <button
          v-if="catalogStore.activeTab === 'services'"
          @click="openServiceModal"
          class="bg-[var(--espace-vert)] text-white px-2 py-1.5 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1 text-xs"
        >
          <i class="fas fa-plus text-xs"></i>
          <span class="hidden xs:inline">{{ t("new_service") }}</span>
        </button>
      </div>

      <!-- Statistiques ultra compactes -->
      <div
        v-if="catalogStore.activeTab === 'products'"
        class="grid grid-cols-3 gap-1 mb-3"
      >
        <div
          class="bg-white rounded-lg p-1.5 shadow-xs border border-gray-100 text-center"
        >
          <div class="text-xs font-medium text-gray-600">
            {{ t("products") }}
          </div>
          <div class="text-sm font-bold text-black">
            {{ catalogStore.productsStats.total }}
          </div>
        </div>
        <div
          class="bg-white rounded-lg p-1.5 shadow-xs border border-gray-100 text-center"
        >
          <div class="text-xs font-medium text-orange-600">
            {{ t("revendable") }}
          </div>
          <div class="text-sm font-bold text-black">
            {{ catalogStore.productsStats.revendable }}
          </div>
        </div>
        <div
          class="bg-white rounded-lg p-1.5 shadow-xs border border-gray-100 text-center"
        >
          <div class="text-xs font-medium text-green-600">
            {{ t("in_stock") }}
          </div>
          <div class="text-sm font-bold text-black">
            {{ catalogStore.productsStats.inStock }}
          </div>
        </div>
      </div>

      <!-- Barre de recherche et filtres ultra optimisés -->
      <div
        class="bg-white rounded-lg p-2 shadow-sm border border-gray-100 mb-3"
      >
        <!-- Ligne unique recherche + bouton filtre -->
        <div class="flex gap-2 items-center">
          <!-- Barre de recherche compacte -->
          <div class="flex-1 relative">
            <i
              class="fas fa-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"
            ></i>
            <input
              v-model="catalogStore.searchQuery"
              type="text"
              :placeholder="
                catalogStore.activeTab === 'products'
                  ? t('search_products')
                  : t('search_services')
              "
              class="w-full pl-6 pr-5 py-1.5 border border-gray-300 rounded-lg focus:border-[var(--espace-vert)] focus:ring-1 focus:ring-green-200 outline-none transition-all text-xs"
            />
            <button
              v-if="catalogStore.searchQuery"
              @click="catalogStore.searchQuery = ''"
              class="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="fas fa-times text-[10px]"></i>
            </button>
          </div>

          <!-- Bouton filtre avec badge -->
          <button
            @click="catalogStore.showFilters = !catalogStore.showFilters"
            class="px-2 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-1 text-xs relative"
          >
            <i class="fas fa-sliders-h text-xs"></i>
            <span class="hidden xs:inline">Filtres</span>
            <span
              v-if="catalogStore.activeFilterCount > 0"
              class="absolute -top-1 -right-1 bg-[var(--espace-vert)] text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center"
            >
              {{ catalogStore.activeFilterCount }}
            </span>
          </button>

          <!-- Bouton reset visible seulement si filtres actifs -->
          <button
            v-if="catalogStore.hasActiveFilters"
            @click="catalogStore.resetFilters"
            class="px-2 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-1 text-xs"
          >
            <i class="fas fa-redo text-[10px]"></i>
            <span class="hidden xs:inline">{{ t("reset") }}</span>
          </button>
        </div>

        <!-- Panneau de filtres dépliants -->
        <div
          v-if="catalogStore.showFilters"
          class="mt-2 pt-2 border-t border-gray-200"
        >
          <!-- Filtres produits -->
          <div
            v-if="catalogStore.activeTab === 'products'"
            class="grid grid-cols-2 xs:grid-cols-3 gap-1"
          >
            <select
              v-model="catalogStore.productFilters.stock"
              class="px-1.5 py-1 border border-gray-300 rounded focus:border-[var(--espace-vert)] focus:ring-1 focus:ring-green-200 outline-none transition-all text-xs"
            >
              <option value="all">{{ t("all_status") }}</option>
              <option value="in_stock">{{ t("in_stock") }}</option>
              <option value="out_of_stock">{{ t("out_of_stock") }}</option>
            </select>

            <select
              v-model="catalogStore.productFilters.revendable"
              class="px-1.5 py-1 border border-gray-300 rounded focus:border-[var(--espace-vert)] focus:ring-1 focus:ring-green-200 outline-none transition-all text-xs"
            >
              <option value="all">{{ t("all_types") }}</option>
              <option value="revendable">{{ t("revendable") }}</option>
              <option value="normal">{{ t("normal") }}</option>
            </select>

            <select
              v-model="catalogStore.productFilters.sortBy"
              class="px-1.5 py-1 border border-gray-300 rounded focus:border-[var(--espace-vert)] focus:ring-1 focus:ring-green-200 outline-none transition-all text-xs"
            >
              <option value="newest">{{ t("newest") }}</option>
              <option value="oldest">{{ t("oldest") }}</option>
              <option value="price_asc">{{ t("price_low_to_high") }}</option>
              <option value="price_desc">{{ t("price_high_to_low") }}</option>
            </select>
          </div>

          <!-- Filtres services -->
          <div
            v-if="catalogStore.activeTab === 'services'"
            class="grid grid-cols-2 gap-1"
          >
            <select
              v-model="catalogStore.serviceFilters.status"
              class="px-1.5 py-1 border border-gray-300 rounded focus:border-[var(--espace-vert)] focus:ring-1 focus:ring-green-200 outline-none transition-all text-xs"
            >
              <option value="all">{{ t("all_status") }}</option>
              <option value="disponible">{{ t("available") }}</option>
              <option value="indisponible">{{ t("unavailable") }}</option>
            </select>

            <select
              v-model="catalogStore.serviceFilters.category"
              class="px-1.5 py-1 border border-gray-300 rounded focus:border-[var(--espace-vert)] focus:ring-1 focus:ring-green-200 outline-none transition-all text-xs"
            >
              <option value="all">{{ t("all_categories") }}</option>
              <option
                v-for="category in catalogStore.currentCategories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.nom }}
              </option>
            </select>
          </div>
        </div>

        <!-- Badges de filtres actifs (seulement quand les filtres sont fermés) -->
        <div
          v-if="!catalogStore.showFilters && catalogStore.hasActiveFilters"
          class="flex flex-wrap gap-1 mt-1"
        >
          <span
            v-if="catalogStore.searchQuery"
            class="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
          >
            "{{
              catalogStore.searchQuery.length > 6
                ? catalogStore.searchQuery.substring(0, 6) + "..."
                : catalogStore.searchQuery
            }}"
            <button
              @click="catalogStore.searchQuery = ''"
              class="hover:text-blue-900 ml-0.5"
            >
              <i class="fas fa-times text-[8px]"></i>
            </button>
          </span>

          <!-- Filtres produits -->
          <span
            v-if="
              catalogStore.activeTab === 'products' &&
              catalogStore.productFilters.stock !== 'all'
            "
            class="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
          >
            {{
              catalogStore.productFilters.stock === "in_stock"
                ? t("in_stock")
                : t("out_of_stock")
            }}
            <button
              @click="catalogStore.productFilters.stock = 'all'"
              class="hover:text-green-900 ml-0.5"
            >
              <i class="fas fa-times text-[8px]"></i>
            </button>
          </span>

          <span
            v-if="
              catalogStore.activeTab === 'products' &&
              catalogStore.productFilters.revendable !== 'all'
            "
            class="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
          >
            {{
              catalogStore.productFilters.revendable === "revendable"
                ? t("revendable")
                : t("normal")
            }}
            <button
              @click="catalogStore.productFilters.revendable = 'all'"
              class="hover:text-orange-900 ml-0.5"
            >
              <i class="fas fa-times text-[8px]"></i>
            </button>
          </span>

          <!-- Filtres services -->
          <span
            v-if="
              catalogStore.activeTab === 'services' &&
              catalogStore.serviceFilters.status !== 'all'
            "
            class="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
          >
            {{
              catalogStore.serviceFilters.status === "disponible"
                ? t("available")
                : t("unavailable")
            }}
            <button
              @click="catalogStore.serviceFilters.status = 'all'"
              class="hover:text-green-900 ml-0.5"
            >
              <i class="fas fa-times text-[8px]"></i>
            </button>
          </span>
        </div>
      </div>

      <!-- Contenu dynamique selon l'onglet -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
      >
          <ProductGrid
            :products="catalogStore.filteredProducts"
            :is-loading="catalogStore.isLoading"
            :has-active-filters="catalogStore.hasActiveFilters"
            :search-query="catalogStore.searchQuery"
            :show-search-summary="true"
            :show-add-button="true"
            @edit-product="openEditProductModal"
            @delete-product="handleDeleteProduct"
            @reset-filters="catalogStore.resetFilters"
            @open-add-modal="openProductModal"
          />
      </div>
    </div>

    <!-- Modals -->
    <ProduitModal
      :visible="showProductModal"
      :product="currentProduct"
      :categoryProduits="catalogStore.productCategories"
      @update:visible="showProductModal = $event"
      @saved="handleProductSaved"
      @closed="handleModalClosed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useCatalogStore } from "../stores/gallery";
import SeoHead from "../components/SeoHead.vue";
import StructuredData from "../components/StructuredData.vue";
import { useI18n } from "../components/useI18n";
import ProduitModal from "../components/mesProduits/ProduitModal.vue";
import ServiceModal from "../components/mesServices/ServiceModal.vue";
import ServicesSection from "../components/mesServices/MesServices.vue";
import ProductGrid from "../components/produits/ProductGrid.vue";
import { Product, Service } from "../components/types/index";

const { t } = useI18n();

// Store
const catalogStore = useCatalogStore();
const router = useRouter();
const toast = useToast();

// États locaux pour les modals
const showProductModal = ref(false);
const showServiceModal = ref(false);
const currentProduct = ref<Product | null>(null);
const currentService = ref<Service | null>(null);

// Computed properties pour le SEO
const seoMeta = computed(() => {
  const totalItems =
    catalogStore.activeTab === "products"
      ? catalogStore.products.length
      : catalogStore.services.length;
  const type = catalogStore.activeTab === "products" ? "produits" : "services";

  return {
    title: `Mon Catalogue - ${catalogStore.activeTab === "products" ? "Produits" : "Services"} | Espace Cameroun`,
    description: `Gérez votre catalogue de ${totalItems} ${type} sur Espace Cameroun.`,
    keywords: `gestion ${type}, catalogue, marketplace, cameroun`,
    url: `${window.location.origin}${router.currentRoute.value.path}`,
    type: "website",
  };
});

const structuredData = computed(() => {
  if (catalogStore.activeTab === "products") {
    const productItems = catalogStore.filteredProducts
      .slice(0, 10)
      .map((produit) => ({
        "@type": "Product",
        name: produit?.nom,
        description:
          produit?.description ||
          `Produit ${produit?.nom} disponible sur Espace Cameroun`,
        image:
          produit?.photos && produit?.photos.length > 0
            ? produit?.photos[0]
            : "",
        offers: {
          "@type": "Offer",
          price: produit?.prix,
          priceCurrency: "XAF",
          availability:
            produit?.quantite > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "Espace Cameroun",
          },
        },
      }));

    return {
      type: "ItemList" as const,
      data: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Mes Produits - Espace Cameroun",
        description: "Liste de mes produits sur Espace Cameroun",
        url: `${window.location.origin}${router.currentRoute.value.path}`,
        numberOfItems: catalogStore.filteredProducts.length,
        itemListElement: productItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: item,
        })),
      },
    };
  } else {
    const serviceItems = catalogStore.filteredServices
      .slice(0, 10)
      .map((service) => ({
        "@type": "Service",
        name: service?.titre,
        description:
          service?.description ||
          `Service ${service?.titre} disponible sur Espace Cameroun`,
        offers: {
          "@type": "Offer",
          price: service?.prix,
          priceCurrency: service?.devise || "XAF",
          availability:
            service?.disponibilite === "disponible"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
        provider: {
          "@type": "Organization",
          name: "Espace Cameroun",
        },
      }));

    return {
      type: "ItemList" as const,
      data: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Mes Services - Espace Cameroun",
        description: "Liste de mes services sur Espace Cameroun",
        url: `${window.location.origin}${router.currentRoute.value.path}`,
        numberOfItems: catalogStore.filteredServices.length,
        itemListElement: serviceItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: item,
        })),
      },
    };
  }
});

// Méthodes pour les modals
const openProductModal = () => {
  currentProduct.value = null;
  showProductModal.value = true;
};

const openEditProductModal = (product: Product) => {
  currentProduct.value = product;
  showProductModal.value = true;
};

const openServiceModal = () => {
  currentService.value = null;
  showServiceModal.value = true;
};

const openEditServiceModal = (service: Service) => {
  currentService.value = service;
  showServiceModal.value = true;
};

const handleModalClosed = () => {
  currentProduct.value = null;
  currentService.value = null;
};

// Handlers pour les événements
const handleProductSaved = async (product: Product) => {
  if (currentProduct.value) {
    // Mise à jour d'un produit existant
    catalogStore.updateProduct(product);
  } else {
    console.log("pro" + product);

    // Ajout d'un nouveau produit
    catalogStore.addProduct(product);
  }
  showProductModal.value = false;
  console.log(showProductModal.value);

  handleModalClosed();
//   toast.success(t("product_saved_success"));
};

const handleServiceSaved = async (service: any) => {
  if (currentService.value) {
    // Mise à jour d'un service existant
    catalogStore.updateService(service);
  } else {
    console.log("ok" + service);

    // Ajout d'un nouveau service
    catalogStore.addService(service);
  }
  toast.success(t("service_saved_success"));
  showServiceModal.value = false;
  handleModalClosed();
};

const handleDeleteProduct = async (productId: string) => {
  if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
  try {
    await catalogStore.deleteProduct(productId);
  } catch (error) {
    // L'erreur est déjà gérée dans le store
  }
};

const handleDeleteService = async (serviceId: string) => {
  if (!confirm(t("confirm_delete_service"))) return;
  try {
    await catalogStore.deleteService(serviceId);
  } catch (error) {
    // L'erreur est déjà gérée dans le store
  }
};

const handleToggleServiceAvailability = async (serviceId: string) => {
  try {
    await catalogStore.toggleServiceAvailability(serviceId);
  } catch (error) {
    // L'erreur est déjà gérée dans le store
  }
};

// Méthode pour changer d'onglet
const setActiveTab = async (tab: "products" | "services") => {
  catalogStore.activeTab = tab;

  // Charger les données si nécessaire
  if (tab === "products" && catalogStore.products.length === 0) {
    await catalogStore.fetchProducts();
  } else if (tab === "services" && catalogStore.services.length === 0) {
    await catalogStore.fetchServices();
  }

  catalogStore.resetFilters();
};

// Initialisation intelligente
onMounted(async () => {
  // Charger uniquement les catégories et les données de l'onglet actuel
  await catalogStore.initializeCatalog();
});

// Watch pour charger les données de l'autre onglet quand on change
watch(
  () => catalogStore.activeTab,
  async (newTab) => {
    if (newTab === "products" && catalogStore.products.length === 0) {
      await catalogStore.fetchProducts();
    } else if (newTab === "services" && catalogStore.services.length === 0) {
      await catalogStore.fetchServices();
    }
  },
);
</script>

<style scoped>
/* Vos styles existants restent inchangés */
</style>
